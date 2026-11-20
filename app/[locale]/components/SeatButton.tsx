'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { mailto } from '@/lib/site';
import { useSeat } from './SeatProvider';

// The page's one call to action. A click opens the seat form. The link
// under it is what a browser follows when the form is not available: an
// email that asks for a seat, with its subject and first lines written.
export default function SeatButton({ className, children }: { className?: string; children?: ReactNode }) {
  const t = useTranslations('common.cta');
  const seat = useSeat();
  return (
    <a
      className={className}
      href={mailto(t('mailSubject'), t('mailBody'))}
      onClick={(e) => {
        if (!seat.enabled) return;
        e.preventDefault();
        seat.open(e.currentTarget);
      }}
    >
      {children ?? t('reserve')}
    </a>
  );
}
