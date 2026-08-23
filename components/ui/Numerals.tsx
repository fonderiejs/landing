import type { ReactNode } from 'react';

// A run of digits, allowing "," and "." only *between* digits.
//
// That inner-only rule is what keeps punctuation out of the span. Both
// characters are in the font subset, so swallowing them would render
// fine - but "costs $30." would put the sentence's full stop in a
// different face than the sentence, and "3 services, 3 bills" would do
// the same to the list comma. Requiring a digit on both sides means
// "1,300" and "4.5" stay whole while trailing punctuation stays out.
//
// Deliberately not anchored and not letter-aware: "$30K" yields "30",
// leaving "$" and "K" in the surrounding type, which is what we want.
// The consequence is that a token like "AES-256-GCM" would yield "256",
// splitting an identifier across two faces - so this is applied at
// chosen call sites rather than blanket-applied to every string. See the
// security page note in the commit that introduced this.
const DIGIT_RUN = /\d+(?:[.,]\d+)*/g;

/**
 * Splits `text` into plain strings and <span class="numeral"> figures.
 *
 * Returns nodes, so it belongs in element children - never in an
 * attribute (href, title, aria-label, alt). Passing an attribute value
 * through this would stringify to "[object Object]".
 */
export function withNumerals(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;

  // Fresh regex per call: DIGIT_RUN carries the /g flag, and sharing one
  // instance means sharing its lastIndex cursor across calls.
  for (const m of text.matchAll(new RegExp(DIGIT_RUN))) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    out.push(
      <span key={at} className="numeral">
        {m[0]}
      </span>
    );
    last = at + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));

  return out;
}

/**
 * Wraps every figure in its children so numbers carry the .numeral face.
 *
 *   <Numerals>{t('compareNote')}</Numerals>
 *
 * Takes a plain string on purpose. Message strings are the intended
 * input, and accepting arbitrary nodes would mean walking a tree and
 * guessing which text is safe to rewrite.
 */
export default function Numerals({ children }: { children: string }) {
  return <>{withNumerals(children)}</>;
}
