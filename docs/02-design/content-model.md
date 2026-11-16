# Content Model (`office.json`)

| Field | Value |
|---|---|
| SDLC phase | Design |
| Status | Draft v0.1 |
| Owner | Patrick (schema, T-SETUP-04) · section owners edit their own keys |
| Note | Office copy stays in JSON (ADR-04); only the Sipa leaderboard uses the database ([database-design.md](./database-design.md)) |
| Implements | NFR-CONT-01, NFR-CONT-02, FR-NAV-04 |

---

## 1. Where content lives

| File | Purpose |
|---|---|
| `src/content/office.json` | All copy. Starter file: [`content/office.json`](../../content/office.json) in this spec set |
| `src/content/schema.ts` | Zod schema (`officeContentSchema`) and the `OfficeContent` type |
| `src/content/index.ts` | `export const content = officeContentSchema.parse(raw)`. A bad edit fails the build and the tests, not the live site |

Components import `content` (or one key of it) and never hard-code copy (NFR-CONT-01).

## 2. Schema

```ts
// src/content/schema.ts
import { z } from 'zod';

const link = z.object({ label: z.string().min(1), href: z.string().startsWith('#') });
const placeholderOrNumber = z.string().regex(/^(\[#\]|\d[\d,]*\+?)$/); // "[#]" or "86" or "1,200+"

export const officeContentSchema = z.object({
  office: z.object({ name: z.string(), lgu: z.string(), short: z.string() }),
  nav: z.array(link).min(1),
  hero: z.object({
    headline: z.string(), tagline: z.string(),
    primaryCta: link, secondaryCta: link,
  }),
  headings: z.object({ about: z.string(), services: z.string(), contact: z.string() }),
  about: z.object({
    intro: z.string(),
    mandate: z.array(z.string()).min(1),
    stats: z.array(z.object({ value: placeholderOrNumber, label: z.string() })).length(3),
  }),
  services: z.array(z.object({ icon: z.string(), title: z.string(), text: z.string() })).min(1),
  facilities: z.object({ items: z.array(z.string()).min(1), note: z.string() }),
  laro: z.object({
    title: z.string(), intro: z.string(),
    sipa: z.object({ title: z.string(), text: z.string(), cta: z.string() }),
    sabong: z.object({ title: z.string(), text: z.string(), cta: z.string() }),
  }),
  contact: z.object({
    address: z.string(), hours: z.string(), phone: z.string(),
    email: z.string().email(), formTitle: z.string(),
  }),
  footer: z.object({ text: z.string(), disclaimer: z.string() }),
});

export type OfficeContent = z.infer<typeof officeContentSchema>;
```

The `_note` key in the starter file is ignored by the schema (Zod strips unknown keys).

## 3. Keys and owners

| Key | Used by | Owner | Req |
|---|---|---|---|
| `office` | `SiteHeader`, `SiteFooter`, `<title>` | Patrick | FR-NAV-01 |
| `nav` | `SiteHeader`, `MobileMenu` | Patrick creates; Carlo (Services) and Ramil (Contact) each **append** one item | FR-NAV-04 |
| `hero` | `Hero` | Patrick | FR-HERO-01 |
| `headings` | Section `h2`s (About, Services, Contact) | Patrick creates all three in T-SETUP-04; owners don't rename them during the team build | NFR-CONT-01 |
| `about` | `About` | Cliff | FR-ABOUT-01/02 |
| `services`, `facilities` | `Services` | Carlo | FR-SVC-01/02 |
| `laro` | `LaroSection`, `SipaPage` | Carlo | FR-LARO-01…03 |
| `contact` | `Contact` | Ramil | FR-CONTACT-01 |
| `footer` | `SiteFooter` | Ramil | FR-CONTACT-03 |

### 3.1 The `nav` array and the planned conflict
T-SETUP-04 ships `nav` with **Home, About, Laro ng Lahi** only. Carlo's services task (T-SERVICES-01) appends `{ "label": "Services", "href": "#services" }` and Ramil's contact task (T-CONTACT-01) appends `{ "label": "Contact", "href": "#contact" }`, both at the end of the array. The second PR to merge hits a conflict on the same lines; it is resolved by keeping both items ([git-playbook §4](../03-development/git-playbook.md#4-the-planned-conflict), NFR-GIT-04). After the resolution, order is Home, About, Laro ng Lahi, Services, Contact.

## 4. Placeholder rules (NFR-CONT-02)

| Kind | Placeholder | Rule |
|---|---|---|
| Statistic | `[#]` | Tiles hide while any value is `[#]` (AC-ABOUT-02) |
| Phone | `(085) 000-0000` | Never a real number |
| Email | `name@example.com` | `example.com` is reserved for examples |
| People | none | No names of officials or staff; refer to roles ("the office") |
| Images | none | No city seal or logo; only our own SVG art |

## 5. Icon names (`services[].icon`)
Allowed: `Trophy`, `Medal`, `MapPin`, `CalendarDays`, `Dumbbell`, `Users`. Unknown names fall back to `Trophy` (AC-SVC-01). The map lives in `features/services/constants/serviceIcons.ts`.
