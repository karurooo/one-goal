# UI/UX Design (Screens, Routes, Components, State)

| Field | Value |
|---|---|
| SDLC phase | Design |
| Status | Draft v0.1 |
| Owner | Carlo (design sign-off) · section owners per screen |
| Wireframes | **Low fidelity:** [https://claude.ai/artifact/WHErranaV8v7BWNBcaJoWP] · **High fidelity:** [https://claude.ai/artifact/RG62DnQctgqANdCcfAkvy7] |
| Related | [architecture.md](./architecture.md), [content-model.md](./content-model.md), [sipa-engine-design.md](./sipa-engine-design.md), [api-design.md](./api-design.md) |

---

## 1. Visual direction

**"Court day."** Bold, sporty, local: deep navy like a scoreboard, court green, and the gold of a rattan sipa ball. Court lines and the woven ball are the only illustration motif (our own SVGs; no photos of people, no city seal).

| Token | Value | Use |
|---|---|---|
| `--navy` | `#0b1f3a` | Header, hero, footer, dark cards, body text |
| `--court` | `#187563` | Eyebrows, icons, Sipa card (text-safe green) |
| `--court-bright` | `#1f8a70` | Game court floor and decoration only, never behind text |
| `--gold` | `#ffb703` | Primary buttons, ball, highlights (always with navy text) |
| `--paper` | `#f7f5ef` | Page background |
| `--sand` | `#eae6da` | Alternate section background |
| `--ink-2` | `#34445c` | Secondary text on light (9.0:1 on paper) |
| `--mist` | `#d7dde6` | Secondary text on navy (12:1) |
| `--line` | `#e4e0d4` | Card borders |
| Radius | 10 px buttons · 14–20 px cards | |
| Headings | **Archivo Black** (self-hosted, `@fontsource/archivo-black`) | h1 76/44 px desktop/mobile, h2 44/30 px |
| Body | **Inter** 400/500/600/700 (`@fontsource/inter`) | 15–19 px, line-height 1.5–1.65 |
| Eyebrow | Inter 700, 12–13 px, letter-spacing 0.12em, uppercase | Section labels |

Contrast check (WCAG): gold on navy 9.4:1 · navy on gold 9.4:1 · court `#187563` on paper 5.1:1 · white on court 5.6:1 · white on `#1f8a70` only 4.3:1, so that shade never carries text.

## 2. Routes and access

| Route | Page | Access | Data | Req |
|---|---|---|---|---|
| `/` | Home (one page, anchors `#home #about #services #laro #contact`) | Public | `office.json` | FR-NAV-01…04 |
| `/laro/sipa` | Sipa game (lazy) | Public | `laro`, localStorage best | FR-SIPA-* |
| `*` | 404 | Public | — | AC-NAV-04 |

No auth, no protected routes.

## 3. Screens

Each screen lists the wireframe artboards that show it.

### 3.1 Home, desktop (`Home desktop` · lo-fi `01`, hi-fi `Main`)
Order: SkipLink → SiteHeader (sticky) → Hero → About → Services (+ facilities band) → Laro ng Lahi → Contact → SiteFooter.

| Section | Layout ≥ 1024 px | Req |
|---|---|---|
| Header | Logo mark + "CSO BUTUAN" left; nav links right; 68 px tall; navy | FR-NAV-01 |
| Hero | 2 columns: eyebrow, headline, tagline, 2 CTAs / sipa ball art; court lines behind at 18% | FR-HERO-* |
| About | 2 columns: eyebrow, h2, intro, 3 stat tiles / "Our mandate" card with check list | FR-ABOUT-* |
| Services | 4-column card grid; navy facilities band with 2-column list and the request note | FR-SVC-* |
| Laro ng Lahi | 2 big cards: Sipa (court green) and Sabong DEMO (navy); helper line under | FR-LARO-* |
| Contact | 2 columns: details list / form card | FR-CONTACT-01/02 |
| Footer | Office name left, disclaimer right | FR-CONTACT-03 |

### 3.2 Home, mobile (`Home mobile` · lo-fi `02`, hi-fi `Mobile`)
Single column at 390 px. Header 60 px with menu button. Hero: ball art top right, full-width CTAs stacked. Stats 3 small tiles in a row. Service cards stacked. Laro cards stacked. Contact details then form.

### 3.3 Mobile menu open (lo-fi `03`, hi-fi `Mobile menu`)
shadcn `Sheet` from the right, full height, nav links 56 px tall, close button top right (`aria-label="Close menu"`). Focus is trapped while open; Esc closes; choosing a link closes and scrolls (AC-NAV-02).

### 3.4 Laro without Sabong (lo-fi `04`)
When `VITE_SABONG_URL` is empty the Sipa card spans the full row (AC-LARO-03).

### 3.5 Contact form states (lo-fi `05`, hi-fi `Contact states`)
Default · errors (inline red text under fields, red border, `aria-invalid`) · submitted (form cleared, Sonner toast bottom right on desktop, top center on mobile).

### 3.6 Sipa and leaderboard (lo-fi `06`–`09` and `11 · Leaderboard states`, hi-fi `06`–`09`)
Navy page, header with "Back to site", title, Best. HUD row (Score · Time · Misses) above a 16:9 canvas. Panels overlay the canvas centered for `ready`, `paused`, `over`. On touch devices ◀ ▶ and **SIPA!** sit under the canvas; the game works in portrait, landscape just gives a bigger court.

**Leaderboard panel (FR-LEAD-01):** at ≥ 1200 px a 300 px column to the right of the game (canvas max 860 px); below 1200 px it sits under the controls. Title "Top 10", rows `rank · nickname · score · date (e.g. "Nov 20")`, the player's new row highlighted in gold. States: loading (10 skeleton rows), empty ("No scores yet. Be the first!"), error ("Leaderboard unavailable" + **Retry**, AC-LEAD-02).

**Game-over panel (FR-LEAD-02…05):** score, kicks, perfects, best; then the nickname form (label "Nickname", hint "Shown publicly. Don't use your full name.", **Submit score**). After success the form is replaced by "You're #4!" or "Saved! Not in the top 10 yet." With score 0 there is no form; if the run couldn't start (offline) it shows "Score can't be submitted (offline)" (AC-LEAD-09).

### 3.7 404 (lo-fi `10`, hi-fi `404`)
Navy hero-style block: "Out of bounds." + "This page isn't on our court." + **Back to home**.

## 4. Component architecture (Atomic Design, Blueprint)

Global primitives in `src/components/ui/` (shadcn): button, card, badge, input, textarea, label, sonner, separator, sheet.

| Area | Atoms | Molecules | Organisms | Templates |
|---|---|---|---|---|
| `components/layout` | `SkipLink`, `LogoMark` | `NavLinks`, `MobileMenu` | `SiteHeader`, `SiteFooter` | `Section` (eyebrow + h2 + children, `id`, `scroll-margin-top`) |
| `components/common` | `SipaBallArt`, `CourtLines` | — | — | — |
| `features/hero` | — | `HeroActions` | `Hero` | — |
| `features/services` | `StatTile`, `CheckItem` | `ServiceCard`, `MandateCard`, `FacilitiesBand` | `About`, `Services` | — |
| `features/laro` | `DemoBadge`, `KeyHint`, `MissDots`, `RankBadge` | `GameCard`, `SipaHud`, `SipaPanel`, `TouchControls`, `LeaderboardList`, `NicknameForm` | `LaroSection`, `SipaGame`, `LeaderboardPanel` | — |
| `features/contact` | `DetailRow` | `ContactDetails`, `ContactForm` | `Contact` | — |

Each feature exports its public pieces from `src/features/<domain>/index.ts`. `HomePage` imports only from those index files.

## 5. State

| State | Where | Persistence |
|---|---|---|
| Mobile menu open | `useState` in `SiteHeader` | none |
| Contact form | React Hook Form | none (never stored) |
| Sipa game state | `useRef` in `useSipaLoop` | none |
| Sipa HUD snapshot | `useState`, throttled 10 Hz | none |
| Sipa best score | `useBestScore` | localStorage `cso.sipa.best.v1` (try/catch) |
| Reduced motion | `useReducedMotion` (matchMedia) | none |

| Leaderboard (server state) | TanStack Query `useLeaderboard` (`['sipa','leaderboard']`) | Query cache |
| Run id for the current round | `useRef` in `SipaGame` | none |
| Nickname | Zustand `playerStore` with `persist` | localStorage `cso.player.v1` (try/catch storage) |

Server state uses TanStack Query and client state uses Zustand, as the Blueprint requires. No `authStore`: no accounts in v1.0.0.

## 6. Forms

| Form | Fields | Schema | Rules |
|---|---|---|---|
| Contact | name, email, message | `contactSchema` in `features/contact/constants/contactSchema.ts` | name 2–80 chars; email valid; message 10–1000 chars |
| Nickname | nickname | `submitScoreSchema.pick({ nickname: true })` from `@schemas/sipa` (shared with the API) | 2–20 chars, letters, numbers, space, `. - _`; 422 errors mapped with `setError` |

- `useForm({ resolver: zodResolver(contactSchema), mode: 'onBlur', reValidateMode: 'onChange' })`.
- Error text under the field in `#b42318` (6.6:1 on white), `aria-invalid`, `aria-describedby`.
- Submit button disabled while submitting; on success `reset()` + toast (AC-CONTACT-03).

## 7. Feedback, loading, empty, error states

| Situation | Behavior |
|---|---|
| Sipa chunk loading | Skeleton: HUD bars + 16:9 grey box |
| Sipa chunk fails to load (offline) | Message "Couldn't load the game." + **Try again** (reloads route) + Back to site |
| Leaderboard loading / empty / error | Skeleton rows / "No scores yet. Be the first!" / "Leaderboard unavailable" + Retry; the game still works |
| Score submit 409 / 429 / 500 | Toast with the server message; form stays so the player can see what happened |
| Stats are placeholders | Tiles hidden (AC-ABOUT-02) |
| Sabong URL missing | Card hidden (AC-LARO-03) |
| Form submitted | Toast |
| Unknown route | 404 page |

## 8. Accessibility & responsiveness

- Skip link to `#main`, visible on focus.
- Focus ring: 3 px gold outline with 2 px offset on dark, navy on light.
- Headings: one `h1` per page; section titles are `h2`; cards `h3`.
- `prefers-reduced-motion`: `scroll-behavior: auto`, no pop-up animation in Sipa.
- Breakpoints (Tailwind): `sm 640`, `md 768` (nav collapses below), `lg 1024` (2-column sections), `xl 1280` (4-column services at ≥ 1200 via `min-[1200px]`).
- Touch targets ≥ 44 px; game controls ≥ 48 px.
