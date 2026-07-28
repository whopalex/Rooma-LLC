import "server-only";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}. Copy .env.local.example to .env.local and fill it in.`);
  }
  return value;
}

export const env = {
  get WHOP_API_KEY() {
    return required("WHOP_API_KEY");
  },
  get WHOP_WEBHOOK_SECRET() {
    return required("WHOP_WEBHOOK_SECRET");
  },
  get WHOP_COMPANY_ID() {
    return required("WHOP_COMPANY_ID");
  },
  get WHOP_MAIN_PLAN_ID() {
    return required("WHOP_MAIN_PLAN_ID");
  },
  get WHOP_ORDER_BUMP_PLAN_ID() {
    return required("WHOP_ORDER_BUMP_PLAN_ID");
  },
  get WHOP_COMBINED_PLAN_ID() {
    return required("WHOP_COMBINED_PLAN_ID");
  },
  get SITE_URL() {
    return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  },
};

/**
 * Whop's API rejects redirect_url unless it's https:// — which localhost never is.
 * Returns undefined in that case so callers can omit the field entirely during local
 * dev (Vercel deployments are always https, so this is a no-op in production).
 */
export function redirectUrlFor(path: string): string | undefined {
  const base = env.SITE_URL;
  if (!base.startsWith("https://")) return undefined;
  return `${base}${path}`;
}
