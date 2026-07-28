import Link from "next/link";
import { VslPlaceholder } from "@/components/upsell/VslPlaceholder";
import { ExpressUpsellButton } from "@/components/upsell/ExpressUpsellButton";
import { ProtectedBadge } from "@/components/checkout/ProtectedBadge";
import { GuaranteeBadges } from "@/components/checkout/GuaranteeBadges";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { env } from "@/lib/env";

const UPSELL_PLAN_ID = process.env.NEXT_PUBLIC_WHOP_UPSELL_PLAN_ID ?? "";

export default function UpsellPage() {
  // Whop rejects non-https redirect URLs, and it's this URL that carries buyers back
  // after a redirect-based payment. On localhost there's nothing valid to send, so the
  // express button falls back to the site root rather than a URL Whop will refuse.
  const returnUrl = env.SITE_URL.startsWith("https://") ? `${env.SITE_URL}/upsell/complete` : env.SITE_URL;

  return (
    <div className="min-h-screen bg-checkout-navy">
      <main className="px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-lg overflow-hidden rounded-xl bg-white shadow-xl">
          <div className="border-b border-black/10 p-5 text-center sm:p-6">
            <h1 className="text-xl font-bold leading-tight text-checkout-dark">
              Tu compra ha sido completada.{" "}
              <span className="text-checkout-green">Antes de que cierres, quiero ser honesta contigo sobre algo.</span>
            </h1>
            <p className="mt-2 text-sm text-checkout-gray">
              Es algo que vimos pasar cientos de veces y sería un error no decírtelo. Mira este video hasta el final.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <VslPlaceholder />
          </div>

          <div className="border-t border-black/10 p-5 text-center sm:p-6">
            <p className="text-lg font-bold text-checkout-dark">Ejecución Avanzada ⭐⭐⭐⭐⭐</p>
            <p className="mt-2 text-3xl font-extrabold text-checkout-dark">$4.97</p>
            <p className="text-xs text-checkout-gray">hoy — luego $17.00 USD/mes</p>

            <div className="mt-5">
              <ExpressUpsellButton planId={UPSELL_PLAN_ID} returnUrl={returnUrl} />
            </div>
          </div>

          <ProtectedBadge />
        </div>

        <div className="mx-auto mt-6 max-w-lg text-center">
          <Link href="/thank-you" className="text-sm text-white/40 underline hover:text-white/60">
            No, prefiero seguir por mi cuenta
          </Link>
        </div>

        <SiteFooter />
      </main>

      <div className="bg-checkout-cream">
        <GuaranteeBadges />
      </div>
    </div>
  );
}
