import { whopsdk } from "@/lib/whop-sdk";
import { env, redirectUrlFor } from "@/lib/env";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CountdownTimer } from "@/components/checkout/CountdownTimer";
import { LaunchToast } from "@/components/checkout/LaunchToast";
import { GuaranteeBadges } from "@/components/checkout/GuaranteeBadges";
import { ProductHeader } from "@/components/checkout/ProductHeader";
import { CheckoutEmbedSection } from "@/components/checkout/CheckoutEmbedSection";

export const dynamic = "force-dynamic";

async function createInitialSession() {
  const config = await whopsdk.checkoutConfigurations.create({
    company_id: env.WHOP_COMPANY_ID,
    plan_id: env.WHOP_MAIN_PLAN_ID,
    metadata: { order_bump: "no" },
    redirect_url: redirectUrlFor("/return"),
  });
  return config.id;
}

export default async function HomePage() {
  const initialSessionId = await createInitialSession();

  return (
    <div className="min-h-screen bg-checkout-navy">
      <CountdownTimer />
      <LaunchToast />

      <main className="px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-lg overflow-hidden rounded-xl bg-white pt-0 shadow-xl">
          <ProductHeader />
          <CheckoutEmbedSection initialSessionId={initialSessionId} siteUrl={env.SITE_URL} />
        </div>

        <SiteFooter />
      </main>

      <div className="bg-checkout-cream">
        <GuaranteeBadges />
      </div>
    </div>
  );
}
