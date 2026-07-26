# NEUROPRODUCTIVO — Whop checkout funnel

- **Live:** https://neuroproductivo-checkout.vercel.app
- **Repo:** https://github.com/whopalex/Rooma-LLC
- **Vercel project:** https://vercel.com/alex-whop/neuroproductivo-checkout

Replica of the Hotmart checkout funnel for the NEUROPRODUCTIVO course, rebuilt on Whop:

1. **`/`** — main checkout. Order-bump checkbox ("Sesión 1 a 1 Diagnóstico de Bloqueo Mental", $27)
   sits above a Whop embedded checkout for the $67 course. Checking the box swaps the embed to a
   pre-created **combined plan ($94 = $67 + $27)** — a single one-time charge, adaptive pricing and
   local payment methods (SPEI, OXXO, Nequi, PSE, card installments, etc.) all intact.
2. **`/upsell`** — one-click upsell page (VSL placeholder + `WhopExpressCheckoutButton`) for a
   one-time $497 course. This is a standalone Apple Pay / Google Pay / Whop Pay widget — it does
   not depend on anything saved during the main checkout.

## Already done

- 4 plans created in the client's live Whop account (`biz_TnOgGSdgPWnZAe`) via `npm run setup:whop`:
  - `NEUROPRODUCTIVO` — $67 one-time (`WHOP_MAIN_PLAN_ID`)
  - `Sesión 1 a 1 Diagnóstico de Bloqueo Mental` — $27 one-time, standalone catalog listing (`WHOP_ORDER_BUMP_PLAN_ID`)
  - Combined course + order-bump plan — $94 one-time, used by the funnel when the bump is checked (`WHOP_COMBINED_PLAN_ID`)
  - `Curso de Ejecución Avanzada` — $497 one-time (`WHOP_UPSELL_PLAN_ID`)
- All plans have `adaptive_pricing_enabled: true` and `payment_method_configuration` with
  `card_installments_three/six/twelve` enabled + `include_platform_defaults: true` (so regional
  local payment methods surface automatically per buyer location).
- `.env.local` is filled in with the real API key, company ID, and all plan/product IDs.
- The app builds (`npm run build`) and has been smoke-tested end-to-end locally against the real
  Whop account: unchecked → `$67` plan, checked → `$94` combined plan, verified live in-browser.

## Important: why local payment methods (SPEI, OXXO, etc.) might not show

Two independent things gate this — both worth checking if a buyer reports missing options:

1. **Local payment methods depend on the buyer's real geography (IP-based), not the merchant's.**
   Testing from a non-Mexican IP without a VPN will never show SPEI/OXXO, by Whop's design.
2. **`setupFutureUsage: "off_session"` filters out non-reusable payment methods.** This project
   does **not** set that prop on the main embed (it isn't needed — `WhopExpressCheckoutButton` on
   `/upsell` is a fully independent widget, not dependent on a saved card from the main purchase).
   If a future change adds `setupFutureUsage="off_session"` back to `CheckoutEmbedSection.tsx`,
   expect SPEI/OXXO/Nequi/PSE to disappear again — that tradeoff is documented inline in the code.

## What you still need to do before going live

### 1. Rotate your API key

The key you shared was pasted in plaintext in a chat conversation. Once you've confirmed
everything works, **generate a new API key** in the Whop dashboard (Developer → API Keys),
update `.env.local` and your Vercel project env vars, and revoke the old one.

### 2. Create the webhook (optional, for future fulfillment logic)

`app/api/webhooks/whop/route.ts` currently just logs whether the order bump was included on each
payment — there's no automatic action tied to it yet (e.g. notifying the team to schedule the
diagnostic call). If you want that, this is the place to add it. Needs a public HTTPS URL, so do
this after deploying:

1. Go to your [Whop dashboard → Developer](https://whop.com/dashboard/developer).
2. Click **Create Webhook**, URL: `https://<your-vercel-domain>/api/webhooks/whop`.
3. Subscribe to at least `payment.succeeded`.
4. Copy the webhook secret into `WHOP_WEBHOOK_SECRET` (both locally and in Vercel's env vars).

### 3. Deploy to Vercel

```bash
npm install
vercel deploy
```

Set every variable from `.env.local` in the Vercel project settings (Environment
Variables). Set `NEXT_PUBLIC_SITE_URL` to your real `https://` domain — locally it
falls back to `http://localhost:3000`, and the Whop API rejects non-https redirect
URLs, so the return-redirect flow only fully works once deployed (or behind an https
tunnel like ngrok/Cloudflare Tunnel for local testing).

### 4. Test before going live

- [ ] Load `/`, confirm the $67 embed renders with the order bump above it.
- [ ] Check the order-bump box, confirm "Detalles de la compra" shows $94 total and the embed
      swaps to the combined plan (network tab: new `POST /api/checkout-session` call).
- [ ] From a Mexican IP (or VPN), confirm SPEI/OXXO appear on the embed; from a Colombian IP,
      confirm Nequi/PSE appear.
- [ ] Visit `/upsell`, confirm the express checkout button renders and completes a purchase.

### 5. Replace the placeholder content

- `components/upsell/VslPlaceholder.tsx` — swap for your real VSL video/embed.
- Copy/branding throughout `app/page.tsx` and `app/upsell/page.tsx` — adjust wording as needed.

## Env vars reference

| Var | Where to find it |
|---|---|
| `WHOP_API_KEY` | Dashboard → Developer → API Keys |
| `WHOP_WEBHOOK_SECRET` | Dashboard → Developer → Webhooks (after creating the webhook — see step 2 above) |
| `WHOP_COMPANY_ID` | Your dashboard URL: `whop.com/dashboard/<biz_xxx>/...` |
| `WHOP_MAIN_PRODUCT_ID` / `WHOP_MAIN_PLAN_ID` | Printed by `npm run setup:whop` |
| `WHOP_ORDER_BUMP_PRODUCT_ID` / `WHOP_ORDER_BUMP_PLAN_ID` | Printed by `npm run setup:whop` — standalone $27 listing |
| `WHOP_COMBINED_PLAN_ID` | Printed by `npm run setup:whop` — the $94 plan actually used when the bump is checked |
| `WHOP_UPSELL_PLAN_ID` / `NEXT_PUBLIC_WHOP_UPSELL_PLAN_ID` | Printed by `npm run setup:whop` |
| `NEXT_PUBLIC_SITE_URL` | Your deployed `https://` domain |

## Re-running the setup script

`npm run setup:whop` skips creating a product if one with the same title already exists
for your company, so it's safe to re-run after a partial failure — it won't create
duplicates of products that already succeeded. It will, however, create a **new** plan each
run (plans aren't deduped by title), so don't re-run casually once real IDs are in `.env.local`.
