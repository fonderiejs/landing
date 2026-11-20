'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/lib/navigation';
import { LINKS } from '@/lib/site';
import Logo from './Logo';
import SeatButton from './SeatButton';

// The bar: three menus and two links on a wide window, a menu button
// below 1024px. It floats over the top of the page and becomes a white
// pill once the page has scrolled.

type Entry = { id: string; label: string; note: string; href: string; kind: 'section' | 'page' | 'out' };
type Menu = { id: string; label: string; entries: Entry[] };

function Chevron() {
  return (
    <svg className="f-nav__chev" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 7.75 10 12.75 15 7.75" />
    </svg>
  );
}

function Out() {
  return (
    <svg className="f-nav__out" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 2.75h4.75V7.5M9 3 2.75 9.25" />
    </svg>
  );
}

export default function Header() {
  const t = useTranslations('common.nav');
  const locale = useLocale();
  // the site is exported with trailing slashes: "/pricing/" and "/pricing" are the same page
  const pathname = usePathname().replace(/\/+$/, '') || '/';
  const onHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [shut, setShut] = useState<string | null>(null);
  const [phone, setPhone] = useState(false);
  const nav = useRef<HTMLDivElement>(null);
  const phoneMenu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  // a section of the home page: an anchor there, the home page at that anchor from anywhere else
  const section = (id: string) => (onHome ? `#${id}` : `/${locale}/#${id}`);

  const menus: Menu[] = [
    {
      id: 'product',
      label: t('product'),
      entries: [
        { id: 'how', label: t('how'), note: t('howNote'), href: section('how-it-works'), kind: 'section' },
        { id: 'features', label: t('features'), note: t('featuresNote'), href: section('features'), kind: 'section' },
        { id: 'run', label: t('run'), note: t('runNote'), href: section('we-run-it'), kind: 'section' },
        { id: 'questions', label: t('questions'), note: t('questionsNote'), href: section('questions'), kind: 'section' },
      ],
    },
    {
      id: 'developers',
      label: t('developers'),
      entries: [
        { id: 'github', label: t('github'), note: t('githubNote'), href: LINKS.github, kind: 'out' },
        { id: 'docs', label: t('docs'), note: t('docsNote'), href: LINKS.docs, kind: 'out' },
        { id: 'packages', label: t('packages'), note: t('packagesNote'), href: LINKS.packages, kind: 'out' },
        { id: 'roadmap', label: t('roadmap'), note: t('roadmapNote'), href: LINKS.roadmap, kind: 'out' },
        { id: 'discord', label: t('discord'), note: t('discordNote'), href: LINKS.discord, kind: 'out' },
      ],
    },
    {
      id: 'company',
      label: t('company'),
      entries: [
        { id: 'contact', label: t('contact'), note: t('contactNote'), href: '/contact', kind: 'page' },
        { id: 'security', label: t('security'), note: t('securityNote'), href: '/security', kind: 'page' },
        { id: 'x', label: t('x'), note: t('xNote'), href: LINKS.x, kind: 'out' },
      ],
    },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // desktop menus: Escape and a press elsewhere close the open one
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      const trigger = nav.current?.querySelector<HTMLButtonElement>(`[aria-controls="f-nav-${open}"]`);
      setShut(open);
      setOpen(null);
      trigger?.focus();
    }
    function onPointerDown(e: PointerEvent) {
      if (!nav.current?.contains(e.target as Node)) setOpen(null);
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  // phone menu: the page behind does not scroll; Escape, a press outside
  // or a window wide enough for the bar closes it
  useEffect(() => {
    document.documentElement.classList.toggle('f-mnav-open', phone);
    if (!phone) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      setPhone(false);
      toggle.current?.focus();
    }
    function onClick(e: MouseEvent) {
      if (!phoneMenu.current?.contains(e.target as Node)) setPhone(false);
    }
    const wide = window.matchMedia('(min-width: 1024px)');
    const onWide = () => {
      if (wide.matches) setPhone(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onClick);
    wide.addEventListener('change', onWide);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('click', onClick);
      wide.removeEventListener('change', onWide);
      document.documentElement.classList.remove('f-mnav-open');
    };
  }, [phone]);

  function entryLink(entry: Entry, className: string, onPick: () => void, withNote: boolean) {
    const body = withNote ? (
      <>
        <span className="f-nav__title">
          {entry.label}
          {entry.kind === 'out' && <Out />}
        </span>
        <span className="f-nav__note">{entry.note}</span>
      </>
    ) : (
      <>
        {entry.label}
        {entry.kind === 'out' && <Out />}
      </>
    );
    if (entry.kind === 'page') {
      return (
        <Link className={className} href={entry.href} onClick={onPick}>
          {body}
        </Link>
      );
    }
    return (
      <a
        className={className}
        href={entry.href}
        onClick={onPick}
        {...(entry.kind === 'out' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {body}
      </a>
    );
  }

  return (
    <header className="f-header" data-scrolled={scrolled}>
      <div className="f-header__inner">
        <nav className="f-bar" data-scrolled={scrolled} aria-label={t('main')}>
          <Link className="f-bar__logo" href="/" aria-label={t('home')}>
            <Logo className="f-bar__mark" />
          </Link>

          <div className="f-nav" ref={nav}>
            {menus.map((menu) => (
              <div
                key={menu.id}
                className="f-nav__dd"
                data-open={open === menu.id ? '' : undefined}
                data-shut={shut === menu.id ? '' : undefined}
                onPointerEnter={(e) => {
                  if (e.pointerType !== 'mouse') return;
                  if (open && open !== menu.id) setOpen(null);
                  if (shut && shut !== menu.id) setShut(null);
                }}
                onPointerLeave={() => {
                  if (shut === menu.id) setShut(null);
                }}
                onBlur={(e) => {
                  if (open === menu.id && !e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(null);
                }}
              >
                <button
                  type="button"
                  className="f-nav__link f-nav__trigger"
                  aria-expanded={open === menu.id}
                  aria-controls={`f-nav-${menu.id}`}
                  onClick={() => {
                    if (open === menu.id) {
                      setOpen(null);
                      setShut(menu.id);
                    } else {
                      setOpen(menu.id);
                      setShut(null);
                    }
                  }}
                >
                  <span>{menu.label}</span>
                  <Chevron />
                </button>
                <div className="f-nav__menu" id={`f-nav-${menu.id}`}>
                  <ul className="f-nav__panel">
                    {menu.entries.map((entry) => (
                      <li key={entry.id}>
                        {entryLink(
                          entry,
                          'f-nav__entry',
                          () => {
                            setOpen(null);
                            setShut(menu.id);
                          },
                          true,
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            <a className="f-nav__link" href={section('how-it-works')}>
              <span>{t('startups')}</span>
            </a>
            <Link className="f-nav__link" href="/pricing" aria-current={pathname === '/pricing' ? 'page' : undefined}>
              <span>{t('pricing')}</span>
            </Link>
          </div>

          <div className="f-bar__end">
            <SeatButton className="f-bar__cta" />
            <div className="f-mnav" data-open={phone ? '' : undefined} ref={phoneMenu}>
              <button
                type="button"
                className="f-mnav__toggle"
                ref={toggle}
                aria-label={phone ? t('closeMenu') : t('openMenu')}
                aria-expanded={phone}
                aria-controls="f-mnav-panel"
                onClick={() => setPhone((v) => !v)}
              >
                <svg className="f-mnav__icon f-mnav__icon--open" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
                <svg className="f-mnav__icon f-mnav__icon--close" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
              <div className="f-mnav__panel" id="f-mnav-panel">
                {menus.map((menu) => (
                  <div key={menu.id} className="f-mnav__group">
                    <p className="f-mnav__head">{menu.label}</p>
                    <ul className="f-mnav__list">
                      {menu.entries.map((entry) => (
                        <li key={entry.id}>{entryLink(entry, 'f-mnav__link', () => setPhone(false), false)}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                <a className="f-mnav__link f-mnav__link--top" href={section('how-it-works')} onClick={() => setPhone(false)}>
                  {t('startups')}
                </a>
                <Link
                  className="f-mnav__link f-mnav__link--top"
                  href="/pricing"
                  aria-current={pathname === '/pricing' ? 'page' : undefined}
                  onClick={() => setPhone(false)}
                >
                  {t('pricing')}
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
