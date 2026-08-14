import { cn } from '@/lib/utils';
import { type CSSProperties, type ElementType, type ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/* Row                                                                */
/* ------------------------------------------------------------------ */

interface RowProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  cols?: number;        // default 12
  gutter?: string;      // e.g. 'clamp(28px, 4vw, 48px)'
  ledger?: boolean;     // 1px gap + var(--line) border trick
  align?: 'start' | 'center' | 'end' | 'stretch';
  style?: CSSProperties;
}

export function Row({
  children,
  className,
  as: Tag = 'div',
  cols,
  gutter,
  ledger,
  align,
  style,
  ...rest
}: RowProps) {
  return (
    <Tag
      className={cn(
        'grid',
        ledger && 'grid--ledger',
        align && `grid--align-${align}`,
        className
      )}
      style={{
        ...(cols && { '--grid-columns': cols }),
        ...(gutter && { '--grid-gutter': gutter }),
        ...style,
      } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Col                                                                */
/* ------------------------------------------------------------------ */

interface ColProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  span?: number;        // 1-12  (desktop / 768px+)
  start?: number;       // 1-12  (column offset)
  spanSm?: number;      // 1-12  (mobile < 768px, opt-in)
}

export function Col({
  children,
  className,
  as: Tag = 'div',
  span = 12,
  start,
  spanSm,
  ...rest
}: ColProps) {
  return (
    <Tag
      className={cn(
        'col',
        `col--${span}`,
        start && `col--start-${start}`,
        spanSm && `col-sm--${spanSm}`,
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
