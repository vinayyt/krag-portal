# Krag Portal — Min boligreise

Homeowner portal for Krag Gruppen. Guides buyers from first look to handover.

## Features

**Phase 1 — Public funnel**
- Landing page with project showcase
- Auth (BankID / Vipps / email)
- Questionnaire in 3 styles (Stepper, Chat, Cards) with bilingual support
- AI-powered project recommendations
- Project detail with unit selector
- Meeting booking

**Phase 2 — Authenticated dashboard**
- Overview with build progress, budget, and activity feed
- Phase timeline with live progress
- Budget & payment schedule
- Documents with e-sign integration hooks
- Photo log by build phase
- 1:1 messaging with advisor
- Choices / add-ons with pricing
- Meetings & inspections
- 3D model viewer (iframe ready)
- Settings with notification toggles

**Design system**
- 3 brand themes: Warm (default), Navy, Clay — switched via `data-brand` on `<html>`
- Mobile-first, 375px baseline; desktop sidebar collapses to bottom tab bar at ≤920px
- WCAG 2.2 AA; `prefers-reduced-motion` respected throughout
- Bilingual: Norwegian Bokmål (`nb`) and English (`en`) via next-intl

---

## Tech stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + CSS custom properties |
| i18n | next-intl |
| Forms | React Hook Form + Zod |
| Data | TanStack Query |
| Database | PostgreSQL + Prisma |
| Auth | BankID/Vipps OIDC (Phase 3); email/password (dev) |
| AI | Server-side LLM proxy (`/api/ai/ask`) |
| Testing | Vitest + RTL + Playwright + axe-core |

---

## Getting started

### Prerequisites

- Node 20+
- PostgreSQL 15+ (or use the Vercel Postgres / Supabase connection string)
- `pnpm` or `npm`

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy and fill in:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | Random secret for session signing |
| `AI_API_KEY` | Optional | OpenAI-compatible API key for AI assistant |
| `AI_BASE_URL` | Optional | Base URL for LLM API (default: OpenAI) |
| `AI_MODEL` | Optional | Model name (default: `gpt-4o-mini`) |
| `BANKID_CLIENT_ID` | Phase 3 | BankID OIDC client ID |
| `BANKID_CLIENT_SECRET` | Phase 3 | BankID OIDC client secret |
| `VIPPS_CLIENT_ID` | Phase 3 | Vipps OAuth client ID |
| `VIPPS_CLIENT_SECRET` | Phase 3 | Vipps OAuth client secret |
| `ESIGN_API_KEY` | Phase 3 | Scrive / Signicat API key |
| `OBJECT_STORAGE_URL` | Phase 3 | S3-compatible storage URL for docs/photos |
| `ALLOW_PASSWORD_AUTH` | Dev only | Set `true` to enable email/password login |

### 3. Database

```bash
npx prisma migrate dev
npx prisma db seed
```

The seed creates a demo buyer (`ingrid.haugen@example.com` / `demo1234`) linked to project Justneshalvøya B7 with full build data.

### 4. Run

```bash
npm run dev
# → http://localhost:3000
```

---

## Testing

```bash
# Unit tests
npm run test

# Unit tests with coverage
npm run test:coverage

# E2E tests (requires dev server running)
npm run test:e2e

# E2E with UI
npx playwright test --ui
```

---

## Project structure

```
krag-portal/
├── src/
│   ├── app/
│   │   ├── [locale]/           # Locale-prefixed routes (nb / en)
│   │   │   ├── page.tsx        # Landing
│   │   │   ├── auth/           # Login / register
│   │   │   ├── questionnaire/  # 3-style questionnaire
│   │   │   ├── recommendations/
│   │   │   ├── projects/[id]/
│   │   │   ├── meeting/
│   │   │   └── dashboard/
│   │   └── api/                # Route handlers
│   │       ├── ai/ask/         # Streaming LLM proxy
│   │       ├── recommendations/
│   │       ├── messages/
│   │       ├── choices/
│   │       └── meetings/
│   ├── components/
│   │   ├── ui/                 # Design system primitives
│   │   ├── screens/            # Full-page screen components
│   │   │   ├── landing/
│   │   │   ├── auth/
│   │   │   ├── questionnaire/
│   │   │   ├── recommendations/
│   │   │   ├── project/
│   │   │   ├── meeting/
│   │   │   └── dashboard/
│   │   │       └── tabs/       # 10 dashboard tab components
│   │   └── providers/
│   ├── lib/
│   │   ├── data.ts             # Typed seed data
│   │   ├── format.ts           # Number, date, locale helpers
│   │   ├── recommendations.ts  # Scoring + deriveAddonsTotal
│   │   └── utils.ts
│   └── types/index.ts
├── messages/
│   ├── nb.json                 # Norwegian Bokmål
│   └── en.json                 # English
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── e2e/
│   └── smoke.spec.ts
├── docs/
│   └── adr/                    # Architecture Decision Records
└── public/
```

---

## Brand themes

Three themes are available, toggled by setting `data-brand` on `<html>`:

| Theme | `data-brand` value | Primary palette |
|---|---|---|
| Warm (default) | `warm` | Sandy beige, burnt sienna accent |
| Navy | `navy` | Light grey-blue, blue primary |
| Clay | `clay` | Warm grey, terracotta primary |

Switch theme programmatically:

```ts
document.documentElement.setAttribute("data-brand", "navy");
```

---

## Integration points

### BankID / Vipps (Phase 3)

Implement OIDC flow in `src/app/api/auth/[...nextauth]/route.ts` using NextAuth.js providers:
- BankID: `BankIDProvider` from `@buypass/next-auth-provider` or custom OIDC provider
- Vipps: Custom OIDC provider pointing to `https://api.vipps.no/access-management-1.0/access`

### E-sign (Phase 3)

Documents with `signed === false` should trigger a signing request to Scrive or Signicat:
1. `POST /api/documents/:id/sign` → creates signing session
2. Redirect buyer to signing URL
3. Provider webhook → `PATCH /api/documents/:id` → `{ signed: true, fileUrl: "..." }`

### 3D viewer

The Model3D tab renders an `ImageBox` placeholder. Replace with an `<iframe>` pointing to your 3D viewer provider (e.g. Matterport, Revizto, or a custom Three.js embed):

```tsx
// src/components/screens/dashboard/tabs/model3d-tab.tsx
<iframe
  src={`https://your-3d-provider.com/embed/${unit.modelId}?floor=${activeFloor}`}
  style={{ width: "100%", aspectRatio: "4/3", border: "none" }}
  allowFullScreen
/>
```

### Object storage

Documents and photos should be stored in S3-compatible object storage (AWS S3, Cloudflare R2, Supabase Storage). Use signed URLs with short expiry (15 min) for download links. Set `OBJECT_STORAGE_URL` in env.

---

## Architecture decisions

See [docs/adr/](./docs/adr/) for rationale on:
- [001 — Tech stack](./docs/adr/001-tech-stack.md)
- [002 — i18n strategy](./docs/adr/002-i18n.md)
- [003 — Auth & identity](./docs/adr/003-auth.md)
- [004 — AI guardrails](./docs/adr/004-ai-guardrails.md)

---

## Feature flags

| Flag | Env var | Default | Description |
|---|---|---|---|
| Password login | `ALLOW_PASSWORD_AUTH` | `false` | Enable in dev; disable in production |
| AI assistant | `AI_API_KEY` | unset | Set to enable; 503 when absent |
| BankID | `BANKID_CLIENT_ID` | unset | Required for Phase 3 auth |
| E-sign | `ESIGN_API_KEY` | unset | Required for document signing |

---

Built by Krag Gruppen · © 2026
