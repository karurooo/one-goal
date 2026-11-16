# API Design (Supabase Edge Function)

| Field | Value |
|---|---|
| SDLC phase | Design |
| Status | Draft v0.2 |
| Owner | Carlo (game track) |
| Baseline | Blueprint "API Versioning", "Backend API Guidelines", "Backend Validation Standards", "API Integration", "CORS Configuration", "Rate Limiting" |
| Implements | FR-LEAD-01 … FR-LEAD-05, NFR-SEC-05 … 08, NFR-REL-01, NFR-REL-02 |
| Related | [database-design.md](./database-design.md), [architecture.md](./architecture.md) |

---

## 1. Base path and versioning

One Edge Function named **`api`** (ADR-07), a Hono app with `basePath('/api/v1')`:

| Environment | Base URL (`VITE_API_URL`) |
|---|---|
| Local | `http://127.0.0.1:54321/functions/v1/api/api/v1`* |
| Staging | `https://<staging-ref>.supabase.co/functions/v1/api/api/v1` |
| Production | `https://<prod-ref>.supabase.co/functions/v1/api/api/v1` |

\* Supabase serves a function at `/functions/v1/<function-name>` and passes the full path to it, so the function name `api` appears before our own `/api/v1` prefix. `/functions/v1/` is Supabase's platform version; **`/api/v1/` is ours** (Blueprint "API Versioning"). A breaking change goes to `/api/v2/` in the same function.

| Domain | Base path |
|---|---|
| Sipa | `/api/v1/sipa` |
| Health | `/api/v1/health` |

`supabase/config.toml`: `[functions.api] verify_jwt = false` (public endpoints, no accounts in v1.0.0). Every check is done by our middleware.

## 2. Response envelope (mandatory)

`_shared/http/response.ts` is the equivalent of the Laravel `ApiResponse` trait.

| Response type | Structure | HTTP codes |
|---|---|---|
| Success | `{ data: T, message: string, errors: null }` | 200, 201 |
| Error | `{ data: null, message: string, errors: Record<string, string[]> \| null }` | 400, 404, 409, 422, 429, 500 |

```ts
export const ok = <T>(c: Context, data: T, message = 'OK', status: 200 | 201 = 200) =>
  c.json({ data, message, errors: null }, status);
export const fail = (c: Context, status: ErrorStatus, message: string, errors: FieldErrors | null = null) =>
  c.json({ data: null, message, errors }, status);
```

- Never return raw rows: services return **resources** (`toLeaderboardEntry(row)`), the API Resource equivalent.
- `app.onError` logs the real error with `console.error` (visible in Supabase logs) and returns `500 { message: "Something went wrong. Please try again." }`. No SQL, stack or table names in responses (NFR-SEC-07).
- `app.notFound` → `404 { message: "Not found" }`.

## 3. Internal structure (Laravel layers → Hono)

| Laravel | Here | Rule |
|---|---|---|
| `routes/api.php` | `api/routes.ts` | Route → controller method only |
| Middleware | `api/middleware/` | `cors`, `clientId`, `rateLimit(action, max, window)` |
| Form Request | `_shared/schemas/sipa.ts` (Zod) | Parsed in the controller with `safeParse`; failures → 422 with field errors |
| Controller | `api/controllers/sipaController.ts` | Thin: parse → service → envelope |
| Service | `api/services/sipaService.ts` | Business rules, maps SQL errors to HTTP errors |
| Repository | `api/repositories/sipaRepository.ts` | The only file that calls `supabase.from()` / `supabase.rpc()` |
| `DB::transaction()` | SQL function `submit_sipa_score` | Called once per submit |
| API Resource | `api/resources/sipaResource.ts` | Output shape only |

The service-role client is created once in `api/lib/supabase.ts` from `Deno.env.get('SUPABASE_URL')` and `Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')` (both provided by Supabase; never in the repo).

## 4. Middleware

### 4.1 CORS (NFR-SEC-06)
Allowed origins come from the `ALLOWED_ORIGINS` function secret (comma-separated), plus one pattern for Vercel previews of this project:

| Environment | `ALLOWED_ORIGINS` |
|---|---|
| Local | `http://localhost:5173` |
| Staging | `https://staging-one-goal.vercel.app,https://one-goal-git-development-<team>.vercel.app` + preview pattern `^https://one-goal-[a-z0-9-]+-<team>\.vercel\.app$` |
| Production | `https://one-goal.vercel.app` |

Methods `GET, POST, OPTIONS`; headers `Content-Type`; no credentials (Blueprint: `withCredentials: false`). Requests from other origins get no CORS headers (the browser blocks them).

### 4.2 Client id (NFR-SEC-08)
`clientId` = `sha256(SALT + first IP in x-forwarded-for)` as hex, stored on the context. `SALT` is the `CLIENT_HASH_SALT` secret. The raw IP is never stored or logged.

### 4.3 Rate limits (AC-LEAD-07)
`rateLimit(action, max, window)` calls `check_rate_limit()`. When it returns `false`: `429`, header `Retry-After: 600`, message "Too many tries. Please wait a few minutes."

| Route | Action | Max per 10 min |
|---|---|---|
| `POST /sipa/runs` | `run_start` | 30 |
| `POST /sipa/runs/{id}/score` | `score_submit` | 10 |
| `GET /sipa/leaderboard` | — | not limited (cached 15 s, §5.1) |

## 5. Endpoints

### 5.1 `GET /api/v1/sipa/leaderboard` (FR-LEAD-01)
Top 10, not deleted.

`200`
```json
{ "data": [ { "rank": 1, "nickname": "Juan", "score": 58, "created_at": "2026-11-20T09:12:44Z" } ],
  "message": "OK", "errors": null }
```
Header `Cache-Control: public, max-age=15`. Empty board → `data: []`.

### 5.2 `POST /api/v1/sipa/runs` (FR-LEAD-04)
Starts a round. No body.

`201` → `{ "data": { "run_id": "6f1c…", "started_at": "2026-11-20T09:11:40Z" }, "message": "Run started", "errors": null }`
`429` → rate limited.

### 5.3 `POST /api/v1/sipa/runs/{run_id}/score` (FR-LEAD-02, 04, 05)
Request (Zod `submitScoreSchema`, shared with the frontend):
```json
{ "nickname": "Juan", "score": 58, "kicks": 40, "perfects": 18 }
```

| Field | Zod | Mirrors DB |
|---|---|---|
| `run_id` (path) | `z.string().uuid()` | `uuid` |
| `nickname` | `z.string().trim().transform(collapseSpaces).pipe(z.string().min(2, 'At least 2 characters').max(20, 'At most 20 characters').regex(/^[A-Za-z0-9 ._-]+$/, 'Letters, numbers, spaces, . - _ only'))` + blocklist refine | `varchar(20)` + check |
| `score` | `z.number().int().min(1).max(180)` | `smallint` 1–180 |
| `kicks` | `z.number().int().min(1).max(90)` | `smallint` 1–90 |
| `perfects` | `z.number().int().min(0)` | `smallint` ≥ 0 |
| object | `.refine(v => v.perfects <= v.kicks)`, `.refine(v => v.score === v.kicks + v.perfects)` → error key `score` | table checks |

Responses:

| Status | When | Body |
|---|---|---|
| `201` | Saved | `{ data: { id, rank, nickname, score }, message: "Score saved" }` |
| `404` | Unknown `run_id` (`CS404`) | `message: "Round not found"` |
| `409` | Already submitted (`CS409`) | `message: "This round was already submitted"` |
| `422` | Zod failed, blocklist, or plausibility (`CS422`) | `message: "Validation failed"`, `errors: { "nickname": ["Please choose another nickname."] }` or `{ "score": ["Score rejected"] }` |
| `429` | Rate limit | see §4.3 |

### 5.4 `GET /api/v1/health`
`200 { data: { status: "ok", version: "<git sha>" } }`. Used by the smoke test and the deploy workflow.

## 6. Frontend client (Blueprint "API Integration")

`src/lib/axios.ts`: one instance.
- `baseURL: env.apiUrl`, `timeout: 8000`, `withCredentials: false`, `headers: { 'Content-Type': 'application/json' }`.
- No auth interceptor (no accounts in v1.0.0).
- Response interceptor: returns `response.data` (the envelope); on error, normalizes to `ApiError { status, message, errors }`.
- Global handling: **429** → toast with the message; **500 / network / timeout** → toast "Leaderboard is unavailable right now." **422** is *not* toasted; the form maps `errors` with `setError` (unknown keys → `root`). **404/409** → toast with the server message.

`src/features/laro/api/`:

| File | Exports |
|---|---|
| `sipaApi.ts` | `getLeaderboard()`, `startRun()`, `submitScore(runId, body)` |
| `queries.ts` | `useLeaderboard()` (key `['sipa','leaderboard']`, `staleTime` 30 s, `retry` 1), `useStartRun()`, `useSubmitScore()` (on success: invalidate the leaderboard) |

## 7. Tests (`supabase/functions/api/api.test.ts`, Deno)

| ID | Test |
|---|---|
| TC-API-01 | `GET /sipa/leaderboard` returns the envelope with ≤ 10 rows sorted by rank |
| TC-API-02 | `POST /sipa/runs` returns 201 and a uuid |
| TC-API-03 | Valid submit after enough elapsed time returns 201 with a rank |
| TC-API-04 | Second submit for the same run returns 409 |
| TC-API-05 | Nickname `"a"` returns 422 with `errors.nickname` |
| TC-API-06 | `score ≠ kicks + perfects` returns 422 with `errors.score` |
| TC-API-07 | Blocked word returns 422 "Please choose another nickname." |
| TC-API-08 | 11th submit in 10 minutes returns 429 with `Retry-After` |
| TC-API-09 | Request from a non-allowed origin gets no `Access-Control-Allow-Origin` header |
| TC-API-10 | A thrown database error returns 500 without SQL text |

Tests run against the local stack (`supabase start` + `supabase functions serve`) in CI.
