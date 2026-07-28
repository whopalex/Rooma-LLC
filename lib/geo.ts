import "server-only";
import { headers } from "next/headers";

// Markets where Whop surfaces push-style local payment methods (PSE, Efecty, SPEI,
// OXXO, Pix…). Those get filtered out by setupFutureUsage, since none of them can be
// charged off-session — so buyers here must not get the card-saving flag.
const LOCAL_METHOD_COUNTRIES = new Set([
  "MX", "CO", "BR", "AR", "CL", "PE", "EC", "UY", "PY", "BO", "VE",
  "CR", "GT", "SV", "HN", "NI", "PA", "DO",
]);

/**
 * Whether this buyer should get `setupFutureUsage` on the checkout embed.
 *
 * Saving the card is what powers the one-click upsell, but it costs the local
 * payment methods. That trade-off only exists in markets that have such methods;
 * everywhere else the flag is free, so we keep the one-click there.
 *
 * Fails open toward local payment methods: an unknown country (local dev, or a
 * request Vercel couldn't geolocate) means no flag. Losing a one-click upsell is
 * recoverable — the upsell falls back to a full checkout. Hiding the only payment
 * method a buyer can actually use is not.
 */
export async function shouldSaveCard(): Promise<boolean> {
  const country = (await headers()).get("x-vercel-ip-country") ?? "";
  if (!country) return false;
  return !LOCAL_METHOD_COUNTRIES.has(country.toUpperCase());
}
