"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  WhopCheckoutEmbed,
  useCheckoutEmbedControls,
  type WhopCheckoutCurrenciesAvailable,
  type WhopCheckoutCurrencyChanged,
} from "@whop/checkout/react";
import { useCurrency } from "./CurrencyContext";
import { OrderBumpCheckbox } from "./OrderBumpCheckbox";
import { OrderSummary } from "./OrderSummary";
import { ProtectedBadge } from "./ProtectedBadge";

interface CheckoutEmbedSectionProps {
  initialSessionId: string;
  siteUrl: string;
  /** Decided server-side from the buyer's country — see lib/geo.ts. */
  saveCard: boolean;
  /** A/B variant: "above" is the default layout, "below" is the /v2 test. */
  orderBumpPosition?: "above" | "below";
}

export function CheckoutEmbedSection({
  initialSessionId,
  siteUrl,
  saveCard,
  orderBumpPosition = "above",
}: CheckoutEmbedSectionProps) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState(initialSessionId);
  const [orderBump, setOrderBump] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkoutControls = useCheckoutEmbedControls();
  const { setCurrency, beginConversion } = useCurrency();
  const [targetCurrency, setTargetCurrency] = useState<string | null>(null);
  // Whop rejects non-https return URLs, which localhost never is — omit it in
  // that case so local dev still renders (deployed on Vercel this is always https).
  const returnUrl = siteUrl.startsWith("https://") ? `${siteUrl}/return` : undefined;

  const recreateSession = useCallback(async (nextOrderBump: boolean) => {
    setIsSwitching(true);
    try {
      const res = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderBump: nextOrderBump }),
      });
      if (!res.ok) throw new Error("No se pudo actualizar el checkout");
      const data = await res.json();
      setSessionId(data.sessionId);
    } catch (err) {
      console.error("[checkout-session] failed to recreate session", err);
    } finally {
      setIsSwitching(false);
    }
  }, []);

  const handleOrderBumpChange = useCallback(
    (checked: boolean) => {
      setOrderBump(checked);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => recreateSession(checked), 400);
    },
    [recreateSession]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // adaptivePricing only makes the buyer's local currency AVAILABLE — it doesn't
  // switch to it automatically. Local payment methods (SPEI, OXXO, Nequi, PSE...)
  // require the checkout to actually be running in that local currency, so we
  // switch as soon as one is detected instead of leaving the buyer on USD.
  const handleCurrenciesAvailable = useCallback(
    (snapshot: WhopCheckoutCurrenciesAvailable) => {
      if (!snapshot.optional_currency || snapshot.current_currency === snapshot.optional_currency) return;
      beginConversion();
      setTargetCurrency(snapshot.optional_currency);
    },
    [beginConversion]
  );

  // The embed can report its available currencies before the controls ref is wired up,
  // and `controls?.setDisplayCurrency(...)` would then silently do nothing — no error,
  // no retry, prices just stay in the base currency. Retry until the ref exists.
  useEffect(() => {
    if (!targetCurrency) return;
    let cancelled = false;
    let attempts = 0;

    const apply = () => {
      if (cancelled) return;
      const controls = checkoutControls.current;
      if (!controls) {
        if (attempts++ < 20) setTimeout(apply, 150);
        return;
      }
      controls.setDisplayCurrency(targetCurrency).catch((err) => {
        console.error("[checkout] failed to switch to local currency", err);
      });
    };

    apply();
    return () => {
      cancelled = true;
    };
  }, [targetCurrency, checkoutControls]);

  // Mirrors whatever currency the embed settled on (either the switch above or a
  // manual change by the buyer) onto the prices we render around it.
  const handleCurrencyChanged = useCallback(
    (data: WhopCheckoutCurrencyChanged) => {
      setCurrency({ currency: data.currency, exchangeRate: data.exchange_rate });
    },
    [setCurrency]
  );

  const orderBumpNode = <OrderBumpCheckbox checked={orderBump} onChange={handleOrderBumpChange} />;

  return (
    <div className="pb-2">
      {orderBumpPosition === "above" && orderBumpNode}
      <div className="relative mx-5 mb-5 min-h-[280px] sm:mx-6">
        {isSwitching && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/70 text-xs font-medium text-black/50">
            Actualizando checkout…
          </div>
        )}
        <WhopCheckoutEmbed
          // setupFutureUsage lands in the iframe URL, so it's read at mount only —
          // the key has to change with it for a switch to take effect.
          key={`${sessionId}:${saveCard ? "save" : "local"}`}
          ref={checkoutControls}
          sessionId={sessionId}
          returnUrl={returnUrl}
          // Set only where local payment methods don't exist, since it filters out
          // every method that can't be charged off-session. Buyers who end up without
          // a saved card get a full checkout on the upsell — see ExpressUpsellButton.
          setupFutureUsage={saveCard ? "off_session" : undefined}
          adaptivePricing
          collectPhoneNumbers
          onCurrenciesAvailable={handleCurrenciesAvailable}
          onCurrencyChanged={handleCurrencyChanged}
          theme="light"
          themeOptions={{ accentColor: "#00992B" }}
          onComplete={(_sessionOrPlanId: string, receiptId?: string) => {
            router.push(receiptId ? `/upsell?receipt_id=${receiptId}` : "/upsell");
          }}
          fallback={<div className="p-8 text-center text-sm text-black/40">Cargando checkout…</div>}
        />
      </div>
      {orderBumpPosition === "below" && orderBumpNode}
      <OrderSummary orderBump={orderBump} />
      <ProtectedBadge />
    </div>
  );
}
