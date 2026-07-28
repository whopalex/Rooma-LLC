"use client";

import { useCurrency } from "./CurrencyContext";

interface PriceProps {
  /** Amount in the plans' base currency — see lib/pricing.ts. */
  amount: number;
  withCode?: boolean;
  /** Placeholder width while the embed settles on a currency. */
  skeletonClassName?: string;
}

/**
 * Renders a price, showing a placeholder while the checkout embed is switching to
 * the buyer's local currency. Without this the page prints the base-currency amount
 * and swaps it out a moment later, which reads as the price changing on its own.
 */
export function Price({ amount, withCode, skeletonClassName = "w-24" }: PriceProps) {
  const { formatPrice, isConverting } = useCurrency();

  if (isConverting) {
    return (
      <span
        aria-hidden
        className={`inline-block h-[1em] animate-pulse rounded bg-black/10 align-[-0.1em] ${skeletonClassName}`}
      />
    );
  }

  return <>{formatPrice(amount, { withCode })}</>;
}
