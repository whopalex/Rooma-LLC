"use client";

import { WhopExpressCheckoutButton } from "@whop/checkout/react";

interface ExpressUpsellButtonProps {
  planId: string;
  returnUrl: string;
}

export function ExpressUpsellButton({ planId, returnUrl }: ExpressUpsellButtonProps) {
  return (
    <div className="mx-auto max-w-sm">
      <WhopExpressCheckoutButton
        planId={planId}
        returnUrl={returnUrl}
        theme="light"
        themeOptions={{ accentColor: "green", highContrast: true }}
      />
      <p className="mt-3 text-center text-xs italic text-checkout-gray">
        Al hacer clic aceptas los términos de esta suscripción mensual.
      </p>
    </div>
  );
}
