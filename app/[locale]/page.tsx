import { setRequestLocale } from 'next-intl/server';
import Top from './sections/Top';
import Band from './sections/Band';
import Steps from './sections/Steps';
import Cast from './sections/Cast';
import Questions from './sections/Questions';
import Parts from './sections/Parts';
import RunIt from './sections/RunIt';

// The founder page. The bar, the footer and the seat form come from the
// layout, so every page of the site carries the same ones.
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <Top />
      <Band />
      <Steps />
      <Cast />
      <Questions />
      <Parts />
      <RunIt />
    </main>
  );
}
