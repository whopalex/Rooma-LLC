import type { Metadata } from "next";
import { whopsdk } from "@/lib/whop-sdk";
import { env, redirectUrlFor } from "@/lib/env";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CountdownTimer } from "@/components/checkout/CountdownTimer";
import { LaunchToast } from "@/components/checkout/LaunchToast";
import { GuaranteeBadges } from "@/components/checkout/GuaranteeBadges";
import { ProductHeader } from "@/components/checkout/ProductHeader";
import { CheckoutEmbedSection } from "@/components/checkout/CheckoutEmbedSection";
import { CurrencyProvider } from "@/components/checkout/CurrencyContext";
import { getFunnelPricing } from "@/lib/pricing";
import { shouldSaveCard } from "@/lib/geo";

export const dynamic = "force-dynamic";

// Same funnel as "/", only the order bump moves below the embed. Kept out of the
// index so the variant can't compete with the main page in search.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

async function createInitialSession() {
  const config = await whopsdk.checkoutConfigurations.create({
    company_id: env.WHOP_COMPANY_ID,
    plan_id: env.WHOP_MAIN_PLAN_ID,
    metadata: { order_bump: "no" },
    redirect_url: redirectUrlFor("/return"),
  });
  return config.id;
}

// NOT wrapped in <Suspense>: WhopCheckoutEmbed renders its fallback during hydration
// and swaps in the iframe afterwards, and that swap never happens when the component
// arrives as streamed-in Suspense content — the embed stays stuck on "Cargando
// checkout…" forever. Verified in-browser: with Suspense no iframe is ever added to
// the DOM; without it the iframe mounts and measures immediately.
async function CheckoutSection() {
  const [initialSessionId, saveCard] = await Promise.all([createInitialSession(), shouldSaveCard()]);
  return (
    <CheckoutEmbedSection
      initialSessionId={initialSessionId}
      siteUrl={env.SITE_URL}
      saveCard={saveCard}
      orderBumpPosition="below"
    />
  );
}

export default async function CheckoutV2Page() {
  // Prices are needed for the very first paint (they're in the header), and
  // getFunnelPricing caches for 5 minutes, so awaiting them here is cheap.
  const pricing = await getFunnelPricing();

  return (
    <div className="min-h-screen bg-checkout-navy">
      <CountdownTimer />
      <LaunchToast />

      <main className="px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-lg overflow-hidden rounded-xl bg-white pt-0 shadow-xl">
          <CurrencyProvider prices={pricing}>
            <ProductHeader />
            <CheckoutSection />
          </CurrencyProvider>
        </div>

        <SiteFooter />
      </main>

      <div className="bg-checkout-cream">
        <GuaranteeBadges />
      </div>
    </div>
  );
}
