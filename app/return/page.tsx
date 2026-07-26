import Link from "next/link";
import { redirect } from "next/navigation";

interface ReturnPageProps {
  searchParams: Promise<{ status?: string; payment_id?: string }>;
}

export default async function ReturnPage({ searchParams }: ReturnPageProps) {
  const { status, payment_id } = await searchParams;

  if (status === "success") {
    redirect(payment_id ? `/upsell?payment_id=${payment_id}` : "/upsell");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="text-xl font-bold">Tu pago no se pudo completar</h1>
      <p className="mt-2 text-black/60">
        Puede que la tarjeta haya sido rechazada o el pago se haya cancelado. Vuelve a intentarlo.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark"
      >
        Volver al checkout
      </Link>
    </div>
  );
}
