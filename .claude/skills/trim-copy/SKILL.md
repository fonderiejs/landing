---
name: trim-copy
description: Audit and compress localized page copy against a two-axis value/expression score and CI-enforced width budgets. Use when asked to trim, tighten, audit, or mobile-optimize marketing or product copy, especially in a multi-locale i18n project. Produces an audit table, rewritten copy, and a content-manifest.json that a CI gate validates.
---

# trim-copy

Trims page copy without losing context, and proves the result fits on a phone **in every locale** rather than asserting it.

Rationale for every rule here lives in the Trimming Matrix v2. This file is the operational procedure.

---

## THE HARD RULE

> **Never state that copy fits a width budget. Run `measure-wu.mjs` and report what it returns.**

Character counting is not reliable by inspection — not across scripts, not across mixed-script strings, and not when half-width Latin sits inside a CJK sentence. A hallucinated PASS on a width check is worse than no check, because it converts an unknown into a false assurance that nobody re-tests.

You author to the budget. **The script decides whether you hit it.** If the two disagree, the script is right.

Same rule for locales you cannot see: if a translation does not exist yet, the gate reports `PROJECTED-*`, never `PASS`. Do not upgrade a projection to a pass in your summary.

---

## PHASE 1 — AUDIT

Score every text element on **two independent axes**. Do not average them together — that is the v1 bug this replaces. Uniqueness rewards specificity and specificity costs words, so a single blended score systematically punishes the most differentiating copy on the page.

**Axis V — Value** (does this content earn a place?)

| Gate | Criterion | Weight |
|------|-----------|--------|
| G1 | **Decision Utility** — moves the reader toward a decision, *including disqualifying them* | 40% |
| G2 | **Uniqueness** — could a competitor publish this verbatim? | 30% |
| G5 | **Substantiated Trust** — is the confidence backed by something checkable? | 30% |

`V = G1(0.40) + G2(0.30) + G5(0.30)`

**Axis E — Expression** (is this the tightest form of it?)

| Gate | Criterion |
|------|-----------|
| G3 | **Signal Density** — what share of these words carry information? |

E is standalone. **E never enters V.**

### Calibration anchors

Score against these. Unanchored 1–5 scales do not reproduce between reviewers or between runs, which makes the whole audit unauditable. Interpolate for 2 and 4.

**G1** · 5 = names the next action, or lets a wrong-fit reader self-select out · 3 = informs a later decision, no action implied here · 1 = describes the company's self-image; implies nothing actionable

**G2** · 5 = a fact only this company can state — proprietary figure, named program, verifiable specific · 3 = true of them and a few peers · 1 = near-verbatim on 10+ competitor sites; swap the logo and nothing breaks

**G5** · 5 = backed by a number, date, name, or third-party proof the reader could go check · 3 = credible but unverifiable, stated in the reader's language · 1 = unbacked adjectives ("world-class", "trusted", "innovative")

**G3** · 5 = every clause carries information; remove any word and meaning is lost · 3 = recognizable padding — hedges, throat-clearing, doubled adjectives — core intact · 1 = mostly connective tissue; the information fits in a fragment

**Mark `LOW-CONF` on anything you cannot anchor confidently. Do not invent a score.**

### Placement router

Placement is a destination, not a magnitude — assign it, don't score it.

`FOLD` · `SECTION` · `ACCORDION` · `SUBPAGE` · `FOOTER`

Under ~20% of readers need it, but need it *at that decision point* → ACCORDION. They'd navigate to it or link someone to it → SUBPAGE. If you're guessing between the two, flag it as a retention risk.

### Verdict matrix

|  | E ≥ 4 | E < 4 |
|---|---|---|
| **V ≥ 3.5** | **KEEP** | **COMPRESS** |
| **V < 3.5** | **DEMOTE** (if a deeper placement fits) else **CUT** | **CUT** |

**Two overrides, in this order:**
1. **Sole-carrier** — if the element is the only thing on the page carrying a required context rung (Phase 2), it can never be CUT. It becomes REWRITE.
2. **Compliance** — skips both axes entirely (see below).

**Output:** `Element ID | Text | wu | G1 | G2 | G5 | V | E | Placement | Verdict | Flags`
One-sentence justification for every CUT.

---

## PHASE 2 — CONTEXT MAP

For every COMPRESS / DEMOTE / CUT / REWRITE element, run the ladder. Hide the element, read only what survives, and answer **by citing the surviving element ID**:

```
WHAT the product does    → element ID: ___
WHY it matters to them   → element ID: ___
WHAT to do next          → element ID: ___
WHY it's credible        → element ID: ___
```

A rung with no citable surviving element is a **failed rung**. "It's implied" and "the page conveys it overall" are failures, not answers — that is the whole point of requiring a citation. Any failed rung triggers the sole-carrier override.

**Output:** `Element ID | Core context | 4 citations | Failed rungs | Risk | Treatment | Override?`
Do not continue while any HIGH risk is open.

---

## PHASE 3 — COMPRESSION

For each COMPRESS / REWRITE element produce: ORIGINAL · CORE MEANING (≤30 wu) · DESKTOP · MOBILE · VISUAL SUBSTITUTE.

- Target the **wu budget**, not a percentage of the original. A tight sentence already inside budget is **done** — do not cut further to hit a quota.
- **Preserve every specific**: numbers, dates, named programs, proper nouns. Specificity is what G2 rewards; it is the last thing to go, not the first.
- Author the source locale to **80% of budget**. Expansion is real: de ≈ +30%, pt-BR ≈ +25%, fr ≈ +20%.
- Active voice. One idea per paragraph. `$30B`, not `thirty billion dollars`.
- Branded terms survive. Unbranded abstraction does not.
- Every sentence answers "so what?". Silence means it was a CUT misfiled as a COMPRESS — send it back to Phase 1.

**Then update the manifest and run the gate. Report its output verbatim.**

---

## PHASE 4 — REASSEMBLY

Rebuild from KEEP + rewritten elements only.

**Above the fold:** H1 · subheadline · one body paragraph *or* visual + short caption · primary CTA · one-line trust signal. Total within `above-fold-total`.

**Each section:** H2 · intro · 1–2 body paragraphs · optional `[ACCORDION: label]` · CTA or transition if earned.

State in one line why the reader keeps scrolling past each section. Weak or generic → flag `RETENTION-RISK`.

Place compliance elements at their routed placement. **Do not reword them.**

---

## PHASE 5 — VALIDATION

| # | Check | Route on FAIL |
|---|---|---|
| 1 | Scale and credibility still established? | Phase 2 |
| 2 | Primary CTA identifiable in ~2s on mobile? | Phase 4 |
| 3 | Every section serves conversion or trust? | Phase 2 |
| 4 | Can a first-time reader state what this does from the fold alone? | Phase 2 |
| 5 | Any claim lacking proof? ("leading provider" fails) | Phase 2 |
| 6 | Disclosures present, at required prominence, unaltered? | Phase 2 |
| 7 | Thumb-scroll only — no pinch-zoom, no horizontal scroll? | Phase 4 |
| 8 | Text-to-CTA ratio sane, real white space? | Phase 4 |
| 9 | Any point where a 360px screen overwhelms? | Phase 4 |
| 10 | Each section opens a curiosity gap worth scrolling for? | Phase 4 |
| 11 | **Width budget passes in every locale** — per the script, not per your reading | Phase 3 |

### Three rules that make REVISE terminate

1. **Regression re-check** — after any loop-back, re-run **all** checks. Compression fixes routinely break context checks; that coupling is how these pipelines silently regress.
2. **Two-loop cap** — any element may loop back at most twice. Third failure escalates to a named human. Unbounded rewrite churn turns a one-week job into a quarter.
3. **REJECT is not a copy verdict** — it means the offer or IA is broken, and copy cannot rescue a page with no reason to exist. Route to strategy. Never loop a REJECT back into Phases 1–5.

---

## COMPLIANCE TRACK

Legal and regulatory copy leaves the matrix.

- **Not scored** — the gates measure marketing value and do not apply.
- **Not capped** — if it does not fit, the *layout* changes, not the text.
- **Placement only** — usually FOOTER or ACCORDION.
- **Rewrite is gated** — record `LEGAL-OK: <name> <date>` in the audit table.
- **Prominence is a legal property** — demoting a disclosure into an accordion may itself be a breach. Placement changes need the same sign-off as rewrites.

---

## THE CI CONTRACT

Your output is a manifest. The script is the gate. Neither does the other's job.

### Manifest

Element IDs are **rendered units, not JSON keys** — copy is routinely split across keys for styling, and the budget applies to the composed string. Getting this wrong is the most common way the gate under-reports.

```json
{
  "messagesDir": "messages",
  "sourceLocale": "en",
  "locales": ["en", "de", "fr", "pt-BR", "ja", "zh"],
  "authoringHeadroom": 0.8,
  "expansion": { "de": 1.3, "fr": 1.2, "pt-BR": 1.25, "ja": 0.6, "zh": 0.5 },
  "elements": [
    { "id": "HERO-H1", "type": "hero-headline",
      "keys": ["hero.titleLine1", "hero.titleLine2"], "join": " " },
    { "id": "PRICING-NOTE", "type": "body",
      "keys": ["pricing.seatNote"], "samples": { "count": "25" } }
  ]
}
```

`messagesDir` resolves **relative to the manifest**, so CI gets the same answer from any working directory. Declare `samples` for any ICU placeholder — an unresolved `{count}` is reported `UNMEASURABLE`, never guessed.

### Run

```bash
node .claude/skills/trim-copy/measure-wu.mjs --manifest content-manifest.json
# --budgets <file>   override budgets.json
# --strict           WARN also fails the build
# --json             machine-readable
```

Exit `0` clean · exit `1` on any `FAIL`, `PROJECTED-FAIL`, or `UNMEASURABLE`.

### Statuses

`PASS` measured, inside budget · `WARN` source locale past authoring headroom, will likely overflow on translation · `FAIL` measured, over · `PROJECTED-OK` / `PROJECTED-FAIL` estimated from an untranslated source — **never a pass** · `UNMEASURABLE` missing bundle, missing key, or unresolved placeholder; treated as blocking, because an unmeasured element is exactly the one that ships broken.

### Budgets and font metrics

`budgets.json` derives each budget from the stylesheet, in the same `min()` CSS itself resolves:

```
perLine = min( maxWidthCh * chRatio ,  containerPx / fontPx )
budget  = perLine * maxLines
```

Each budget names a `font`, and the gate loads that family's **real advance widths** from `metrics/<font>.json`. Do not fall back to the 0.5em-per-Latin-char average if you can avoid it — measured across the three families in this project it ranges from 0.46em (Instrument Serif) to 0.631em (Inter), so the constant is **biased per family, not merely imprecise**: it overstates a narrow display serif by ~45% while understating a wide UI sans by ~25%. A gate wrong in both directions blocks good copy and passes broken copy in the same run, which is how a gate gets disabled.

Regenerate metrics with `extract-metrics.mjs` (network, run once per font version, commit the JSON). CI reads only the committed JSON, so an upstream font revision cannot silently change a verdict.

**`maxLines` is design intent — the line count the layout allows, not what a locale happens to need.** When a locale exceeds it, that is the finding. Raising `maxLines` until it passes converts a real overflow into a green check.

**Calibrate before trusting.** Render the longest locale at the reference viewport, measure each element's box in devtools, use those numbers. Then confirm the gate reports a known-bad string as FAIL — *a gate never observed failing has not been tested.* Evaluate responsive type **at** the reference viewport: `clamp(44px, 7.2vw, 96px)` is 44px at 360px wide, the min, not the middle.
