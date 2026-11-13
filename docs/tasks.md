# Scatter & Catch: task specs

Spec-driven breakdown of [Scatter & Catch Team Plan.md](./Scatter%20&%20Catch%20Team%20Plan.md). Each task is small enough for one person in about half a day to a day, has one branch and one PR, and is done when every acceptance box is ticked and CI is green.

## How to use this file

1. **Pick** a `todo` task whose `Depends on` tasks are all `done`. Put your name in the `Assignee` column and set the status to `doing` in the same PR or in a quick `docs:` commit.
2. **Branch** off `development` with the branch name given. One task = one branch = one PR.
3. **Build to the spec.** The `Contract` lines are fixed. If you need to change one, say so in the PR description and get the owner of the other side to approve.
4. **PR** into `development`. Paste the acceptance list into the PR description and tick it. You need 1 approval from a different role.
5. **Close** by setting the status to `done` (with the PR number) in this file.

Roles: **A** Engine · **B** Canvas & feel · **C** UI · **D** Backend, DevOps, QA lead. A role is the default owner; anyone can take a task if its owner agrees.

Statuses: `todo` · `doing` · `review` · `done` · `blocked`

---

## Board

| ID | Task | Role | Assignee | Depends on | Status |
|---|---|---|---|---|---|
| S0-1 | Tooling, hooks, CI, branches | D | Carlo | none | done (#1) |
| S0-2 | App shell, router, theme | C | Patrick | none | done (#3) |
| S0-3 | Page title "Scatter & Catch" | C | Cliff | none | done (#13) |
| P2-1 | Game types + engine API stubs | A | Patrick | none | done (#4) |
| P2-2 | GameCanvas props + `draw` signature | B | Patrick | none | done (#4) |
| P2-3 | Leaderboard types, API stubs, nickname schema, ERD | D | Patrick | none | done (#4) |
| P2-4 | Wireframes: Start, HUD, Game Over | C | | none | todo |
| P2-5 | Max-score formula (written down, signed off by A) | D + A | Carlo | P2-1 | done (#18) |
| S1-1 | Supabase client + env | D | Carlo | none | done (#5) |
| S1-2 | Turn on anonymous sign-in, smoke-test `ensureSession` | D | Carlo | S1-1 | done |
| S1-3 | Finish CONFIG for movement | A | Patrick | P2-1 | done (#6), `critterRadius` added (feat/respawn); gaps: no wander turn rate; Q1 `fastCritter.radius` and `capWithinMs` → `windowMs` rename not done |
| S1-4 | `critter.step()`: wander + wall bounce | A | Patrick | S1-3 | done (#6), gaps: tests cover 2 of 4 walls; no constant-speed test |
| S1-5 | `critter.step()`: flee from pointer | A | Patrick | S1-4 | done (#6), `pointer` added to `GameState` (feat/respawn); gaps: flee lives in `step()`, `attract()` is still a stub; no pointer-on-critter NaN test |
| S1-6 | DPR canvas + resize | B | Patrick | P2-2 | done (#8) |
| S1-7 | `useGameLoop`: rAF + delta time | B | Patrick | S1-6 | done (#8) |
| S1-8 | Pointer tracking + plain-circle `draw` | B | Patrick | S1-7, S1-4 | done (#14) |
| S1-9 | `gameStore` screen machine | C | Patrick | P2-1 | done (#9) |
| S1-10 | Placeholder PlayPage wired to store + canvas | C | Cliff | S1-9, S1-6 | done (#20) |
| S2-1 | `tap()`: nearest-first single catch | A | Patrick | S1-4 | done (#16) |
| S2-2 | Round timer + `startRound` + game over | A | Patrick | S1-3 | done (#21) |
| S2-3 | Respawn at the far edge | A | Patrick | S1-5 | done (#23) |
| S2-4 | Tap input + 0.5 s touch linger | B | Patrick | S1-8, S2-1 | review (feat/tap-input), also wires S2-5 (full GameCanvas/GameState integration) |
| S2-5 | ~10 Hz HUD push + `onOver` | B | Patrick | S1-7, S2-2 | review (feat/tap-input, same PR as S2-4) |
| S2-6 | Auto-pause on blur / hidden tab | B | | S1-9 | todo |
| S2-7 | HUD atoms + `Hud` molecule | C | | S1-9, P2-4 | todo |
| S2-8 | StartScreen + GameOverPanel + Esc/Enter | C | | S1-10, P2-4 | todo |
| S2-9 | `usePersonalBest` | C | Cliff | none | todo |
| S2-10 | Apply `scores` migration + verify RLS | D | Carlo | P2-3 | done (#17) |
| S3-1 | Difficulty phases | A | | S2-2 | todo |
| S3-2 | Fast critters (+25) | A | | S3-1 | todo |
| S3-3 | Combo (+5/step, cap +25, 1 s window) | A | | S2-1 | todo |
| S3-4 | Bombs (−20, 2 s ×2 scatter) | A | | S3-1 | todo |
| S3-5 | Render critter types | B | | S1-8 | todo |
| S3-6 | ComboBadge + best combo on Game Over | C | | S2-7, S3-3 | todo |
| S3-7 | `submit_score()` RPC | D | Carlo | S2-10, P2-5 | done (#19) |
| S4-1 | `fetchTop10` + `submitScore` bodies | D | Carlo | S3-7, S1-2 | review |
| S4-2 | LeaderboardTable + `/leaderboard` page | D | | S4-1 | todo |
| S4-3 | NicknameForm | C | | P2-3 | todo |
| S4-4 | Submit flow + Top 10 on Game Over | C | | S4-3, S4-1, S2-8 | todo |
| S4-5 | Score-ceiling test | A | | S3-2, S3-3, S3-4, S3-7 | todo |
| S4-6 | Overlay/loop isolation check | B | | S2-8, S2-5 | todo |
| S5-1 | Particle pool + "+N" floaters | B | | S3-5 | todo |
| S5-2 | Eyes, squash, bomb shake (reduced-motion aware) | B | | S3-5 | todo |
| S5-3 | Web Audio beeps | B | | S2-4 | todo |
| S5-4 | 40-critter performance pass | B | | S5-1, S5-2 | todo |
| S5-5 | Mute toggle | C | | S5-3 | todo |
| S5-6 | Real-phone layout/touch tuning | C | | S2-8 | todo |
| S5-7 | Balance CONFIG from play-tests | A | | S3-4 | todo |
| S5-8 | Deploy pipeline + staging/prod Supabase | D | | S4-2 | todo |
| T-1 | Alpha: acceptance checklist on staging | D (all) | | S5-* | todo |
| T-2 | Beta: friends test | D | | T-1 | todo |
| R-1 | Release: `staging` → `main` + smoke test | D | | T-2 | todo |

Team: **Carlo** (D) · **Patrick** (A, B) · **Cliff** (C). Assignees for done tasks are from git history.

---

## Global rules (apply to every task)

- Per-frame state (critters, particles, pointer, timer) lives in a `useRef` inside `useGameLoop`. It never goes into Zustand or React state. Zustand gets screen changes and the ~10 Hz HUD push only.
- `draw()` reads `GameState` and never mutates it.
- Every tuning number goes in `CONFIG`. No magic numbers in `engine.ts`, `critter.ts` or `draw.ts`.
- Engine functions are pure TypeScript with no DOM access, so they test in Vitest without a canvas.
- Offline must keep working: with no `.env.local`, the game plays fully and the leaderboard shows an offline message.
- Commit prefixes `feat: | fix: | style: | refactor: | chore: | docs: | test:`. The hook rejects anything else.

---

## Phase 2: design leftovers

### S0-3 · Page title
- **Branch:** `fix/page-title`
- **Spec:** `index.html` `<title>` is `Scatter & Catch`.
- **Acceptance:**
  - [ ] The browser tab shows "Scatter & Catch"

### P2-4 · Wireframes
- **Branch:** `docs/wireframes`
- **Spec:** Low-fi wireframes (images or ASCII in `docs/wireframes.md`) for Start, the in-game HUD and Game Over, each at phone (375 px) and desktop width. Show where the score, timer, combo, pause and mute go, and the nickname field plus Top 10 on Game Over.
- **Acceptance:**
  - [ ] 3 screens × 2 widths
  - [ ] B and D have reviewed it (the canvas area and leaderboard placement)

### P2-5 · Max-score formula
- **Branch:** `docs/max-score-formula`
- **Spec:** Write down the highest score a perfect player can reach in 30 s, as a formula over `CONFIG` plus one assumed number: the maximum catches per second a human can tap (proposal: 8/s). It must include the fast-critter bonus, the combo cap and the phase timings, with bombs counted as never tapped. Add it to the comment at the top of the `scores` migration and as `MAX_SCORE` in `features/game/constants/config.ts`.
- **Contract:** `MAX_SCORE` is the value that `submit_score()` (S3-7) rejects above. S4-5 tests that the engine can't exceed it.
- **Acceptance:**
  - [ ] The formula and its assumptions are written down
  - [ ] A approves the PR

---

## Sprint 1: prototype (wander, flee, bounce)

### S1-2 · Anonymous sign-in
- **Branch:** none (dashboard setting) or `chore/anon-auth-check`
- **Spec:** In Supabase, go to Authentication → Sign In / Providers → Anonymous and turn it on. Calling `ensureSession()` from `src/lib/supabase.ts` twice returns the same `user.id`.
- **Acceptance:**
  - [ ] Anonymous sign-in is enabled on the dev project
  - [ ] Two calls return the same user (checked once in the browser console)

### S1-3 · CONFIG for movement
- **Branch:** `feat/movement-config`
- **Spec:** Add the movement numbers that `config.ts` is still missing: base speed (px/s), wander turn rate, flee radius (px), flee speed, critter radius, starting critter count, and squash amount/duration on bounce. Clear up `fastCritter.radius: 160`: decide whether 160 px is the fast critter's flee radius or its body size, and rename the key to say which. Also rename `combo.capWithinMs` to `combo.windowMs`.
- **Contract:** Everything stays inside the `CONFIG` object (`as const`).
- **Acceptance:**
  - [ ] No movement number is hard-coded anywhere else
  - [ ] Each key has a one-line comment giving its unit

### S1-4 · Wander + wall bounce
- **Branch:** `feat/critter-movement`
- **Spec:** `features/game/lib/critter.ts` exports `step(c: Critter, dt: number, w: number, h: number): void`. The critter drifts with a slowly turning heading. When its edge passes a wall, it reflects that velocity component, clamps back inside and starts a squash.
- **Acceptance:**
  - [ ] Test: a critter moving into each of the 4 walls ends up inside with its velocity sign flipped
  - [ ] Test: speed stays constant through a bounce, within 1%

### S1-5 · Flee
- **Branch:** `feat/critter-flee`
- **Spec:** `attract(game)` is the existing stub name. It needs the pointer position, so add `pointer: { x: number; y: number; active: boolean }` to `GameState`. Every critter within the flee radius accelerates along the normalized vector pointing from the pointer to itself.
- **Acceptance:**
  - [ ] Test: a critter to the right of the pointer gains positive `vx`
  - [ ] Test: a critter outside the radius is unaffected
  - [ ] Test: a critter exactly on the pointer doesn't produce NaN

### S1-6 · DPR canvas + resize
- **Branch:** `feat/game-canvas`
- **Spec:** `GameCanvas` fills its parent. Its backing store is CSS size × `devicePixelRatio`, and the context is scaled so the game works in CSS pixels. It updates on resize via `ResizeObserver`.
- **Contract:** The props stay `{ onHud, onOver }`.
- **Acceptance:**
  - [ ] Sharp on a high-DPI screen
  - [ ] Resizing the window doesn't stretch the drawing

### S1-7 · Game loop
- **Branch:** `feat/game-loop`
- **Spec:** `hooks/useGameLoop.ts` holds `GameState` in a `useRef`, runs `requestAnimationFrame`, calls `update(g, dt)` with dt in seconds clamped to ≤ 0.05, then `draw(g, ctx)`. It cancels the rAF on unmount.
- **Acceptance:**
  - [ ] No React re-render per frame (check with the profiler)
  - [ ] Unmounting the page stops the loop (no console errors after leaving)

### S1-8 · Pointer + plain circles
- **Branch:** `feat/pointer-and-circles`
- **Spec:** Pointer events on the canvas update `g.pointer`, covering mouse and touch through Pointer Events. `draw()` clears the canvas and draws every live critter as a filled circle.
- **Acceptance:**
  - [ ] Critters visibly flee the cursor and your finger on a phone
  - [ ] No page scroll or zoom while dragging on a phone

### S1-9 · gameStore
- **Branch:** `feat/game-store`
- **Spec:** `features/game/stores/gameStore.ts` (Zustand) holds `screen: GameScreen`, `hud: HudValues`, `lastRound: RoundStats | null` and `muted: boolean`. Actions: `start()`, `pause()`, `resume()`, `over(stats)`, `toStart()`, `setHud(h)`, `toggleMute()`. Illegal transitions are ignored. For example, `pause()` while on `start` does nothing.
- **Acceptance:**
  - [ ] Test covering the allowed transitions: start→playing→paused→playing→over→start
  - [ ] Test: an illegal transition doesn't change `screen`

### S1-10 · Placeholder PlayPage
- **Branch:** `feat/play-page-placeholder`
- **Spec:** `PlayPage` renders `GameCanvas` full-screen. A plain "Play" button calls `store.start()`, and the screen name is shown as text.
- **Acceptance:**
  - [ ] Clicking Play changes the shown screen to `playing`

---

## Sprint 2: core game

### S2-1 · tap()
- **Branch:** `feat/tap-catch`
- **Spec:** `tap(g, x, y)` finds the nearest live critter whose distance to the tap is ≤ `radius + CONFIG.catchRadiusPadding`. It marks that critter dead, adds `pointsPerCatch`, increments `caught` and returns a `TapEvent`. If nothing is in range, it returns `null`.
- **Acceptance:**
  - [ ] Test: with two overlapping critters, only the nearest is caught
  - [ ] Test: a tap 1 px outside the padding returns `null`
  - [ ] Test: a tap does nothing when `screen !== 'playing'`

### S2-2 · Timer + rounds
- **Branch:** `feat/round-timer`
- **Spec:** `startRound(g)` resets score, caught, combo and critters, sets `timeRemaining = CONFIG.roundSeconds` and sets `screen = 'playing'`. `update()` counts the timer down only while playing. At 0 it sets `screen = 'over'`.
- **Acceptance:**
  - [ ] Test: after 30 s of updates the screen is `over` and the timer is exactly 0
  - [ ] Test: a paused game doesn't lose time

### S2-3 · Respawn
- **Branch:** `feat/respawn`
- **Spec:** When fewer than `CONFIG.minCritters` are alive, spawn 5 at the edge farthest from the pointer.
- **Acceptance:**
  - [ ] Test: the alive count never stays below `minCritters` after an `update`
  - [ ] Test: spawned critters land on the far side from the pointer

### S2-4 · Tap input
- **Branch:** `feat/tap-input`
- **Spec:** `pointerdown` calls `tap()`. On touch, the pointer stays active for 0.5 s after `pointerup`, so a lifted finger still scares critters away.
- **Acceptance:**
  - [ ] Tapping a critter on a phone and on desktop catches it

### S2-5 · HUD push + onOver
- **Branch:** `feat/hud-push`
- **Spec:** The loop calls `onHud({ score, timeRemaining, combo })` at most every 100 ms, and calls `onOver(stats)` exactly once when the screen becomes `over`.
- **Acceptance:**
  - [ ] Profiler: HUD components re-render about 10×/s, and nothing else re-renders
  - [ ] `onOver` fires once per round

### S2-6 · Auto-pause
- **Branch:** `feat/auto-pause`
- **Spec:** `blur` or `visibilitychange` to hidden while `playing` calls `store.pause()`.
- **Acceptance:**
  - [ ] Switching tabs mid-round pauses the game, and the timer doesn't advance

### S2-7 · HUD
- **Branch:** `feat/hud`
- **Spec:** The atoms `ScoreDisplay`, `TimerDisplay` (red under 10 s) and `PauseButton` (lucide icon) go in the `Hud` molecule, which reads `gameStore.hud`. The HUD has `pointer-events: none`, except on the buttons.
- **Acceptance:**
  - [ ] You can catch critters underneath the HUD
  - [ ] The timer turns red at 9.9 s
  - [ ] Matches the P2-4 wireframe

### S2-8 · Start + Game Over screens
- **Branch:** `feat/start-gameover`
- **Spec:** `StartScreen` has the title, a Play button and your personal best. `GameOverPanel` has score, caught, best combo, personal best and Play Again. Enter starts or restarts; Esc pauses or resumes.
- **Acceptance:**
  - [ ] The full loop works with the keyboard only
  - [ ] Matches the P2-4 wireframe

### S2-9 · usePersonalBest
- **Branch:** `feat/personal-best`
- **Spec:** `usePersonalBest()` returns `{ best, record(score) }`. The value is stored in `localStorage`, and every read/write is wrapped in try/catch. If storage fails, `best` is 0 and nothing crashes.
- **Acceptance:**
  - [ ] Test: `record` only raises the stored value
  - [ ] Test: a throwing `localStorage` doesn't crash

### S2-10 · Apply scores migration
- **Branch:** `feat/scores-table-migration`
- **Spec:** Review `supabase/migrations/20261113062754_create_scores_table.sql` and rename it with a real timestamp. Decide whether a round score can go negative because of bombs. If it can, either the engine clamps it at 0 (tell A) or the `score >= 0` check changes. Apply the migration to the dev project.
- **Acceptance:**
  - [ ] The table and index exist on the dev project
  - [ ] As `anon`, `select` works and `insert`/`update`/`delete` fail (SQL editor)
  - [ ] Supabase security advisors show no warnings for `scores`

---

## Sprint 3: difficulty

### S3-1 · Phases
- **Branch:** `feat/difficulty-phases`
- **Spec:** Add `phase: 0 | 1 | 2` to `GameState`. Phase 1 starts at `timeRemaining ≤ phase1At` (20), and phase 2 at `≤ phase2At` (10). The speed multiplier and the fast/bomb counts come from `CONFIG.difficultyPhases`.
- **Acceptance:**
  - [ ] Tests at 20.01, 20.0, 10.01 and 10.0 seconds remaining

### S3-2 · Fast critters
- **Branch:** `feat/fast-critters`
- **Spec:** Each phase keeps its count of `spiky` critters alive. Catching one scores `fastCritter.bonusPoints` (+25) instead of +10.
- **Acceptance:**
  - [ ] Test: catching a fast critter scores 25 plus any combo

### S3-3 · Combo
- **Branch:** `feat/combo`
- **Spec:** A catch within `combo.windowMs` of the previous one raises `combo` by 1. The combo adds `pointsPerStep × (combo − 1)`, capped at `capPoints`. A tap that misses, or a gap longer than the window, resets the combo to 0. `bestCombo` tracks the highest value.
- **Acceptance:**
  - [ ] Test: the bonus stops growing at +25
  - [ ] Test: a miss resets the combo
  - [ ] Test: a 1001 ms gap resets the combo

### S3-4 · Bombs
- **Branch:** `feat/bombs`
- **Spec:** Each phase keeps its count of `bomb` critters alive. Tapping one gives −20, breaks the combo and makes every critter scatter at ×2 speed for 2 s.
- **Acceptance:**
  - [ ] Test: the score drops by 20 (respecting the S2-10 clamping decision)
  - [ ] Test: speed returns to normal after 2 s

### S3-5 · Render types
- **Branch:** `feat/critter-types-render`
- **Spec:** `blob` is a round blob, `spiky` is a cyan spiky shape, and `bomb` is dark with a pulsing red ring. The pulse is driven by time passed into `draw()`, not by mutating state.
- **Acceptance:**
  - [ ] All 3 types are distinguishable at a glance on a phone

### S3-6 · Combo badge
- **Branch:** `feat/combo-badge`
- **Spec:** `ComboBadge` pops (scale animation) when the combo reaches 2 or more, and is hidden at 0. Game Over shows the best combo.
- **Acceptance:**
  - [ ] No animation under `prefers-reduced-motion`

### S3-7 · submit_score() RPC
- **Branch:** `feat/submit-score-function`
- **Spec:** A new migration adds `submit_score(nickname text, score int, caught int, best_combo int) returns scores`, defined as `security definer` with `set search_path = ''`. It requires `auth.uid()` and validates the nickname with the same rules as `nicknameSchema`. It rejects `score > MAX_SCORE` (P2-5) and impossible ratios between `score`, `caught` and `best_combo`. It also rejects a second submission from the same user within 25 s. Grant `execute` to `authenticated` only.
- **Acceptance:**
  - [ ] Manual SQL test: a valid call inserts a row
  - [ ] Manual SQL test: a resubmit within 25 s raises an error
  - [ ] Manual SQL test: score > MAX_SCORE raises an error
  - [ ] Manual SQL test: direct `insert` still fails
  - [ ] Security advisors are clean

---

## Sprint 4: leaderboard

### S4-1 · API bodies
- **Branch:** `feat/leaderboard-api`
- **Spec:** `fetchTop10()` selects the top 10 ordered by `score desc, created_at asc`. `submitScore()` calls `ensureSession()` and then `rpc('submit_score', …)`. Both throw a clear error when `supabase` is null (offline). `useSubmitScore` invalidates `['leaderboard','top10']` on success.
- **Contract:** The signatures in `api/scores.ts` stay as merged in #4.
- **Acceptance:**
  - [ ] Test with a mocked client: offline throws, and the RPC is called with the right args

### S4-2 · LeaderboardTable
- **Branch:** `feat/leaderboard-table`
- **Spec:** The `RankRow` atom goes in the `LeaderboardTable` organism, which has loading, empty, error and offline states. `/leaderboard` renders it with a Back to Play link.
- **Acceptance:**
  - [ ] With no `.env.local`, the page shows the offline message and doesn't crash

### S4-3 · NicknameForm
- **Branch:** `feat/nickname-form`
- **Spec:** React Hook Form with `zodResolver(nicknameFormSchema)` and `mode: 'onBlur'`. The submit button is disabled while submitting. Props: `{ onSubmit(values): Promise<void> }`.
- **Acceptance:**
  - [ ] Test: entering "ab" shows the min-length error on blur
  - [ ] Test: the button is disabled while a submit is pending

### S4-4 · Submit flow on Game Over
- **Branch:** `feat/nickname-submit-flow`
- **Spec:** `GameOverPanel` puts `NicknameForm` together with `useSubmitScore`. A failed submit shows a Sonner toast. On success it shows the Top 10 with your row highlighted. StartScreen gets a Leaderboard button.
- **Acceptance:**
  - [ ] A submitted score appears in the Top 10 without a reload
  - [ ] A resubmit within 25 s shows a toast, not a crash

### S4-5 · Score ceiling test
- **Branch:** `test/score-ceiling`
- **Spec:** A Vitest test simulates a perfect 30 s round at the P2-5 tap rate (every tap hits, fast critters first, combo always maxed, bombs never tapped). It asserts that the score is ≤ `MAX_SCORE`.
- **Acceptance:**
  - [ ] The test passes
  - [ ] Changing any scoring number in CONFIG without updating `MAX_SCORE` makes it fail

### S4-6 · Overlay/loop isolation
- **Branch:** `fix/overlay-loop-isolation`
- **Spec:** While the Start, Pause or Game Over overlays are open, the attract-mode loop keeps running and the overlays don't re-render per frame.
- **Acceptance:**
  - [ ] Profiler shows overlays rendering only on screen changes

---

## Sprint 5: polish

### S5-1 · Particles + floaters
- **Branch:** `feat/particles`
- **Spec:** A fixed-size particle pool is allocated once, with nothing allocated inside the loop. A catch emits a burst plus a "+N" floater that rises and fades.
- **Acceptance:**
  - [ ] A heap snapshot shows no growth over a 30 s round

### S5-2 · Eyes, squash, shake
- **Branch:** `feat/critter-feel`
- **Spec:** Critters get eyes that look toward the pointer, plus squash on bounce. A bomb tap shakes the screen, and the shake is off under `prefers-reduced-motion`.
- **Acceptance:**
  - [ ] With reduced motion on in the OS, there's no shake

### S5-3 · Audio
- **Branch:** `feat/audio`
- **Spec:** `lib/audio.ts` uses Web Audio beeps for catch, combo, bomb and game over. The AudioContext is created on the first tap (browser autoplay rule). The beeps respect `gameStore.muted`.
- **Acceptance:**
  - [ ] No autoplay warning in the console
  - [ ] Mute silences everything

### S5-4 · Performance pass
- **Branch:** `chore/perf-40-critters`
- **Spec:** With 40 critters plus particles, the game holds 60 fps on a mid-range phone.
- **Acceptance:**
  - [ ] A performance trace attached to the PR shows no long frames over 16 ms during Frenzy

### S5-5 · Mute toggle
- **Branch:** `feat/mute-toggle`
- **Spec:** The `MuteButton` atom in the HUD and on Start toggles `gameStore.muted`. The setting persists in localStorage (try/catch).
- **Acceptance:**
  - [ ] The setting survives a reload

### S5-6 · Phone tuning
- **Branch:** `feat/mobile-tuning`
- **Spec:** Test on a real Android and a real iPhone via `npm run dev -- --host`. Fix layout, safe-area insets and touch targets (≥ 44 px).
- **Acceptance:**
  - [ ] No scroll, zoom or text selection on either phone

### S5-7 · Balance
- **Branch:** `refactor/balance-config`
- **Spec:** Tune CONFIG from at least 3 play-testers' rounds. If scoring numbers change, update `MAX_SCORE` and the S4-5 test.
- **Acceptance:**
  - [ ] The PR lists before/after values and why

### S5-8 · Deploy
- **Branch:** `chore/deploy-pipeline`
- **Spec:** Static deploy of `dist/` (Vercel or Netlify). `development` deploys to a preview, `staging` to the staging site and `main` to production. Create separate Supabase projects for staging and prod, apply the migrations to both, turn on anonymous sign-in and set the env vars on the host.
- **Acceptance:**
  - [ ] The staging URL plays a round and submits a score
  - [ ] Production uses its own Supabase project

---

## Testing & release

### T-1 · Alpha
Run the PRD acceptance checklist on the staging site, on desktop and phone, together with the plan's Verification list (items 1–6). File every failure as a `fix/*` task here.

### T-2 · Beta
Friends play without instructions. Record whether they understood the game without help, whether they replayed at least twice, and whether there's a visible skill gap between players.

### R-1 · Release
Merge `staging` → `main` with approval, deploy to production, then smoke-test: play a round, submit a score and see it in the Top 10.

---

## Open questions (owner decides, then update the spec)

| # | Question | Owner | Blocks |
|---|---|---|---|
| Q1 | `CONFIG.fastCritter.radius: 160`: is it the flee radius or the body size? | A | S1-3 |
| Q2 | Can a score go negative after bombs? The engine would clamp at 0, or the SQL check changes (proposed by D: engine clamps at 0, SQL keeps `score >= 0`; A to confirm) | A + D | S2-10, S3-4 |
| Q3 | Assumed max human tap rate for `MAX_SCORE` (proposal: 8/s; used in P2-5, A to confirm) | A + D | P2-5 |
