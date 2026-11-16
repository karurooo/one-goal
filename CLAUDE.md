# CSO Butuan site: rules for Claude

Specs in `docs/` are the source of truth. Read the task in `docs/03-development/tasks.md` first; if the code needs behavior the spec lacks, fix the spec in the same PR (`docs:` commit).

## Workflow

- One task = one branch (exact name from tasks.md) = one PR into `development`. Never commit to `development`, `staging` or `main`.
- Conventional Commits (`feat(scope): summary`, lowercase, no period, ≤ 72 chars; types and scopes in conventions §4.3). Commitlint enforces it.
- Stage with explicit paths, not `git add -A` (other tools write into the repo).
- Run `npm run check` before pushing. On Windows run from `C:\` (uppercase), or Vitest fails.

## Code

- TypeScript strict, no `any`, no `dangerouslySetInnerHTML`. Functional components; Tailwind classes via `cn()`.
- All copy lives in `src/content/office.json` (parsed by `src/content/schema.ts`); components import `content`.
- Alias `@/` → `src/`. Features import each other only through `index.ts`.
- shadcn primitives live in `src/components/ui/`; add more with `npx shadcn@latest add <name>`.
- Prettier: no semicolons, single quotes, 100 cols.
