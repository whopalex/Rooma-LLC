"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  WhopCheckoutEmbed,
  WhopExpressCheckoutButton,
  type WhopExpressButtonRendered,
} from "@whop/checkout/react";

interface ExpressUpsellButtonProps {
  planId: string;
  returnUrl: string;
}

export function ExpressUpsellButton({ planId, returnUrl }: ExpressUpsellButtonProps) {
  const router = useRouter();
  // The express button only renders when there's something to click: a saved card,
  // Apple Pay or Google Pay. Buyers who paid with SPEI/OXXO/PSE have none of those,
  // so it resolves to "none" and we'd otherwise show them an empty box.
  const [rendered, setRendered] = useState<WhopExpressButtonRendered | null>(null);
  // Also switchable by hand: the express button can resolve to a method the buyer
  // doesn't want to use (an Apple Pay sheet when they paid by SPEI, say), so the
  // full checkout stays one click away even when one-click technically works.
  const [showFullCheckout, setShowFullCheckout] = useState(false);
  const noExpressMethod = rendered === "none" || showFullCheckout;

  const handleMethodResolved = useCallback((info: { rendered: WhopExpressButtonRendered }) => {
    setRendered(info.rendered);
  }, []);

  return (
    <div className="mx-auto max-w-sm">
      <div className={noExpressMethod ? "hidden" : undefined}>
        <WhopExpressCheckoutButton
          planId={planId}
          returnUrl={returnUrl}
          theme="light"
          themeOptions={{ accentColor: "green", highContrast: true }}
          onExpressMethodResolved={handleMethodResolved}
        />
      </div>

      {noExpressMethod && (
        <WhopCheckoutEmbed
          planId={planId}
          returnUrl={returnUrl}
          adaptivePricing
          theme="light"
          themeOptions={{ accentColor: "#00992B" }}
          onComplete={() => router.push("/thank-you")}
          fallback={<div className="p-8 text-center text-sm text-black/40">Cargando checkout…</div>}
        />
      )}

      {!noExpressMethod && rendered !== null && (
        <button
          type="button"
          onClick={() => setShowFullCheckout(true)}
          className="mt-3 w-full text-center text-xs text-checkout-gray underline underline-offset-2 hover:text-checkout-dark"
        >
          Usar otro método de pago
        </button>
      )}

      <p className="mt-3 text-center text-xs italic text-checkout-gray">
        Al hacer clic aceptas los términos de esta suscripción mensual.
      </p>
    </div>
  );
}
