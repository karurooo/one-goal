# Implementation Tasks: v1.0.0

| Field      | Value                                                                                                                                                                                                                                                                                                                                                      |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SDLC phase | Development (Phase A and B) · Deployment (Phase C, Day 3)                                                                                                                                                                                                                                                                                                  |
| Status     | Draft v0.2                                                                                                                                                                                                                                                                                                                                                 |
| How to use | One task = one branch = one PR into `development`. Each task lists its **owner, branch, planned commits, requirement IDs** and **done-when** checks. A task is done when its checks pass, CI and the Vercel preview are green, and the PR is merged. Tick the box in the same PR. `scripts/create-issues.sh` turns the team-build tasks into GitHub issues |

Legend: **Owner** = who builds it · **Backup** = who takes it if the owner is away · **Rev** = default reviewer (any teammate may review) · **Req** = requirement IDs · **Dep** = tasks merged first.

---

## Phases

| Phase                     | Repo                 | Who                | What                                                                                                                              | Ends with                                                                        |
| ------------------------- | -------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **A. Reference build**    | `one-goal` (private) | Carlo alone        | Every task below, in order, with the same branch names and commits. Fix the specs wherever the code teaches us something          | All tasks merged to `development`; specs updated; T-PREP-01 replay notes written |
| **B. Team build**         | team repo (graded)   | Everyone, by track | Rebuild from the specs (reference as fallback, never pasted whole), the planned conflict, release PR to `staging`, Alpha/Beta/UAT | v1.0.0 candidate on `staging`, UAT signed                                        |
| **C. Launch Day (Day 3)** | team repo            | Everyone           | `staging → main`, tag v1.0.0, production checks, hotfix v1.0.1 and back-merge                                                     | v1.0.0 and v1.0.1 live                                                           |

## Team & ownership

The site follows the trainer's split for a team of 4: **one page section per person**. The game track (Laro ng Lahi, Sipa, leaderboard, Supabase) is an extra section that Carlo builds alone.

| Trainer's section  | Person                 | Tasks                                              |
| ------------------ | ---------------------- | -------------------------------------------------- |
| Header and hero    | **Patrick** (Person 1) | T-LAYOUT-01, T-HERO-01 · plus setup T-SETUP-02…04  |
| About and mandate  | **Cliff** (Person 2)   | T-ABOUT-01 · plus tooling T-SETUP-05               |
| Services           | **Carlo** (Person 3)   | T-SERVICES-01 · plus the game track and repo setup |
| Contact and footer | **Ramil** (Person 4)   | T-CONTACT-01, T-GIT-01, T-DOCS-01 · Cliff backs up |

| Person                     | Owns (paths)                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Patrick**                | Root config (`package.json`, `vite.config.ts`, `tsconfig*`, `vercel.json`, `components.json`, `index.html`), `src/main.tsx`, `src/app/App.tsx`, `src/app/router.tsx`, `src/app/routes/{home,errors}/**`, `src/components/{ui,layout,common}/**` (except `SiteFooter.tsx`), `src/features/hero/**`, `src/content/{schema,index}.ts`, `src/lib/utils.ts`, `src/hooks/**`, `src/styles/**`, `src/testing/**`, `.github/pull_request_template.md` |
| **Cliff**                  | `src/features/about/**`, `eslint.config.js`, `.prettierrc`, `.husky/**`, `commitlint.config.js`, `.github/workflows/ci.yml` · backs up Ramil                                                                                                                                                                                                                                                                                                  |
| **Carlo**                  | `src/features/services/**`; game track: `src/features/laro/**`, `src/app/routes/laro/**`, `src/components/error/**`, `src/config/env.ts`, `src/lib/axios.ts`, `src/providers/**`, `src/types/api.ts`, `supabase/**`, `.github/workflows/deploy-backend.yml`; `docs/**`                                                                                                                                                                        |
| **Ramil** (when available) | `src/features/contact/**`, `src/components/layout/AppShell/SiteFooter.tsx`, `README.md` · Cliff backs up the code, Patrick the README                                                                                                                                                                                                                                                                                                         |

`src/content/office.json` is shared; each owner edits only their keys ([content-model §3](../02-design/content-model.md#3-keys-and-owners)). `CHANGELOG.md` belongs to whoever is Release Manager in the current module. Carlo's game PRs touch `App.tsx` once (to add `QueryProvider`) and say so in the PR.

### Roles rotate every module (trainer's rule; nobody merges their own PR)

| Module                          | Maintainer (owns the repo settings, merges) | Reviewer (reads every PR) | Release Manager (tags and ships)                                  |
| ------------------------------- | ------------------------------------------- | ------------------------- | ----------------------------------------------------------------- |
| 1. Setup (Phase B)              | Cliff                                       | Carlo                     | Patrick: starts `CHANGELOG.md` `[Unreleased]`                     |
| 2. Build (Phase B)              | Patrick                                     | Cliff                     | Ramil (Carlo backs up): keeps `[Unreleased]` current as PRs merge |
| 3. Release to staging (Phase B) | Ramil (Cliff backs up)                      | Patrick                   | Cliff: T-REL-01, T-REL-02                                         |
| 4. Launch Day (Phase C)         | Patrick                                     | Ramil (Cliff backs up)    | **Carlo**: T-REL-03 (v1.0.0), tags v1.0.1                         |

- If the Maintainer wrote the PR, the Reviewer merges it.
- If the Reviewer wrote the PR, any other teammate reviews it.
- If someone is absent, their backup (or anyone free) takes the role. **No PR waits for one specific person.**

### Phase B plan (team build)

| Module / wave         | Patrick                              | Cliff              | Ramil                         | Carlo                                                                                                        | Sync point                                                       |
| --------------------- | ------------------------------------ | ------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| 1. Setup              | T-SETUP-02 → T-SETUP-03 → T-SETUP-04 | T-SETUP-05         | reads specs, review checklist | T-SETUP-01 first; then game track T-DB-01, T-DB-02                                                           | **H1:** T-SETUP-04 merged → everyone branches from `development` |
| 2. Build              | T-LAYOUT-01, T-HERO-01               | T-ABOUT-01         | T-CONTACT-01, T-DOCS-01       | T-SERVICES-01; game track T-API-01, T-API-02, T-CI-01, T-SIPA-01, T-LEAD-01, T-SIPA-02, T-LEAD-02, T-LARO-01 | **H2:** T-LAYOUT-01 merged before section PRs merge              |
| Conflict              | merges T-SERVICES-01                 | reviews            | T-GIT-01                      | —                                                                                                            | **H3:** conflict resolved on `development`                       |
| 3. Release to staging | reviews                              | T-REL-01, T-REL-02 | merges                        | T-QA-01, UAT                                                                                                 | **H4:** UAT signed on `staging`                                  |

### Phase C plan (Day 3)

| Step | Who                                                                                  | Task                                                                   |
| ---- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| 1    | Carlo opens, Ramil reviews, Patrick merges                                           | T-REL-03 `staging → main` PR, merge, tag `v1.0.0`, GitHub Release      |
| 2    | Everyone                                                                             | T-QA-02 production smoke test                                          |
| 3    | First free person writes, Ramil (or anyone else) reviews, Patrick merges, Carlo tags | T-REL-04 hotfix → `v1.0.1` → back-merge to `staging` and `development` |

### Handoff contracts

| Contract                              | Producer              | Consumers           | Defined in            |
| ------------------------------------- | --------------------- | ------------------- | --------------------- |
| `OfficeContent` type + `content`      | Patrick (T-SETUP-04)  | everyone            | content-model §2      |
| Design tokens (Tailwind theme)        | Patrick (T-SETUP-03)  | everyone            | ui-ux §1              |
| `Section` template                    | Patrick (T-LAYOUT-01) | Cliff, Carlo, Ramil | ui-ux §4              |
| `submitScoreSchema` (`@schemas/sipa`) | Carlo (T-API-02)      | Carlo (T-LEAD-01)   | api-design §5.3       |
| API envelope + endpoints              | Carlo (T-API-01/02)   | Carlo (T-LEAD-01)   | api-design §2, §5     |
| Sipa engine API                       | Carlo (T-SIPA-01)     | Carlo (T-SIPA-02)   | sipa-engine-design §2 |

Until T-LAYOUT-01 merges, section owners wrap their section in a plain `<section id="…">`; switching to `Section` is a one-line change.

---

## M0: Preparation

- [ ] **T-PREP-01 Replay notes from the reference build.** `Owner: Carlo` · Phase A, last step
      For each team task: the files it touches, the order of its commits, anything that surprised you. Store as `docs/03-development/replay-notes.md` in the reference repo; copy it into the team repo with the docs.
      Done when: every team task has notes; specs updated for every difference found.
- [ ] **T-PREP-02 Public Sabong URL.** `Owner: Carlo`
      Deploy the Sabong demo publicly, or close OQ-1 as "no Sabong card". · Req: FR-LARO-02

## M1: Setup wave

- [ ] **T-SETUP-01 Repo, branches, protection, services.** `Owner: Carlo` · Backup: Patrick · No branch (settings)
      Create the repo with a README (GitHub's initial commit), create `development` and `staging` from `main`, set the default branch to `development`, protect all three ([deployment §4](../05-deployment/deployment.md#4-github-settings)), add teammates with the **Maintain** role (each takes a turn as Maintainer), run `scripts/create-issues.sh`. Create Supabase projects `cso-staging` and `cso-production` (Singapore). Connect Vercel (production branch `main`, staging domain on `staging`).
      Done when: a direct push to any protected branch is rejected; issues exist; Vercel shows a deployment for `main`. · Req: NFR-GIT-03, NFR-GIT-07
- [x] **T-SETUP-02 Scaffold the app.** `Owner: Patrick` · Rev: Carlo · Branch: `chore/scaffold-vite-app`
      The existing Vite `react-ts` scaffold, strict TS flags (conventions §2.1), path aliases `@/` and `@schemas`, `.nvmrc`, `.gitignore` (adds `.env*`, `supabase/.temp`, `supabase/functions/.env`), `.env.example`, PR template, `docs/` (this spec set), `CLAUDE.md`.
      Done when: `npm run build` passes; the preview shows the Vite page. · Dep: T-SETUP-01
      Commits: `chore: scaffold vite react typescript app` · `chore: enable strict typescript and path aliases` · `docs: add specs, claude rules and pr template`
- [x] **T-SETUP-03 Tailwind, tokens and shadcn.** `Owner: Patrick` · Rev: Cliff · Branch: `chore/setup-tailwind-shadcn`
      Tailwind, design tokens and self-hosted fonts (ui-ux §1), shadcn init + primitives (ui-ux §4), `cn()`, `globals.css`.
      Done when: a test page shows a gold shadcn `Button` in Archivo Black/Inter. · Req: NFR-A11Y-01 · Dep: T-SETUP-02
      Commits: `chore: add tailwind css with design tokens` · `chore: add self-hosted fonts` · `chore: add shadcn ui primitives`
- [x] **T-SETUP-04 Router, pages and content.** `Owner: Patrick` · Rev: Cliff · Branch: `feat/router-and-content`
      `App.tsx`, `router.tsx` with `/`, lazy `/laro/sipa` placeholder and `*`; `HomePage` with empty sections and their ids; `src/content/{office.json,schema.ts,index.ts}` + content test (TC-CONT-01/02); `vercel.json` (deployment §3.2).
      Done when: `/laro/sipa` reloads on the preview without 404; content test passes. · Req: FR-NAV-03, FR-NAV-04, NFR-CONT-01, NFR-SEC-04 · Dep: T-SETUP-03
      Commits: `feat(router): add home, sipa and not found routes` · `feat(content): add office content with zod schema` · `test(content): validate office content` · `chore: add vercel rewrites and security headers`
- [x] **T-SETUP-05 Lint, hooks and frontend CI.** `Owner: Cliff` · Rev: Patrick · Branch: `chore/setup-lint-hooks-ci`
      ESLint, Prettier, Husky + lint-staged + commitlint (conventions §3), Vitest + RTL setup, `ci.yml` frontend job (deployment §2.2).
      Done when: `git commit -m "update"` is rejected; the PR shows the `frontend` check. · Req: NFR-GIT-02 · Dep: T-SETUP-02
      Commits: `chore: add eslint and prettier` · `chore: add husky, lint-staged and commitlint` · `test: add vitest and testing library setup` · `chore(ci): add frontend checks workflow`

## M2: Site track (team)

- [ ] **T-LAYOUT-01 Header, mobile menu, section template, 404.** `Owner: Patrick` · Rev: Cliff · Branch: `feat/site-header`
      `SkipLink`, `LogoMark`, `NavLinks`, `MobileMenu` (Sheet), `SiteHeader`, `Section`, `useReducedMotion`, `NotFoundPage`.
      Done when: AC-NAV-01, 02, 04, 05 pass on the preview; keyboard-only works; TC-NAV-01…03 pass. · Req: FR-NAV-01, FR-NAV-02, FR-NAV-04, NFR-A11Y-02 · Dep: T-SETUP-04
      Commits: `feat(layout): add section template and skip link` · `feat(nav): add sticky header with section links` · `feat(nav): add mobile menu` · `feat(router): add not found page` · `test(nav): cover links, mobile menu and not found`
- [ ] **T-HERO-01 Hero.** `Owner: Patrick` · Rev: Cliff · Branch: `feat/hero-section`
      `Hero`, `HeroActions`, `SipaBallArt`, `CourtLines`.
      Done when: AC-HERO-01…03 pass at 1280×720 and 390×844. · Req: FR-HERO-01, FR-HERO-02 · Dep: T-SETUP-04
      Commits: `feat(hero): add headline, tagline and calls to action` · `style(hero): add court lines and sipa ball art`
- [ ] **T-ABOUT-01 About and mandate.** `Owner: Cliff` · Rev: Patrick · Branch: `feat/about-section`
      `About`, `MandateCard`, `CheckItem`, `StatTile` (hidden while values are `[#]`).
      Done when: AC-ABOUT-01, 02 and TC-ABOUT-01 pass. · Req: FR-ABOUT-01, FR-ABOUT-02 · Dep: T-SETUP-04
      Commits: `feat(about): add intro and mandate list` · `feat(about): add stat tiles hidden for placeholders` · `test(about): cover placeholder stats`
- [ ] **T-SERVICES-01 Services (programs and facilities).** `Owner: Carlo` · Rev: Cliff · Branch: `feat/services-section`
      `Services`, `ServiceCard`, `FacilitiesBand`, `serviceIcons`; **append** Services to `nav`.
      Done when: AC-SVC-01…03 and TC-SVC-01 pass; Services shows in the header. · Req: FR-SVC-01, FR-SVC-02 · Dep: T-SETUP-04
      Commits: `feat(services): add program cards` · `feat(services): add facilities band` · `feat(nav): add services link`
- [ ] **T-CONTACT-01 Contact and footer.** `Owner: Ramil` · Backup: Cliff · Rev: Carlo or Patrick · Branch: `feat/contact-footer`
      `Contact`, `ContactDetails`, `DetailRow`, `ContactForm` + `contactSchema`, `SiteFooter`; **append** Contact to `nav`.
      Done when: AC-CONTACT-01…04, TC-CONTACT-01/02 pass. · Req: FR-CONTACT-01, FR-CONTACT-02, FR-CONTACT-03, NFR-SEC-03 · Dep: T-SETUP-04
      Commits: `feat(contact): add office details` · `feat(contact): add contact form with validation and toast` · `feat(footer): add footer with practice-site disclaimer` · `feat(nav): add contact link` · `test(contact): cover form errors and toast`
- [ ] **T-GIT-01 Resolve the planned conflict.** `Owner: author of the second nav PR (normally Ramil)` · Rev: whoever approved it before
      Merge `origin/development` into the branch, keep both nav items, `npm run check`, push ([git-playbook §4](./git-playbook.md#4-the-planned-conflict)).
      Done when: no conflict markers; header shows Services and Contact; PR re-approved and merged. · Req: NFR-GIT-04 · Dep: T-SERVICES-01, T-CONTACT-01
- [ ] **T-DOCS-01 README.** `Owner: Ramil` · Backup: Patrick · Rev: anyone · Branch: `chore/readme`
      Project, team and roles, how to run (frontend + Supabase local), branch flow, live URLs.
      Done when: a new teammate can run the site from the README alone. · Commit: `docs: add readme with team, setup and urls`

## M3: Game track (Carlo)

- [ ] **T-DB-01 Leaderboard tables.** `Owner: Carlo` · Rev: Patrick · Branch: `feat/sipa-leaderboard-db`
      `supabase init` + `config.toml`; migrations for `set_updated_at`, `sipa_runs`, `sipa_scores`, `rate_limits` (database-design §3, §6, §9); pgTAP TC-DB-01, 05.
      Done when: `supabase db reset` and `supabase test db` pass locally. · Req: NFR-SEC-05 · Dep: T-SETUP-02
      Commits: `chore(db): initialize supabase project` · `feat(db): add sipa runs, scores and rate limit tables` · `test(db): cover rls and score constraints`
- [ ] **T-DB-02 Leaderboard SQL functions.** `Owner: Carlo` · Rev: Patrick · Branch: `feat/sipa-score-functions`
      `check_rate_limit`, `start_sipa_run`, `submit_sipa_score`, `sipa_leaderboard` view, cleanup job, seed (database-design §4, 5, 7, 8); pgTAP TC-DB-02…04, 06…08.
      Done when: all pgTAP tests pass. · Req: FR-LEAD-04, AC-LEAD-05, AC-LEAD-06 · Dep: T-DB-01
      Commits: `feat(db): add start run and submit score functions` · `feat(db): add leaderboard view and rate limit check` · `chore(db): schedule cleanup and add seed scores` · `test(db): cover submit rules, ranking and rate limits`
- [ ] **T-API-01 API skeleton.** `Owner: Carlo` · Rev: Cliff · Branch: `feat/api-skeleton`
      Edge Function `api`: Hono app, envelope helpers, error handler, CORS, client id, rate-limit middleware, `GET /health` (api-design §2–4, §5.4).
      Done when: `/api/v1/health` answers locally; TC-API-09, 10 pass. · Req: NFR-SEC-06, NFR-SEC-07, NFR-SEC-08 · Dep: T-DB-02
      Commits: `feat(api): add hono app with response envelope` · `feat(api): add cors, client id and rate limit middleware` · `feat(api): add health route` · `test(api): cover cors and error envelope`
- [ ] **T-API-02 Sipa endpoints.** `Owner: Carlo` · Rev: Patrick · Branch: `feat/sipa-leaderboard-api`
      `_shared/schemas/sipa.ts`, blocklist, controller/service/repository/resource for the three Sipa routes (api-design §5.1–5.3).
      Done when: TC-API-01…08 pass. · Req: FR-LEAD-01, FR-LEAD-02, FR-LEAD-04, AC-LEAD-03…08 · Dep: T-API-01
      Commits: `feat(api): add shared sipa score schema` · `feat(api): add leaderboard route` · `feat(api): add start run and submit score routes` · `test(api): cover sipa routes`
- [ ] **T-CI-01 Backend CI and deploy workflow.** `Owner: Carlo` · Rev: Cliff · Branch: `chore/backend-ci-deploy`
      `ci.yml` backend job (deno fmt/lint/test + `supabase test db`), `deploy-backend.yml` for `staging` and `main` (deployment §2.3).
      Done when: a PR shows the `backend` check; a merge to `staging` deploys to `cso-staging`. · Dep: T-SETUP-05, T-API-01
      Commits: `chore(ci): add backend checks` · `chore(ci): deploy migrations and functions on staging and main`
- [ ] **T-SIPA-01 Sipa engine.** `Owner: Carlo` · Rev: Patrick · Branch: `feat/sipa-engine`
      `constants.ts`, `types.ts`, `rng.ts`, `engine.ts`, tests (sipa-engine-design §1–3, §7).
      Done when: TC-SIPA-01…09 pass. · Req: FR-SIPA-01, FR-SIPA-03 · Dep: T-SETUP-05
      Commits: `feat(sipa): add engine constants and types` · `feat(sipa): add kick zone, scoring and gravity` · `feat(sipa): add misses, serve and round timer` · `test(sipa): cover scoring, misses and timer`
- [ ] **T-LEAD-01 API client.** `Owner: Carlo` · Rev: Patrick · Branch: `feat/leaderboard-client`
      `config/env.ts`, `lib/axios.ts`, `types/api.ts`, `providers/QueryProvider.tsx` (added to `App.tsx`), `features/laro/api/*`, `stores/playerStore.ts` (api-design §6).
      Done when: unit tests cover envelope unwrapping, 422 mapping and the 429 toast. · Req: FR-LEAD-01, FR-LEAD-03 · Dep: T-API-02, T-SETUP-04
      Commits: `feat(config): parse env with zod` · `feat(api): add axios instance with envelope handling` · `feat(leaderboard): add query hooks and player store` · `test(leaderboard): cover api error handling`
- [ ] **T-SIPA-02 Sipa game page.** `Owner: Carlo` · Rev: Patrick · Branch: `feat/sipa-game`
      `render.ts`, `useSipaLoop`, `useBestScore`, `SipaHud`, `SipaPanel`, `TouchControls`, `SipaGame`, `SipaPage` (lazy, skeleton, `RouteErrorFallback`).
      Done when: AC-SIPA-01…08 pass on a laptop and a phone; TC-SIPA-10, 11 pass; chunk ≤ 30 KB gzipped. · Req: FR-SIPA-01…06, NFR-PERF-02, NFR-PERF-03, NFR-A11Y-04 · Dep: T-SIPA-01
      Commits: `feat(sipa): draw court, player and ball` · `feat(sipa): add game loop with keyboard controls` · `feat(sipa): add touch controls` · `feat(sipa): add hud, panels and best score`
- [ ] **T-LEAD-02 Leaderboard UI.** `Owner: Carlo` · Rev: Cliff · Branch: `feat/leaderboard-ui`
      `LeaderboardPanel`, `LeaderboardList`, `RankBadge`, `NicknameForm`; start-run and submit wiring (sipa-engine-design §8).
      Done when: AC-LEAD-01…05, 07, 09 pass against the local stack; game still works with the API stopped (NFR-REL-01). · Req: FR-LEAD-01…05, NFR-REL-01 · Dep: T-SIPA-02, T-LEAD-01
      Commits: `feat(leaderboard): add top 10 panel with loading and error states` · `feat(leaderboard): add nickname form and score submit` · `test(leaderboard): cover submit states`
- [ ] **T-LARO-01 Laro ng Lahi section.** `Owner: Carlo` · Rev: Cliff · Branch: `feat/laro-section`
      `LaroSection`, `GameCard`, `DemoBadge`.
      Done when: AC-LARO-01…04 and TC-LARO-01…03 pass. · Req: FR-LARO-01, FR-LARO-02, FR-LARO-03, NFR-SEC-02 · Dep: T-LAYOUT-01
      Commits: `feat(laro): add laro ng lahi section with sipa card` · `feat(laro): add sabong demo card behind VITE_SABONG_URL` · `test(laro): cover sabong card visibility`

## M4: Release to staging (end of Phase B)

- [ ] **T-QA-01 Alpha on staging.** `Owner: Carlo` · Everyone helps
      After T-REL-02, run the [smoke test](../04-testing/test-plan.md#4-smoke-tests) on the staging URL; Lighthouse mobile; each problem → `fix/<what>` PR into `development`, then a new `development → staging` PR.
      Done when: all smoke rows pass on staging; scores recorded. · Req: NFR-PERF-01, NFR-A11Y-01, NFR-RESP-01, NFR-REL-02
- [ ] **T-REL-01 Release prep.** `Owner: Cliff (Release Manager, module 3)` · Rev: Patrick · Branch: `release/v1.0.0`
      `CHANGELOG.md` `[1.0.0]`, `package.json` version `1.0.0`, tick done tasks. PR into `development`.
      Done when: merged. · Commit: `chore(release): prepare v1.0.0` · Dep: all M2 and M3 tasks
- [ ] **T-REL-02 Promote to staging.** `Owner: Cliff (Release Manager, module 3)` · Rev: Patrick
      PR `development → staging` titled `chore(release): v1.0.0 to staging`; merge; backend deploys to `cso-staging`; Beta with the trainer or other teams; UAT by Carlo.
      Done when: UAT row signed in the README by Carlo. · Req: NFR-GIT-03 · Dep: T-REL-01

## M5: Launch Day (Phase C, Day 3)

- [ ] **T-REL-03 Release v1.0.0.** `Owner: Carlo (Release Manager, module 4)` · Rev: Ramil (Cliff backs up)
      PR `staging → main` titled `chore(release): v1.0.0`; merge; backend deploys to `cso-production`; tag `v1.0.0` on the merge commit; GitHub Release ([git-playbook §5](./git-playbook.md#5-release-v100)).
      Done when: tag and Release exist; production serves that commit; `/api/v1/health` shows its SHA. · Req: NFR-GIT-05, NFR-GIT-07 · Dep: T-REL-02
- [ ] **T-QA-02 Production smoke test.** `Owner: everyone` · Run the smoke test on the production URL. · Req: NFR-GIT-07 · Dep: T-REL-03
- [ ] **T-REL-04 Hotfix v1.0.1.** `Owner: first free person` · Rev: anyone else · Branch: `hotfix/<what-broke>`
      From `main`, one `fix(<scope>): …` commit, PR into `main` (label `hotfix`), merge, tag `v1.0.1`, then back-merge PRs `main → staging` and `staging → development` ([git-playbook §6](./git-playbook.md#6-hotfix)).
      Done when: the bug is gone on production; `v1.0.1` exists; `staging` and `development` contain the fix. · Req: NFR-GIT-06 · Dep: T-REL-03

---

## Traceability check (v1.0.0 Must requirements → tasks)

| Requirement                                    | Tasks                                                              |
| ---------------------------------------------- | ------------------------------------------------------------------ |
| FR-NAV-01, FR-NAV-02                           | T-LAYOUT-01                                                        |
| FR-NAV-03                                      | T-SETUP-04, T-LAYOUT-01                                            |
| FR-NAV-04                                      | T-SETUP-04, T-LAYOUT-01, T-SERVICES-01, T-CONTACT-01               |
| FR-HERO-01                                     | T-HERO-01                                                          |
| FR-ABOUT-01                                    | T-ABOUT-01                                                         |
| FR-SVC-01, FR-SVC-02                           | T-SERVICES-01                                                      |
| FR-LARO-01, FR-LARO-03                         | T-LARO-01                                                          |
| FR-SIPA-01, FR-SIPA-02, FR-SIPA-03, FR-SIPA-06 | T-SIPA-01, T-SIPA-02                                               |
| FR-LEAD-01, FR-LEAD-02, FR-LEAD-04             | T-DB-01, T-DB-02, T-API-02, T-LEAD-01, T-LEAD-02                   |
| FR-CONTACT-01, FR-CONTACT-02, FR-CONTACT-03    | T-CONTACT-01                                                       |
| NFR-PERF-01…03                                 | T-SIPA-02, T-QA-01                                                 |
| NFR-A11Y-01…04                                 | T-SETUP-03, T-LAYOUT-01, T-SIPA-02, T-QA-01                        |
| NFR-RESP-01, 02                                | all section tasks, T-QA-01                                         |
| NFR-SEC-01…08                                  | T-SETUP-02, T-SETUP-04, T-DB-01, T-API-01, T-LARO-01, T-CONTACT-01 |
| NFR-REL-01, 02                                 | T-LEAD-02, T-QA-01                                                 |
| NFR-CONT-01, 02, 03                            | T-SETUP-04, all section tasks                                      |
| NFR-GIT-01, 02                                 | every task (branch + commits listed), T-SETUP-05                   |
| NFR-GIT-03                                     | T-SETUP-01, T-REL-02                                               |
| NFR-GIT-04                                     | T-GIT-01                                                           |
| NFR-GIT-05                                     | T-REL-01, T-REL-03                                                 |
| NFR-GIT-06                                     | T-REL-04                                                           |
| NFR-GIT-07                                     | T-SETUP-01, T-QA-02, T-REL-03                                      |

**Workload (team build):** Patrick 5 (setup + header + hero) · Cliff 4 (tooling + about + release prep) · Ramil 3 (all `good first issue`) · Carlo 1 site section + 10 game-track tasks + repo setup + v1.0.0 (all proven in Phase A).
