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
| 2 | **Retrieval quality** — naive phrasing ("let people pay") misses the right nodes; keyword search alone scores ~50–76% on public benchmarks | Solved by design; official gate pending real corpus | Replaced free-text queries with a closed enum of language-less concept IDs (`billing.subscriptions`, …) — the LLM maps intent to concept in the tool call, so it works identically in every language. Pilot eval: a below-spec model picking from the enum alone scored **96/96** across EN + FR + Romanian (Romanian added with zero code changes) | `fonderie-js/BRAIN_PLAN.md` § "R2 update" + "Pilot run"; PR fonderiejs/sdk#12 |
| 3 | **Triggering** — the model ignores the knowledge layer and answers from priors | Solved in prior art | PreToolUse hooks intercept file reads *before* they happen — deterministic, not instruction-dependent | `BRAIN_PLAN.md` risk R1; graphify (Graphify-Labs/graphify) |
| 4 | **Version skew** — brain serves 1.3.0 knowledge against an installed 1.1.0 | Prototype landed; skew-proof test passing; broad rollout pending Phase 3 | Don't reconcile — co-locate. Each package ships its own brain fragment in its tarball (the `.d.ts` pattern), and the project brain is compiled from `node_modules`, so knowledge travels with the installed version and skew is impossible by construction. Working across all 18 packages; a negative test proves the co-located fragment wins even at a version the repo has never seen (no "latest" leak), with a loud flag on the legacy fallback. Central brain kept only for discovering not-yet-installed packages (where "latest" is correct). Rolling release rejected — it would break pinning/rollback/audit | `fonderie-js/BRAIN_PLAN.md` § "R3 update"; PR fonderiejs/sdk#12 |
| 5 | **Credibility** — self-scored benchmarks at N=3 read as grading our own homework | Open, owned by Phase 4 gate | External anchors (public benchmarks), N≥5, published recall@k; no claim ships without passing its gate | `BRAIN_PLAN.md` risk R4 |
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
- [`DEPLOYMENT.md`](DEPLOYMENT.md) — release cycle and the hard-learned npm rules
- [graphify (Graphify-Labs/graphify)](https://github.com/Graphify-Labs/graphify) — prior art we borrow from and benchmark against
- LOCOMO / LongMemEval — public retrieval benchmarks anchoring our claims
