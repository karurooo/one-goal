# Git Playbook

| Field | Value |
|---|---|
| SDLC phase | Development and Deployment |
| Owner | The module's Release Manager · everyone follows |
| Implements | NFR-GIT-01 … NFR-GIT-07 |
| Rules | [conventions.md §4](./conventions.md#4-git-workflow) |

Command-by-command steps for every graded Git moment.

| Criterion | Req | Points | Section |
|---|---|---|---|
| Branch names follow Conventional Branch | NFR-GIT-01 | 10 | §1 |
| Commits follow Conventional Commits | NFR-GIT-02 | 20 | §1 |
| Every merge via reviewed PR, none straight to main | NFR-GIT-03 | 20 | §2, §3, §5 |
| Conflicts resolved cleanly | NFR-GIT-04 | 10 | §4 |
| v1.0.0 tag | NFR-GIT-05 | 10 | §5 |
| Hotfix delivered the right way | NFR-GIT-06 | 10 | §6 |
| Live Vercel URL works | NFR-GIT-07 | 20 | §2, §5 |

## 1. Every task, every time
```bash
git switch development && git pull
git switch -c feat/about-section             # exact branch name from tasks.md
# ...work, one planned commit at a time...
git add -p                                    # stage only what belongs in this commit
git commit -m "feat(about): add intro and mandate list"
npm run check                                 # before pushing
git push -u origin feat/about-section
gh pr create --base development --fill        # or the GitHub web page; fill the template
```
- Branch from `development`, PR into `development` (hotfixes are the only exception, §6).
- Wrong commit message, not pushed yet: `git commit --amend -m "…"`. Already pushed: leave it; never force-push a shared branch.
- Keep your branch current while you work: `git fetch origin && git merge origin/development`.

## 2. Setup (T-SETUP-01, done by Carlo)
1. Create the repo **with a README** (GitHub makes the initial commit on `main`; nobody ever pushes to `main`).
2. Create the long-lived branches from `main`:
   ```bash
   git clone <repo> && cd <repo>
   git switch -c staging && git push -u origin staging
   git switch -c development && git push -u origin development
   ```
3. Settings → General: default branch `development`; Pull Requests: **allow merge commits only**, automatically delete head branches.
4. Settings → Rules (or Branches): protect `main`, `staging`, `development` (deployment §4).
5. Vercel: import the repo (Vite preset), production branch `main`, add a domain for `staging`; set env vars per environment (deployment §5).
6. Supabase: create `cso-staging` and `cso-production`; set function secrets (conventions §5.2); add the GitHub Actions secrets (deployment §2.3).
7. Run `bash scripts/create-issues.sh`.
8. Check: open the production URL, then `/laro/sipa` directly and refresh. A 404 on refresh means `vercel.json` is missing (it lands with T-SETUP-04).

## 3. Review and merge rules
- One approval from a teammate; the reviewer uses the [PR review checklist](../04-testing/test-plan.md#5-pr-review-checklist) and leaves at least one real comment.
- The module's Maintainer merges with **Create a merge commit**. If the Maintainer wrote the PR, the Reviewer merges it. Nobody merges their own PR. Roles rotate every module ([tasks.md](./tasks.md#roles-rotate-every-module-trainers-rule-nobody-merges-their-own-pr)).
- Before merging: branch up to date with its base ("Update branch" button), CI green, Vercel preview checked.

## 4. The planned conflict
Carlo's `feat/services-section` (T-SERVICES-01) and Ramil's `feat/contact-footer` (T-CONTACT-01) both append an item to the end of `nav` in `src/content/office.json`. Both branches must start from `development` **before** either one merges, and neither may merge `development` into their branch until the first PR is in. Merge Carlo's first; Ramil's PR then shows "This branch has conflicts".

```bash
git switch feat/contact-footer
git fetch origin
git merge origin/development          # CONFLICT (content): Merge conflict in src/content/office.json
```
The file shows:
```
    { "label": "Laro ng Lahi", "href": "#laro" },
<<<<<<< HEAD
    { "label": "Contact", "href": "#contact" }
=======
    { "label": "Services", "href": "#services" }
>>>>>>> origin/development
  ],
```
Keep both, Services first, fix the commas, delete the marker lines:
```
    { "label": "Laro ng Lahi", "href": "#laro" },
    { "label": "Services", "href": "#services" },
    { "label": "Contact", "href": "#contact" }
  ],
```
```bash
npm run check                         # JSON valid, content test passes, build passes
git add src/content/office.json
git commit                            # keep the default "Merge remote-tracking branch 'origin/development' into feat/contact-footer"
git push
```
The earlier approval was dismissed by the new commit: the reviewer re-approves, the Maintainer merges.

## 5. Release v1.0.0

### 5.1 Before Day 3: to staging (T-REL-01, T-REL-02; Release Manager of module 3: Cliff)
```bash
git switch development && git pull
git switch -c release/v1.0.0
# CHANGELOG.md: move Unreleased → [1.0.0] - YYYY-MM-DD; package.json "version": "1.0.0"
git commit -am "chore(release): prepare v1.0.0"
git push -u origin release/v1.0.0
gh pr create --base development --title "chore(release): prepare v1.0.0"
```
After merge:
```bash
gh pr create --base staging --head development --title "chore(release): v1.0.0 to staging" \
  --body "Promotes development to staging for Alpha, Beta and UAT. Implements T-REL-02."
```
Reviewer approves → Maintainer merges (merge commit) → Vercel deploys the staging domain, `deploy-backend.yml` deploys to `cso-staging` → run the smoke test (T-QA-01) → UAT sign-off.

### 5.2 Day 3: to production (T-REL-03; Release Manager of module 4: Carlo)
```bash
gh pr create --base main --head staging --title "chore(release): v1.0.0" \
  --body "Releases v1.0.0 to production. Implements T-REL-03 (NFR-GIT-05, NFR-GIT-07)."
```
Reviewer approves → Maintainer merges → wait for Vercel production and `deploy-backend` (main) to finish → tag the merge commit:
```bash
git switch main && git pull
git tag -a v1.0.0 -m "v1.0.0: City Sports Office site launch"
git push origin v1.0.0
gh release create v1.0.0 --title "v1.0.0" --notes-file CHANGELOG.md   # or --generate-notes
```
Check: production URL and `https://<prod-ref>.supabase.co/functions/v1/api/api/v1/health` show the new SHA.

## 6. Hotfix

Use the trainer's bug if they announce one. If not, use our prepared scenario:

> **Scenario H1: footer disclaimer missing on phones.** After release someone notices on a phone that the footer has no "Practice website…" line (NFR-CONT-02, AC-CONTACT-04). Cause: the disclaimer `<p>` in `SiteFooter.tsx` has `hidden md:block`. Fix: remove `hidden md:block`.
>
> To make the drill real, T-CONTACT-01 ships the footer with that class (it's in the reference build too), and the reviewer's checklist doesn't catch it because it is only visible on a phone.

```bash
git switch main && git pull
git switch -c hotfix/footer-disclaimer-mobile
# smallest possible fix
git commit -am "fix(footer): show practice-site disclaimer on mobile"
git push -u origin hotfix/footer-disclaimer-mobile
gh pr create --base main --label hotfix --title "fix(footer): show practice-site disclaimer on mobile" \
  --body "Hotfix for production. Implements T-REL-04 (NFR-GIT-06, AC-CONTACT-04)."
```
Someone who didn't write the fix reviews → the Maintainer merges → production redeploys → check on a phone → the Release Manager tags:
```bash
git switch main && git pull
git tag -a v1.0.1 -m "v1.0.1: show footer disclaimer on mobile"
git push origin v1.0.1
gh release create v1.0.1 --generate-notes
```
Back-merge so the fix isn't lost on the next release:
```bash
gh pr create --base staging --head main --title "chore(release): back-merge v1.0.1 into staging"
# after it merges:
gh pr create --base development --head staging --title "chore(release): back-merge v1.0.1 into development"
```
Never fix production by pushing to `main`, even for one line.
