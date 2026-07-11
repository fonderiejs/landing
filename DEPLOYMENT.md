# Fonderie — Deployment Cycle

How each surface of the platform ships, as of 2026-07-11. Three surfaces,
three cadences: the SDK releases through CI, the site deploys as static
files, the services ship as containers.

```
                        ┌─────────────────────────┐
                        │      fonderie-js/       │
                        │   (SDK monorepo, MIT)   │
                        └───────────┬─────────────┘
        feature PR + changeset      │
                                    ▼
                   GitHub Actions ── release.yml
                   npm ci → turbo build → turbo test
                                    │
              ┌─────────────────────┴──────────────────────┐
              │ changesets pending?                        │
              ▼ yes                                        ▼ no
   opens/updates "Version                    publishes changed packages
   Packages" PR (bumps +                     to npm as @fonderie/*
   CHANGELOGs accumulate)                    + pushes release tags
              │                                            ▲
              └────────── merging that PR ─────────────────┘
```

## 1. SDK (`fonderie-js/` → npm `@fonderie/*`)

**The steady-state loop** (everything after the first release):

1. Branch, make changes, and run `npx changeset` — pick the affected
   packages, choose patch/minor/major, write one line of changelog. Commit
   the generated `.changeset/*.md` with your PR.
2. Merge to `main`. CI builds (turbo, dependency-ordered), tests, and
   opens/updates the **Version Packages** PR.
3. **Merging the Version Packages PR is the deploy button.** CI applies the
   bumps, publishes every changed package to npm, and pushes one git tag per
   package (`@fonderie/core@x.y.z`).

Nothing publishes without that deliberate merge; a release is always one PR
with the full diff of versions and changelogs.

**Hard-learned rules:**

- **New packages need one manual bootstrap.** npm granular tokens cannot
  *create* packages (E404 on first PUT) — they can only update existing
  ones. The first publish of any new package is done locally by a human:
  `npx changeset publish --otp=<6-digit code>` as the `fonderie` npm
  account. From then on CI owns it.
- **Build order is turbo's job.** `npm run build --workspaces` builds
  alphabetically and breaks `.d.ts` generation for dependents;
  `turbo build` (`dependsOn: ["^build"]`) is the only supported build.
  Cold build of all 17: ~7s.
- **Scope ≠ GitHub org.** Packages are `@fonderie/*`; the repo is
  `github.com/fonderie-js/sdk`. The npm `fonderie-js` account is a defensive
  registration — never publish real packages under it.
- **`examples/` is local-only.** It contains client work and was purged from
  public history; it is gitignored and must never be re-tracked.

**Credentials:**

| Credential | Where | Notes |
|---|---|---|
| `NPM_TOKEN` (granular, bypass-2FA, `@fonderie` scope, read/write) | GitHub → sdk repo → Actions secrets | **Expires 2026-10-09** — rotate before |
| `fonderie` npm account + TOTP | 1Password/authenticator | Used only for bootstrapping new packages |

**Deadline:** npm retires bypass-2FA tokens for publishing in **Jan 2027**.
Migrate `release.yml` to Trusted Publishing (OIDC, no long-lived token)
before then — it also removes the token-rotation chore.

## 2. Landing site (`platform/landing/` → fonderie.ai)

Pure static output: five HTML pages + `base.css` + `theme.css` +
`landing.js` + fonts/icons. No build step, no framework.

- **Local review:** `node serve.mjs` → http://localhost:8080 (clean URLs).
- **Production (when we deploy):** any static host with clean-URL support —
  Vercel (`cleanUrls: true`), Cloudflare Pages (automatic), or nginx
  (`try_files $uri $uri.html =404`). Deploy = upload the `landing/` folder;
  there is nothing to compile.
- **Not yet deployed.** Blockers before going live: Privacy/Terms legal
  text, and the `hello@fonderie.ai` mailbox behind the contact page.

## 3. Services (`platform/api`, `platform/auth`, `platform/app`)

Docker-based; each repo has its own Dockerfile and the platform has a
`docker-compose.yml`. No automated pipeline yet — deployment is manual and
out of scope until the first hosted environment exists. When that lands,
the same pattern applies: GitHub Actions per repo, build image → push
registry → deploy, gated on tests.

## Release checklist (copy-paste)

Routine release:
```
[ ] PR includes a changeset (.changeset/*.md)
[ ] CI green on main
[ ] Review the Version Packages PR (versions + changelogs sane)
[ ] Merge it — CI publishes and tags
[ ] Spot-check: npm view @fonderie/<pkg> version
```

Adding a brand-new package:
```
[ ] package.json: name @fonderie/<name>, publishConfig.access public,
    files [dist, LICENSE, README.md], repository.directory set
[ ] LICENSE copied in, README follows the house template
[ ] Local bootstrap: npx changeset publish --otp=<code> (as fonderie)
[ ] Then routine releases via CI
```
