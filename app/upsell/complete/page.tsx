import { redirect } from "next/navigation";

interface UpsellCompletePageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function UpsellCompletePage({ searchParams }: UpsellCompletePageProps) {
  const { status } = await searchParams;

  if (status === "error") {
    redirect("/upsell");
  }

  redirect("/thank-you");
}
