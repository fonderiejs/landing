#!/usr/bin/env node
/**
 * extract-metrics.mjs — vendor font ADVANCE WIDTHS, not font binaries.
 *
 * The gate needs one number per glyph, not outlines. Extracting hmtx/cmap to
 * JSON costs a few KB of text per family instead of ~60-300KB of binary, and
 * sidesteps both the binary-asset question and the font-redistribution one:
 * an advance width is a measurement, not a copy of the typeface.
 *
 * Run this ONCE per font version and commit the JSON. CI then never touches
 * the network -- the gate reads only what is committed, so a Google Fonts
 * outage or a silent upstream revision cannot change a build's verdict.
 *
 * Usage:
 *   node extract-metrics.mjs "Instrument Serif" [weight] > metrics/instrument-serif.json
 */

const FAMILY = process.argv[2];
const WEIGHT = process.argv[3] ?? '400';
if (!FAMILY) { console.error('usage: extract-metrics.mjs "<Family Name>" [weight]'); process.exit(1); }

// Latin-1 + Latin Extended-A + the punctuation that actually shows up in UI copy.
// Anything outside this set falls back to UAX #11 at measure time, which is the
// correct model for CJK anyway.
const RANGES = [[0x20,0x7e],[0xa0,0xff],[0x100,0x17f],[0x2010,0x2027],[0x2030,0x203e],
                [0x20ac,0x20ac],[0x2122,0x2122],[0x2212,0x2212]];

const UA = 'Mozilla/5.0 (Windows NT 6.1)';   // coaxes a plain TTF out of the CSS API
const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(FAMILY)}:wght@${WEIGHT}`;
const css = await (await fetch(cssUrl, { headers: { 'User-Agent': UA } })).text();
const m = css.match(/url\((https:\/\/[^)]+\.ttf)\)/);
if (!m) { console.error(`no TTF in CSS for "${FAMILY}" @ ${WEIGHT}:\n${css.slice(0, 400)}`); process.exit(1); }
const ttfUrl = m[1];
const b = Buffer.from(await (await fetch(ttfUrl)).arrayBuffer());

/* ---- sfnt ---- */
const tbl = {};
for (let i = 0, n = b.readUInt16BE(4); i < n; i++) {
  const o = 12 + i * 16;
  tbl[b.toString('ascii', o, o + 4).trim()] = b.readUInt32BE(o + 8);
}
const upem = b.readUInt16BE(tbl.head + 18);
const nhm  = b.readUInt16BE(tbl.hhea + 34);
const adv  = (g) => b.readUInt16BE(tbl.hmtx + Math.min(g, nhm - 1) * 4);

/* ---- cmap format 4 ---- */
const cm = tbl.cmap;
let sub = null;
for (let i = 0, n = b.readUInt16BE(cm + 2); i < n; i++) {
  const r = cm + 4 + i * 8, pid = b.readUInt16BE(r), eid = b.readUInt16BE(r + 2);
  const off = cm + b.readUInt32BE(r + 4);
  if (b.readUInt16BE(off) === 4 && ((pid === 3 && eid === 1) || pid === 0)) { sub = off; break; }
}
if (sub == null) { console.error('no format-4 cmap subtable'); process.exit(1); }
const segX2 = b.readUInt16BE(sub + 6), seg = segX2 / 2;
const END = sub + 14, START = END + segX2 + 2, DELTA = START + segX2, RANGE = DELTA + segX2;
function gid(cp) {
  for (let i = 0; i < seg; i++) {
    if (b.readUInt16BE(END + i * 2) < cp) continue;
    const s = b.readUInt16BE(START + i * 2);
    if (s > cp) return 0;
    const ro = b.readUInt16BE(RANGE + i * 2), d = b.readInt16BE(DELTA + i * 2);
    if (ro === 0) return (cp + d) & 0xffff;
    const g = b.readUInt16BE(RANGE + i * 2 + ro + (cp - s) * 2);
    return g === 0 ? 0 : (g + d) & 0xffff;
  }
  return 0;
}

const advances = {};
let covered = 0, total = 0;
for (const [lo, hi] of RANGES) {
  for (let cp = lo; cp <= hi; cp++) {
    total++;
    const g = gid(cp);
    if (!g) continue;                       // absent -> falls back at measure time
    covered++;
    advances[cp] = Math.round((adv(g) / upem) * 1000) / 1000;
  }
}

console.log(JSON.stringify({
  family: FAMILY,
  weight: WEIGHT,
  source: ttfUrl,
  unitsPerEm: upem,
  chRatio: advances[0x30],                  // the CSS `ch` unit, in em
  coverage: `${covered}/${total}`,
  advances,
}, null, 0));
