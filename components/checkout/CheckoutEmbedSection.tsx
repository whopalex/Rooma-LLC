"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { WhopCheckoutEmbed, useCheckoutEmbedControls, type WhopCheckoutCurrenciesAvailable } from "@whop/checkout/react";
import { OrderBumpCheckbox } from "./OrderBumpCheckbox";
import { OrderSummary } from "./OrderSummary";
import { ProtectedBadge } from "./ProtectedBadge";

interface CheckoutEmbedSectionProps {
  initialSessionId: string;
  siteUrl: string;
}

export function CheckoutEmbedSection({ initialSessionId, siteUrl }: CheckoutEmbedSectionProps) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState(initialSessionId);
  const [orderBump, setOrderBump] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkoutControls = useCheckoutEmbedControls();
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
      if (snapshot.optional_currency && snapshot.current_currency !== snapshot.optional_currency) {
        checkoutControls.current?.setDisplayCurrency(snapshot.optional_currency).catch((err) => {
          console.error("[checkout] failed to switch to local currency", err);
        });
      }
    },
    [checkoutControls]
  );

  return (
    <div className="pb-2">
      <OrderBumpCheckbox checked={orderBump} onChange={handleOrderBumpChange} />
      <div className="relative mx-5 mb-5 min-h-[280px] sm:mx-6">
        {isSwitching && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/70 text-xs font-medium text-black/50">
            Actualizando checkout…
          </div>
        )}
        <WhopCheckoutEmbed
          key={sessionId}
          ref={checkoutControls}
          sessionId={sessionId}
          returnUrl={returnUrl}
          setupFutureUsage="off_session"
          adaptivePricing
          onCurrenciesAvailable={handleCurrenciesAvailable}
          theme="light"
          themeOptions={{ accentColor: "#00992B" }}
          onComplete={(_sessionOrPlanId: string, receiptId?: string) => {
            router.push(receiptId ? `/upsell?receipt_id=${receiptId}` : "/upsell");
          }}
          fallback={<div className="p-8 text-center text-sm text-black/40">Cargando checkout…</div>}
        />
      </div>
      <OrderSummary orderBump={orderBump} />
      <ProtectedBadge />
    </div>
  );
}
