import Link from "next/link";
import { VslPlaceholder } from "@/components/upsell/VslPlaceholder";
import { ExpressUpsellButton } from "@/components/upsell/ExpressUpsellButton";
import { env } from "@/lib/env";

const UPSELL_PLAN_ID = process.env.NEXT_PUBLIC_WHOP_UPSELL_PLAN_ID ?? "";

export default function UpsellPage() {
  return (
    <div className="min-h-screen bg-zinc-100 px-4 py-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-sm font-bold uppercase tracking-wide text-brand-dark">Espera — antes de irte</p>
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
          Acelera tus resultados con el curso avanzado de Ejecución
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-black/70">
          Mira este video de 3 minutos: te contamos cómo pasar de entender por qué procrastinas a ejecutar tus
          proyectos sin fricción, todos los días.
        </p>
      </div>

      <div className="mt-8">
        <VslPlaceholder />
      </div>

      <div className="mx-auto mt-8 max-w-md rounded-xl border border-black/10 bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-black/50">Oferta única — solo en esta página</p>
        <p className="mt-2 text-2xl font-extrabold">
          Curso de Ejecución Avanzada — <span className="text-brand-dark">$497 USD</span>
        </p>
        <p className="mt-1 text-sm text-black/60">Pago único. Acceso de por vida.</p>
        <div className="mt-5">
          <ExpressUpsellButton planId={UPSELL_PLAN_ID} returnUrl={`${env.SITE_URL}/upsell/complete`} />
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-md text-center">
        <Link href="/thank-you" className="text-sm text-black/40 underline hover:text-black/60">
          No gracias, continuar a mi acceso
        </Link>
      </div>
    </div>
  );
}
