'use client';

import { useState } from 'react';

export default function CopyButton({ text, copyLabel, copiedLabel }: { text: string; copyLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="hero__copy-btn"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={13} height={13}>
        <rect x={9} y={9} width={11} height={11} rx={2} />
        <path d="M5 15V5a2 2 0 0 1 2-2h10" />
      </svg>
      <span>{copied ? copiedLabel : copyLabel}</span>
    </button>
  );
}
