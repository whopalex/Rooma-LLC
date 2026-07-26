import { NextRequest, NextResponse } from "next/server";
import { whopsdk } from "@/lib/whop-sdk";
import { env, redirectUrlFor } from "@/lib/env";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const orderBump = body?.orderBump === true;

  // Both the plain course ($67) and course+order-bump ($94) are pre-created plans —
  // referencing them by ID (rather than inline attributes) keeps adaptive pricing and
  // the installment/payment-method configuration set on each plan intact.
  const config = await whopsdk.checkoutConfigurations.create({
    company_id: env.WHOP_COMPANY_ID,
    plan_id: orderBump ? env.WHOP_COMBINED_PLAN_ID : env.WHOP_MAIN_PLAN_ID,
    metadata: { order_bump: orderBump ? "yes" : "no" },
    redirect_url: redirectUrlFor("/return"),
  });

  return NextResponse.json({ sessionId: config.id, purchaseUrl: config.purchase_url });
}
