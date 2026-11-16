# Test Plan

| Field | Value |
|---|---|
| SDLC phase | Testing |
| Owner | Carlo (UAT) · each task owner writes their tests |
| Status | Draft v0.2 |
| Related | [product-requirements.md](../01-requirements/product-requirements.md), [sipa-engine-design §7](../02-design/sipa-engine-design.md#7-tests-enginetestts), [database-design §10](../02-design/database-design.md#10-pgtap-tests-supabasetestssipatestsql), [api-design §7](../02-design/api-design.md#7-tests-supabasefunctionsapiapitestts-deno) |

---

## 1. Test levels and tools

| Level | Tool | Runs | Where |
|---|---|---|---|
| Unit | Vitest | engine, schemas, hooks | `npm test`, CI |
| Component | Vitest + React Testing Library + happy-dom | sections, form, Laro visibility | `npm test`, CI |
| Content | Vitest | `officeContentSchema.parse(office.json)` | `npm test`, CI |
| Database | pgTAP (`supabase test db`) | tables, RLS, SQL functions | `npm run db:test`, CI `backend` job |
| API | Deno test against the local stack | Edge Function routes, middleware | `npm run fn:test`, CI `backend` job |
| Static | ESLint (incl. `jsx-a11y`), `tsc --noEmit` | everything | `npm run check`, CI |
| Build | `vite build` + bundle size report | everything | CI |
| Preview check | Manual, on the PR's Vercel preview | the changed section | Reviewer, every PR |
| Smoke | Manual checklist (§4) | staging, then production | T-QA-01 (staging), T-QA-02 (production), after the hotfix |
| Audit | Lighthouse (mobile), keyboard-only pass | staging URL | T-QA-01 |

## 2. Minimum coverage

- Every acceptance criterion marked "test" in §3 has an automated test.
- The Sipa engine: every row of sipa-engine-design §7.
- Database: every row of database-design §10. API: every row of api-design §7.
- No coverage percentage gate; the CI gate is "all tests pass" (Blueprint: tests must pass on every PR before merge).

## 3. Key test cases

### 3.1 Content
| ID | Case | AC |
|---|---|---|
| TC-CONT-01 | `office.json` parses with `officeContentSchema` | NFR-CONT-01 |
| TC-CONT-02 | No string in `office.json` matches a PH mobile number pattern (`09\d{9}` or `+639\d{9}`) | NFR-CONT-02 |

### 3.2 Layout and navigation
| ID | Case | AC |
|---|---|---|
| TC-NAV-01 | Header renders one link per `nav` item (test with a 6-item fixture) | AC-NAV-05 |
| TC-NAV-02 | Menu button has `aria-expanded`, opens the menu, choosing a link closes it | AC-NAV-02 |
| TC-NAV-03 | Unknown route renders the 404 page with a link to `/` | AC-NAV-04 |

### 3.3 Sections
| ID | Case | AC |
|---|---|---|
| TC-ABOUT-01 | Stat tiles hidden when any value is `[#]`, shown when all are numbers | AC-ABOUT-02 |
| TC-SVC-01 | Unknown icon name renders the fallback icon | AC-SVC-01 |
| TC-LARO-01 | With `VITE_SABONG_URL=https://x.test` the Sabong link has `target="_blank"` and `rel="noopener noreferrer"` | AC-LARO-02 |
| TC-LARO-02 | With it empty or `http://…` the Sabong card is absent | AC-LARO-03 |
| TC-LARO-03 | Sabong card shows the "No betting, no real money" text | AC-LARO-04 |
| TC-CONTACT-01 | Invalid email shows an inline error with `aria-invalid="true"` | AC-CONTACT-02 |
| TC-CONTACT-02 | Valid submit clears the fields and shows the toast; `fetch` is never called | AC-CONTACT-03 |

### 3.4 Sipa
| ID | Case | AC |
|---|---|---|
| TC-SIPA-01…09 | Engine tests listed in sipa-engine-design §7 | AC-SIPA-01…03, 05 |
| TC-SIPA-10 | `useBestScore` returns 0 and does not throw when `localStorage` throws | AC-SIPA-04 |
| TC-SIPA-11 | Unmounting `SipaGame` calls `cancelAnimationFrame` and removes the keydown listener | AC-SIPA-06 |

### 3.5 Leaderboard (frontend, API mocked with MSW or a mocked Axios adapter)
| ID | Case | AC |
|---|---|---|
| TC-LEAD-01 | Panel shows 10 skeleton rows while loading, then rows in rank order | AC-LEAD-01 |
| TC-LEAD-02 | API error shows "Leaderboard unavailable" and Retry refetches | AC-LEAD-02 |
| TC-LEAD-03 | Nickname "a" shows the inline error without calling the API | AC-LEAD-03 |
| TC-LEAD-04 | 422 `errors.nickname` is shown under the field (`setError`) | AC-LEAD-03, 08 |
| TC-LEAD-05 | 201 shows "You're #4!" and refetches the leaderboard | AC-LEAD-04 |
| TC-LEAD-06 | 429 shows a toast with the server message | AC-LEAD-07 |
| TC-LEAD-07 | Run start failed → over panel shows the offline message, no form | AC-LEAD-09 |
| TC-LEAD-08 | Nickname is remembered in `playerStore` after a successful submit | FR-LEAD-03 |

### 3.6 Database and API
TC-DB-01…08 ([database-design §10](../02-design/database-design.md#10-pgtap-tests-supabasetestssipatestsql)) and TC-API-01…10 ([api-design §7](../02-design/api-design.md#7-tests-supabasefunctionsapiapitestts-deno)).

## 4. Smoke tests

Run on a laptop (Chrome) **and** a phone, first on **staging** (T-QA-01), then on **production** on Day 3 (T-QA-02). Each failure on staging becomes a `fix/…` PR into `development`; on production, a `hotfix/…` PR into `main`.

| # | Step | Expected | Req |
|---|---|---|---|
| S1 | Open the production URL | Hero visible, no console errors | FR-HERO-01, NFR-GIT-07 |
| S2 | Click each nav link | Scrolls to the section; header stays | AC-NAV-01 |
| S3 | Phone: open the menu, pick Contact | Menu closes, page at Contact | AC-NAV-02 |
| S4 | Press Tab from the top | Skip link first, focus visible everywhere | NFR-A11Y-02 |
| S5 | Services at 1280 px and 390 px | 4 columns / 1 column, no sideways scroll | AC-SVC-02, NFR-RESP-01 |
| S6 | Click Play Sipa | `/laro/sipa` opens without a full reload | AC-LARO-01 |
| S7 | Refresh `/laro/sipa` | Game page, not a 404 | AC-NAV-03 |
| S8 | Play with keyboard until game over | Score, perfect, misses, timer, best all work; page doesn't scroll | AC-SIPA-01…04, 07 |
| S9 | Phone: play with touch buttons | Moves and kicks; buttons easy to hit | AC-SIPA-08 |
| S10 | Switch tab while playing, come back | Game is paused | AC-SIPA-05 |
| S11 | Click Back to site | Home; CPU idle (no loop) | AC-SIPA-06 |
| S12 | Sabong card (if shown) | Opens Sabong in a new tab | AC-LARO-02 |
| S13 | Submit an empty contact form, then a valid one | Inline errors, then toast and cleared form | AC-CONTACT-02, 03 |
| S14 | Open `/nope` | 404 with link home | AC-NAV-04 |
| S15 | Response headers (DevTools → Network → document) | Security headers present | NFR-SEC-04 |
| S16 | Lighthouse mobile on `/` | Performance ≥ 90, Accessibility ≥ 95 | NFR-PERF-01, NFR-A11Y-01 |
| S17 | Open `<API>/health` | `status: ok`, version = the deployed SHA | NFR-GIT-07 |
| S18 | Sipa page: Top 10 loads | Rows in order (or "No scores yet") | AC-LEAD-01 |
| S19 | Finish a round, submit "Smoke Test" | "You're #N" and the row appears highlighted | AC-LEAD-04 |
| S20 | Submit the same round again (DevTools → replay request) | 409 | AC-LEAD-05 |
| S21 | DevTools offline, start a round | Game plays; over panel shows the offline message | AC-LEAD-09, NFR-REL-01 |
| S22 | After the smoke test | Delete the "Smoke Test" rows in the Supabase dashboard (set `deleted_at`) | — |

## 5. PR review checklist

Anyone can review; you don't need to be a developer. If any line fails, choose **Request changes** and say which line.

**Names (NFR-GIT-01, 02)**
- [ ] Branch is `feat/…`, `fix/…`, `chore/…`, `release/…` or `hotfix/…`, lowercase with hyphens, and matches the task in tasks.md.
- [ ] The PR's base is `development` (only release PRs target `staging`/`main`; only hotfixes target `main`).
- [ ] PR title and every commit look like `type(scope): summary` (`feat fix style refactor chore docs test`).
- [ ] The description lists the task ID, requirement IDs and `Closes #…`.

**Scope**
- [ ] The PR does one task. No unrelated files (`.env`, `dist`, formatting of other people's files).
- [ ] Only the owner's paths changed (tasks.md "Team & ownership"); `office.json` changes only the owner's keys.

**It works**
- [ ] CI is green. Open the Vercel preview link.
- [ ] Check the task's acceptance criteria on the preview, on a wide and a narrow window.
- [ ] Copy comes from `office.json`; no real phone numbers, officials' names or city seal.
- [ ] Keyboard: Tab reaches everything new, focus is visible.

**Before approving**
- [ ] Leave at least one comment (a question or suggestion is fine).
- [ ] Approve. **Don't merge your own PR**; the Maintainer (or you, if the Maintainer wrote it) merges with a merge commit.

## 6. SDLC testing stages (Blueprint)

| Stage | When | Who | Pass when |
|---|---|---|---|
| Alpha | After `development → staging` (T-QA-01) | the team | Smoke test S1–S22 pass on staging |
| Beta | Before Day 3, on staging | trainer or other teams (process owners) | No blocker found |
| UAT | Before Day 3, on staging | Carlo (product owner) | All Must ACs pass → "Testing" row signed in README |
| Production check | Day 3 after `staging → main` (T-QA-02) and after the hotfix | everyone | S1–S22 pass on production → Certificate of Acceptance row signed |
