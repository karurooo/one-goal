# Sipa Engine Design

| Field | Value |
|---|---|
| SDLC phase | Design |
| Status | Draft v0.1 |
| Owner | Carlo |
| Rules and numbers | [../01-requirements/sipa-game-design.md](../01-requirements/sipa-game-design.md) |
| Implements | FR-SIPA-01…06, FR-LEAD-01…05 (client side), NFR-PERF-02/03, NFR-A11Y-04 |

---

## 1. Modules

```
src/features/laro/sipa/
├─ constants.ts        # every number from sipa-game-design §4
├─ types.ts            # SipaState, SipaInput, SipaEvent
├─ rng.ts              # mulberry32(seed): deterministic random for tests
├─ engine.ts           # createState, step: PURE, no DOM, no Date, no Math.random
├─ engine.test.ts      # Vitest
├─ render.ts           # draw(ctx, state, alpha, opts): canvas only, no React
├─ useSipaLoop.ts      # rAF loop, fixed step, input sampling, pause on hidden
├─ useBestScore.ts     # localStorage best score (try/catch)
└─ components/
   ├─ atoms/       KeyHint.tsx, MissDots.tsx
   ├─ molecules/   SipaHud.tsx, TouchControls.tsx, SipaPanel.tsx, LeaderboardList.tsx, NicknameForm.tsx
   └─ organisms/   SipaGame.tsx, LeaderboardPanel.tsx
src/features/laro/api/        # sipaApi.ts, queries.ts (api-design §6)
src/features/laro/stores/     # playerStore.ts (Zustand persist: nickname)
src/app/routes/SipaPage.tsx   # lazy route: header "Back to site" + <SipaGame/>
```

**Rule:** `engine.ts`, `rng.ts`, `constants.ts`, `types.ts` import nothing from React, the DOM or the browser. That keeps the rules testable in Vitest without a canvas.

## 2. Public API (handoff contract)

```ts
// types.ts
export type Phase = 'ready' | 'playing' | 'paused' | 'over';

export interface SipaState {
  phase: Phase;
  timeLeft: number;            // seconds
  ball: { x: number; y: number; vx: number; vy: number; spin: number };
  player: { x: number; kickT: number };   // kickT > 0 while the leg animates
  gravity: number;
  score: number; kicks: number; perfects: number; misses: number;
  cooldown: number;            // whiff cooldown, seconds
  servePause: number;          // seconds until the next serve after a miss
  rngState: number;
}

export interface SipaInput { left: boolean; right: boolean; kick: boolean }  // kick = pressed this tick

export type SipaEvent =
  | { type: 'kick'; perfect: boolean; points: 1 | 2 }
  | { type: 'whiff' }
  | { type: 'miss'; missesLeft: number }
  | { type: 'gravityUp'; gravity: number }
  | { type: 'over'; reason: 'misses' | 'time' };

// engine.ts
export function createState(seed?: number): SipaState;           // phase 'ready'
export function start(s: SipaState): SipaState;                  // ready → playing
export function setPaused(s: SipaState, paused: boolean): SipaState;
export function step(s: SipaState, input: SipaInput, dt: number): { state: SipaState; events: SipaEvent[] };
export function inKickZone(s: SipaState): boolean;
export function inPerfectZone(s: SipaState): boolean;
```

`step` returns a **new** object (no mutation of the input) and does nothing unless `phase === 'playing'`.

## 3. Step order (one tick, `dt = 1/60`)

1. If `servePause > 0`: count it down; when it hits 0, serve (ball at `SERVE_Y`, random x in [200, 760], `vx = vy = 0`). Skip to 6.
2. Move player: `x += (right − left) · PLAYER_SPEED · dt`, clamp to [`PLAYER_MIN_X`, `PLAYER_MAX_X`].
3. Kick: if `input.kick` and `cooldown ≤ 0`:
   - in zone → `vy = KICK_VY`, `vx = ±rand(KICK_VX_MIN, KICK_VX_MAX)`, points 1 or 2, `kicks++`, emit `kick`; every `GRAVITY_EVERY` kicks raise gravity (cap) and emit `gravityUp`.
   - else → `cooldown = WHIFF_COOLDOWN`, emit `whiff`.
   - Either way `player.kickT = 0.15`.
4. Ball: `vy += gravity · dt`; `x += vx · dt`; `y += vy · dt`; bounce off side walls (flip `vx`); `spin += vx · dt / BALL_R`.
5. Ground: if `y ≥ GROUND_Y − BALL_R` → `misses++`, emit `miss`; if `misses === MAX_MISSES` → `phase = 'over'`, emit `over('misses')`; else `servePause = MISS_PAUSE`.
6. Timer: `timeLeft −= dt`; at ≤ 0 → `timeLeft = 0`, `phase = 'over'`, emit `over('time')`.
7. Count down `cooldown` and `kickT`.

## 4. Loop (`useSipaLoop`)

```ts
const STEP = 1 / TICK_HZ;
let acc = 0, last = performance.now();
function frame(now: number) {
  acc += Math.min((now - last) / 1000, 0.25); last = now;   // clamp after tab switch
  while (acc >= STEP) { const r = step(state, sampleInput(), STEP); state = r.state; handle(r.events); acc -= STEP; }
  draw(ctx, state, acc / STEP, { reducedMotion });
  hudThrottle(state);                                       // React HUD at most 10×/s
  rafId = requestAnimationFrame(frame);
}
```

- State lives in a `useRef`, not `useState`; React only re-renders the HUD (throttled to 10 Hz) and the panels on phase change.
- `kick` is an **edge**: set by keydown/pointerdown, cleared after one step.
- `document.visibilitychange` → `setPaused(true)` (AC-SIPA-05).
- Cleanup on unmount: `cancelAnimationFrame`, remove keydown/keyup/visibility listeners (AC-SIPA-06).
- Keydown handler calls `preventDefault()` for Space and arrows **only** while the game page is mounted (AC-SIPA-07).

## 5. Rendering (`render.ts`)

- Canvas CSS size: 100% of container width, max 860 px (the leaderboard takes the right column at ≥ 1200 px), `aspect-ratio: 16 / 9`.
- Backing size: `cssWidth × devicePixelRatio`; `ctx.setTransform(scale, 0, 0, scale, 0, 0)` where `scale = backingWidth / 960`.
- Draw order: court → floor → kick zone (brighter when `inKickZone`) → shadow under ball → ball (rotated by `spin`, unless reduced motion) → player → pop-ups.
- No allocations inside `draw` beyond what the canvas API needs.
- The canvas has `role="img"` and an `aria-label` ("Sipa game"). Score and status are announced by the React HUD in an `aria-live="polite"` region (only on phase change and on "New best!", not every point).

## 6. HUD and panels (React)

| Component | Content |
|---|---|
| `SipaHud` | Score, Time (m:ss), Misses (`MissDots`, 3 dots), Best |
| `SipaPanel` | `ready` / `paused` / `over` content from sipa-game-design §2; buttons are real `<button>`s and get focus when the panel opens. `over` includes `NicknameForm` |
| `LeaderboardPanel` | `useLeaderboard()`; loading, empty, error + Retry states; highlights the row with the id returned by the last submit |
| `TouchControls` | ◀ ▶ (hold), **SIPA!**, shown when `matchMedia('(pointer: coarse)')` |

## 7. Tests (`engine.test.ts`)

| Test | Covers |
|---|---|
| kick in zone adds 1, ball goes up | AC-SIPA-01 |
| kick in inner zone adds 2 and emits `perfect` | AC-SIPA-01 |
| kick outside zone changes nothing but cooldown | AC-SIPA-02 |
| ball reaching ground adds a miss and schedules a serve | AC-SIPA-03 |
| third miss ends the round with reason `misses` | AC-SIPA-03 |
| timer reaching 0 ends the round with reason `time` | AC-SIPA-03 |
| gravity rises every 5 kicks and stops at the cap | R7 |
| same seed + same inputs → same state | determinism (testability) |
| `step` does nothing while paused | AC-SIPA-05 |
| `useBestScore` survives a throwing `localStorage` | AC-SIPA-04 |

## 8. Leaderboard hooks into the loop

| Moment | Call | Notes |
|---|---|---|
| `start()` (ready → playing) | `startRun.mutate()`; store `run_id` in a ref when it resolves | Don't wait; if it fails, `runId = null` and the over panel shows the offline message |
| `over` event | read `state.score`, `state.kicks`, `state.perfects` | These three are what the API checks |
| Submit | `submitScore.mutate({ runId, nickname, score, kicks, perfects })` | Disable the button while pending; on 201 save the nickname to `playerStore` |
| Play again | clear `runId`, new `createState()` | A new run is started on the next Start |
