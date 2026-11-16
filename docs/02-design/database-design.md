# Database Design (Supabase Postgres)

| Field | Value |
|---|---|
| SDLC phase | Design |
| Status | Draft v0.2 |
| Owner | Carlo (game track) |
| Implements | FR-LEAD-01 … FR-LEAD-05, NFR-SEC-05, NFR-SEC-08 |
| Related | [api-design.md](./api-design.md), [../01-requirements/sipa-game-design.md §9](../01-requirements/sipa-game-design.md#9-leaderboard-flow-fr-lead-01--05) |

---

## 1. Principles (Blueprint database conventions, unchanged)

- Table names `snake_case`, plural. Foreign keys `{table_singular}_id`. Booleans `is_…`.
- Every table has `created_at` and `updated_at` (`timestamptz`, default `now()`), with the `set_updated_at` trigger.
- Soft delete (`deleted_at`) on master tables. `sipa_scores` uses it so moderation hides a row without losing it.
- Column limits are enforced in SQL **and** mirrored in Zod (Blueprint: "validation rules must mirror database constraints").
- **RLS is enabled on every table with no policies for `anon` or `authenticated`.** Only the Edge Function (service role) reads and writes (ADR-08).
- Multi-step writes run inside one SQL function (the `DB::transaction()` equivalent).
- No personal data: a nickname, numbers and a salted hash only (NG6, NFR-SEC-08).

## 2. Entity-relationship diagram

```
┌─────────────────────────────┐        ┌─────────────────────────────────┐
│ sipa_runs                   │ 1    0..1 │ sipa_scores                    │
├─────────────────────────────┤────────├─────────────────────────────────┤
│ id            uuid PK       │        │ id            uuid PK           │
│ client_hash   text          │        │ sipa_run_id   uuid FK UNIQUE    │
│ started_at    timestamptz   │        │ nickname      varchar(20)       │
│ is_submitted  boolean       │        │ score         smallint          │
│ created_at    timestamptz   │        │ kicks         smallint          │
│ updated_at    timestamptz   │        │ perfects      smallint          │
└─────────────────────────────┘        │ elapsed_ms    integer           │
                                       │ client_hash   text              │
┌─────────────────────────────┐        │ created_at    timestamptz       │
│ rate_limits                 │        │ updated_at    timestamptz       │
├─────────────────────────────┤        │ deleted_at    timestamptz NULL  │
│ id            bigint PK     │        └─────────────────────────────────┘
│ client_hash   text          │
│ action        text          │        view: sipa_leaderboard (top rows, not deleted)
│ created_at    timestamptz   │
│ updated_at    timestamptz   │
└─────────────────────────────┘
```

## 3. Tables

### 3.1 `sipa_runs`
One row per round started (`POST /sipa/runs`). The server's `started_at` is the only clock we trust.

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `client_hash` | `text` | not null, `char_length = 64` (hex SHA-256) |
| `started_at` | `timestamptz` | not null, default `now()` |
| `is_submitted` | `boolean` | not null, default `false` |
| `created_at`, `updated_at` | `timestamptz` | not null, default `now()` |

Index: `(client_hash, created_at)`. Rows older than 7 days are deleted by a scheduled job (pg_cron, §7).

### 3.2 `sipa_scores`
| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `sipa_run_id` | `uuid` | not null, **unique**, FK → `sipa_runs.id` on delete restrict |
| `nickname` | `varchar(20)` | not null, `check (char_length(nickname) between 2 and 20 and nickname ~ '^[A-Za-z0-9 ._-]+$')` |
| `score` | `smallint` | not null, `check (score between 1 and 180)` |
| `kicks` | `smallint` | not null, `check (kicks between 1 and 90)` |
| `perfects` | `smallint` | not null, `check (perfects between 0 and kicks)` |
| `elapsed_ms` | `integer` | not null, `check (elapsed_ms between 0 and 600000)` |
| `client_hash` | `text` | not null |
| `created_at`, `updated_at` | `timestamptz` | not null, default `now()` |
| `deleted_at` | `timestamptz` | null (moderation) |

Table check: `check (score = kicks + perfects)`.
Index: `(score desc, created_at asc) where deleted_at is null` for the leaderboard.

### 3.3 `rate_limits`
Append-only log of limited actions. Rows older than 1 day are deleted by the cleanup job.

| Column | Type | Constraints |
|---|---|---|
| `id` | `bigint` | PK, generated always as identity |
| `client_hash` | `text` | not null |
| `action` | `text` | not null, `check (action in ('run_start', 'score_submit'))` |
| `created_at`, `updated_at` | `timestamptz` | not null, default `now()` |

Index: `(client_hash, action, created_at)`.

## 4. View

```sql
create view public.sipa_leaderboard with (security_invoker = true) as
select row_number() over (order by score desc, created_at asc) as rank,
       id, nickname, score, kicks, perfects, created_at
from public.sipa_scores
where deleted_at is null
order by score desc, created_at asc
limit 10;
```
`security_invoker` keeps RLS in force; only the service role can read it.

## 5. SQL functions (service layer in the database)

All `security definer`, `set search_path = ''`, `execute` granted to `service_role` only.

| Function | Does | Errors (custom SQLSTATE → HTTP in the API) |
|---|---|---|
| `check_rate_limit(p_client_hash text, p_action text, p_max int, p_window interval) returns boolean` | Counts the client's rows for the action inside the window; if under `p_max`, inserts one and returns `true`; else returns `false` | — |
| `start_sipa_run(p_client_hash text) returns uuid` | Inserts a run, returns its id | — |
| `submit_sipa_score(p_run_id uuid, p_client_hash text, p_nickname text, p_score int, p_kicks int, p_perfects int) returns table(id uuid, rank bigint)` | In one transaction: lock the run `for update`; check it exists (`CS404` → 404), is not submitted (`CS409` → 409), age ≤ 10 min and `elapsed ≥ kicks × 600 ms` (`CS422` → 422); insert the score with `elapsed_ms = now() − started_at`; set `is_submitted = true`; return the new id and its rank among non-deleted scores | see left |

Rank = `1 + count(*) of non-deleted scores with (score > mine) or (score = mine and created_at < mine)`.

## 6. Triggers
- `set_updated_at` (`before update`, every table): `new.updated_at = now()`.

## 7. Scheduled cleanup
`pg_cron` job `cleanup_sipa` daily at 03:00 Asia/Manila: delete `sipa_runs` older than 7 days **that have no score**, and `rate_limits` older than 1 day. (Local stack: run manually; it's not needed for tests.)

## 8. Seed data (`supabase/seed.sql`, local only)
Five demo scores with nicknames `Demo 1` … `Demo 5`, so the leaderboard isn't empty while developing. Never run on staging or production.

## 9. Migrations

| File | Contents | Task |
|---|---|---|
| `20261117000100_create_set_updated_at.sql` | `set_updated_at()` function | T-DB-01 |
| `20261117000200_create_sipa_tables.sql` | `sipa_runs`, `sipa_scores`, `rate_limits`, indexes, RLS on, triggers, grants revoked from `anon`/`authenticated` | T-DB-01 |
| `20261117000300_create_sipa_functions.sql` | `check_rate_limit`, `start_sipa_run`, `submit_sipa_score`, `sipa_leaderboard` view, grants to `service_role` | T-DB-02 |
| `20261117000400_schedule_cleanup.sql` | `pg_cron` job (guarded: skips if extension missing) | T-DB-02 |

Rules (every migration):
- Enable RLS in the same migration that creates a table.
- `revoke all on <table> from anon, authenticated;`
- Add the `set_updated_at` trigger.
- A pgTAP test in `supabase/tests/` for every function and constraint added.
- Never edit a migration that is already on `development`; add a new one.

## 10. pgTAP tests (`supabase/tests/sipa.test.sql`)

| ID | Test |
|---|---|
| TC-DB-01 | RLS is enabled on all three tables; `anon` can't select from them or the view |
| TC-DB-02 | `submit_sipa_score` inserts once; a second call for the same run raises `CS409` |
| TC-DB-03 | A run older than 10 minutes raises `CS422` |
| TC-DB-04 | `kicks × 600 ms` greater than elapsed raises `CS422` |
| TC-DB-05 | `score ≠ kicks + perfects` violates the check constraint |
| TC-DB-06 | Rank is correct with ties (earlier submission ranks higher) |
| TC-DB-07 | `check_rate_limit` returns `false` on the (max + 1)th call in the window |
| TC-DB-08 | Soft-deleted scores are not in `sipa_leaderboard` |

> The run is **not** tied to the client hash on submit: phones on mobile data can change IP during a round. The client hash is used only for rate limits.
