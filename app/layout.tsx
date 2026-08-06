// Intentionally minimal: the actual <html>/<body> (with the per-locale
// `lang` attribute) lives in app/[locale]/layout.tsx. Next.js requires a
// root layout to exist, but a descendant layout is allowed to own the
// document shell instead - the standard next-intl App Router pattern.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
