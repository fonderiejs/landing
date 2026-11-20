import { getTranslations } from 'next-intl/server';

// The dark band of names. It holds only names Fonderie may truthfully
// show: the AI assistants the parts work with, as the product README lists
// them. Never "trusted by", never a partner.
// Icons: @lobehub/icons-static-svg (MIT), recoloured; the marks belong to
// their owners. any.svg is ours.
const NAMES = [
  { name: 'Claude Code', logo: 'claudecode' },
  { name: 'Kimi Code', logo: 'kimi' },
  { name: 'Cursor', logo: 'cursor' },
  { name: 'Codex', logo: 'codex' },
  { name: 'Gemini CLI', logo: 'geminicli' },
];

export default async function Band() {
  const t = await getTranslations('home.band');
  return (
    <section className="f-band">
      {/* the line slides down behind the dark band as the band comes up the window; the mark across
          the middle of this block is what the style sheet measures that by */}
      <div className="relative flex items-center justify-center px-4 py-5 md:px-10 md:py-6">
        <span className="f-band__mark" aria-hidden="true" />
        <h2 className="f-band__headline">{t('headline')}</h2>
      </div>
      <div className="f-band__dark">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <p className="f-band__heading">{t('heading')}</p>
          <div className="grid grid-cols-3 md:grid-cols-6">
            {/* each name sits in a cell as wide as its column. A name wider than its cell runs over it:
                how far is decided between the cell and the name, and browsers decide it differently,
                so the cell is kept as a box of its own */}
            {NAMES.map((item) => (
              <div key={item.logo} className="f-band__cell">
                <span className="f-band__item">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="f-band__logo" src={`/images/band/${item.logo}.svg`} alt="" width={24} height={24} loading="lazy" />
                  <span>{item.name}</span>
                </span>
              </div>
            ))}
            <div className="f-band__cell">
              <span className="f-band__item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="f-band__logo" src="/images/band/any.svg" alt="" width={24} height={24} loading="lazy" />
                <span>{t('any')}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
