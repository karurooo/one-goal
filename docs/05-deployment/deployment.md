# Deployment, DevOps, Security & Maintenance

| Field | Value |
|---|---|
| SDLC phase | Deployment & Maintenance |
| Status | Draft v0.2 |
| Owner | Carlo (Supabase, releases) · Patrick (Vercel, frontend CI) · Cliff (hooks, CI workflow) |
| Related | [architecture §6](../02-design/architecture.md#6-environments), [git-playbook.md](../03-development/git-playbook.md) |

---

## 1. Infrastructure

| Piece | Service | Notes |
|---|---|---|
| Source, PRs, issues, tags, Releases | GitHub (organization repo) | Blueprint "Repository: GitHub Organization" |
| CI/CD | GitHub Actions | `ci.yml` (PRs), `deploy-backend.yml` (push to `staging`, `main`) |
| Frontend hosting | Vercel, Vite preset | Production = `main`; staging domain = `staging`; preview per branch |
| Backend | Supabase Cloud, region Singapore (`ap-southeast-1`) | Projects `cso-staging`, `cso-production` |
| Local backend | Supabase CLI (Docker) | `supabase start` |

## 2. Local development and CI

### 2.1 Quick start (Blueprint "Quick Start" equivalent)
```bash
git clone <repo> && cd <repo>
npm ci
cp .env.example .env.local                    # VITE_API_URL=http://127.0.0.1:54321/functions/v1/api/api/v1
cp supabase/functions/.env.example supabase/functions/.env   # ALLOWED_ORIGINS, CLIENT_HASH_SALT (local values)
npx supabase start                            # Postgres, Studio (http://127.0.0.1:54323), Edge runtime
npx supabase db reset                         # migrations + seed
npx supabase functions serve api --env-file supabase/functions/.env --no-verify-jwt
npm run dev                                   # http://localhost:5173
npm run check                                 # before every PR
```
Requires Node 20 LTS (`.nvmrc`), Docker Desktop, and the Supabase CLI (installed as a dev dependency).

### 2.2 Pull request checks: `.github/workflows/ci.yml`
```yaml
name: ci
on:
  pull_request:
    branches: [development, staging, main]
jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: .nvmrc, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test -- --run
      - run: npm run build
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
        with: { version: latest }
      - uses: denoland/setup-deno@v2
        with: { deno-version: v2.x }
      - run: deno fmt --check supabase/functions && deno lint supabase/functions
      - run: supabase start
      - run: supabase test db
      - run: |
          supabase functions serve api --no-verify-jwt --env-file supabase/functions/.env.ci &
          sleep 5
          deno test --allow-net --allow-env supabase/functions/api
```
`supabase/functions/.env.ci` holds local-only values (`ALLOWED_ORIGINS=http://localhost:5173`, a dummy `CLIENT_HASH_SALT`) and is safe to commit. `frontend` lands with T-SETUP-05; `backend` with T-CI-01. Both become required status checks once they exist.

### 2.3 Backend deployment: `.github/workflows/deploy-backend.yml`
```yaml
name: deploy-backend
on:
  push:
    branches: [staging, main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ github.ref_name == 'main' && 'production' || 'staging' }}
    env:
      SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
      SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}
      PROJECT_REF: ${{ vars.SUPABASE_PROJECT_REF }}
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
        with: { version: latest }
      - run: supabase link --project-ref "$PROJECT_REF"
      - run: supabase db push
      - run: supabase secrets set APP_VERSION=${{ github.sha }} --project-ref "$PROJECT_REF"
      - run: supabase functions deploy api --no-verify-jwt --project-ref "$PROJECT_REF"
      - run: curl -fsS "https://$PROJECT_REF.supabase.co/functions/v1/api/api/v1/health"
```
GitHub Environments `staging` and `production` each hold their own `SUPABASE_PROJECT_REF` (variable) and `SUPABASE_DB_PASSWORD` (secret); `SUPABASE_ACCESS_TOKEN` is a repo secret owned by Carlo. The `production` environment requires approval from Carlo (Release Manager), so the backend deploys only after the `staging → main` merge on Day 3. The Edge Function secrets (`ALLOWED_ORIGINS`, `CLIENT_HASH_SALT`) are set once per project with `supabase secrets set`.

## 3. Vercel configuration

### 3.1 Project settings
| Setting | Value |
|---|---|
| Framework preset | Vite (build `npm run build`, output `dist`, install `npm ci`) |
| Node version | 20.x |
| Production branch | `main` → `one-goal.vercel.app` |
| Branch domain | `staging` → `staging-one-goal.vercel.app` |
| Preview deployments | every other branch (each PR shows a link) |

### 3.2 `vercel.json`
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [{ "source": "/((?!assets/).*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://*.supabase.co http://127.0.0.1:54321; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
```
- The rewrite lets `/laro/sipa` load on refresh (AC-NAV-03).
- `connect-src` allows the Supabase API; fonts are self-hosted so no other origin is needed.

## 4. GitHub settings

| Setting | Value | Req |
|---|---|---|
| Default branch | `development` | |
| Protected branches | `main`, `staging`, `development`: require a PR · **1 approval** · dismiss stale approvals · require conversation resolution · require status checks `frontend`, `backend` (once they exist) · branch up to date · block force pushes · no deletion · **no bypass, including admins** | NFR-GIT-03 |
| Code Owners review | **Off** (Ramil isn't always available) | |
| Merge button | Merge commits only; automatically delete head branches | conventions §4.4 |
| Environments | `staging` (no approval), `production` (required reviewer: Carlo) | |
| Secrets / variables | repo secret `SUPABASE_ACCESS_TOKEN`; per environment `SUPABASE_DB_PASSWORD` (secret), `SUPABASE_PROJECT_REF` (variable) | NFR-SEC-01 |
| Labels | `section`, `game`, `setup`, `release`, `hotfix`, `bug`, `good first issue` | |

## 5. Environment variables

### 5.1 Vercel (public, build time)
| Variable | Preview + development branch | Staging (`staging`) | Production (`main`) |
|---|---|---|---|
| `VITE_API_URL` | staging API | staging API | production API |
| `VITE_SABONG_URL` | Sabong URL or empty | Sabong URL or empty | Sabong URL or empty |

`VITE_` values end up in the bundle; never put secrets in Vercel (NFR-SEC-01). Changing a variable needs a redeploy.

### 5.2 Supabase function secrets
See [conventions §5.2](../03-development/conventions.md#52-edge-function-secrets-supabase-secrets-set-never-in-the-repo-or-vercel). Use a different `CLIENT_HASH_SALT` per project.

## 6. Deployment phase activities (Blueprint SDLC)

| Activity | When | Who |
|---|---|---|
| Staging deploy (`development → staging`) | End of Phase B | Carlo |
| Alpha, Beta, UAT on staging | End of Phase B | team, trainer, Carlo |
| User's training | Not needed (public site); the README covers developers | — |
| Launching (`staging → main`, tag v1.0.0) | **Day 3** | Carlo + reviewers |
| Hotfix v1.0.1 and back-merge | Day 3 | first free person + Carlo |
| Initial support | After Day 3: watch Supabase logs and the leaderboard for a week | Carlo |

## 7. Rollback

| Layer | How |
|---|---|
| Frontend | Vercel → Deployments → previous production deployment → **Promote to Production** (instant). Then fix forward with a `hotfix/…` PR |
| Edge Function | Revert the change with a `hotfix/…` PR; `deploy-backend` redeploys. Emergency: `supabase functions deploy` from the previous tag's checkout by Carlo |
| Database | Never edit or roll back an applied migration; write a new forward migration in a `hotfix/…` PR |
| Bad leaderboard rows | Supabase dashboard → `sipa_scores` → set `deleted_at` |

## 8. Production security checklist (Blueprint, adapted)

- [ ] No secrets in the repo, bundle or Vercel (search for `service_role`, `key`, `secret`, `password` before v1.0.0).
- [ ] `.gitignore` covers `.env*` (except `.env.example`), `supabase/functions/.env`, `supabase/.temp`, `node_modules`, `dist`.
- [ ] RLS enabled on every table; `anon` can't read tables or the view (TC-DB-01).
- [ ] `ALLOWED_ORIGINS` on production lists only `https://one-goal.vercel.app` (TC-API-09).
- [ ] Rate limits active (TC-API-08); `CLIENT_HASH_SALT` set and unique per project.
- [ ] Error responses contain no SQL or stack traces (TC-API-10).
- [ ] Security headers present on production (smoke S15).
- [ ] External links `rel="noopener noreferrer"`; no `dangerouslySetInnerHTML`.
- [ ] `npm audit --omit=dev` shows no high or critical issues.
- [ ] Practice-site disclaimer visible on desktop and phone; no city seal, officials' names or real numbers.
- [ ] Supabase: email/password and anonymous sign-ins **disabled** (no accounts in v1.0.0); database password strong and stored only in GitHub Environments.

## 9. Maintenance (after training)

- Dependabot (npm, GitHub Actions, weekly); each update is a normal PR into `development`.
- Weekly glance at Supabase logs and the leaderboard; soft-delete abusive nicknames.
- Releases follow SemVer: features `minor`, fixes `patch`, through the same `development → staging → main` flow.
