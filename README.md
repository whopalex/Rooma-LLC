# NEUROPRODUCTIVO — Whop checkout funnel

- **Live:** https://neuroproductivo-checkout.vercel.app
- **Repo:** https://github.com/whopalex/Rooma-LLC
- **Vercel project:** https://vercel.com/alex-whop/neuroproductivo-checkout

Replica of the Hotmart checkout funnel for the NEUROPRODUCTIVO course, rebuilt on Whop:

1. **`/`** — main checkout. Order-bump checkbox ("Sesión 1 a 1 Diagnóstico de Bloqueo Mental", $27)
   sits above a Whop embedded checkout for the $67 course. Checking the box swaps the embed to a
   pre-created **combined plan ($94 = $67 + $27)** — a single one-time charge. The embed sets
   `setupFutureUsage="off_session"` so the card is saved for the upsell page (client's explicit
   choice — see the tradeoff note below, this hides SPEI/OXXO/Nequi/PSE on this page).
2. **`/upsell`** — one-click upsell page (VSL slot for a VTurb embed + `WhopExpressCheckoutButton`),
   styled to match the main checkout (same navy/white/green). Subscription: **$4.97 charged today,
   then $17.00/month starting on day 30** (see the billing note below — this requires
   `trial_period_days: 30` on the plan, not just `initial_price`/`renewal_price`).
   On success, both the main checkout (`onComplete` in `CheckoutEmbedSection.tsx`) and the
   redirect-based flow (`app/return/page.tsx`, for 3DS/SPEI/OXXO) send the buyer to `/upsell` —
   this happens the same way regardless of whether the order bump was included.

## Already done

- 4 plans created in the client's live Whop account (`biz_TnOgGSdgPWnZAe`) via `pnpm setup:whop`:
  - `NEUROPRODUCTIVO` — $67 one-time (`WHOP_MAIN_PLAN_ID`)
  - `Sesión 1 a 1 Diagnóstico de Bloqueo Mental` — $27 one-time, standalone catalog listing (`WHOP_ORDER_BUMP_PLAN_ID`)
  - Combined course + order-bump plan — $94 one-time, used by the funnel when the bump is checked (`WHOP_COMBINED_PLAN_ID`)
  - `Curso de Ejecución Avanzada` — subscription, $4.97 today + $17/mo from day 30 (`WHOP_UPSELL_PLAN_ID`)
- All plans have `adaptive_pricing_enabled: true` and `payment_method_configuration` with
  `card_installments_three/six/twelve` enabled + `include_platform_defaults: true` (so regional
  local payment methods surface automatically per buyer location).
- `.env.local` is filled in with the real API key, company ID, and all plan/product IDs.
- The app builds (`pnpm build`) and has been smoke-tested end-to-end locally against the real
  Whop account: unchecked → `$67` plan, checked → `$94` combined plan, verified live in-browser.

## Known tradeoff: one-click upsell vs. local payment methods on `/`

`setupFutureUsage="off_session"` is set on the main checkout embed (`CheckoutEmbedSection.tsx`).
This is **required** to reliably save the buyer's card so the `/upsell` express button can charge
it without asking for card details again — confirmed via Whop's own docs
(`developer/guides/save-payment-methods.mdx`: "Save during checkout" → pass this prop).

The cost: this same flag filters out payment methods that can't be saved for later off-session
use — SPEI, OXXO, Nequi, PSE, etc. will **not** appear on the main checkout while this is set.
Crypto still shows (it's currency-agnostic). This was an explicit choice the client made
(prioritizing a guaranteed no-re-entry upsell over local payment methods on `/`) — if that
changes, removing `setupFutureUsage` from the embed restores local payment methods immediately.

Separately, two things gate local payment methods even when they're not explicitly filtered:
1. They depend on the buyer's real geography (IP-based), not the merchant's — testing from a
   non-Mexican IP without a VPN will never show SPEI/OXXO, by Whop's design.
2. `adaptivePricing` only makes the buyer's local currency *available* — the code in
   `CheckoutEmbedSection.tsx` actively switches to it via `setDisplayCurrency` as soon as it's
   detected (`onCurrenciesAvailable`), since local payment methods require the checkout to
   actually be running in that local currency, not just displaying a converted price.

## Known gotcha: `initial_price` + `renewal_price` are ADDITIVE on the first charge

Confirmed live in Whop's checkout UI: a plan with `initial_price: 4.97, renewal_price: 17,
billing_period: 30` and **no** `trial_period_days` shows "Total due today: **$21.97**"
(4.97 + 17 summed) — not $4.97 alone as the field names might suggest. To get "$4.97 today, then
$17/mo starting in 30 days," you must also set `trial_period_days: 30` (equal to
`billing_period`) — this defers the first *renewal* charge without being a real "free" trial,
since `initial_price` is still charged immediately regardless of `trial_period_days`. Verified by
screenshotting the actual Whop-hosted checkout page for a test plan before wiring it into
production — see `scripts/setup-whop-products.ts`'s `UPSELL` entry for the working config.

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
pnpm install
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
| `WHOP_MAIN_PRODUCT_ID` / `WHOP_MAIN_PLAN_ID` | Printed by `pnpm setup:whop` |
| `WHOP_ORDER_BUMP_PRODUCT_ID` / `WHOP_ORDER_BUMP_PLAN_ID` | Printed by `pnpm setup:whop` — standalone $27 listing |
| `WHOP_COMBINED_PLAN_ID` | Printed by `pnpm setup:whop` — the $94 plan actually used when the bump is checked |
| `WHOP_UPSELL_PLAN_ID` / `NEXT_PUBLIC_WHOP_UPSELL_PLAN_ID` | Printed by `pnpm setup:whop` |
| `NEXT_PUBLIC_SITE_URL` | Your deployed `https://` domain |

## Re-running the setup script

`pnpm setup:whop` skips creating a product if one with the same title already exists
for your company, so it's safe to re-run after a partial failure — it won't create
duplicates of products that already succeeded. It will, however, create a **new** plan each
run (plans aren't deduped by title), so don't re-run casually once real IDs are in `.env.local`.
