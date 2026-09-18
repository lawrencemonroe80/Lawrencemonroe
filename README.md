# LAWRENCE MONROE — Release 001 Digital Campaign

Ultra-premium multi-page e-commerce experience for the Lawrence Monroe private label —
high-fashion minimalism, 90s neo-noir analog textures, and cutting-edge
interactive motion design.

**📐 Architecture spec:** [`VERCEL_ARCHITECTURE.md`](./VERCEL_ARCHITECTURE.md) —
sitemap, Vercel serverless functions, Square integration, Sanity editorial
layer, DNS + env configuration, client onboarding workflow.

**🎬 Design system:** [`DESIGN_FRAMEWORK.md`](./DESIGN_FRAMEWORK.md) — the complete
motion & interaction framework (palette, type, hero architecture, lookbook
scroll mechanics, component specs, motion tokens, code snippets).

## Stack
- React 18 + TypeScript + Vite (SPA, curtain route transitions)
- Tailwind CSS (custom noir palette) + Framer Motion 11
- Zustand (cart / modal state)
- **Vercel** — Edge Network hosting, `/api` serverless functions, image optimization
- **Square** — Web Payments SDK (client) + Catalog / Inventory / Orders / Payments APIs (server)
- **Sanity.io** — editorial vault content (`sanity/schemas.ts`)

## Pages
| Route | Page |
|---|---|
| `/` | Index — light editorial entrance, capsule drop, statement, network |
| `/shop` · `/shop/:slug` | Live Square catalog + product dossiers |
| `/vault` | Editorial vault (Sanity lookbooks + motion archive) |
| `/telemetry` | RAW FEEDS — live Instagram + community, SHOP THE LOOK tagging |
| `/about` | Brand manifesto |
| `/checkout` | Square Web Payments SDK checkout |

## Serverless API (Vercel)
| Route | Purpose |
|---|---|
| `GET /api/square/catalog` | Live Square catalog + inventory feed |
| `POST /api/square/checkout` | Server-authoritative order + payment |
| `POST /api/square/webhook` | Square events (HMAC-verified) |
| `GET /api/instagram` | @LawrenceMonroe feed + Square product tags |
| `POST /api/revalidate` | Sanity publish webhook → cache revalidation |

Every integration degrades gracefully to bundled content when unconfigured.

## Development
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
vercel dev         # local serverless functions + frontend together
```
