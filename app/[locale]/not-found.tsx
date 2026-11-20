import { Link } from '@/lib/navigation';

export default function NotFound() {
  return (
    <div className="page__card--flush">
      <main className="notfound">
        <p className="eyebrow">Error 404</p>
        <p className="notfound__num">
          4<span className="text-old-accent">0</span>4
        </p>
        <h1 className="notfound__title">This page didn&rsquo;t compose. It may have moved, or never existed.</h1>
        <div className="flex flex-wrap gap-3 justify-center items-center mt-2">
          <Link href="/" className="btn btn--dark">
            Back home
            <span className="btn__chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" width={14} height={14}>
                <path d="M7 17 17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
