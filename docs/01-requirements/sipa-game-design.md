# Sipa Game Design (Rules and Numbers)

| Field | Value |
|---|---|
| SDLC phase | Requirements Gathering |
| Status | Draft v0.1 |
| Owner | Carlo |
| Implements | FR-SIPA-01 … FR-SIPA-06, FR-LEAD-01 … FR-LEAD-05 ([product-requirements §5.6–5.7](./product-requirements.md#56-sipa-mini-game-sipa)) |
| Engine design | [../02-design/sipa-engine-design.md](../02-design/sipa-engine-design.md) |

---

## 1. The game in one line

**Keep the rattan ball in the air with your feet for 60 seconds.** Sipa is a traditional Filipino game; ours is a short, arcade-style browser version.

## 2. Round flow

```
ready ──(Kick / Start)──▶ playing ──(P/Esc/hidden)──▶ paused ──(P/Esc/Resume)──▶ playing
                             │
                             └──(3 misses or timer 0)──▶ over ──(R/Enter/Play again)──▶ ready
```

| Phase | What the player sees |
|---|---|
| `ready` | Court, player, ball resting above the player's foot. Panel: "Sipa · Keep the ball up for 60 seconds" + controls + **Start** button. **Top 10** beside the court |
| `playing` | Ball moving, HUD counting |
| `paused` | Dimmed court, panel: **Resume**, **Restart**, **Back to site** |
| `over` | Panel: final score, best score ("New best!" if beaten), **nickname + Submit score** (§9), **Play again**, **Back to site**. Top 10 beside the court |

## 3. Rules

| # | Rule | Req |
|---|---|---|
| R1 | A ball is served from the top at a random x and falls under gravity | FR-SIPA-01 |
| R2 | The player moves left and right along the floor | FR-SIPA-02 |
| R3 | Kick while the ball is inside the **kick zone** → ball flies up, **+1** | FR-SIPA-03 |
| R4 | Ball inside the **inner zone** when kicked → **perfect**, **+2**, "PERFECT +2" pop-up | FR-SIPA-03 |
| R5 | Kick outside the zone → a whiff: leg animates, nothing else changes, 0.2 s cooldown | AC-SIPA-02 |
| R6 | After each kick the ball gets a small random sideways speed, so the player must move | FR-SIPA-01 |
| R7 | Every 5 kicks, gravity goes up 8% (max ×1.6) | FR-SIPA-01 |
| R8 | Ball touches the ground → **miss**, short pause (0.6 s), new serve | FR-SIPA-03 |
| R9 | **3 misses** or the **60-second timer** ends the round | FR-SIPA-03 |
| R10 | Best score is kept on the device | FR-SIPA-04 |

## 4. Numbers (all tunable constants in `constants.ts`)

World is a fixed **960 × 540** logical space (y grows downward). The canvas scales it.

| Constant | Value | Notes |
|---|---|---|
| `TICK_HZ` | 60 | Fixed simulation step, `dt = 1/60` s |
| `ROUND_SECONDS` | 60 | |
| `MAX_MISSES` | 3 | |
| `GROUND_Y` | 470 | Top of the floor |
| `FOOT_Y` | 440 | Height of the kicking foot |
| `BALL_R` | 18 | Ball radius |
| `PLAYER_SPEED` | 420 | units/s |
| `PLAYER_MIN_X` / `PLAYER_MAX_X` | 60 / 900 | |
| `GRAVITY_START` | 900 | units/s² |
| `GRAVITY_STEP` | 1.08 | multiplier every `GRAVITY_EVERY` kicks |
| `GRAVITY_EVERY` | 5 | kicks |
| `GRAVITY_MAX` | 1440 | ×1.6 cap |
| `KICK_VY` | −720 | upward speed after a kick |
| `KICK_VX_MIN` / `KICK_VX_MAX` | 60 / 160 | random sideways speed, random sign |
| `ZONE_HALF_W` | 60 | kick zone: \|ball.x − player.x\| ≤ 60 |
| `ZONE_TOP` | `FOOT_Y − 80` | kick zone: ball.y between `ZONE_TOP` and `GROUND_Y − BALL_R` |
| `PERFECT_HALF_W` | 30 | inner zone horizontal half-width |
| `PERFECT_TOP` / `PERFECT_BOTTOM` | `FOOT_Y − 50` / `FOOT_Y − 10` | inner zone vertical band |
| `WHIFF_COOLDOWN` | 0.2 s | after a kick outside the zone |
| `MISS_PAUSE` | 0.6 s | before the next serve |
| `SERVE_Y` | 60 | |
| Walls | x = `BALL_R` and x = 960 − `BALL_R` | ball bounces off, `vx` flips |

Expected feel: first kicks are easy (about 1.6 s between kicks); by 25 kicks gravity is ×1.47 and the rhythm is about 1 s.

## 5. Controls

| Action | Keyboard | Touch | Mouse |
|---|---|---|---|
| Move | ← → or A D | Hold ◀ / ▶ buttons | — |
| Kick | Space or J | **SIPA!** button | Click the canvas |
| Start | Space / Enter | **Start** | **Start** |
| Pause / resume | P or Esc | Pause button | Pause button |
| Restart (on game over) | R or Enter | **Play again** | **Play again** |

Listeners are attached only while `/laro/sipa` is mounted, never on `window` for the whole app (AC-SIPA-06, AC-SIPA-07).

## 6. Scoring and best score

- `score` = sum of kicks (+1) and perfects (+2).
- Stats shown at game over: score, kicks, perfects, best.
- Best score key: `cso.sipa.best.v1` in `localStorage`, a non-negative integer. Read and write inside `try/catch`; an invalid stored value counts as 0 (AC-SIPA-04).

## 7. Presentation

| Element | Look |
|---|---|
| Court | Court green `#1f8a70` (`--court-bright`), white court lines at 25% opacity, darker floor strip |
| Ball | Gold `#ffb703` circle with four navy woven arcs; rotates with `vx` |
| Player | Navy silhouette (head, body, two legs); kicking leg swings for 0.15 s |
| Kick zone | Faint gold ellipse at the foot; brightens while the ball is inside it |
| Pop-ups | "+1" white, "PERFECT +2" gold pill, fade over 0.6 s |
| Reduced motion | No pop-up bounce, no screen shake, ball rotation off |

## 8. Out of scope (v1.0.0)
Sound, multiplayer, difficulty levels, power-ups, accounts, weekly/monthly boards.

## 9. Leaderboard flow (FR-LEAD-01 … 05)

```
Page opens ──▶ GET  /api/v1/sipa/leaderboard           → top 10 shown (or "unavailable" + Retry)
Start      ──▶ POST /api/v1/sipa/runs                  → { run_id }   (server records started_at)
             (if it fails: play anyway; submit is disabled for this round, AC-LEAD-09)
Round over ──▶ nickname (remembered) + Submit
           ──▶ POST /api/v1/sipa/runs/{run_id}/score   { nickname, score, kicks, perfects }
                 201 → "You're #4" + refresh top 10
                 409 → "Already submitted"     422 → field error or "Score rejected"
                 429 → toast "Too many tries, wait a few minutes"
```

| Rule | Value | Why |
|---|---|---|
| One submission per run | `run_id` single use | AC-LEAD-05 |
| Plausibility | `score = kicks + perfects`, `perfects ≤ kicks`, `kicks ≤ 90`, `kicks × 0.6 s ≤ elapsed ≤ 600 s` | AC-LEAD-06. Fastest real kick cycle is about 1 s at max gravity; 0.6 s leaves slack for network delay |
| Run expiry | A run older than 10 minutes can't be scored | AC-LEAD-06 |
| Rate limits | 30 runs and 10 submissions per device per 10 minutes | AC-LEAD-07 |
| Nickname | 2–20 chars, `[A-Za-z0-9 ._-]`, trimmed, inner spaces collapsed, blocklist | AC-LEAD-03, 08 |
| Score 0 | No submit form | AC-LEAD-03 |
| Leaderboard | Best 10 rows overall (one player may appear more than once) | Simple; revisit after v1.0.0 |

This is **anti-silliness, not anti-cheat**: a determined player can still fake a plausible score. That's acceptable for a practice site with no prizes.

