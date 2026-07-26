import { waitUntil } from "@vercel/functions";
import type { NextRequest } from "next/server";
import { whopsdk } from "@/lib/whop-sdk";

// The order bump is now a one-time charge combined into the main checkout's own
// plan ($67 or $94, see app/api/checkout-session/route.ts) — so there's no
// separate post-payment charge to trigger here anymore. This handler is kept as
// a starting point for future fulfillment logic (e.g. notifying the team when
// the $27 diagnostic session was included, so they can schedule the call).
export async function POST(request: NextRequest): Promise<Response> {
  const requestBodyText = await request.text();
  const headers = Object.fromEntries(request.headers);

  let webhookData;
  try {
    // Verifies the Standard Webhooks signature and throws on a bad/missing one —
    // never trust a payload that hasn't passed through this.
    webhookData = whopsdk.webhooks.unwrap(requestBodyText, { headers });
  } catch (err) {
    console.error("[webhook] signature verification failed", err);
    return new Response("invalid signature", { status: 400 });
  }

  if (webhookData.type === "payment.succeeded") {
    waitUntil(handlePaymentSucceeded(webhookData.data));
  }

  // Respond 2xx fast — Whop retries on non-2xx / slow responses.
  return new Response("OK", { status: 200 });
}

async function handlePaymentSucceeded(payment: any) {
  const orderBumpIncluded = payment?.metadata?.order_bump === "yes";
  console.log("[payment.succeeded]", { paymentId: payment?.id, orderBumpIncluded });
  // TODO: if orderBumpIncluded, notify the team to schedule the "Sesión 1 a 1
  // Diagnóstico de Bloqueo Mental" call (e.g. email/Slack) — no such integration
  // exists yet.
}
