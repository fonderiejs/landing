import { codeToHtml } from 'shiki';
import { cn } from '@/lib/utils';

// Server Component: Shiki renders to static HTML at build time (fits
// static export - no client-side highlighting runtime shipped).
export default async function CodeBlock({
  code,
  lang = 'typescript',
  className,
}: {
  code: string;
  lang?: string;
  className?: string;
}) {
  const html = await codeToHtml(code, {
    lang,
    theme: 'github-dark-default',
    // github-dark-default's comment grey (#8B949E) renders under the
    // 4.5:1 AA text-contrast threshold at this font size against the
    // panel background once anti-aliasing is factored in - bump it up.
    colorReplacements: { '#8b949e': '#9aa4ae' },
  });

  return <div className={cn('code-block', className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
