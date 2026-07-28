"use client";
/* eslint-disable @next/next/no-img-element */

import { useCurrency } from "./CurrencyContext";

// The creator's own existing cover image from their prior checkout page —
// same 750x600 crop, shown full-width at the top of the card like the original.
const PRODUCT_IMAGE_URL =
  "https://static-media.hotmart.com/iFxYMqMels6vUfsyJlhWna2GHtE=/750x600/filters:quality(100)/hotmart/checkout_custom/717d4fb7-db65-4e1c-a944-a5724673f867/toxbe3zdl.png";

export function ProductHeader() {
  const { formatPrice, prices } = useCurrency();

  return (
    <div className="border-b border-black/10">
      <img src={PRODUCT_IMAGE_URL} alt="NEUROPRODUCTIVO" className="aspect-[5/4] w-full object-cover" />
      <div className="p-5 sm:p-6">
        <h1 className="text-lg font-bold leading-tight text-checkout-dark">NEUROPRODUCTIVO</h1>
        <p className="mt-0.5 text-xs text-checkout-gray">Autor: MAJO Y RONALD</p>
        <p className="mt-2 text-xl font-bold text-checkout-dark">{formatPrice(prices.main)}</p>
        <p className="mt-0.5 text-xs text-checkout-gray">Pago único — acceso inmediato</p>
        <p className="mt-1 text-xs text-checkout-gray">Precio de lanzamiento</p>
      </div>
    </div>
  );
}
