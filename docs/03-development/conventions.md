# Development Conventions & Coding Standards

| Field      | Value                                                                                                          |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| SDLC phase | Development                                                                                                    |
| Status     | Draft v0.2                                                                                                     |
| Owner      | Patrick (site tooling) · Carlo (Supabase tooling) · everyone follows                                           |
| Source     | ICT Information System Blueprint 2026, with Supabase in place of Laravel; Conventional Branch for the training |

---

## 1. Naming conventions (Blueprint)

### 1.1 Database (unchanged from the Blueprint)

| Convention    | Rule                                       | Example                                   |
| ------------- | ------------------------------------------ | ----------------------------------------- |
| Tables        | `snake_case`, plural                       | `sipa_runs`, `sipa_scores`, `rate_limits` |
| Foreign keys  | `{table_singular}_id`                      | `sipa_run_id`                             |
| Timestamps    | every table has `created_at`, `updated_at` |                                           |
| Soft deletes  | `deleted_at` on master tables              | `sipa_scores.deleted_at`                  |
| Booleans      | `is_` prefix                               | `is_submitted`                            |
| SQL functions | `snake_case` verb first                    | `submit_sipa_score`, `check_rate_limit`   |
| Migrations    | `YYYYMMDDHHMMSS_<verb>_<what>.sql`         | `20261117000200_create_sipa_tables.sql`   |

### 1.2 TypeScript / React (Blueprint)

| Type               | Convention                      | Example                                  |
| ------------------ | ------------------------------- | ---------------------------------------- |
| Components         | PascalCase `.tsx`               | `SiteHeader.tsx`, `LeaderboardPanel.tsx` |
| Hooks              | camelCase, `use` prefix         | `useLeaderboard`, `useReducedMotion`     |
| API files          | camelCase                       | `sipaApi.ts`                             |
| Types / interfaces | PascalCase                      | `SipaState`, `ApiResponse<T>`            |
| Stores             | camelCase + `Store`             | `playerStore.ts`                         |
| Zod schemas        | camelCase + `Schema`            | `submitScoreSchema`, `contactSchema`     |
| Constants          | `SCREAMING_SNAKE_CASE`          | `TICK_HZ`, `MAX_MISSES`                  |
| Tests              | next to the file, `.test.ts(x)` | `engine.test.ts`                         |
| localStorage keys  | `cso.<area>.<name>.v<n>`        | `cso.sipa.best.v1`, `cso.player.v1`      |

### 1.3 Edge Function (replaces PHP/Laravel naming)

| Type         | Convention                                | Example                   |
| ------------ | ----------------------------------------- | ------------------------- |
| Controllers  | camelCase file, `<domain>Controller`      | `sipaController.ts`       |
| Services     | `<domain>Service`                         | `sipaService.ts`          |
| Repositories | `<domain>Repository`                      | `sipaRepository.ts`       |
| Resources    | `<domain>Resource`, functions `to<Thing>` | `toLeaderboardEntry()`    |
| Middleware   | camelCase verb/noun                       | `rateLimit.ts`, `cors.ts` |

## 2. Coding standards

### 2.1 TypeScript & React (Blueprint)

- `strict: true` plus `noUncheckedIndexedAccess`. **No `any`** (`@typescript-eslint/no-explicit-any: error`).
- Functional components only. Hooks hold data fetching and logic; components stay presentational.
- Copy comes from `content` (NFR-CONT-01); UI labels may be literals.
- **Never** `dangerouslySetInnerHTML` (nicknames are user input).
- Every data-driven component handles loading, error and empty states.
- Alias `@/` → `src/`, `@schemas` → `supabase/functions/_shared/schemas`. Features import each other only through `index.ts`.
- Tailwind classes with `cn()`; no inline `style` except canvas sizing.
- Sipa engine files are pure (no DOM, `Math.random`, `Date`, `performance`).

### 2.2 Edge Function (replaces "PHP / Laravel Standards")

- Controllers are thin: parse with Zod → call the service → return the envelope.
- Services hold the rules; repositories are the only database callers.
- Multi-step writes are one SQL function (transaction).
- Never return raw rows; map through a resource.
- Never put SQL text, stack traces or table names in a response.
- `_shared/` code runs in Deno **and** Vite: relative imports with `.ts` extensions, no `Deno.*` APIs.

### 2.3 SQL

- Lowercase keywords, `snake_case`, explicit `public.` schema.
- `security definer` functions always `set search_path = ''`.
- Every table: RLS enabled, `revoke all … from anon, authenticated`, `set_updated_at` trigger, in the same migration.

## 3. Lint, format, hooks (Blueprint "Git Hooks")

| Tool                    | Scope                 | Config                                                                                             |
| ----------------------- | --------------------- | -------------------------------------------------------------------------------------------------- |
| ESLint (flat)           | `src/`                | `typescript-eslint` strict, `react-hooks`, `jsx-a11y`, `react/no-danger`                           |
| Prettier                | TS/TSX/JSON/MD/CSS    | 2 spaces, single quotes, no semicolons, trailing commas, 100 cols, `prettier-plugin-tailwindcss`   |
| `deno fmt`, `deno lint` | `supabase/functions/` | `supabase/functions/deno.json`                                                                     |
| Husky + lint-staged     | repo                  | `pre-commit`: eslint --fix + prettier on staged files; `deno fmt --check` on staged function files |
| commitlint              | `commit-msg`          | `@commitlint/config-conventional`, types limited to §4.2                                           |
| `post-commit`           | repo                  | Reminder if `supabase/migrations` changed but no test in `supabase/tests` did                      |

npm scripts: `dev`, `build`, `preview`, `lint`, `typecheck`, `test`, `check` (= lint + typecheck + test + build), `db:start`, `db:reset`, `db:test`, `fn:serve`, `fn:test`.

## 4. Git workflow

### 4.1 Long-lived branches (Blueprint flow)

```
feat/* · fix/* · chore/*  ──PR──▶  development  ──PR──▶  staging  ──PR──▶  main  ──▶ tag vX.Y.Z
                                     (testing)        (pre-production)    (production)
hotfix/*  ◀── branched from main ──PR──▶ main, then back-merged: main ──PR──▶ staging ──PR──▶ development
```

| Branch        | Purpose                        | Deploys to                                        | Who merges into it                                                          |
| ------------- | ------------------------------ | ------------------------------------------------- | --------------------------------------------------------------------------- |
| `development` | Integration of finished tasks  | Vercel development URL + staging API              | Maintainer                                                                  |
| `staging`     | Pre-production; Alpha/Beta/UAT | Vercel staging domain + `cso-staging` Supabase    | Maintainer, on the Release Manager's PR from `development`                  |
| `main`        | Production                     | `one-goal.vercel.app` + `cso-production` Supabase | Maintainer, on the Release Manager's PR from `staging` (or a `hotfix/*` PR) |

All three are protected: PRs only, 1 approval, no force push, no deletion (deployment §4).

### 4.2 Branch names: Conventional Branch (NFR-GIT-01)

Format `<type>/<description>`: lowercase letters, numbers and hyphens; no spaces, underscores, double or trailing hyphens. Dots only in release versions. The Blueprint's `feat/` and `fix/` are Conventional Branch's accepted aliases for `feature/` and `bugfix/`, so we use the Blueprint spelling.

| Prefix     | Use                               | Branch from → PR into                               | Example                       |
| ---------- | --------------------------------- | --------------------------------------------------- | ----------------------------- |
| `feat/`    | New section or feature            | `development` → `development`                       | `feat/hero-section`           |
| `fix/`     | Bug found before release          | `development` → `development`                       | `fix/nav-anchor-offset`       |
| `chore/`   | Setup, tooling, docs, deps        | `development` → `development`                       | `chore/setup-tailwind-shadcn` |
| `release/` | Release prep (version, changelog) | `development` → `development`, then the release PRs | `release/v1.0.0`              |
| `hotfix/`  | Urgent production fix             | `main` → `main`                                     | `hotfix/sipa-touch-controls`  |

### 4.3 Commits: Conventional Commits (NFR-GIT-02)

```
<type>(<optional scope>): <summary in imperative, lowercase, no period, ≤ 72 chars>

<optional body: why, not how>

Refs: T-SERVICES-01
```

| Type       | Use (Blueprint)                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------- |
| `feat`     | A new feature or section                                                                       |
| `fix`      | A bug fix (`fix: describe fix no.1; describe fix no.2` when one commit fixes two small things) |
| `style`    | Visual/CSS or formatting change, no behavior change                                            |
| `refactor` | Restructure without changing behavior                                                          |
| `chore`    | Setup, config, dependencies, release housekeeping                                              |
| `docs`     | Documentation and specs                                                                        |
| `test`     | Tests                                                                                          |

Scopes: `nav`, `hero`, `about`, `services`, `contact`, `footer`, `content`, `router`, `layout`, `laro`, `sipa`, `leaderboard`, `api`, `db`, `config`, `ci`, `release`.

Good: `feat(services): add program cards` · `fix(nav): close mobile menu after link click` · `chore(release): v1.0.0`
Bad: `update`, `Fixed stuff.`, `feat: Added Hero Section`, `wip`

### 4.4 Pull requests (NFR-GIT-03)

- One task per PR into `development`. Title = the main commit message.
- Description from `.github/pull_request_template.md`: `Implements T-… (FR-…, AC-…)`, `Closes #…`, how to check.
- **Merge commit** only (no squash/rebase), so branch names and commits stay in history.
- 1 approval from a teammate; **nobody merges their own PR**; the module's Maintainer merges (or the Reviewer, if the Maintainer wrote it). Roles rotate every module (tasks.md).
- CI and the Vercel preview are green; the branch is up to date with its base.
- Release PRs: `development → staging` titled `chore(release): v1.0.0 to staging`; `staging → main` titled `chore(release): v1.0.0`.

### 4.5 Spec traceability and spec changes

- Every PR lists its task and requirement IDs.
- If the code needs behavior the spec doesn't describe, change the spec in the same PR with a `docs:` commit, or ask the team first. Code and specs must not disagree on `development`.
- Both repos (reference and team) follow the same rules.

### 4.6 Never

- Push to `development`, `staging` or `main` directly; force-push a shared branch; rewrite their history.
- Commit `.env*`, `node_modules`, `dist`, `supabase/.temp`.
- Merge your own PR.
- Edit a migration that is already on `development`.

## 5. Environment variables

### 5.1 Frontend (public, validated with Zod in `src/config/env.ts`)

| Variable          | Required | Example                                          | Notes                                                                                           |
| ----------------- | -------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `VITE_API_URL`    | Yes      | `http://127.0.0.1:54321/functions/v1/api/api/v1` | API base (api-design §1). If invalid, the leaderboard shows "unavailable"; the site still works |
| `VITE_SABONG_URL` | No       | `https://sabong-demo.vercel.app`                 | Must be `https://`; empty → card hidden                                                         |

### 5.2 Edge Function secrets (`supabase secrets set`, never in the repo or Vercel)

| Secret                                      | Notes                                        |
| ------------------------------------------- | -------------------------------------------- |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Provided by Supabase automatically           |
| `ALLOWED_ORIGINS`                           | Comma-separated origins (api-design §4.1)    |
| `CLIENT_HASH_SALT`                          | 32+ random characters, different per project |
| `APP_VERSION`                               | Set by the deploy workflow to the Git SHA    |

`.env.example` lists the frontend variables only. Local function secrets live in `supabase/functions/.env` (git-ignored).
