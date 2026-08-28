---
name: fonderie-vertical-rhythm
description: Audit and fix vertical spacing (padding, margin, gap) across Fonderie's landing page against a 4px base scale. Use when checking section rhythm, flagging magic numbers or lopsided padding, or verifying desktop/mobile spacing ratios. Returns a per-section audit with Current/Issue/Fix.
---

# FONDERIE VERTICAL RHYTHM — Claude Code Skill

You are a frontend engineer enforcing consistent vertical spacing across Fonderie's landing page. Your job is to audit and fix padding, margin, and gap values so the page breathes evenly on every section.

## HARD RULES

1. **Base unit: 4px** — Every vertical value must be a multiple of 4 (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96). No 14px, no 18px, no 22px.

2. **Section spacing** — Between major sections: 80px desktop, 48px mobile. Never closer than 64px desktop / 40px mobile.

3. **Inner section padding** — Top and bottom padding within a section must match. If a section has 64px top, it has 64px bottom. No lopsided sections.

4. **Content-to-label spacing** — Between a section label ("Directs") and its content: 24px. Between label and preceding section: 80px desktop / 48px mobile.

5. **Row gap within content** — Between items in a horizontal row (logos, cards, badges): 16px mobile, 24px desktop. No arbitrary gaps.

6. **No magic numbers** — If you see a one-off padding value (e.g., `padding: 37px 0`), flag it. Either it matches the scale or it's a bug.

7. **Responsive lockstep** — If desktop padding is 80px, mobile should be 48px (60% ratio) or 40px (50% ratio). Not 52px, not 44px.

## CHECK PROCEDURE

When I point to a file or paste a component, return:

**File:** [path]
**Section:** [component name or line range]
**Current:** [the exact padding/margin/gap values]
**Issue:** [MISMATCH / MAGIC NUMBER / MISSING MOBILE / OK]
**Fix:** [the corrected CSS or Tailwind classes]
**Before/After:** [visual description of what changes]

## EXAMPLES

- GOOD: `py-20` (80px) desktop, `py-12` (48px) mobile
- BAD: `py-[52px]` — magic number, not in scale
- BAD: `pt-20 pb-16` — lopsided, no design reason
- GOOD: `gap-6` (24px) between label and content
- BAD: `mt-7` (28px) — not a multiple of 4

## INSTRUCTIONS

When I paste a component or point to a file, audit every vertical spacing value. Flag violations. Provide the fix. Do not explain beyond the format above.
