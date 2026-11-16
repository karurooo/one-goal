# System Architecture & Technology Stack

| Field | Value |
|---|---|
| SDLC phase | Design |
| Status | Draft v0.2 |
| Owner | Patrick (site platform) · Carlo (game track: Sipa, leaderboard, Supabase) |
| Related | [database-design.md](./database-design.md), [api-design.md](./api-design.md), [ui-ux-design.md](./ui-ux-design.md), [content-model.md](./content-model.md), [sipa-engine-design.md](./sipa-engine-design.md), [../05-deployment/deployment.md](../05-deployment/deployment.md) |

---

## 1. Architecture overview

A React single-page app on Vercel, plus a small Supabase backend for the Sipa leaderboard. Office content stays in a JSON file; only leaderboard data lives in the database.

```
                    ┌───────────────────────────── GitHub ─────────────────────────────┐
  feat/* ──PR──▶ development ──PR──▶ staging ──PR──▶ main ──tag v1.0.0
                    │                   │               │
                    ▼                   ▼               ▼
             Vercel preview      Vercel staging    Vercel production       (frontend)
             Supabase local*     Supabase staging  Supabase production     (backend, via GitHub Actions)
                    └──────────────────────────────────────────────────────────────────┘
  * development uses the local Supabase stack; previews call the staging API

  Browser ──HTTPS──▶ Vercel CDN (index.html + JS)
     │  "/"            one-page site  ← src/content/office.json
     │  "/laro/sipa"   Sipa (lazy chunk, canvas)
     │  "*"            404
     │
     ├── Axios ──HTTPS──▶ Supabase Edge Function `api`  (/functions/v1/api/v1/sipa/…)
     │                        Hono: CORS → rate limit → Zod validation → controller → service → repository
     │                                                                           │ service role (secret)
     │                                                                           ▼
     │                                                 Postgres: sipa_runs, sipa_scores, rate_limits (RLS on)
     │
     └── new tab ──▶ Sabong demo (separate site, VITE_SABONG_URL)
```

### Key architectural decisions (ADR summary)

| ADR | Decision | Why |
|---|---|---|
| ADR-01 | **Supabase replaces Laravel** (Postgres, Edge Functions, CLI local stack) | Team decision; free hosting; same layered design as the Blueprint backend |
| ADR-02 | **React + TypeScript + Vite** | Blueprint frontend stack |
| ADR-03 | **shadcn/ui + Tailwind CSS** (no MUI) | Blueprint; one UI kit per team |
| ADR-04 | Office content in **one JSON file** typed with Zod, not in the database | No admin area in v1.0.0 (NG2); edits go through PRs ([content-model.md](./content-model.md)) |
| ADR-05 | **react-router-dom** with a lazy `/laro/sipa` route | Keeps the game out of the first load (NFR-PERF-02) |
| ADR-06 | Sipa on a **2D canvas** with a **pure engine** | No dependency; unit-testable ([sipa-engine-design.md](./sipa-engine-design.md)) |
| ADR-07 | **One Edge Function `api`** with Hono routes under `/api/v1/` | Matches the Blueprint's `/api/v1/` prefix; one deploy unit; Laravel-style layers inside ([api-design.md](./api-design.md)) |
| ADR-08 | **Browser never touches tables.** All reads and writes go through the Edge Function with the service role; RLS is on with no public policies | Validation, rate limits and the envelope in one place (NFR-SEC-05) |
| ADR-09 | **Axios + TanStack Query** for the API; **Zustand** for the remembered nickname | Blueprint state management and API integration rules |
| ADR-10 | **Blueprint Git flow** `feature → development → staging → main`, PRs only | Blueprint; also satisfies the training's "no direct pushes to main" |
| ADR-11 | **Vercel** for the frontend with branch deployments; **Supabase Cloud** (Singapore) for the backend | Training brief; low latency from Butuan |
| ADR-12 | Sabong is a **link** to a separate site | Keeps this repo small; no iframe security work |

---

## 2. Blueprint mapping

### 2.1 Backend (Laravel replaced by Supabase)

| Blueprint (Laravel) | This project (Supabase) |
|---|---|
| Laravel 13 REST API, `routes/api.php`, `/api/v1/` | Edge Function `api` (Deno + **Hono**), routes in `supabase/functions/api/routes.ts`, base path `/api/v1/` |
| Controllers (`app/Http/Controllers/V1/`) | `api/controllers/*.ts`: thin; parse, validate, call service, return envelope |
| Form Requests | **Zod** schemas in `supabase/functions/_shared/schemas/` (shared with the frontend) |
| Services (`app/Services/`) | `api/services/*.ts`: business rules (plausibility, ranking) |
| Repository pattern | `api/repositories/*.ts`: the only code that queries the database |
| `ApiResponse` trait | `_shared/http/response.ts` (`ok`, `fail`) |
| `DB::transaction()` | One **SQL function** per multi-step write (`submit_sipa_score`), called with `rpc()` |
| Eloquent models + migrations | SQL migrations in `supabase/migrations/` |
| Seeders / factories | `supabase/seed.sql` (local demo scores only) |
| Sanctum auth | Not needed in v1.0.0 (no accounts). The function runs with `verify_jwt = false` and does its own checks |
| Rate limiting (5/IP login) | `rate_limits` table + `check_rate_limit()` SQL function, per salted IP hash |
| CORS `allowed_origins` | Hono CORS middleware with an origin allow-list from the `ALLOWED_ORIGINS` secret |
| Pest tests | **Deno test** for the function, **pgTAP** (`supabase test db`) for SQL |
| Scramble (OpenAPI docs) | Hand-written `docs/02-design/openapi.yaml`-style tables in api-design.md (small API) |
| Laravel Pint, CaptainHook | `deno fmt`, `deno lint`, Husky (repo-wide) |
| Herd/Laragon, MySQL, DBngin | Supabase CLI local stack (Docker): Postgres, Studio, Edge runtime |
| Redis | Not needed |
| Sentry (not used) | Not used |

### 2.2 Frontend (Blueprint kept)

| Category | Blueprint | This project | Notes |
|---|---|---|---|
| Framework | React (TypeScript) | ✅ React 19 + TypeScript (strict) | Existing scaffold (`npm create vite`, `react-ts`) |
| Bundler / package manager | Vite / npm | ✅ | |
| Router | react-router-dom | ✅ | |
| Forms | React Hook Form + Zod | ✅ | Contact form, nickname form |
| State | Zustand, TanStack Query | ✅ TanStack Query for the leaderboard; Zustand (`playerStore`, persisted) for the nickname | |
| HTTP client | Axios | ✅ `src/lib/axios.ts` | Envelope unwrapping, 422/429/500 handling |
| UI framework | Shadcn + Tailwind | ✅ | No MUI |
| Data tables | TanStack Table | ✗ | A 10-row list doesn't need it |
| Icons | lucide-react | ✅ | |
| Toasts | Sonner | ✅ | |
| Unit tests | Vitest, happy-dom | ✅ + React Testing Library | |
| Git hooks | Husky | ✅ + lint-staged + commitlint | |
| Fonts (added) | — | `@fontsource/inter`, `@fontsource/archivo-black` | Self-hosted, CSP stays strict |
| Error monitoring, PWA, charts, PDF, rich text, theme switching, Lodash | listed | ✗ not in v1.0.0 | Not needed by a one-page site |

### 2.3 Deviations from the Blueprint (recorded)
- **Backend:** Supabase instead of Laravel (ADR-01). No auth in v1.0.0 because there are no accounts.
- **Hosting:** Vercel + Supabase Cloud instead of Windows IIS on-premise and Docker images.
- **Review:** one approval from **any teammate** (the Blueprint asks for at least one approval; Ramil isn't always available).
- **Branches:** Blueprint names (`feat/`, `fix/`) plus `hotfix/`, `release/`, `chore/` from Conventional Branch, which the training grades.

---

## 3. Repository structure

```
one-goal/
├─ .github/
│  ├─ pull_request_template.md
│  └─ workflows/
│     ├─ ci.yml                  # PRs: lint, typecheck, vitest, build, deno test, supabase test db
│     └─ deploy-backend.yml      # push to staging/main: migrations + functions deploy
├─ .husky/                       # pre-commit, commit-msg, post-commit
├─ .claude/skills/implement-task/
├─ docs/                         # these specs (source of truth)
├─ public/
├─ scripts/create-issues.sh
├─ src/                          # frontend (§4)
├─ supabase/
│  ├─ config.toml
│  ├─ migrations/                # YYYYMMDDHHMMSS_<what>.sql
│  ├─ seed.sql
│  ├─ tests/                     # pgTAP: *.test.sql
│  └─ functions/
│     ├─ deno.json               # import map: hono, zod, @supabase/supabase-js
│     ├─ _shared/
│     │  ├─ schemas/sipa.ts      # Zod schemas shared with the frontend
│     │  ├─ http/response.ts     # envelope helpers
│     │  ├─ http/errors.ts
│     │  └─ blocklist.ts
│     └─ api/
│        ├─ index.ts             # Deno.serve(app.fetch)
│        ├─ app.ts               # Hono app: basePath('/api/v1'), middleware
│        ├─ routes.ts
│        ├─ middleware/{cors,rateLimit,clientId}.ts
│        ├─ controllers/sipaController.ts
│        ├─ services/sipaService.ts
│        ├─ repositories/sipaRepository.ts
│        └─ api.test.ts
├─ CLAUDE.md · README.md · CHANGELOG.md
├─ commitlint.config.js · eslint.config.js · .prettierrc
├─ components.json · index.html · package.json · tsconfig*.json · vercel.json · vite.config.ts
└─ .env.example
```

The frontend imports the shared Zod schemas through the alias `@schemas` → `supabase/functions/_shared/schemas` (relative `.ts` imports only, no Deno-only APIs in that folder).

## 4. Frontend directory layout (Blueprint)

| Directory | Purpose | Owner (team build) |
|---|---|---|
| `src/main.tsx`, `src/app/App.tsx`, `src/app/router.tsx` | Entry, providers, router | Patrick |
| `src/app/routes/home/HomePage.tsx` | `/` composes the section organisms | Patrick |
| `src/app/routes/laro/SipaPage.tsx` | `/laro/sipa` (lazy) | Carlo |
| `src/app/routes/errors/NotFoundPage.tsx` | `*` | Patrick |
| `src/components/ui/` | shadcn primitives | Patrick |
| `src/components/layout/AppShell/` | `SiteHeader`, `MobileMenu`, `SkipLink`, `Section`, `SiteFooter` | Patrick (header, menu, skip, section) · Ramil (`SiteFooter`) |
| `src/components/common/` | `SipaBallArt`, `CourtLines` | Patrick |
| `src/components/error/` | `RouteErrorFallback` (lazy chunk failed) | Carlo |
| `src/config/env.ts` | Zod-parsed env (`VITE_API_URL`, `VITE_SABONG_URL`) | Carlo |
| `src/content/` | `office.json`, `schema.ts`, `index.ts` | Patrick (schema); owners edit their keys |
| `src/features/hero/` | Hero | Patrick |
| `src/features/about/` | About and mandate | Cliff |
| `src/features/services/` | Services (programs and facilities) | Carlo |
| `src/features/laro/` | Laro section, Sipa game (`sipa/`), leaderboard (`api/`, `stores/`, components) | Carlo |
| `src/features/contact/` | Contact section and form | Ramil |
| `src/hooks/` | `useReducedMotion` | Patrick |
| `src/lib/utils.ts` | `cn()` | Patrick |
| `src/lib/axios.ts`, `src/providers/QueryProvider.tsx`, `src/types/api.ts` | Axios instance, TanStack Query client, envelope types | Carlo |
| `src/styles/globals.css` | Tailwind, tokens, fonts | Patrick |
| `src/testing/setup.ts` | Vitest setup | Patrick |

**Two tracks.** The **site track** (everything except `features/laro/**`, `app/routes/laro/**`, `components/error/**`, `config/env.ts`, `lib/axios.ts`, `providers/**`, `types/api.ts` and `supabase/**`) is split between Cliff, Patrick and Ramil. The **game track** (those paths) belongs to Carlo alone.

Each feature: `features/<domain>/{api,components/{atoms,molecules,organisms},constants,hooks,lib,stores,types,index.ts}`. Only create folders you use.

## 5. Runtime flows

### 5.1 Page load
1. Vercel serves `index.html` for any path (`vercel.json` rewrite).
2. `main.tsx` renders `App`: `QueryProvider` → `RouterProvider` → `Toaster`.
3. `/` renders `HomePage`: `SiteHeader`, `Hero`, `About`, `Services`, `LaroSection`, `Contact`, `SiteFooter`, all reading `content`. **No API call on `/`.**

### 5.2 Sipa with the leaderboard
1. `/laro/sipa` loads the lazy chunk; `useLeaderboard()` (TanStack Query, `staleTime` 30 s) calls `GET /sipa/leaderboard`.
2. **Start** → `useStartRun()` → `POST /sipa/runs` → `run_id` kept in a ref. The game starts immediately; it does not wait for the response.
3. Round over → `NicknameForm` (RHF + Zod, default from `playerStore`) → `useSubmitScore()` → `POST /sipa/runs/{run_id}/score`.
4. On 201: show rank, invalidate `['sipa','leaderboard']`. On 422: `setError` on the field or a form-level message. On 409/429/500: toast.

### 5.3 Edge Function request
`CORS → clientId (salted IP hash) → rateLimit → route → controller (Zod parse) → service (rules) → repository (supabase-js with service role) → envelope`.

### 5.4 Opening Sabong
`config/env.ts` validates `VITE_SABONG_URL`; if it is a valid `https://` URL the card renders with `target="_blank" rel="noopener noreferrer"`, otherwise it is hidden.

## 6. Environments

| Environment | Git branch | Frontend URL | Backend | Who deploys |
|---|---|---|---|---|
| Local | any | `http://localhost:5173` | Supabase CLI local stack (`http://127.0.0.1:54321`) | developer |
| Preview | `feat/*`, `fix/*`, `chore/*` PRs | Vercel preview URL | `cso-staging` project | Vercel (automatic) |
| Development | `development` | Vercel branch URL `one-goal-git-development-<team>.vercel.app` | `cso-staging` project | Vercel (automatic) |
| Staging | `staging` | Vercel branch domain (e.g. `staging-one-goal.vercel.app`) | `cso-staging` project | Vercel + `deploy-backend.yml` |
| Production | `main` | `one-goal.vercel.app` | `cso-production` project | Vercel + `deploy-backend.yml` (Day 3) |
