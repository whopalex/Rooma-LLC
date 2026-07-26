import Link from "next/link";
import { VslPlaceholder } from "@/components/upsell/VslPlaceholder";
import { ExpressUpsellButton } from "@/components/upsell/ExpressUpsellButton";
import { env } from "@/lib/env";

const UPSELL_PLAN_ID = process.env.NEXT_PUBLIC_WHOP_UPSELL_PLAN_ID ?? "";

export default function UpsellPage() {
  return (
    <div className="min-h-screen bg-checkout-navy px-4 py-10">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
          Tu compra ha sido completada.{" "}
          <span className="text-checkout-green">Antes de que cierres, quiero ser honesta contigo sobre algo.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-white/60">
          Es algo que vimos pasar cientos de veces y sería un error no decírtelo. Mira este video hasta el final.
        </p>
      </div>

      <div className="mt-8">
        <VslPlaceholder />
      </div>

      <div className="mx-auto mt-8 max-w-md rounded-xl bg-white p-6 text-center shadow-xl">
        <p className="text-lg font-bold text-checkout-dark">Ejecución Avanzada ⭐⭐⭐⭐⭐</p>
        <p className="mt-2 text-3xl font-extrabold text-checkout-dark">$4.97</p>
        <p className="text-xs text-checkout-gray">hoy — luego $17.00 USD/mes</p>

        <div className="mt-5">
          <ExpressUpsellButton planId={UPSELL_PLAN_ID} returnUrl={`${env.SITE_URL}/upsell/complete`} />
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-md text-center">
        <Link href="/thank-you" className="text-sm text-white/40 underline hover:text-white/60">
          No, prefiero seguir por mi cuenta
        </Link>
      </div>
    </div>
  );
}
