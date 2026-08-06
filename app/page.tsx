import { redirect } from 'next/navigation';

// Static export has no server, so "/" can't do a real HTTP redirect.
// This root page still gets prerendered as out/index.html; Next injects
// a client-side redirect for the (rare) visitor who lands here directly
// instead of on a locale-prefixed URL.
export default function RootPage() {
  redirect('/en');
}
