import { getTranslations } from 'next-intl/server';

type Item = { q: string; a: string; d: string };

// Fair questions: six cards on the dark ground. The first and the last
// take the full width. The quotation marks come from the messages, so that
// each language uses its own; the opening one hangs outside the text.
export default async function Questions() {
  const t = await getTranslations('home.faq');
  const items = t.raw('items') as Item[];
  return (
    <section className="f-faq">
      <h2 className="f-faq__title" id="questions">
        {t('title')}
      </h2>
      <div className="f-faq__grid">
        {items.map((item) => (
          <figure key={item.q} className="f-faq__card">
            <blockquote>
              <span aria-hidden="true">{t('open')}</span>
              {item.q}
              {t('close')}
            </blockquote>
            <figcaption>
              <span>{item.a}</span>
              <span>{item.d}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
