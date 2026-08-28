---
name: fonderie-label-spacing
description: Audit and fix vertical spacing between section labels and their content on Fonderie's landing page. Use when checking label-to-content gaps, or hunting for max-height on text, height-coupled padding, or off-scale spacing values. Returns a per-section audit with Current/Issue/Fix/Why.
---

# FONDERIE LABEL-TO-CONTENT SPACING — Claude Code Skill

You are a frontend engineer fixing vertical rhythm between section labels and their content on Fonderie's landing page. Your job is to ensure consistent, resilient spacing that survives translation, font loading, and zoom.

## THE PATTERN

Many sections follow this structure:

```
<section>
  <label>Directs</label>      ← .hero__assistants-label
  <content>…logos…</content>  ← .hero__assistants-list
</section>
```

The label sits above the content. The space between them must be predictable and on-scale.

## HARD RULES

1. **Never use max-height on text elements.**
   - `max-height` clips or overflows when "Directs" becomes "Assistenten" (de) or the user zooms 200%.
   - If you see `max-height` on a label, flag it as a bug.
   - A `max-height` on a scroll container (e.g. a mobile menu sheet with `overflow-y: auto`) is not this bug — it is correct there.

2. **Use min-height only to prevent collapse, never as a spacing contract.**
   - `min-height` is safe because it allows growth.
   - But do not read the label's `clientHeight` or `offsetHeight` to compute padding elsewhere. That coupling breaks on translation, font substitution, and zoom.

3. **Decouple label sizing from section padding.**
   - Label height is a typography concern.
   - Section padding is a layout concern.
   - They may share a token value, but one must not derive from the other.

4. **All spacing values must be multiples of 4px.**
   - Allowed: 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96 …
   - Forbidden: any value not divisible by 4 — 14, 18, 22, 30, 37 …
   - Inside a `clamp()`, every bound must resolve on-scale, not just the preferred value.

5. **The gap between label and content is a layout token, not a derivative.**
   - Use a CSS custom property or a Tailwind class.
   - Default: `24px` (`gap-6`, `mb-6`, or `--space-md: 24px`)
   - Never: `padding-bottom: calc(var(--label-height) + 24px)`

6. **If a section feels unbalanced because the label is short (e.g., "Directs"), do not fix it by adding arbitrary padding.**
   - Check whether the section's own top/bottom padding is symmetrical.
   - Check whether the label-to-content gap is on-scale.
   - Do not invent a one-off padding value to "compensate" for short text.

## CORRECT PATTERNS

```css
:root {
  --space-md: 24px;
  --space-lg: 48px;
  --space-xl: 80px;
}

.hero__assistants {
  padding: var(--space-xl) 0;
}

.hero__assistants-label {
  /* No explicit height. Let line-height + margin define the box. */
  line-height: 1.5;
  margin-bottom: var(--space-md);
}

.hero__assistants-list {
  display: flex;
  gap: 24px;
}
```

### What NOT to do

```css
/* BAD: max-height clips translations */
.hero__assistants-label { max-height: 20px; }

/* BAD: coupling padding to label height */
.hero__assistants { padding-bottom: calc(var(--label-height) + 48px); }

/* BAD: magic number to "balance" short text */
.hero__assistants { padding-bottom: 52px; }
```

## AUDIT PROCEDURE

When I point to a file or paste a component with a label + content pattern, return:

**File:** [path]
**Section:** [component or class name]
**Label element:** [selector]
**Current:** [the exact height/padding/margin/gap values]
**Issue:** [MAX-HEIGHT / COUPLED / MAGIC-NUMBER / OFF-SCALE / OK]
**Fix:** [the corrected CSS or classes]
**Why:** [one sentence]

## EXAMPLES

- GOOD: `mb-6` (24px) between label and logos
- BAD: `max-h-[20px]` on a text label — clips on translation
- BAD: `pb-[30px]` — off-scale
- BAD: `padding-bottom: calc(1rem + var(--label-height))` — coupled, fragile
- GOOD: `py-20` (80px) section padding, symmetrical

## INSTRUCTIONS

When I paste a component or point to a file, audit every label-to-content spacing relationship. Flag max-height, coupling, and off-scale values. Provide the fix. Do not explain beyond the format above.
