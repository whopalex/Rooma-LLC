import { GuaranteeBadges } from "@/components/checkout/GuaranteeBadges";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-checkout-navy">
      <main className="px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-lg overflow-hidden rounded-xl bg-white p-6 text-center shadow-xl sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-checkout-green/15">
            <svg viewBox="0 0 24 24" className="h-9 w-9 fill-none stroke-checkout-green stroke-[2.5]">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="mt-5 text-2xl font-bold text-checkout-dark">
            ¡Listo! Ya eres parte de <span className="text-checkout-green">NEUROPRODUCTIVO</span>
          </h1>
          <p className="mt-3 text-sm text-checkout-gray">
            Te enviamos un correo con tu acceso y los datos para entrar a la plataforma. Revisa también spam o
            promociones por si acaso.
          </p>

          <div className="mt-6 rounded-lg border border-black/10 bg-checkout-cream p-4 text-left">
            <p className="text-sm font-bold text-checkout-dark">Próximos pasos</p>
            <ul className="mt-2 space-y-2 text-sm text-checkout-gray">
              <li className="flex gap-2">
                <span className="text-checkout-green">1.</span>
                Revisa tu email y confirma tu cuenta.
              </li>
              <li className="flex gap-2">
                <span className="text-checkout-green">2.</span>
                Entra a la plataforma con los datos que te enviamos.
              </li>
              <li className="flex gap-2">
                <span className="text-checkout-green">3.</span>
                Empieza con el primer módulo de NEUROPRODUCTIVO.
              </li>
            </ul>
          </div>

          <p className="mt-6 text-xs text-checkout-gray">
            ¿No te llegó el correo? Escríbenos a{" "}
            <a href="mailto:soporte@neuroproductivo.com" className="text-checkout-blue underline">
              soporte@neuroproductivo.com
            </a>
          </p>
        </div>

        <SiteFooter showPurchaseConsent={false} />
      </main>

      <div className="bg-checkout-cream">
        <GuaranteeBadges />
      </div>
    </div>
  );
}
