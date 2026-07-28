import "server-only";
import { whopsdk } from "./whop-sdk";
import { env } from "./env";

/**
 * Prices shown on the checkout card are read from the Whop plans themselves, not
 * hardcoded — otherwise editing a plan price in the Whop dashboard would leave the
 * page advertising an amount the embed no longer charges.
 */
export interface FunnelPricing {
  main: number;
  bump: number;
  /** Course + order bump, charged as a single plan when the bump is checked. */
  combined: number;
  /** ISO 4217, uppercase — the plans' base currency before adaptive pricing. */
  currency: string;
  /**
   * Anchor ("was") price the discount is measured against. Whop plans have no
   * compare-at field, so this is a marketing number, not something the buyer is
   * ever charged. The discount percentage is derived from it and `main`, so
   * changing the plan price in Whop keeps the two consistent.
   */
  compareAt: number;
}

const COMPARE_AT_PRICE = 97;

// Last known-good values, used only if the API call fails. Keeping the page up with
// a slightly stale price beats failing the render and losing the sale entirely.
const FALLBACK: FunnelPricing = { main: 67, bump: 27, combined: 94, currency: "USD", compareAt: COMPARE_AT_PRICE };

const TTL_MS = 5 * 60 * 1000;
let cached: { at: number; value: FunnelPricing } | null = null;

export async function getFunnelPricing(): Promise<FunnelPricing> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.value;

  try {
    const [main, bump, combined] = await Promise.all([
      whopsdk.plans.retrieve(env.WHOP_MAIN_PLAN_ID),
      whopsdk.plans.retrieve(env.WHOP_ORDER_BUMP_PLAN_ID),
      whopsdk.plans.retrieve(env.WHOP_COMBINED_PLAN_ID),
    ]);

    const value: FunnelPricing = {
      main: main.initial_price,
      bump: bump.initial_price,
      combined: combined.initial_price,
      currency: (main.currency ?? "usd").toUpperCase(),
      compareAt: COMPARE_AT_PRICE,
    };
    cached = { at: Date.now(), value };
    return value;
  } catch (err) {
    console.error("[pricing] failed to read plan prices from Whop, using fallback", err);
    return cached?.value ?? FALLBACK;
  }
}
