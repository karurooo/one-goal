# Scatter & Catch: team plan (4 people, blueprint-aligned)

## Context
We are building the Scatter & Catch PRD (a 30 s canvas game with a Supabase Top 10) on the existing Vite + React 19 + TS scaffold. The team of 4 follows the **ICT Information System Blueprint 2026** for the frontend file structure, Atomic Design, state management, validation, Git workflow, commits, CI and SDLC phases. **Laravel is not used.** Supabase (Postgres + RLS + one RPC function) is the backend, and `supabase-js` replaces the Axios/Sanctum layer.

## Blueprint mapping: what we adopt, adapt and skip

| Blueprint item | Here |
|---|---|
| React + TS + Vite + npm, strict TS, no `any` | Adopt (already scaffolded) |
| `src/features/<domain>/…` + Atomic Design tiers | Adopt: features `game` and `leaderboard` |
| Zustand (client state) / TanStack Query (server state) | Adopt: `gameStore` for screen/HUD, Query for Top 10 and submit |
| React Hook Form + Zod | Adopt: the nickname form only |
| react-router-dom | Adopt: `/` (play) and `/leaderboard` |
| Shadcn + Tailwind, lucide-react, Sonner | Adopt: button, input, card, badge. Icons for pause/mute, toasts for submit errors |
| Vitest + happy-dom + React Testing Library | Adopt |
| ESLint + Prettier, Husky hooks | Adopt. The commit-msg hook is a small regex check, so no commitlint dependency |
| GitHub Actions CI (lint, type-check, build, test) | Adopt |
| Branch flow `feat/*` → `development` → `staging` → `main`, 1 approval | Adopt |
| DB naming: plural snake_case, `created_at` + `updated_at`, `{x}_id` FKs | Adopt for the `scores` table |
| Backend validation mirrors the frontend | Adapt: Zod nickname rules = SQL `check` + `submit_score` checks |
| Response envelope, Form Requests, Services, Sanctum, Axios instance | Adapt: Postgres function `submit_score` is the "service". RLS plus revoked grants act as the policy layer. `supabase-js` is the single client in `src/lib/supabase.ts` |
| Laravel, MySQL, Redis, Docker, IIS, Reverb/Echo | Skip (not needed for a static game) |
| TanStack Table, ApexCharts, Lexical, PDF, PWA, next-themes, Sentry, Lodash | Skip for v1. Top 10 is a plain list, and the game is dark only |

## Folder structure

```
src/
  main.tsx
  app/
    App.tsx                      providers + router
    routes/play/PlayPage.tsx     composes game organisms, owns screen flow
    routes/leaderboard/LeaderboardPage.tsx
  components/
    ui/                          shadcn primitives (button, input, card, badge)
    error/ErrorBoundary.tsx
  config/env.ts                  Zod-parsed VITE_SUPABASE_URL / ANON_KEY (optional → offline)
  lib/
    supabase.ts                  single client, or null when env missing; anonymous sign-in
    utils.ts                     cn()
  providers/QueryProvider.tsx
  testing/setup.ts
  features/
    game/
      components/atoms/          ScoreDisplay, TimerDisplay, ComboBadge, PauseButton, MuteButton
      components/molecules/      Hud, RoundStats
      components/organisms/      GameCanvas, StartScreen, GameOverPanel
      constants/config.ts        CONFIG (every tuning number from the PRD)
      lib/                       engine.ts, critter.ts, particles.ts, draw.ts, audio.ts
      hooks/                     useGameLoop.ts, usePersonalBest.ts
      stores/gameStore.ts        Zustand: screen, hud (≈10 Hz), lastRound, muted
      types/index.ts             GameState, Critter, RoundStats, HudValues
      index.ts
    leaderboard/
      api/scores.ts              submitScore(), fetchTop10() + useTop10 / useSubmitScore
      components/atoms/          RankRow
      components/molecules/      NicknameForm (RHF + Zod)
      components/organisms/      LeaderboardTable (loading / empty / offline states)
      constants/schemas.ts       nicknameSchema (3–16 chars, trimmed)
      types/index.ts             ScoreRow, SubmitScoreInput
      index.ts
supabase/migrations/<timestamp>_create_scores_table.sql
.github/workflows/ci.yml
.husky/pre-commit, .husky/commit-msg
```
**Rule from the PRD that overrides blueprint habits:** the per-frame game state (critters, particles, pointer, timer) lives in a `useRef` inside `useGameLoop`. It never goes into Zustand or React state. Zustand gets only screen changes and the throttled HUD push.

## Team roles

| Person | Area | Owns |
|---|---|---|
| **A: Engine** | rules, movement, scoring, phases | `features/game/lib/{engine,critter}.ts`, `constants/config.ts`, `types/`, engine tests |
| **B: Canvas & feel** | loop, input, drawing, particles, audio | `GameCanvas`, `hooks/useGameLoop.ts`, `lib/{draw,particles,audio}.ts` |
| **C: UI** | routes, screens, HUD, store, styling | `app/`, `components/ui/`, game atoms/molecules, `StartScreen`, `GameOverPanel`, `gameStore`, `usePersonalBest` |
| **D: Backend & DevOps / QA lead** | Supabase, leaderboard feature, CI, deploy | `supabase/`, `lib/supabase.ts`, `config/env.ts`, `features/leaderboard/**`, `.github/`, `.husky/` |

## Git workflow (from the blueprint)
- Long-lived branches: `main` (production), `staging` (pre-production), `development` (testing). D creates them from `main` in Phase 1.
- Work branches use `feat/<name>` or `fix/<name>` and come off `development`. PRs go into `development` and need ≥1 approval from a different role, with CI green.
- Promotion: `development` → `staging` at the end of each sprint, and `staging` → `main` at release.
- Commit prefixes: `feat: / fix: a; b; / style: / refactor: / chore: / docs: / test:`, enforced by `.husky/commit-msg` (regex `^(feat|fix|style|refactor|chore|docs|test): .+`). `pre-commit` runs lint + Prettier check on staged files.

## SDLC phases

### 1. Requirements (done: the PRD)
Defaults for the open questions: abstract blobs and a fixed 30 s. Out of scope: everything in "Ideas after v1".

### 2. Design (everyone, about 1 day)
- **A:** `features/game/types/index.ts` and the engine API: `createGame(w,h)`, `startRound(g)`, `attract(g)`, `update(g,dt)`, `tap(g,x,y) → TapEvent|null`.
- **B:** `GameCanvas` props contract `{ onHud, onOver }` and the `draw(g, ctx)` signature (read-only on state).
- **C:** Low-fi wireframes for Start, HUD and Game Over at phone and desktop width.
- **D:** ERD for `scores` (id, user_id → auth.users, nickname, score, caught, best_combo, created_at, updated_at). Write the `submitScore`/`fetchTop10` signatures and the max-score formula, then sign off with A.
- **Output:** contracts merged on `development` as `docs:` / `feat:` commits, so everyone can work against stubs.

### 3. Development: 5 sprints = the PRD milestones

**Sprint 0: setup** (D: `chore/project-setup`, C: `chore/ui-setup`)
- D: install deps, Husky + hooks, Prettier, Vitest + happy-dom + RTL + `testing/setup.ts`, `ci.yml` (`npm ci`, lint, `tsc -b`, test, build), create the branches.
- C: Tailwind + shadcn init, delete the demo `App.css`, `src/assets/*` and `public/icons.svg`, router + QueryProvider + ErrorBoundary shell, set the title, dark theme, `touch-action:none`, no zoom.

**Sprint 1: prototype** (wander, flee, bounce)
- A `feat/critter-movement`: CONFIG and `critter.step()` (wander, flee along the normalized away vector, wall bounce with squash). Tests for flee direction and bounce.
- B `feat/game-loop-canvas`: DPR canvas, resize, rAF + delta time in `useGameLoop` (cancelled on unmount), pointer events, plain circles.
- C `feat/play-route-screens`: `gameStore` screen machine (`start|playing|paused|over`) and a placeholder PlayPage.
- D `feat/supabase-client`: Supabase project with anonymous sign-in on, `config/env.ts`, `lib/supabase.ts` (null if env missing), `.env.example`.

**Sprint 2: core game**
- A `feat/catch-and-timer`: nearest-first single catch within size + 8 px, +10 per catch, 30 s timer, respawn of 5 at the far edge when fewer than 5 remain. Tests.
- B `feat/pointer-catch-input`: tap wiring, 0.5 s touch linger, ~10 Hz HUD push, pause on blur/visibilitychange.
- C `feat/hud-start-gameover`: HUD atoms (timer red under 10 s, `pointer-events:none` except buttons), Start and Game Over screens, Esc/Enter keys, `usePersonalBest` (localStorage in try/catch).
- D `feat/scores-table-migration`: table, checks, index `(score desc, created_at asc)`, RLS select-only, writes revoked from anon/authenticated.

**Sprint 3: difficulty**
- A `feat/difficulty-phases`: phases at 20/10 s (speed ×1.0/1.3/1.6, fast 0/2/4, bombs 0/1/2), fast +25 with 160 px radius, combo +5/step capped at +25 within 1 s, bomb −20 with 2 s ×2 scatter, miss breaks the combo. Tests for phase boundaries and the combo cap.
- B `feat/critter-types-render`: shape and color per type (blob / spiky cyan / dark with pulsing red ring).
- C `feat/combo-badge`: combo pop and best combo on Game Over.
- D `feat/submit-score-function`: `submit_score()` with security definer and pinned `search_path`. It requires `auth.uid()`, applies the plausibility checks and allows one submission per user every 25 s. Manual SQL test that direct writes fail.

**Sprint 4: leaderboard**
- D `feat/leaderboard-api`: `api/scores.ts`, Query hooks, `LeaderboardTable` (offline message on error), `/leaderboard` route content.
- C `feat/nickname-submit-form`: `NicknameForm` (RHF + Zod, `mode:'onBlur'`, disabled while submitting, Sonner toast on error), Top 10 with your rank on Game Over, and a Leaderboard button on Start.
- A `test/score-ceiling`: test that the engine's max possible score matches D's SQL ceiling.
- B `fix/overlay-loop-isolation`: the loop keeps running and nothing re-renders per frame while overlays are open.

**Sprint 5: polish**
- B `feat/particles-audio-eyes`: particle pool (no allocation in the loop), "+N" floaters, eyes, squash, bomb shake (off under `prefers-reduced-motion`), Web Audio beeps after the first tap. Performance pass with 40 critters.
- C `feat/mute-and-mobile-tuning`: mute toggle and real-phone layout/touch tuning.
- A `refactor/balance-config`: tune CONFIG from play-tests.
- D `chore/deploy-pipeline`: static deploy of `dist/` (e.g. Vercel or Netlify) with `development` → preview, `staging` → staging site, `main` → production. Separate Supabase projects for staging and prod.

### 4. Testing (D leads)
- **Unit/component (CI):** engine scoring/combo/phases/single-catch/respawn, `nicknameSchema`, `NicknameForm` errors, HUD rendering.
- **Alpha (internal team) on the staging site:** run the PRD acceptance checklist on desktop and phone.
- **Beta (friends):** check the success signals (understood without help, ≥2 replays, skill gap visible).
- **Release gate:** every acceptance box ticked → promote `staging` → `main`.

### 5. Deployment
`staging` → `main` PR with approval, production deploy, smoke test (play a round, submit, see the Top 10).

### 6. Maintenance
Balancing tweaks via `refactor:` PRs to CONFIG, and `fix/*` branches for bugs.

## Dependencies to watch
- Design contracts block every sprint, so merge them first.
- C's submit form needs D's `useSubmitScore`. C codes against the typed stub until Sprint 4.
- D's SQL ceiling needs A's final scoring (Sprints 3–4).
- `draw.ts` reads `GameState` but never mutates it (B ↔ A boundary).

## Verification
1. CI green on every PR: lint, `tsc -b`, `vitest run`, `vite build`.
2. `npm run dev` with no `.env.local`: the game plays fully and the leaderboard shows offline.
3. Phone via `npm run dev -- --host`: no scroll or zoom, touch herding works, blur pauses.
4. React DevTools profiler during Frenzy: only ~10 Hz HUD renders.
5. Supabase staging: a score appears in the Top 10, a resubmit within 25 s is rejected, and direct insert/update/delete from the console fails.
6. A bad commit message such as `added stuff` is rejected by the hook.
