"use client";

import { WhopExpressCheckoutButton } from "@whop/checkout/react";

interface ExpressUpsellButtonProps {
  planId: string;
  returnUrl: string;
}

export function ExpressUpsellButton({ planId, returnUrl }: ExpressUpsellButtonProps) {
  return (
    <div className="mx-auto max-w-sm">
      <WhopExpressCheckoutButton planId={planId} returnUrl={returnUrl} />
      <p className="mt-3 text-center text-xs text-black/50">
        Un clic — se cobra con la misma tarjeta que acabas de usar. Sin volver a escribir tus datos.
      </p>
    </div>
  );
}
