#!/usr/bin/env node
/**
 * measure-wu.mjs — width-unit budget gate for localized copy.
 *
 * Measures every element in a content manifest, in every locale, against a
 * width budget expressed in em-units (wu), and fails the build on overflow.
 *
 * WHY NOT "Latin / 2, CJK x 1":
 *   That rule is wrong on real strings. A Japanese headline containing "SaaS"
 *   holds half-width Latin inside a CJK string; half-width katakana (U+FF61-)
 *   is narrow while its full-width twin is wide; combining marks have zero
 *   advance. This walks codepoints and applies Unicode East Asian Width
 *   (UAX #11) instead, which is the property the shaping engine actually uses.
 *
 * MEASURED vs PROJECTED:
 *   A locale with a real string is MEASURED. A missing locale is PROJECTED
 *   from the source string times an expansion factor and can never report a
 *   plain PASS. Treating an estimate as a pass is the exact failure this
 *   gate exists to prevent.
 *
 * Usage:
 *   node measure-wu.mjs --manifest content-manifest.json
 *                       [--budgets budgets.json] [--messages messages]
 *                       [--strict] [--json]
 *
 * Exit 0 = clean. Exit 1 = at least one FAIL or UNMEASURABLE.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, basename, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

/* ---------------------------------------------------------------- width --
 * East Asian Width. W (Wide) and F (Fullwidth) take a full em. A
 * (Ambiguous) is locale-dependent: it renders wide in a CJK font and
 * narrow otherwise -- which is why it is resolved per locale, not globally.
 * Everything else takes a half em; combining marks take none.
 *
 * The A table is a curated subset covering characters that actually occur
 * in UI copy (middot, dashes, curly quotes, arrows, degree, section, (c)).
 * Swap in a generated full UAX #11 table if you need exhaustive coverage.
 */
const WIDE = [
  [0x1100,0x115f],[0x231a,0x231b],[0x2329,0x232a],[0x23e9,0x23ec],[0x23f0,0x23f0],
  [0x23f3,0x23f3],[0x25fd,0x25fe],[0x2614,0x2615],[0x2648,0x2653],[0x267f,0x267f],
  [0x2693,0x2693],[0x26a1,0x26a1],[0x26aa,0x26ab],[0x26bd,0x26be],[0x26c4,0x26c5],
  [0x26ce,0x26ce],[0x26d4,0x26d4],[0x26ea,0x26ea],[0x26f2,0x26f3],[0x26f5,0x26f5],
  [0x26fa,0x26fa],[0x26fd,0x26fd],[0x2705,0x2705],[0x270a,0x270b],[0x2728,0x2728],
  [0x274c,0x274c],[0x274e,0x274e],[0x2753,0x2755],[0x2757,0x2757],[0x2795,0x2797],
  [0x27b0,0x27b0],[0x27bf,0x27bf],[0x2b1b,0x2b1c],[0x2b50,0x2b50],[0x2b55,0x2b55],
  [0x2e80,0x303e],[0x3041,0x33ff],[0x3400,0x4dbf],[0x4e00,0x9fff],[0xa000,0xa4cf],
  [0xa960,0xa97f],[0xac00,0xd7a3],[0xf900,0xfaff],[0xfe10,0xfe19],[0xfe30,0xfe6f],
  [0xff00,0xff60],[0xffe0,0xffe6],
  [0x1f300,0x1f64f],[0x1f680,0x1f6ff],[0x1f900,0x1f9ff],
  [0x20000,0x2fffd],[0x30000,0x3fffd],
];

const AMBIGUOUS = [
  [0x00a1,0x00a1],[0x00a4,0x00a4],[0x00a7,0x00a8],[0x00aa,0x00aa],[0x00ad,0x00ae],
  [0x00b0,0x00b4],[0x00b6,0x00ba],[0x00bc,0x00bf],[0x00d7,0x00d7],[0x00f7,0x00f7],
  [0x2010,0x2010],[0x2013,0x2016],[0x2018,0x2019],[0x201c,0x201d],[0x2020,0x2022],
  [0x2024,0x2027],[0x2030,0x2030],[0x2032,0x2033],[0x2035,0x2035],[0x203b,0x203b],
  [0x203e,0x203e],[0x20ac,0x20ac],[0x2103,0x2103],[0x2105,0x2105],[0x2109,0x2109],
  [0x2113,0x2113],[0x2116,0x2116],[0x2121,0x2122],[0x2126,0x2126],[0x212b,0x212b],
  [0x2153,0x2154],[0x215b,0x215e],[0x2160,0x216b],[0x2170,0x2179],[0x2190,0x2199],
  [0x21d2,0x21d2],[0x21d4,0x21d4],[0x2460,0x24ff],[0x25a0,0x25f7],[0x2605,0x2606],
  [0x260e,0x260f],[0x2640,0x2640],[0x2642,0x2642],[0x2660,0x2665],[0x2667,0x266a],
  [0x266c,0x266f],
];

// Zero-advance: combining marks, ZWJ/ZWNJ, variation selectors, bidi controls.
const ZERO = [
  [0x0300,0x036f],[0x0483,0x0489],[0x0591,0x05bd],[0x0610,0x061a],[0x064b,0x065f],
  [0x0670,0x0670],[0x06d6,0x06dc],[0x0e31,0x0e31],[0x0e34,0x0e3a],[0x0e47,0x0e4e],
  [0x200b,0x200f],[0x202a,0x202e],[0x2060,0x2064],[0xfe00,0xfe0f],[0xfe20,0xfe2f],
];

const inRanges = (cp, ranges) => {
  let lo = 0, hi = ranges.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (cp < ranges[mid][0]) hi = mid - 1;
    else if (cp > ranges[mid][1]) lo = mid + 1;
    else return true;
  }
  return false;
};

const CJK_LOCALES = new Set(['ja', 'zh', 'ko', 'zh-CN', 'zh-TW', 'zh-Hans', 'zh-Hant']);

/** Advance width of one codepoint, in em. */
export function charWidth(cp, locale) {
  if (cp === 0x0a || cp === 0x0d) return 0;
  if (cp < 0x20 || (cp >= 0x7f && cp < 0xa0)) return 0;   // control
  if (inRanges(cp, ZERO)) return 0;
  if (inRanges(cp, WIDE)) return 1;
  if (inRanges(cp, AMBIGUOUS)) return CJK_LOCALES.has(locale) ? 1 : 0.5;
  return 0.5;
}

/**
 * Width of a string in wu. Iterates codepoints, so surrogate pairs are safe.
 *
 * With `metrics`, each glyph uses the font's real advance from hmtx. Without,
 * it falls back to the UAX #11 class average -- correct for CJK (full-width is
 * genuinely 1em) but crude for Latin, where real faces range from Instrument
 * Serif's 0.46em `0` to Inter's 0.631em. That spread is why the gate loads
 * metrics: a fixed 0.5em constant is biased per family, not merely imprecise.
 *
 * A codepoint absent from `metrics` falls through to UAX #11, which is exactly
 * right -- an absent glyph means the browser is using a fallback font too.
 */
export function measure(str, locale, metrics) {
  const adv = metrics?.advances;
  let wu = 0;
  for (const ch of str) {
    const cp = ch.codePointAt(0);
    const real = adv?.[cp];
    wu += real !== undefined ? real : charWidth(cp, locale);
  }
  return Math.round(wu * 100) / 100;
}

const _metricsCache = new Map();
function loadMetrics(name, dir) {
  if (!name) return null;
  if (_metricsCache.has(name)) return _metricsCache.get(name);
  const file = join(dir, `${name}.json`);
  const m = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
  if (!m) console.error(`warning: no metrics at ${file} — falling back to UAX #11 averages for "${name}"`);
  _metricsCache.set(name, m);
  return m;
}

/* ------------------------------------------------------------ normalize --
 * Strip what the reader never sees, and resolve what they do.
 * next-intl rich text (<b>..</b>) is markup, not width. ICU placeholders
 * ({name}, {count, plural, ...}) have runtime-unknown width -- substitute a
 * declared sample or refuse to guess.
 */
const TAG = /<\/?[a-zA-Z][a-zA-Z0-9]*\s*\/?>/g;
const PLACEHOLDER = /\{\s*([a-zA-Z0-9_]+)\s*(?:,[^}]*)?\}/g;

function normalize(raw, samples) {
  let s = String(raw).replace(TAG, '');
  const unresolved = [];
  s = s.replace(PLACEHOLDER, (match, name) => {
    if (samples && Object.prototype.hasOwnProperty.call(samples, name)) return String(samples[name]);
    unresolved.push(name);
    return match;
  });
  return { text: s.replace(/\s+/g, ' ').trim(), unresolved };
}

/* -------------------------------------------------------------- loading -- */
function flatten(obj, prefix, out) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

function loadLocale(messagesDir, locale) {
  const dir = join(messagesDir, locale);
  if (!existsSync(dir)) return null;
  const out = {};
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const section = basename(f, '.json');
    flatten(JSON.parse(readFileSync(join(dir, f), 'utf8')), section, out);
  }
  return out;
}

/* ---------------------------------------------------------------- gate -- */
/**
 * A budget is either a flat wu number, or derived from the design system:
 *   { fontPx, containerPx, maxLines }  ->  (containerPx / fontPx) * maxLines
 *
 * Prefer the derived form. A hardcoded wu number silently rots the moment
 * someone changes a font-size, and then the gate is confidently wrong --
 * which is worse than no gate. The derived form fails loudly instead,
 * because the numbers it reads are the same ones in the stylesheet.
 */
function resolveBudget(b, locale, metrics) {
  if (b == null) return null;
  if (typeof b === 'number') return b;
  // Per-locale override merged over the base. Line counts genuinely differ by
  // locale when the CSS says so -- a nowrap span relaxed to `white-space:
  // normal` for ja/zh yields a different line count from the same box.
  const merged = { ...b, ...(b.locales?.[locale] ?? {}) };
  const { fontPx, containerPx, maxWidthCh, maxLines } = merged;
  if (!maxLines) return null;

  // Two candidate line widths, in em. `max-width: Nch` is measured in the
  // element's own font, so it needs that font's chRatio -- and the parent's
  // usable width caps it regardless. CSS resolves this as a min(), so we do
  // too: whichever binds first is the real line.
  const fromCh = maxWidthCh && metrics?.chRatio ? maxWidthCh * metrics.chRatio : Infinity;
  const fromBox = fontPx && containerPx ? containerPx / fontPx : Infinity;
  const perLine = Math.min(fromCh, fromBox);
  if (!isFinite(perLine)) return null;
  return Math.round(perLine * maxLines * 100) / 100;
}

function evaluate({ manifest, budgets, messagesDir, metricsDir }) {
  const { locales, sourceLocale, expansion = {}, authoringHeadroom = 0.8 } = manifest;
  const bundles = Object.fromEntries(locales.map((l) => [l, loadLocale(messagesDir, l)]));
  const rows = [];

  for (const el of manifest.elements) {
    if (budgets[el.type] == null) {
      rows.push({ id: el.id, locale: '-', status: 'UNMEASURABLE',
                  note: `no budget defined for type "${el.type}"` });
      continue;
    }
    const font = typeof budgets[el.type] === 'object' ? budgets[el.type].font : null;
    const metrics = loadMetrics(font, metricsDir);

    for (const locale of locales) {
      const budget = resolveBudget(budgets[el.type], locale, metrics);
      const bundle = bundles[locale];
      const base = { id: el.id, type: el.type, locale, budget };

      if (!bundle) {
        rows.push({ ...base, status: 'UNMEASURABLE',
                    note: `no bundle at ${join(messagesDir, locale)} — check "messagesDir" (resolved relative to the manifest)` });
        continue;
      }

      const parts = el.keys.map((k) => bundle[k]);
      const missing = el.keys.filter((k, i) => parts[i] === undefined);

      // Untranslated -> project from source. Never a plain PASS.
      if (missing.length) {
        const src = bundles[sourceLocale];
        const srcParts = src ? el.keys.map((k) => src[k]).filter((v) => v !== undefined) : [];
        if (!srcParts.length) {
          rows.push({ ...base, status: 'UNMEASURABLE',
                      note: `missing in ${locale} and in source: ${missing.join(', ')}` });
          continue;
        }
        const { text } = normalize(srcParts.join(el.join ?? ' '), el.samples);
        const factor = expansion[locale] ?? 1.0;
        const wu = Math.round(measure(text, locale, metrics) * factor * 100) / 100;
        rows.push({ ...base, wu, projected: true,
                    status: wu > budget ? 'PROJECTED-FAIL' : 'PROJECTED-OK',
                    note: `untranslated; ${sourceLocale} x ${factor}` });
        continue;
      }

      const { text, unresolved } = normalize(parts.join(el.join ?? ' '), el.samples);
      if (unresolved.length) {
        rows.push({ ...base, status: 'UNMEASURABLE',
                    note: `unresolved placeholder(s): ${unresolved.join(', ')} — declare "samples"` });
        continue;
      }

      const wu = measure(text, locale, metrics);
      let status = 'PASS';
      if (wu > budget) status = 'FAIL';
      else if (locale === sourceLocale && wu > budget * authoringHeadroom) status = 'WARN';

      const worst = Object.entries(expansion).filter(([l]) => l !== sourceLocale)
        .sort((a, b) => b[1] - a[1])[0];
      const note = status === 'WARN' && worst
        ? `over ${Math.round(authoringHeadroom * 100)}% authoring headroom; ${worst[0]} (x${worst[1]}) projects ${Math.round(wu * worst[1] * 10) / 10}`
        : status === 'FAIL' ? `over by ${Math.round((wu - budget) * 100) / 100} wu` : '';

      rows.push({ ...base, wu, text, status, note });
    }
  }
  return rows;
}

/* -------------------------------------------------------------- report -- */
const ICON = { PASS: '✓', WARN: '!', FAIL: '✗', 'PROJECTED-OK': '~',
               'PROJECTED-FAIL': '✗', UNMEASURABLE: '?' };

function report(rows, { strict }) {
  const byId = new Map();
  for (const r of rows) {
    if (!byId.has(r.id)) byId.set(r.id, []);
    byId.get(r.id).push(r);
  }

  for (const [id, group] of byId) {
    const t = group[0].type ?? '?';
    const bs = [...new Set(group.map((r) => r.budget).filter((v) => v != null))];
    const b = bs.length === 1 ? `${bs[0]} wu` : `${Math.min(...bs)}-${Math.max(...bs)} wu, per locale`;
    console.log(`\n${id}  (${t}, budget ${b})`);
    for (const r of group) {
      const wu = r.wu == null ? '  —  ' : String(r.wu).padStart(6);
      const bar = r.wu != null && r.budget
        ? ' ' + '█'.repeat(Math.min(20, Math.round((r.wu / r.budget) * 20))).padEnd(20, '·')
        : ' '.padEnd(21);
      console.log(`  ${ICON[r.status]} ${r.locale.padEnd(6)}${wu} wu${bar} ${r.status}${r.note ? '  ' + r.note : ''}`);
    }
  }

  const count = (s) => rows.filter((r) => r.status === s).length;
  const fails = count('FAIL') + count('PROJECTED-FAIL') + count('UNMEASURABLE');
  const warns = count('WARN');

  console.log(`\n${'─'.repeat(64)}`);
  console.log(`${byId.size} elements × ${new Set(rows.map((r) => r.locale)).size} locales  ` +
    `→  ${count('PASS')} pass · ${warns} warn · ${count('FAIL')} fail · ` +
    `${count('PROJECTED-FAIL')} projected-fail · ${count('UNMEASURABLE')} unmeasurable`);

  if (fails) { console.log(`\nFAIL — ${fails} blocking issue(s).`); return 1; }
  if (warns && strict) { console.log(`\nFAIL — ${warns} warning(s), --strict.`); return 1; }
  console.log(`\nPASS${warns ? ` — ${warns} warning(s), non-blocking.` : ''}`);
  return 0;
}

/* ---------------------------------------------------------------- main -- */
// Only run the CLI when executed directly, so `measure`/`charWidth` can be
// imported by unit tests without the module exiting the process on import.
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) main();

function main() {
const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
const flag = (n) => argv.includes(`--${n}`);

if (flag('help') || !argv.length) {
  console.log('Usage: node measure-wu.mjs --manifest <file> [--budgets <file>] [--messages <dir>] [--strict] [--json]');
  process.exit(0);
}

const here = new URL('.', import.meta.url).pathname;
const manifestPath = resolve(arg('manifest', 'content-manifest.json'));
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const budgets = JSON.parse(readFileSync(resolve(arg('budgets', join(here, 'budgets.json'))), 'utf8')).budgets;

// Resolve messagesDir against the MANIFEST, not process.cwd() -- otherwise the
// gate reports different results depending on where CI happens to invoke it.
const messagesDir = resolve(dirname(manifestPath), arg('messages', manifest.messagesDir ?? 'messages'));

const metricsDir = join(here, 'metrics');
const rows = evaluate({ manifest, budgets, messagesDir, metricsDir });

if (flag('json')) {
  console.log(JSON.stringify({ manifest: manifestPath, rows }, null, 2));
  process.exit(rows.some((r) => ['FAIL', 'PROJECTED-FAIL', 'UNMEASURABLE'].includes(r.status)) ? 1 : 0);
}
process.exit(report(rows, { strict: flag('strict') }));
}
