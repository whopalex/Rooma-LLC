"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { FunnelPricing } from "@/lib/pricing";

// Prices come from the Whop plans (see lib/pricing.ts) and are denominated in the
// plans' base currency. The embed converts to the buyer's local currency on its own;
// this context mirrors that conversion onto the copy around it — header price, order
// bump price, order summary — so the card never shows USD next to a local-currency embed.
interface CurrencyState {
  currency: string;
  exchangeRate: number | null;
}

interface CurrencyContextValue extends CurrencyState {
  prices: FunnelPricing;
  /** True between "a currency switch is coming" and the embed confirming it. */
  isConverting: boolean;
  beginConversion: () => void;
  setCurrency: (next: CurrencyState) => void;
  /** Formats a base-currency amount in whatever currency the embed is charging. */
  formatPrice: (amount: number, options?: { withCode?: boolean }) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ prices, children }: { prices: FunnelPricing; children: ReactNode }) {
  const [state, setState] = useState<CurrencyState>({ currency: prices.currency, exchangeRate: null });
  const [isConverting, setIsConverting] = useState(false);

  // Whop reports currencies lowercase ("cop", "usd"). Intl accepts either, but the
  // code we print next to the amount has to be uppercase, and the "did Intl already
  // render the code?" check below is case-sensitive — so normalize on the way in.
  const setCurrency = useCallback((next: CurrencyState) => {
    setState({ currency: next.currency.toUpperCase(), exchangeRate: next.exchangeRate });
    setIsConverting(false);
  }, []);

  // Called once we know the embed is switching currencies but before it reports the
  // new rate. Prices hide behind a placeholder for that window so nobody reads an
  // amount in the wrong currency and watches it silently change under them.
  const beginConversion = useCallback(() => {
    setIsConverting(true);
    // Never shimmer forever: if the embed goes quiet — which it does, it sometimes
    // never emits the change event at all — fall back to showing the base price.
    setTimeout(() => setIsConverting(false), 4000);
  }, []);

  const formatPrice = useCallback(
    (amount: number, options?: { withCode?: boolean }) => {
      const { currency, exchangeRate } = state;
      const isBase = currency === prices.currency || !exchangeRate;
      const converted = isBase ? amount : amount * exchangeRate;

      // narrowSymbol keeps the familiar symbol up front ("$1,234.00" rather than
      // "MX$1,234.00") and the ISO code goes after the amount, so every currency
      // reads the same way: symbol, amount, code. Intl still applies the right
      // fraction digits per currency — CLP, JPY and PYG show no cents.
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        currencyDisplay: "narrowSymbol",
      }).format(converted);

      // A handful of currencies have no narrow symbol (PEN, CHF, AED…) and Intl falls
      // back to rendering the ISO code itself. Appending it again would say it twice.
      if (options?.withCode === false || formatted.includes(currency)) return formatted;
      return `${formatted} ${currency}`;
    },
    [state, prices.currency]
  );

  const value = useMemo<CurrencyContextValue>(
    () => ({ ...state, prices, isConverting, beginConversion, setCurrency, formatPrice }),
    [state, prices, isConverting, beginConversion, setCurrency, formatPrice]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside <CurrencyProvider>");
  return ctx;
}
