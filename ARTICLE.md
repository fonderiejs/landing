# Fonderie: what we set out to build, what we found, and what stands in the way

Say "add subscriptions" to your coding assistant and watch what happens.
It writes a billing system from scratch — new schema, new Stripe glue, new
security decisions — different ones every session, and nobody audits any
of it. Tomorrow, in another project, it does it all again.

That's the problem Fonderie exists to end.

## The goal

Every SaaS — big tech or solo — rebuilds the same backend before writing a
line of product: login, teams, payments, permissions, email, feature
flags. Twenty years of engineering keeps re-deriving them, re-shipping the
same flaws. LLMs made this faster, not better: faster horses, improvising
a new security model every session.

Fonderie is the engine instead — a set of pre-built, reviewable
TypeScript bricks (`@fonderie/auth`, `@fonderie/workspaces`,
`@fonderie/billing`, and fourteen more) that snap into `@fonderie/core`
and run in **your** process against **your** database. No Fonderie server
is ever in the request path. It ships as plain npm packages plus a skill
that teaches any assistant — Claude Code, Cursor, Codex — to reach for a
brick instead of hand-writing infrastructure.

```
Without Fonderie              With Fonderie
─────────────────             ─────────────
Week 1-2: Auth setup          Day 1: npm install
Week 3:   Team/org model      Day 1: Register bricks
Week 4:   Stripe wiring       Day 1: Write product logic
Week 5:   Email system        Day 2: Ship to users
Week 6:   Permissions
Week 7:   Multi-tenancy
Week 8:   Remote config
Week 9:   Finally write product
```

The plan is deliberate: no open promotion until four billing archetypes
(workspace billing, user billing, credits, freemium + guest migration)
each carry a real paying project in production. The first of those is
crewfinding — a bilingual field-service app where a client pays for a
workspace and workers join with roles and permissions. The framework
matures by building real projects on it, not by being designed in
isolation.

## What we discovered

Building against a real client surfaced things no design doc would have:

- **Workspace identity was resolved in the wrong place.** The packages
  read workspace context only from URL params; the API's contract is
  `X-Workspace-ID` header first, then query param, then URL. Every route
  needing workspace context had to be corrected.
- **Roles without permissions are empty shells.** A permission is a named
  capability that exists on its own; a role must be seeded with
  permissions in the same transaction that creates it. And one user can
  hold multiple roles, which forced the member table's unique constraint
  to become a three-part primary key with `BOOL_OR` aggregation across
  roles.
- **The permission model itself was wrong.** Free-text action/resource
  pairs gave way to the API's proven CRUD-bit schema — one row per role
  per named resource, four booleans.
- **Schema gaps hide until production.** Sessions, MFA challenges, and
  the message log had no tables; courier templates lived in the wrong
  package. The rule that emerged: each package owns its SQL tables, and
  cross-boundary reads go through the owning package's service functions —
  never raw SQL into someone else's schema.
- **Keyword retrieval alone won't teach an assistant the SDK.** We
  studied graphify's public benchmarks before building our own
  code-knowledge layer: keyword-scoped retrieval scores roughly 50–76% on
  naturally-phrased questions. "Let people pay" won't reliably find
  billing on BM25 alone.

## How we mitigated

- **Real projects as gates, not demos.** Each archetype graduates only
  when a paying client is live on it. Any amount validates the archetype;
  hypothetical usage validates nothing.
- **Architecture law written down.** `ctx.meta` is the only channel
  between packages — no sibling imports. Migrations are append-only and
  idempotent. A schema ownership map names which package owns every table.
- **A skill with a generated/curated split.** Hand-written guidance on
  when to reach for which brick; machine-generated signatures that are
  never hand-edited, so the assistant's knowledge can't drift from the
  published API.
- **Deterministic enforcement over hoping the model obeys.** For the
  planned "brain" layer, we adopt PreToolUse hooks — intercepting file
  reads before they happen — rather than trusting instructions. And
  because our SDK surface is versioned and known at publish time, the
  knowledge graph is pre-built once per release in CI; retrieval gaps get
  hand-curated alias edges ("pay" → billing, "login" → auth) that
  arbitrary-repo tools can't have.
- **Release discipline.** Changesets and semver from `0.1.0`; nothing
  publishes to npm without a deliberate merge of one Version Packages PR
  carrying the full diff of versions and changelogs.

## The roadblocks — and the fix for each

Honestly, in the open. Each blocker is stated with its mitigation and
where it's tracked:

| # | Blocker | Status | The fix | Reference |
|---|---------|--------|---------|-----------|
| 1 | **npm can't bootstrap new packages from CI** — granular tokens update but never create; first publish fails with E404 | Solved (process) | One manual local publish per new package (`npx changeset publish --otp=…` as the `fonderie` account); CI owns every release after | `DEPLOYMENT.md` § "Hard-learned rules" |
| 2 | **Retrieval quality** — naive phrasing ("let people pay") misses the right nodes; keyword search alone scores ~50–76% on public benchmarks | Merged to SDK main (PR #12); first real-data signal in; official gate still pending live-client corpus | Replaced free-text queries with a closed enum of language-less concept IDs (`billing.subscriptions`, …) — the LLM maps intent to concept in the tool call, so it works identically in every language. Generated + translated pilot scored **96/96** across EN + FR + Romanian; then **24 real developer phrasings** (Stack Overflow titles, not ours) scored **23/24** — the first evidence it holds on language we didn't write, above the 90% bar with a below-spec model | `fonderie-js/BRAIN_PLAN.md` § "Pilot run" + "First real-data signal"; merged in fonderiejs/sdk#12 |
| 3 | **Triggering** — the model ignores the knowledge layer and answers from priors | Solved in prior art | PreToolUse hooks intercept file reads *before* they happen — deterministic, not instruction-dependent | `BRAIN_PLAN.md` risk R1; graphify (Graphify-Labs/graphify) |
| 4 | **Version skew** — brain serves 1.3.0 knowledge against an installed 1.1.0 | **Shipped to npm** — fragments live in the published tarballs; skew impossible on the installed path; only Phase-3 wiring remains | Don't reconcile — co-locate. Each package ships its own brain fragment in its tarball (the `.d.ts` pattern), and the project brain is compiled from `node_modules`, so knowledge travels with the installed version and skew is impossible by construction. **Now published and verified** — `brain/{signatures,outcomes}.md` ships inside the tarball (confirmed in `@fonderie/auth@1.3.1`), and CI freshness-gates every fragment so it can't drift from the code it ships with. A negative test proves the co-located fragment wins even at a version the repo has never seen (no "latest" leak); central brain kept only for discovering not-yet-installed packages. Rolling release rejected — it would break pinning/rollback/audit. **Remaining (Phase 3):** the `init`/postinstall regenerate trigger and one real mixed-version install test | `fonderie-js/BRAIN_PLAN.md` § "R3 update"; merged in fonderiejs/sdk#12, published via #15–#18 |
| 5 | **The cost thesis & credibility** — is Fonderie *cheaper* in tokens, and does the brain reliably drive the build? | **Cost goal met in the regime where it is winnable (N=3); the one quality gap found is covered & production-confirmed** | Pre-registered benchmark, 36 clean sessions. The honest arc, in the open: a single small task runs at **~parity** (Fonderie carries its weight but does not undercut from-scratch on one build) — the win lives in *repeated* sessions on a growing app, where the mold is re-paid every turn. There, transcript-measured **Fonderie-knowledge overhead is 0.24 → a fraction (≤⅓)** of the full skill, stable as N grew (0.13→0.22→0.24). That number is the knowledge the mold is responsible for, isolated from product code and turn count — the quantity the thesis was ever about — **not** a blanket cheaper-than-scratch claim. A parity-plus scare was traced (for $0, by instrumenting transcripts) to turn-count noise that averaged out at N=3. Quality held equal between the Fonderie conditions (delegation-aware 8.0 vs 7.7); from-scratch shipped an insecure hard-coded secret in **2 of 3** runs, in ~3× the code. The one weakness the full rubric found — a 1/3 discovery stall — is covered by defense-in-depth and confirmed by a 12/12 re-run. Nothing claimed beyond the measurement | `fonderie-js/experiments/phase41-2026-07/BATCH-RESULTS.md`; the [round-five write-up](https://fonderiejs.com/blog/token-cost-experiment); `BRAIN_PLAN.md` § Phase 4.1 |
| 6 | **The clock** — 3 live clients and $3k+ MRR by Nov 2026; one archetype in flight, three remain | In progress | One real paying project per archetype, in strict order A→C→B→D; each phase gated, a gate that fails twice ends the phase | `fonderie-js/ROADMAP.md` |

Rule of the program: a failed exit gate gets exactly one retry. Gates are
never renegotiated mid-phase.

```
May ─────── Jul ─────── Sep ─────── Nov 2026
 │           │           │           │
 A ██████████░░ workspace billing (crewfinding — in flight)
             C ░░░░░░ credits / tokens
                   B ░░░░░░ user billing
                         D ░░░░░░ freemium + guest migration
                                     ▲ gate: 3 live clients, $3k+ MRR
```

## Release & versioning — the dev lifecycle

The bricks are libraries other people pin, so the version number is a
promise. We follow semver strictly, judged **from the consumer's side** —
"would someone who installed us have to change their code?"

| Bump | When | Examples |
|---|---|---|
| **major** | A breaking change to anything public — a consumer must react | removed/renamed export, changed function signature or return shape, changed route contract or config shape, a non-backward-compatible migration |
| **minor** | A backward-compatible new capability — safe to upgrade into | new export, new *optional* parameter, new route, new recipe |
| **patch** | A backward-compatible fix or internal change — no API change | bug fix, security fix, docs, shipping the co-located brain fragment |

Rule of thumb: if a consumer's existing code could break or behave
differently, it's **major**; if they gain something without touching their
code, **minor**; if nothing about the public surface moved, **patch**. When
unsure, size up, not down — a needless major is annoying, a hidden breaking
change under a patch is a betrayal.

**How a release actually ships** (changesets + GitHub Actions, no manual
`npm publish`):

1. **Author.** Branch, make the change, run `npm run docs:signatures` (regenerates the API signatures *and* each package's co-located `brain/` fragment) — then `npx changeset`: pick the affected packages, choose major/minor/patch by the table above, write one changelog line. Commit the `.changeset/*.md` with the code.
2. **PR gates (`ci.yml`).** Build, then freshness gates that fail if generated artifacts drift from source — the central signatures, **each package's `brain/` fragment**, and `brain.json` — plus the brain tests. Nothing merges with stale generated knowledge.
3. **Merge to `main`.** CI opens/updates a **"Version Packages"** PR that applies the bumps, writes CHANGELOGs, and regenerates `brain.json` for the new versions (wired into the version step so it can't go stale).
4. **Merge the Version Packages PR — that is the publish.** CI runs `changeset publish`, ships every bumped package to npm with its `brain/` fragment inside the tarball, and pushes one git tag per package. Nothing reaches npm without that deliberate second merge.

**Hard-won rules, paid for in failed runs:**

- **`repository.url` must match the real repo** — npm provenance (sigstore) rejects the publish with a 422 otherwise. A stale org name (`fonderie-js` vs `fonderiejs`) blocked an entire release until fixed everywhere.
- **Generated artifacts are gated, not trusted.** Version bumps change `brain.json`; API changes change the co-located fragments. Both are CI freshness-gated so a drifted artifact can't publish inside a tarball — which is what keeps the brain *version-matched by construction*.
- **New packages need one manual first publish** (npm tokens can't create a package, only update it); CI owns every release after.

## Architecture evolution — eager knowledge to a lazy pyramid

The benchmark taught us where the tokens actually go, and it changed the shape
of the thing. The first design loaded everything Fonderie knows into the agent
every turn — the full skill (~28,000 tokens) or, later, a compiled project brain
(~6,000–13,000) — whether the task used it or not. A billing-only session still
carried auth, teams, webhooks, audit, every turn.

The new design is the three-layer pattern the industry converged on (Cloudflare
Wrangler, Anthropic skills, Playwright's CLI/MCP split): **CLI + lazy skills +
LLM**, on top of the unchanged bricks.

```
BEFORE (eager)                     AFTER (lazy pyramid)
──────────────                     ────────────────────
LLM                                LLM            <- reasoning ONLY
 ^ resident every turn              |
FAT SKILL ~28k  /  MCP ~55k    SKILLS (lazy)     CLI (deterministic)
PROJECT BRAIN ~6-13k           router ~1.4k       0 schema tax, pipe->grep
(all 17 packages, always)      + per-package bodies read ONLY when touched
                                   |
                                   v  on the unchanged foundation:
                          DETERMINISTIC MICRO-BACKEND BRICKS (@fonderie/*)
                          audited, version-matched -> consistent LLM output
```

Measured: the router sits at ~1,400 resident tokens versus the eager brain's
~6,400 — the per-package bodies load on demand, not every turn. Same knowledge,
same guarantees, a fraction of the resident cost.

**The pillars we lean on, each measured, each doing one job:**

1. **Deterministic micro-backend bricks** — audited `@fonderie/*` that make a
   non-deterministic LLM ship *consistent, secure* code (from-scratch shipped an
   insecure secret 2 of 3 times; Fonderie never, in ~⅓ the code). This is the
   product; it does not change.
2. **Lazy skill layering** — a small router that pulls one brick's body in only
   when the task touches it. Load scales with what the agent does.
3. **CLI for retrieval** — zero schema tax, output into a pipe, runs anywhere;
   measured at parity with MCP, so it's a viable default.
4. **Co-located version-matched knowledge** — each package ships its own brain
   fragment in its tarball, so knowledge travels with the installed version.
5. **Concept-enum routing** — 17 language-less concepts map intent to the one
   body to load (96/96 across EN/FR/Romanian).
6. **Cross-vendor skill format** — one artifact reads in every agent harness, no
   server to keep alive.
7. **Two-axis honesty** — measure tokens *and* wall-clock; CLI trades latency
   for tokens, so MCP stays the option for stateful, long-running loops.

The one-line difference: before, load everything every turn in case; after, keep
a tiny router resident and pull the one brick's knowledge in only when the task
reaches for it — on bricks that keep the output consistent. Full chart and
numbers in `fonderie-js/ARCHITECTURE-EVOLUTION.md`.

## Where this leaves us

The bet is the one HTTP made: standardize the boring parts so nobody
re-argues them, and let founders spend themselves on the only part that's
actually theirs — their product. Everything above is checkable in the
repo: the bricks, the skill, the schema map, the gates. Audit
everything — or never need to.

## References

- [`fonderie-js/FONDERIE.md`](fonderie-js/FONDERIE.md) — architecture law: the problem, the thesis, the library-not-service rule
- [`fonderie-js/GAME_PLAN.md`](fonderie-js/GAME_PLAN.md) — schema ownership map, permission model, the discoveries above
- [`fonderie-js/ROADMAP.md`](fonderie-js/ROADMAP.md) — the four archetypes, gates, and 6-month timeline
- [`fonderie-js/BRAIN_PLAN.md`](fonderie-js/BRAIN_PLAN.md) — the four named risks (R1–R4) and their phase gates
- [`fonderie-js/experiments/phase41-2026-07/BATCH-RESULTS.md`](fonderie-js/experiments/phase41-2026-07/BATCH-RESULTS.md) — the N=3 cost/quality benchmark, raw and reproducible
- [Round-five write-up](https://fonderiejs.com/blog/token-cost-experiment) — the public post: five rounds, every number
- [`DEPLOYMENT.md`](DEPLOYMENT.md) — release cycle and the hard-learned npm rules
- [graphify (Graphify-Labs/graphify)](https://github.com/Graphify-Labs/graphify) — prior art we borrow from and benchmark against
- LOCOMO / LongMemEval — public retrieval benchmarks anchoring our claims
