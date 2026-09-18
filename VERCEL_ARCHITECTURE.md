# LAWRENCE MONROE — Vercel E-Commerce Architecture Specification
**Full-Stack Spec v1.0 — Vercel Edge Network · Square Commerce · Sanity Editorial**
*Principal Full-Stack E-Commerce Architect & Lead UI/UX Motion Engineer*

Everything in this document is implemented in this repository. The storefront is live-code, the serverless routes are in `api/`, the Sanity schemas are in `sanity/`, and every command is copy-paste ready.

---

## §1 — MULTI-PAGE SITEMAP & VERCEL PROJECT STRUCTURE

### 1.1 Sitemap

```
lawrencemonroe.com
│
├── / ........................ INDEX / THE ENTRANCE (v2 light editorial)
│     ├── Single mounted print + ink wordmark on paper grain
│     ├── THE DROP — capsule, top items, live Square pricing/stock
│     ├── THE STATEMENT — one typographic moment (velocity type)
│     └── THE NETWORK — four channel index rows + closing CTA
│
├── /shop .................... SHOP / COLLECTION CATALOG
│     ├── Sort: NEW ARRIVALS · ESSENTIALS · LOOKBOOK EXCLUSIVES (+ price)
│     ├── Live Square pricing, size variations (S–XXL), inventory badges
│     ├── Interactive variant selection + QUICK ADD per card
│     ├── Macro-zoom inspection on card hover
│     └── Cart Drawer → INSTANT inline Square checkout OR full /checkout
│
├── /shop/:slug .............. PRODUCT DOSSIER (detail page)
│
├── /vault ................... EDITORIAL VAULT / THE ARCHIVE
│     ├── Campaign lookbooks · Gen Effects Vol 1 · Silver-Gelatin stories
│     ├── Sanity Studio–powered with bundled local fallback
│     ├── Sticky stacking lookbook + speed-index drag gallery
│     └── Dossier modals with gallery plates + SHOP THE STORY links
│
├── /telemetry ............... RAW FEEDS / SOCIAL HUB
│     ├── Official @LawrenceMonroe Instagram (Behold or Graph, via /api/instagram)
│     ├── Curated community archive
│     ├── Asymmetrical grid — hover zoom, timestamps, "VIEW POST" cursor state
│     ├── Light-box viewer — high-res plates, keyboard nav, SHOP THE LOOK
│     └── Tags mapped to Square Item IDs
│
├── /about ................... BRAND MANIFESTO (high typography)
├── /checkout ................ Square Web Payments SDK checkout
└── /api/* ................... Vercel Serverless Functions (see §2)
```

### 1.2 Project structure (directory tree)

```
Lawrencemonroe/
├── api/                          # VERCEL SERVERLESS FUNCTIONS (Node runtime)
│   ├── lib/
│   │   └── square.ts             # Square client lib: catalog, inventory,
│   │                             #   images, orders, payments + 60s cache
│   ├── square/
│   │   ├── catalog.ts            # GET  /api/square/catalog   (public feed)
│   │   ├── checkout.ts           # POST /api/square/checkout  (order + charge)
│   │   └── webhook.ts            # POST /api/square/webhook   (HMAC verified)
│   ├── instagram.ts              # GET  /api/instagram        (IG Graph → tags)
│   └── revalidate.ts             # POST /api/revalidate       (Sanity webhook)
│
├── sanity/                       # SANITY STUDIO REFERENCE (see §3)
│   ├── schemas.ts                # lookbookStory · curatedTelemetryPost · siteSettings
│   └── sanity.config.ts          # Studio config + desk structure
│
├── src/
│   ├── pages/
│   │   ├── HomePage.tsx          # / (hero, capsule, network)
│   │   ├── ShopPage.tsx          # /shop (Square live)
│   │   ├── ProductDetailPage.tsx # /shop/:slug
│   │   ├── VaultPage.tsx         # /vault (Sanity live)
│   │   ├── TelemetryPage.tsx     # /telemetry (Instagram live)
│   │   ├── AboutPage.tsx         # /about
│   │   └── CheckoutPage.tsx      # /checkout (Square WPSDK)
│   ├── services/
│   │   ├── squareCatalog.ts      # /api/square/catalog consumer + local fallback
│   │   ├── sanityVault.ts        # Content Lake (GROQ over HTTPS) consumer
│   │   └── rawFeed.ts            # /api/instagram consumer + curated fallback
│   ├── components/
│   │   ├── common/
│   │   │   ├── PageTransition.tsx    # curtain route transitions
│   │   │   ├── OptimizedImage.tsx    # /_vercel/image WebP/AVIF + srcset
│   │   │   ├── AssetInspector.tsx    # macro zoom lens
│   │   │   ├── CustomCursor.tsx      # magnetic cursor w/ state pills
│   │   │   ├── CartDrawer.tsx        # slide-over: BAG / EXPRESS / SUCCESS
│   │   │   └── ...
│   │   ├── checkout/
│   │   │   ├── InlineSquareCheckout.tsx  # WPSDK card form inside the drawer
│   │   │   └── SquarePaymentForm.tsx     # full /checkout page form
│   │   └── home/ (light hero, capsule drop, statement, network
│   │       + lookbook stack & drag gallery — served on /vault)
│   ├── motion/tokens.ts          # design tokens (easings/springs/triggers)
│   └── data/ (bundled fallbacks: products, vault, feed, frames)
│
├── vercel.json                   # SPA rewrites, immutable caching, security headers
├── netlify [REMOVED]             # architecture migrated to Vercel
└── DESIGN_FRAMEWORK.md           # motion & interaction design system
```

### 1.3 GitHub → Vercel CI/CD

```bash
# One-time link
npm i -g vercel
vercel link                    # → creates the Vercel project

# Everyday flow
git checkout -b feat/next-release
# …work…
git push origin feat/next-release
# → Vercel builds an instant PREVIEW deployment (unique URL, safe to share)

git checkout main
git merge feat/next-release
git push origin main           # → PRODUCTION deployment (automatic)
```

- **Preview deployments**: every push to any non-`main` branch gets an immutable preview URL with the full `/api/*` function set (sandbox env vars).
- **Rollback**: Dashboard → Deployments → any previous build → *Promote to Production* (zero-git-history surgery).
- `vercel.json` ships SPA rewrites (`/((?!api/).*)` → `/index.html`), immutable `assets/*` caching, and security headers.

---

## §2 — VERCEL SERVERLESS FUNCTIONS (SECURE SQUARE + INSTAGRAM)

All secrets live in **Vercel → Settings → Environment Variables** — never in the repo, never in the client bundle. The browser only ever talks to our own `/api/*` routes.

```
Browser ──▶ /api/square/catalog ──▶ connect.squareup.com  (Bearer SQUARE_ACCESS_TOKEN)
        ──▶ /api/square/checkout ─▶ /v2/orders + /v2/payments
        ──▶ /api/instagram ───────▶ graph.instagram.com    (access token)
                                     └─ captions matched → Square Item IDs
```

### 2.1 `api/lib/square.ts` — the single Square touchpoint

- `buildAuthoritativeCatalog()` — paginates `GET /v2/catalog/list?types=ITEM`, batch-fetches `POST /v2/inventory/counts/batch-retrieve` (IN_STOCK per variation), resolves IMAGE objects to CDN URLs, and normalizes everything into `{ squareItemId, name, variations[{variationId, name, priceCents, stock, available}], … }`. Cached 60s per instance.
- `createSquareOrder()` — `POST /v2/orders` with `catalog_object_id` line items → **the order appears in the owner's Square Orders dashboard**.
- `createSquarePayment()` — `POST /v2/payments` charging the Web Payments SDK token **against the order** (`order_id`), keeping payment + fulfillment linked.
- Environment switch: `SQUARE_ENVIRONMENT=production|sandbox` flips `connect.squareup.com` ↔ `connect.squareupsandbox.com`.

### 2.2 `api/square/checkout.ts` — server-authoritative charge (excerpt)

```ts
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { sourceId, customer, items, idempotencyKey } = req.body || {};

  // 1. Validate cart against LIVE Square catalog — prices/stock from Square
  const catalog = squareConfigured() ? await buildAuthoritativeCatalog() : null;
  for (const item of items) {
    const live = catalog?.items.find(/* match by Square item id or name */);
    const variation = live?.variations.find((v) => v.name.toUpperCase().startsWith(size));
    if (!variation?.available || variation.stock < qty)
      return res.status(400).json({ error: `${live.name} (${size}) — insufficient inventory.` });
    orderLines.push({ variationId: variation.variationId, quantity: qty }); // ← catalog-priced
  }

  // 2. Create the Square ORDER (shows in Square Dashboard → Orders)
  const order = await createSquareOrder({ locationId, lines: orderLines, … });

  // 3. Charge the Web Payments SDK token against that order
  const payment = await createSquarePayment({
    sourceId,                          // token from payments.tokenize() — PCI SAQ-A
    amountCents: order.totalCents,     // amount computed server-side
    orderId: order.orderId,            // payment ↔ fulfillment linkage
    idempotencyKey,                    // safe retry / double-charge protection
  });

  return res.status(200).json({ orderId, squareOrderId: order.orderId,
    paymentId: payment.payment.id, status: payment.payment.status, … });
}
```

Client side, the Square Web Payments SDK produces the token (card fields are iframed by Square — raw PAN never touches our code):

```ts
const payments = window.Square.payments(VITE_SQUARE_APP_ID, VITE_SQUARE_LOCATION_ID);
const card = await payments.card({ /* noir input styling */ });
await card.attach('#card-container');
const result = await card.tokenize();               // { token, status: 'OK' }
const order = await fetch('/api/square/checkout', {
  method: 'POST',
  body: JSON.stringify({ sourceId: result.token, customer, items: cart }),
}).then((r) => r.json());
```

### 2.3 `api/instagram.ts` — live feed with product tagging

Two providers, first match wins — both keep tokens off the client:

| Provider | Env | Notes |
|---|---|---|
| **Behold** (recommended) | `BEHOLD_FEED_ID` | behold.so manages token refresh + API churn upstream; endpoint is just `https://feed.behold.so/{feedId}` |
| **Instagram Graph API** | `INSTAGRAM_ACCESS_TOKEN` | direct Graph calls (`instagram_basic` + `instagram_manage_insights`) |

```ts
// Provider dispatch
const provider = beholdFeedId ? 'behold' : 'graph';
const rawPosts = beholdFeedId
  ? await fetchFromBehold(beholdFeedId)      // GET feed.behold.so/{id}
  : await fetchFromGraph(igToken);           // GET graph.instagram.com/v21.0

// SHOP THE LOOK — match captions/SKUs against the live Square catalog
const posts = rawPosts.map((m) => ({ ...m, tags: matchTags(m.caption, catalog.items) }));
return res.json({ source: 'live', provider, posts });   // soft-fail → curated fallback
```

Full Graph flow for reference:

```ts
export default async function handler(req, res) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;        // server-side only
  const me    = await fetch(`${IG_GRAPH}/me?fields=id,username&access_token=${token}`);
  const media = await fetch(`${IG_GRAPH}/${id}/media?fields=id,caption,media_url,
                              thumbnail_url,permalink,timestamp,like_count&limit=24…`);

  // SHOP THE LOOK — match captions/SKUs against the live Square catalog
  const catalog = await buildAuthoritativeCatalog();
  const posts = media.data.map((m) => ({
    …m,
    tags: matchTags(m.caption, catalog.items),   // name tokens or SKU → Square item
  }));
  return res.json({ source: 'live', posts });    // soft-fail → curated fallback
}
```

### 2.4 `api/square/webhook.ts` + `api/revalidate.ts`
- Square webhook: verifies `x-square-hmacsha256-signature` (HMAC-SHA256 over `url + body`), handles `inventory.count.updated` / `catalog.version.updated` / `payment.updated` → clears the catalog cache.
- Sanity webhook (`/api/revalidate`): timing-safe secret check, cache clear + warm fetch (see §3.3).

---

## §3 — SANITY.IO EDITORIAL LAYER + ON-DEMAND ISR

### 3.1 Schemas (`sanity/schemas.ts`)

| Document | Fields | Powers |
|---|---|---|
| `lookbookStory` | title, slug, category (CAMPAIGN / GEN EFFECTS / SILVER-GELATIN), summary, coverImage, gallery[] (image + plate label), publishedAt, credits[], **linkedSquareItemIds[]**, featured | /vault dossiers |
| `curatedTelemetryPost` | handle, image, caption, postedAt, linkedSquareItemIds[] | /telemetry community rail |
| `siteSettings` | vaultIntro, telemetryIntro | page intro lines |

The `linkedSquareItemIds` field is the join key between editorial and commerce — story dossiers and social frames render **SHOP THE STORY / SHOP THE LOOK** chips for each linked Square item.

### 3.2 Studio setup

```bash
npm create sanity@latest -- --template clean --dataset production
# → sanity.io account → new project → copy the PROJECT ID
# copy sanity/schemas.ts into the studio workspace, wire sanity.config.ts
npm run dev        # Studio at localhost:3333
# Optional hosting: deploy Studio to sanity.lawrencemonroe.com
```

The storefront reads the public Content Lake directly (no secret needed):

```ts
// src/services/sanityVault.ts
const res = await fetch(
  `https://${PROJECT_ID}.apicdn.sanity.io/v1/data/query/${DATASET}?query=${encodeURIComponent(GROQ)}`
);
```

Images flow through Sanity's CDN (`cdn.sanity.io`) and are rewritten by `<OptimizedImage />` into `/_vercel/image` WebP/AVIF with a responsive srcset.

### 3.3 Webhook → On-Demand revalidation

This app is a Vite SPA, so the Next.js `res.revalidate()` primitive is replaced by its exact functional equivalent:

```
Owner clicks PUBLISH in Sanity Studio
  → Sanity webhook (manage.sanity.io → API → Webhooks)
      URL:     https://lawrencemonroe.com/api/revalidate
      Secret:  header  sanity-webhook-secret = SANITY_WEBHOOK_SECRET
      Trigger: on create/update/delete of lookbookStory
  → api/revalidate.ts verifies the secret (timing-safe), clears the
    catalog cache, warms /api/square/catalog, returns a receipt
  → Editorial content itself is read fresh from the Content Lake CDN on
    every page load (uncached fetch) — publish-to-screen is immediate
```

*(If the project migrates to Next.js App Router, `api/revalidate.ts` becomes a one-line `res.revalidate(path)` per slug — the webhook contract stays identical.)*

---

## §4 — GODADDY → VERCEL DNS + ENVIRONMENT VARIABLES

### 4.1 Domain mapping (GoDaddy DNS Manager)

| Type | Host | Value | TTL |
|---|---|---|---|
| **A** | `@` | `76.76.21.21` | 600s (or "Default") |
| **CNAME** | `www` | `cname.vercel-dns.com` | 600s |

Steps:
1. Vercel Dashboard → Project → **Settings → Domains → Add** → `lawrencemonroe.com` (and `www.lawrencemonroe.com` → redirect to apex).
2. GoDaddy → My Products → DNS → manage the domain's zone file → set the records above. **Delete any competing A/CNAME records** (GoDaddy "Parked" defaults) or Vercel will warn about conflicts.
3. SSL: Vercel provisions the certificate automatically once the A record propagates (usually minutes). Leave "Full" — no action needed.
4. Verify in Vercel → Domains → both records show ✅ **Valid Configuration**.

### 4.2 Environment variables (Vercel → Settings → Environment Variables)

**Server (Production + Preview — secret):**

| Key | Value | Used by |
|---|---|---|
| `SQUARE_ACCESS_TOKEN` | Square Dashboard → Developer → Credentials (*Production* app) | all /api/square/* |
| `SQUARE_LOCATION_ID` | Square Dashboard → Locations → Location details | catalog, checkout |
| `SQUARE_ENVIRONMENT` | `production` (or `sandbox` for staging) | lib/square |
| `SQUARE_WEBHOOK_SIGNATURE_KEY` | Square Dashboard → Developer → Webhooks → Signature key | api/square/webhook |
| `INSTAGRAM_ACCESS_TOKEN` | Meta developers → Instagram Graph API token (instagram_basic) | api/instagram |
| `BEHOLD_FEED_ID` *(optional)* | behold.so feed id — takes priority over the Graph token | api/instagram |
| `SANITY_WEBHOOK_SECRET` | long random string — same value in the Sanity webhook | api/revalidate |
| `SITE_URL` | `https://lawrencemonroe.com` | webhooks, revalidate |

**Client (prefixed `VITE_` — public by design):**

| Key | Value |
|---|---|
| `VITE_SQUARE_APP_ID` | Square app id (`sq0idp-…`) — pairs with the public location id |
| `VITE_SQUARE_LOCATION_ID` | Same location id as above (public in WPSDK init) |
| `VITE_SQUARE_ENVIRONMENT` | `production` / `sandbox` |
| `VITE_SANITY_PROJECT_ID` | sanity.io project id |
| `VITE_SANITY_DATASET` | `production` |

Then redeploy (env changes require a fresh build: Deployments → ⋯ → Redeploy).

---

## §5 — CLIENT PORTAL ONBOARDING WORKFLOW

### 5.1 Products & inventory — Square Dashboard (no code)

1. **Square Dashboard → Items → Create item.** Name it exactly as it should read on the site (e.g. `LM SHORTS 003`). Add description, upload the lead image.
2. **Add variations** — one per size: `S, M, L, XL, XXL` (site maps these to the size rail). Set each variation's price and, if used, SKU (SKUs are also read by Instagram SHOP THE LOOK matching).
3. **Inventory → set counts** per variation (or edit from the Point of Sale app — same data).
4. **Within ~60 seconds** the item appears at `/shop` (live feed), on the homepage capsule strip, and is orderable at checkout. Stock badges (`LOW STOCK`, `SOLD OUT`) and size availability follow the live inventory automatically.
5. Orders placed on the site land in **Square Dashboard → Orders** with the website order id in the note/metadata — pick, pack, ship, and track from there. Refunds/updates flow back through Square.

### 5.2 Editorial — Sanity Studio (no code)

1. Open Studio → **Lookbook Stories → +**.
2. Write title (slug auto-generates), pick a **category** (CAMPAIGN / GEN EFFECTS / SILVER-GELATIN), write the summary.
3. **Drag-and-drop** the cover image and gallery plates; caption each plate (the mono label under it).
4. Add credits, set **Published At** (controls ordering), tick **Featured** for the lead dossier slot.
5. Under **Linked Square Items**, paste the Square Item IDs to shop-link (copy from Square Dashboard → Items → item URL — the staff-only note field is a good place to keep them).
6. **Publish.** The webhook fires `/api/revalidate`; the story is live on `/vault` immediately.
7. Community frames: **Curated Telemetry Posts → +** (same flow, feeds `/telemetry`).

### 5.3 Daily loop
- **Drop a product** → Square: add item + stock → auto-appears.
- **Sell out** → Square: inventory hits 0 → cards flip to `SOLD OUT`, checkout blocks that size server-side.
- **Campaign update** → Sanity: publish story → live instantly.
- **Instagram** → post normally from the phone; the feed and its SHOP THE LOOK tags sync automatically.

---

## §6 — MOTION SNIPPETS (PAGE TRANSITIONS + SQUARE CART DRAWER)

### 6.1 Route curtain transition (`src/components/common/PageTransition.tsx`)

```tsx
// Two-layer curtain: gold seam + void-black panel sweeps L→R→L on navigation
<motion.div
  key={pathname}
  className="fixed inset-0 z-[90] pointer-events-none"
  initial={{ x: '100%' }}
  animate={{ x: ['100%', '0%', '0%', '-100%'] }}
  transition={{ duration: 0.72, times: [0, 0.45, 0.55, 1],
                ease: [0.16, 1, 0.3, 1] }}   // EASE.cinematicOut
>
  <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-gold via-gold/60 to-gold" />
  <div className="absolute inset-0 bg-void" />   {/* #0D0D0D */}
</motion.div>

// New route content fades up beneath the clearing curtain
<AnimatePresence mode="wait" initial={false}>
  <motion.div key={location.pathname}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}>
    <Routes>…</Routes>
  </motion.div>
</AnimatePresence>
```
Reduced-motion: the curtain is skipped; only the 340ms content cross-fade remains.

### 6.2 Square cart drawer (`src/components/common/CartDrawer.tsx`)

```tsx
{/* Backdrop — spec-exact glassmorphism */}
<motion.div
  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
  transition={{ duration: 0.3, ease: [0.83, 0, 0.17, 1] }}  // EASE.aperture
  onClick={closeCart}
  className="fixed inset-0 bg-black/60 backdrop-blur-[20px]"
/>

{/* Panel — fluid slide with physical settle (stackSettle-class spring) */}
<motion.div
  initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
  transition={{ type: 'spring', stiffness: 210, damping: 30, mass: 0.9 }}
  className="w-screen max-w-md bg-graphite border-l border-line"
>
  {/* antique gold seam down the leading edge */}
  <div className="absolute top-0 left-0 bottom-0 w-[1px]
                  bg-gradient-to-b from-gold via-gold/40 to-transparent" />
  …line items → CHECKOUT → Square Web Payments SDK tokenize → /api/square/checkout
</motion.div>
```

### 6.3 Quick-add + variant selection (ShopCard, `/shop`)

```tsx
const [selectedSize, setSelectedSize] = useState<Size>(firstAvailable);

<button /* size chip */
  onClick={() => setSelectedSize(v.size)}
  disabled={!v.available}                       // live Square variation stock
  className={isSelected ? 'border-gold bg-gold text-black'
             : v.available ? 'border-line hover:border-smoke'
             : 'line-through cursor-not-allowed'}>
  {v.label}
</button>

<button onClick={handleQuickAdd} disabled={!selectedVariant?.available}>
  <Plus size={13} /> QUICK ADD {selectedSize}   // addItem(...) + openCart()
</button>                                       // drawer carries the WPSDK form
```

### 6.4 Telemetry light-box (glass viewer, keyboard nav)

```tsx
<motion.div  /* fluid scale-up through blur(20px) glass */
  initial={{ opacity: 0, scale: 0.92, y: 26, filter: 'blur(10px)' }}
  animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
  exit={{ opacity: 0, scale: 0.94, y: 14, filter: 'blur(8px)' }}
  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
  className="glass-panel-heavy max-w-5xl flex flex-col lg:flex-row">
  <AnimatePresence mode="wait">                 {/* plate swap: blur-in/out */}
    <motion.img key={post.id}
      initial={{ opacity: 0, scale: 1.015, filter: 'blur(6px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} />
  </AnimatePresence>
  …SHOP THE LOOK chips → tagHref(tag) → /shop/:slug
</motion.div>

// Keyboard: ← / → cycle frames, Esc closes (window keydown while open)
// Grid tiles advertise `data-cursor="view" data-cursor-label="VIEW POST"`
// (vault dossiers use the "EXPLORE" state) — see CustomCursor state machine.
```

### 6.5 Supporting tokens (`src/motion/tokens.ts`)
`EASE.cinematicOut [0.16,1,0.3,1]` · `EASE.aperture [0.83,0,0.17,1]` · springs `cursorCore 900/50/.1`, `magnetic 180/14/.4`, `parallaxRig 60/20/1.2`, `inspectorLens 400/32/.5`. Full token tables: **DESIGN_FRAMEWORK.md §4**.

---

## §7 — IMAGE OPTIMIZATION (VERCEL EDGE)

`<OptimizedImage />` rewrites remote sources (Sanity CDN, Square media, Instagram CDN) to `/_vercel/image?url=…&w=…&q=75`, emitting a 480/828/1080/1600 `srcset` (WebP/AVIF negotiation automatic). Local assets ride Vite's hashed pipeline with `immutable` cache headers via `vercel.json`. On non-Vercel hosts (dev, previews) the component degrades to original URLs with zero config.

*Plan note: remote-domain image optimization on Vercel requires the Pro plan; on Hobby the component still functions and serves originals.*

---

## §8 — DEPLOYMENT CHECKLIST

```
□ vercel link                            # connect repo
□ Add env vars (§4.2) — all 7 server + 5 client
□ Add domains + GoDaddy DNS (§4.1)       # SSL auto-provisions
□ Square: production app credentials + webhook
    → https://lawrencemonroe.com/api/square/webhook
    → subscribe: inventory.count.updated, payment.updated, order.created
□ Sanity: project + dataset → VITE_SANITY_PROJECT_ID
□ Sanity webhook → https://lawrencemonroe.com/api/revalidate (+ secret)
□ Instagram provider — EITHER Behold (BEHOLD_FEED_ID) OR Meta token
    with instagram_basic → INSTAGRAM_ACCESS_TOKEN
□ Redeploy with env vars → verify /api/square/catalog returns source:'square'
□ Test order end-to-end → confirm it appears in Square Dashboard → Orders
```

**Fallback posture:** every integration degrades gracefully — no Square token → bundled catalog; no Sanity → bundled archive; no Instagram token → curated feed. The site never shows an empty state to a customer.
