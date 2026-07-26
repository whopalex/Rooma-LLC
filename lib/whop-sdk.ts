import "server-only";
import { Whop } from "@whop/sdk";

// Exact construction pattern confirmed against docs.whop.com/developer/guides/webhooks —
// the webhook secret must be base64-encoded before being handed to the SDK.
export const whopsdk = new Whop({
  apiKey: process.env.WHOP_API_KEY,
  webhookKey: btoa(process.env.WHOP_WEBHOOK_SECRET ?? ""),
});
