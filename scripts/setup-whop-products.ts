/**
 * One-time provisioning script. Run manually with:
 *   npm run setup:whop
 *
 * Creates the products/plans this funnel needs and prints the resulting IDs
 * in .env-ready format — paste them into .env.local. Re-running this script
 * skips any product whose title already exists for the company (idempotent
 * by title), so it's safe to run again after a partial failure.
 *
 * Note on the order bump: it's created as its own standalone product/plan
 * (for the dashboard catalog and in case it's ever sold on its own), but the
 * actual funnel checkout can't charge two separate products' plans in one
 * Whop session — a checkout configuration takes exactly one plan. So when
 * the buyer checks the order-bump box, the funnel switches to a fourth,
 * combined plan (course + bump, $94 total) attached to the main product,
 * rather than referencing the standalone $27 plan directly.
 */
import { Whop } from "@whop/sdk";

const apiKey = process.env.WHOP_API_KEY;
const companyId = process.env.WHOP_COMPANY_ID;

if (!apiKey) {
  console.error("Missing WHOP_API_KEY in .env.local");
  process.exit(1);
}
if (!companyId) {
  console.error("Missing WHOP_COMPANY_ID in .env.local (find it in your Whop dashboard URL: whop.com/dashboard/<biz_xxx>)");
  process.exit(1);
}

const client = new Whop({ apiKey });

// Enables local payment methods (Whop auto-selects the right ones per buyer
// location) plus 3/6/12-month card installments where the processor supports them.
const PAYMENT_METHOD_CONFIGURATION = {
  enabled: ["card_installments_three", "card_installments_six", "card_installments_twelve"],
  disabled: [],
  include_platform_defaults: true,
};

interface ProductSpec {
  key: string;
  title: string;
  planTitle: string; // Plan.title is capped at 30 chars — keep this short, unlike the product title
  headline: string;
  description: string;
  initialPrice: number;
  planType?: "one_time" | "renewal";
  renewalPrice?: number;
  billingPeriod?: number;
  trialPeriodDays?: number;
}

const PRODUCTS: ProductSpec[] = [
  {
    key: "MAIN",
    title: "NEUROPRODUCTIVO",
    planTitle: "Pago único",
    headline: "Deja de procrastinar y recupera el control de tus proyectos",
    description: "Curso de Majo y Ronald sobre por qué procrastinamos y cómo salir del bloqueo.",
    initialPrice: 67,
  },
  {
    key: "ORDER_BUMP",
    title: "Sesión 1 a 1 Diagnóstico de Bloqueo Mental",
    planTitle: "Sesión 1:1",
    headline: "Descubre en 60 minutos tu origen exacto y tu perfil real",
    description:
      "Llamada 1 a 1 vía Meet de 60 minutos. En la llamada, basados en tu perfil, te mostramos el camino ideal para que empieces y no vuelvas a parar.",
    initialPrice: 27,
  },
  {
    key: "UPSELL",
    title: "Curso de Ejecución Avanzada",
    planTitle: "Suscripción mensual",
    headline: "Pasa de entender el bloqueo a ejecutar todos los días",
    description: "Membresía mensual de ejecución avanzada — $4.97 el primer día, luego $17/mes.",
    initialPrice: 4.97,
    planType: "renewal",
    renewalPrice: 17,
    billingPeriod: 30,
    // Without trial_period_days, Whop's checkout shows "due today" as
    // initial_price + renewal_price summed ($21.97) — confirmed live in the
    // real checkout UI. Setting trial_period_days equal to billing_period is
    // what makes "due today" show only initial_price ($4.97), with the first
    // renewal_price charge deferred to day 30.
    trialPeriodDays: 30,
  },
];

async function findExistingProduct(title: string) {
  const list = await client.products.list({ company_id: companyId! });
  return list.data?.find((p: any) => p.title === title) ?? null;
}

async function createProductAndPlan(spec: ProductSpec) {
  console.log(`\n--- ${spec.title} ---`);

  let product = await findExistingProduct(spec.title);
  if (product) {
    console.log(`Product already exists (${product.id}), skipping product creation.`);
  } else {
    product = await client.products.create({
      company_id: companyId!,
      title: spec.title,
      headline: spec.headline,
      description: spec.description,
      visibility: "hidden", // sold only via this funnel's direct checkout links, not the public store page
    });
    console.log(`Created product: ${product.id}`);
  }

  const plan = await client.plans.create({
    product_id: product.id,
    currency: "usd",
    plan_type: spec.planType ?? "one_time",
    initial_price: spec.initialPrice,
    renewal_price: spec.renewalPrice,
    billing_period: spec.billingPeriod,
    trial_period_days: spec.trialPeriodDays,
    adaptive_pricing_enabled: true,
    payment_method_configuration: PAYMENT_METHOD_CONFIGURATION,
    visibility: "visible",
    release_method: "buy_now",
    title: spec.planTitle,
  } as any);
  const priceLabel = spec.renewalPrice
    ? `$${spec.initialPrice} then $${spec.renewalPrice}/${spec.billingPeriod}d`
    : `$${spec.initialPrice}`;
  console.log(`Created plan: ${plan.id} (${priceLabel})`);

  return { productId: product.id, planId: plan.id };
}

async function main() {
  const results: Record<string, { productId: string; planId: string }> = {};

  for (const spec of PRODUCTS) {
    results[spec.key] = await createProductAndPlan(spec);
  }

  const mainProductId = results.MAIN.productId;
  const combinedPrice = PRODUCTS[0].initialPrice + PRODUCTS[1].initialPrice;
  console.log(`\n--- Combined checkout plan (course + order bump, $${combinedPrice}) ---`);
  const combinedPlan = await client.plans.create({
    product_id: mainProductId,
    currency: "usd",
    plan_type: "one_time",
    initial_price: combinedPrice,
    adaptive_pricing_enabled: true,
    payment_method_configuration: PAYMENT_METHOD_CONFIGURATION,
    visibility: "hidden", // only reached via the funnel when the order bump is checked, not sold directly
    release_method: "buy_now",
    title: "Curso + Sesión 1:1",
  } as any);
  console.log(`Created combined plan: ${combinedPlan.id} ($${combinedPrice})`);

  console.log("\n\n=== Paste these into .env.local ===\n");
  console.log(`WHOP_COMPANY_ID=${companyId}`);
  console.log(`WHOP_MAIN_PRODUCT_ID=${results.MAIN.productId}`);
  console.log(`WHOP_MAIN_PLAN_ID=${results.MAIN.planId}`);
  console.log(`WHOP_ORDER_BUMP_PRODUCT_ID=${results.ORDER_BUMP.productId}`);
  console.log(`WHOP_ORDER_BUMP_PLAN_ID=${results.ORDER_BUMP.planId}`);
  console.log(`WHOP_COMBINED_PLAN_ID=${combinedPlan.id}`);
  console.log(`WHOP_UPSELL_PLAN_ID=${results.UPSELL.planId}`);
  console.log(`NEXT_PUBLIC_WHOP_UPSELL_PLAN_ID=${results.UPSELL.planId}`);
  console.log("");
}

main().catch((err) => {
  console.error("\nSetup script failed:", err);
  process.exit(1);
});
