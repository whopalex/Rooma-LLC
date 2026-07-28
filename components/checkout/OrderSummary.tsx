"use client";

import { useCurrency } from "./CurrencyContext";
import { Price } from "./Price";

interface OrderSummaryProps {
  orderBump: boolean;
}

export function OrderSummary({ orderBump }: OrderSummaryProps) {
  const { prices } = useCurrency();
  // The bump switches the checkout to the combined plan, so the total is that plan's
  // price — not main + bump added up, which could drift if they're priced separately.
  const total = orderBump ? prices.combined : prices.main;

  return (
    <div className="mx-5 mb-4 text-sm sm:mx-6">
      <p className="mb-2 text-sm font-bold text-checkout-dark">Detalles de la compra</p>
      <div className="flex items-center justify-between">
        <span className="text-checkout-gray">NEUROPRODUCTIVO</span>
        <span className="font-semibold text-checkout-dark"><Price amount={prices.main} withCode={false} skeletonClassName="w-16" /></span>
      </div>
      {orderBump && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-checkout-gray">Sesión 1 a 1 Diagnóstico de Bloqueo Mental</span>
          <span className="font-semibold text-checkout-dark"><Price amount={prices.bump} withCode={false} skeletonClassName="w-16" /></span>
        </div>
      )}
      <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-3">
        <span className="font-bold text-checkout-dark">Total a Pagar</span>
        <span className="font-bold text-checkout-dark"><Price amount={total} /></span>
      </div>
    </div>
  );
}
