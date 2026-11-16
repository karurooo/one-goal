# Product Requirements Specification

| Field | Value |
|---|---|
| Project | **CSO Butuan site**: one-page website for the City Sports Office (practice site) |
| SDLC phase | Requirements Gathering (Waterfall, per ICT Blueprint 2026) |
| Status | Draft v0.1, for review |
| Owner | Carlo S. Gaballo · Developers: Carlo, Cliff, Patrick · Contributor/reviewer: Ramil (when available) |
| Context | City Government of Butuan "Git & GitHub" training. **Development: now until Day 3.** **Day 3 "Launch Day": deployment and release only** (staging → production, tag, hotfix) |
| Stack | ICT Information System Blueprint 2026, with **Supabase replacing Laravel** |
| Related | [sipa-game-design.md](./sipa-game-design.md), [../02-design/architecture.md](../02-design/architecture.md), [../02-design/database-design.md](../02-design/database-design.md), [../02-design/api-design.md](../02-design/api-design.md), [../02-design/ui-ux-design.md](../02-design/ui-ux-design.md) |

---

## 1. Vision

A clean, fast, one-page website for the **City Sports Office** that tells residents what the office does, which programs and facilities it runs, and how to reach it. A **Laro ng Lahi** section lets visitors play **Sipa**, a traditional Filipino game, right on the site and post their score to a public **top-10 leaderboard** (stored in Supabase). It also links to the team's **Sabong (demo)** fighting game.

The site is a **practice project** for the Git & GitHub training. The product is graded on its **Git history** as much as on the site itself, so the process requirements (§6.7) are first-class requirements.

### 1.1 How we build it: two repositories

| Repo | Who | Purpose |
|---|---|---|
| **Reference build** (`one-goal`, private) | Carlo alone | Build the whole system from these specs first, so every task is proven to work and the specs match real code |
| **Team build** (graded) | Carlo, Cliff, Patrick, Ramil | Rebuild the same system task by task with the prepared branches, commits, PR titles and descriptions, reviews and merges, plus a planned merge conflict and a hotfix |

Both repos follow the same specs, task list and Git rules. The reference build stays private until grading is done.

## 2. Goals and non-goals

### Goals
- G1. Finish development before Day 3, then release the site to production on Launch Day: tag **v1.0.0** and a working live Vercel URL.
- G2. A Git history that earns full marks: Conventional Branch names, Conventional Commits, every merge through a reviewed PR, a cleanly resolved conflict, a v1.0.0 tag and a correctly delivered hotfix.
- G3. Follow the ICT Information System Blueprint 2026: frontend stack and layout (React + TypeScript + Vite + shadcn/ui + Tailwind, Axios, TanStack Query, Zustand, RHF + Zod, atomic design), backend guidelines (`/api/v1/`, response envelope, thin controllers + services, validation, rate limiting, CORS) with **Supabase in place of Laravel**, Git flow `feature → development → staging → main`, and the Waterfall SDLC outputs.
- G4. A small, fun Sipa game that works with keyboard and touch, with a fair public leaderboard.

### Non-goals (explicitly out of scope)
- NG1. **Not an official City Government of Butuan website.** No city seal or logo, no real officials' names, no real phone numbers or personal emails.
- NG2. **The backend serves the Sipa leaderboard only.** No user accounts, no admin area, no login in v1.0.0. The contact form is not sent anywhere; it shows a confirmation toast only.
- NG6. **No personal data.** The leaderboard stores a nickname and a score, nothing else (no email, no real full name required). Moderation in v1.0.0 is done in the Supabase dashboard.
- NG3. **No real-money or betting mechanics** anywhere, including the Sabong link. The Sabong demo is a skill-based game with no betting.
- NG4. No CMS, no multi-language switch, no analytics or cookies in v1.0.0.
- NG5. No 3D or game engine for Sipa: plain 2D canvas only.

## 3. Users and roles

### 3.1 Site users

| User | Needs |
|---|---|
| Resident / parent | What programs exist, how to join a clinic, office hours and location |
| Athlete / coach | Delegation programs, facilities and how to request them |
| Event organizer | Facility list and the request rule |
| Casual visitor | A quick game (Sipa) |

### 3.2 Team roles (training)

The trainer's rules: teams of 4 take **one page section each** (header and hero, about and mandate, services, contact and footer), and roles **rotate every module**. Assignments: [tasks.md](../03-development/tasks.md#team--ownership).

| Role | Responsibility |
|---|---|
| **Maintainer** | Owns the repo settings for the module and merges approved PRs; keeps `development` green |
| **Reviewer** | Reads every PR in the module with the [review checklist](../04-testing/test-plan.md#5-pr-review-checklist), approves or requests changes |
| **Release Manager** | Tags and ships: keeps `CHANGELOG.md`, opens the release PRs (`development → staging`, `staging → main`), tags v1.0.0 and v1.0.1, opens the hotfix back-merges |
| Author | Anyone opening a PR. **Never merges their own PR.** |

## 4. Release plan

| Release | Content | When |
|---|---|---|
| Reference build | All v1.0.0 requirements, built by Carlo alone in the private reference repo | Now, before the team build |
| Team build | The same tasks rebuilt by the team in the graded repo, merged into `development`, then `staging` | After the reference build, before Day 3 |
| **v1.0.0** | All Must requirements; `staging → main`; live on Vercel; tagged on `main` | **Day 3, Launch Day** |
| **v1.0.1** | One hotfix (trainer's bug, or our prepared scenario): `hotfix/…` from `main` → one `fix:` commit → PR → tag | Day 3, when announced |
| v1.1 (after training) | Should/Could items not finished, real stats from the office | Optional |

Priority uses **MoSCoW** (M = Must, S = Should, C = Could, W = Won't in v1.0.0).

---

## 5. Functional requirements

Acceptance criteria use the **EARS** pattern ("WHEN … THE SYSTEM SHALL …"). Every requirement has an ID; tasks, PRs and tests reference these IDs.

### 5.1 Layout, navigation and routing (NAV)

| ID | Requirement | Pri | Release |
|---|---|---|---|
| FR-NAV-01 | A sticky header with the office name and links to each section | M | v1.0.0 |
| FR-NAV-02 | On narrow screens the links collapse into a menu button | M | v1.0.0 |
| FR-NAV-03 | Routes `/`, `/laro/sipa` and a 404 page | M | v1.0.0 |
| FR-NAV-04 | The nav items come from `office.json` (`nav`) | M | v1.0.0 |

**Acceptance criteria**
- AC-NAV-01: WHEN the user clicks a nav link THE SYSTEM SHALL scroll smoothly to that section, and the header SHALL stay visible.
- AC-NAV-02: WHEN the viewport is below 768 px THE SYSTEM SHALL show a menu button (with `aria-label="Open menu"` and `aria-expanded`), and choosing a link SHALL close the menu.
- AC-NAV-03: WHEN the user opens `/laro/sipa` directly or refreshes it on the live URL THE SYSTEM SHALL show the Sipa page (not a Vercel 404).
- AC-NAV-04: WHEN the user opens an unknown path THE SYSTEM SHALL show the 404 page with a link back to `/`.
- AC-NAV-05: WHEN an item is added to `nav` in `office.json` THE SYSTEM SHALL show it in the header without code changes.

### 5.2 Hero (HERO)

| ID | Requirement | Pri | Release |
|---|---|---|---|
| FR-HERO-01 | Headline, tagline and two calls to action ("See services", "Laro ng Lahi") | M | v1.0.0 |
| FR-HERO-02 | Court-line background and woven sipa ball illustration (decorative) | S | v1.0.0 |

- AC-HERO-01: WHEN the page loads THE SYSTEM SHALL show the headline and tagline from `office.json` (`hero`) above the fold on a 1280×720 and a 390×844 screen.
- AC-HERO-02: WHEN the user clicks a call to action THE SYSTEM SHALL scroll to `#services` or `#laro`.
- AC-HERO-03: Decorative SVGs SHALL have `aria-hidden="true"`.

### 5.3 About and mandate (ABOUT)

| ID | Requirement | Pri | Release |
|---|---|---|---|
| FR-ABOUT-01 | Intro paragraph and mandate list | M | v1.0.0 |
| FR-ABOUT-02 | Three stat tiles | S | v1.0.0 |

- AC-ABOUT-01: THE SYSTEM SHALL render the intro and each mandate item from `office.json` (`about`).
- AC-ABOUT-02: WHEN a stat value is the placeholder `[#]` THE SYSTEM SHALL hide the stat tiles (we never show invented numbers).

### 5.4 Services: programs and facilities (SVC)

| ID | Requirement | Pri | Release |
|---|---|---|---|
| FR-SVC-01 | A Services section with a card per program or service (icon, title, text) | M | v1.0.0 |
| FR-SVC-02 | A facilities list with the facility-request rule | M | v1.0.0 |

- AC-SVC-01: THE SYSTEM SHALL render one card per entry in `services`; the `icon` name SHALL map to a lucide-react icon, falling back to a default icon for unknown names.
- AC-SVC-02: THE SYSTEM SHALL lay the cards out in 4 columns at ≥ 1200 px, 2 at ≥ 640 px and 1 below.
- AC-SVC-03: THE SYSTEM SHALL show every `facilities.items` entry and the `facilities.note`.

### 5.5 Laro ng Lahi (LARO)

| ID | Requirement | Pri | Release |
|---|---|---|---|
| FR-LARO-01 | A Sipa card that routes to `/laro/sipa` | M | v1.0.0 |
| FR-LARO-02 | A Sabong (demo) card that opens the Sabong game in a new tab | S | v1.0.0 |
| FR-LARO-03 | The Sabong card states "No betting, no real money" | M | v1.0.0 |

- AC-LARO-01: WHEN the user clicks "Play Sipa" THE SYSTEM SHALL navigate client-side to `/laro/sipa` (no full page reload).
- AC-LARO-02: WHEN `VITE_SABONG_URL` is set THE SYSTEM SHALL render the Sabong card with a link that has `target="_blank"` and `rel="noopener noreferrer"`.
- AC-LARO-03: WHEN `VITE_SABONG_URL` is empty or not an `https://` URL THE SYSTEM SHALL NOT render the Sabong card, and the Sipa card SHALL fill the row.
- AC-LARO-04: The Sabong card SHALL show the "No betting, no real money" line from `office.json` whenever the card is shown.

### 5.6 Sipa mini-game (SIPA)

Full rules and numbers: [sipa-game-design.md](./sipa-game-design.md).

| ID | Requirement | Pri | Release |
|---|---|---|---|
| FR-SIPA-01 | A playable Sipa game on `/laro/sipa` | M | v1.0.0 |
| FR-SIPA-02 | Keyboard and touch controls | M | v1.0.0 |
| FR-SIPA-03 | Score, perfect bonus, misses, 60-second timer | M | v1.0.0 |
| FR-SIPA-04 | Best score saved on the device | S | v1.0.0 |
| FR-SIPA-05 | Pause and resume | S | v1.0.0 |
| FR-SIPA-06 | Game-over panel with "Play again" and "Back to site" | M | v1.0.0 |

- AC-SIPA-01: WHEN the user presses Kick while the ball is in the kick zone THE SYSTEM SHALL send the ball up and add 1 point (2 points for a perfect kick, with a "PERFECT +2" pop-up).
- AC-SIPA-02: WHEN the user presses Kick while the ball is outside the kick zone THE SYSTEM SHALL NOT change the score or the ball.
- AC-SIPA-03: WHEN the ball touches the ground THE SYSTEM SHALL count a miss and serve a new ball; WHEN misses reach 3 or the timer reaches 0 THE SYSTEM SHALL end the round.
- AC-SIPA-04: WHEN a round ends with a score above the stored best THE SYSTEM SHALL save it and show "New best!"; IF storage is unavailable THE SYSTEM SHALL keep playing without a best score and without an error.
- AC-SIPA-05: WHEN the user presses P/Esc, the Pause button, or the tab becomes hidden THE SYSTEM SHALL pause the game and the timer.
- AC-SIPA-06: WHEN the user leaves `/laro/sipa` THE SYSTEM SHALL stop the animation loop and remove its key listeners.
- AC-SIPA-07: WHILE the game page is open, Space and arrow keys SHALL NOT scroll the page.
- AC-SIPA-08: On a touch screen THE SYSTEM SHALL show ◀ ▶ buttons and a large SIPA! button, each at least 48×48 px.

### 5.7 Sipa leaderboard (LEAD)

Backend: Supabase Postgres + one Edge Function (`/api/v1/sipa/...`). Design: [database-design.md](../02-design/database-design.md), [api-design.md](../02-design/api-design.md).

| ID | Requirement | Pri | Release |
|---|---|---|---|
| FR-LEAD-01 | Show the top 10 scores (rank, nickname, score, date) on the Sipa page | M | v1.0.0 |
| FR-LEAD-02 | After a round, the player can submit the score under a nickname | M | v1.0.0 |
| FR-LEAD-03 | Remember the last nickname on this device | S | v1.0.0 |
| FR-LEAD-04 | The server accepts only plausible scores, once per round, and limits how often one device can submit | M | v1.0.0 |
| FR-LEAD-05 | Show the player's rank after a successful submit | S | v1.0.0 |

- AC-LEAD-01: WHEN the Sipa page opens THE SYSTEM SHALL show the top 10 sorted by score (highest first), ties broken by the earlier submission.
- AC-LEAD-02: WHEN the leaderboard cannot be loaded within 8 s or the API errors THE SYSTEM SHALL show "Leaderboard unavailable" with **Retry**, and the game SHALL stay fully playable.
- AC-LEAD-03: WHEN a round ends with a score above 0 THE SYSTEM SHALL show a nickname field and **Submit score**. The nickname is 2–20 characters of letters, numbers, spaces, `.`, `-` or `_`. Invalid input shows an inline error (Zod); a 422 from the server is mapped to the field with `setError`.
- AC-LEAD-04: WHEN the score is accepted THE SYSTEM SHALL show "You're #N" (or "Saved! Not in the top 10 yet."), disable the form, and refresh the top 10.
- AC-LEAD-05: WHEN the same round is submitted twice THE SYSTEM SHALL reject the second with 409 and keep the first.
- AC-LEAD-06: THE SYSTEM SHALL reject with 422 any score where `score ≠ kicks + perfects`, `perfects > kicks`, `kicks > 90`, or the round's server-side elapsed time is shorter than `kicks × 0.6 s` or longer than 10 minutes.
- AC-LEAD-07: WHEN one device starts more than 30 rounds or submits more than 10 scores in 10 minutes THE SYSTEM SHALL answer 429 with `Retry-After`, shown as a toast.
- AC-LEAD-08: WHEN a nickname contains a blocked word THE SYSTEM SHALL answer 422 "Please choose another nickname."
- AC-LEAD-09: WHEN the player was offline at round start THE SYSTEM SHALL show "Score can't be submitted (offline)" instead of the form.

### 5.8 Contact and footer (CONTACT)

| ID | Requirement | Pri | Release |
|---|---|---|---|
| FR-CONTACT-01 | Address, office hours, phone and email (placeholders) | M | v1.0.0 |
| FR-CONTACT-02 | A contact form (name, email, message) with validation | M | v1.0.0 |
| FR-CONTACT-03 | Footer with office name and practice-site disclaimer | M | v1.0.0 |

- AC-CONTACT-01: THE SYSTEM SHALL render the contact details from `office.json` (`contact`).
- AC-CONTACT-02: WHEN the user submits with an empty name, an invalid email, or a message under 10 characters THE SYSTEM SHALL show an inline error under each invalid field (`aria-invalid`, `aria-describedby`) and SHALL NOT clear the form.
- AC-CONTACT-03: WHEN the user submits a valid form THE SYSTEM SHALL clear it and show a toast: "Salamat! This is a practice site, so nothing was sent." No network request is made.
- AC-CONTACT-04: THE SYSTEM SHALL show the footer disclaimer on every route.

---

## 6. Non-functional requirements

### 6.1 Performance (PERF)
| ID | Requirement |
|---|---|
| NFR-PERF-01 | Lighthouse (mobile) Performance ≥ 90 on `/` of the production URL |
| NFR-PERF-02 | Initial JS ≤ 200 KB gzipped; the Sipa game is a lazy-loaded route chunk ≤ 30 KB gzipped |
| NFR-PERF-03 | The Sipa game runs at 60 fps on a mid-range phone; the loop stops when the page is hidden or left |

### 6.2 Accessibility (A11Y)
| ID | Requirement |
|---|---|
| NFR-A11Y-01 | Lighthouse Accessibility ≥ 95; text contrast ≥ 4.5:1 |
| NFR-A11Y-02 | Everything works with the keyboard; visible focus rings; a "Skip to content" link |
| NFR-A11Y-03 | Real `<button>`, `<a href>`, labelled inputs; icon-only buttons have `aria-label` |
| NFR-A11Y-04 | `prefers-reduced-motion`: no smooth scroll and no screen shake or pop-up bounce in Sipa |

### 6.3 Responsiveness (RESP)
| ID | Requirement |
|---|---|
| NFR-RESP-01 | Works from 360 px to 1920 px wide without horizontal scrolling |
| NFR-RESP-02 | Touch targets ≥ 44×44 px (48 px in the game) |

### 6.4 Security and privacy (SEC)
| ID | Requirement |
|---|---|
| NFR-SEC-01 | No secrets in the repo, the bundle or Vercel env vars. The service role key exists only as a Supabase Edge Function secret. The frontend gets only public values (`VITE_API_URL`, `VITE_SABONG_URL`) |
| NFR-SEC-02 | External links use `rel="noopener noreferrer"` |
| NFR-SEC-03 | No `dangerouslySetInnerHTML`; form input is never sent anywhere or stored |
| NFR-SEC-04 | Security headers on Vercel: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, `Content-Security-Policy` (see deployment §3) |
| NFR-SEC-05 | Row Level Security is enabled on every table; the browser never talks to tables directly (all access through the Edge Function) |
| NFR-SEC-06 | CORS on the Edge Function allows only the site's own origins (localhost:5173, the Vercel preview/staging/production domains) |
| NFR-SEC-07 | Errors never expose internal details (SQL errors, stack traces); the Blueprint envelope is used for every response |
| NFR-SEC-08 | Client identity for rate limits is a salted SHA-256 hash of the IP address; raw IPs are not stored |

### 6.5 Reliability (REL)
| ID | Requirement |
|---|---|
| NFR-REL-01 | The site and the Sipa game work when the API is down; only leaderboard features show an error state |
| NFR-REL-02 | API p95 response time ≤ 500 ms for the leaderboard read (Supabase region: Singapore, `ap-southeast-1`) |

### 6.6 Content (CONT)
| ID | Requirement |
|---|---|
| NFR-CONT-01 | All copy lives in `src/content/office.json`; components never hard-code copy except UI labels (e.g. "Send message") |
| NFR-CONT-02 | No city seal, no real officials' names, no real phone numbers; placeholders are marked (`[#]`, `(085) 000-0000`, `@example.com`) |
| NFR-CONT-03 | English with Filipino/Bisaya touches is fine (e.g. "Laro para sa tanan") |

### 6.7 Process: Git and release (GIT)

These are the training's grading criteria (100 points), written as requirements.

| ID | Requirement | Points | How we meet it |
|---|---|---|---|
| NFR-GIT-01 | Every branch name follows **Conventional Branch** (with the Blueprint's `feat/` and `fix/`, which Conventional Branch accepts as aliases) | 10 | conventions §4.1; each task lists its branch |
| NFR-GIT-02 | Every commit follows **Conventional Commits** | 20 | conventions §4.2; commitlint hook |
| NFR-GIT-03 | Every change moves `feature → development → staging → main` through reviewed PRs; nothing is pushed straight to `development`, `staging` or `main`; nobody merges their own PR | 20 | Branch protection (deployment §4) |
| NFR-GIT-04 | Merge conflicts are resolved cleanly (no conflict markers, build passes, both changes kept) | 10 | The planned conflict, [git-playbook §4](../03-development/git-playbook.md#4-the-planned-conflict) |
| NFR-GIT-05 | `main` is tagged **v1.0.0** (annotated) with a GitHub Release | 10 | git-playbook §5 |
| NFR-GIT-06 | The hotfix goes `hotfix/…` from `main` → one `fix:` commit → reviewed PR into `main` → tag `v1.0.1` → back-merged into `staging` and `development` | 10 | git-playbook §6 |
| NFR-GIT-07 | The live Vercel production URL works and serves the latest `main` | 20 | deployment §3, smoke test S1 |

---

## 7. Open questions

| # | Question | Owner | Default if unanswered |
|---|---|---|---|
| OQ-1 | Will the Sabong demo have a public URL by Day 3? | Carlo | Leave `VITE_SABONG_URL` empty; the card hides (AC-LARO-03) |
| OQ-2 | Can we get real (public) program names and stats from the City Sports Office? | Carlo | Keep placeholders; stat tiles hide |
| OQ-3 | What is the date of Day 3, and when must the team build be on `staging`? | Carlo | Team build on `staging` two days before Day 3 |
| OQ-4 | Which bug will the trainer ask us to hotfix? | — | Unknown until announced; we also prepare our own scenario ([git-playbook §6](../03-development/git-playbook.md#6-hotfix)) |
| OQ-5 | Is Ramil available for the team build? | Ramil | Cliff takes T-CONTACT-01, Patrick takes T-DOCS-01 |
| OQ-6 | Supabase free plan allows 2 active projects. Do we have room for `cso-staging` and `cso-production`? | Patrick | If not, staging uses the production project and the release PR is tested on the Vercel staging URL only |
| OQ-7 | Do we need a profanity list in Filipino/Bisaya for nicknames? | Carlo | Start with a short list in `supabase/functions/_shared/blocklist.ts`; moderation by deleting rows in the dashboard |
