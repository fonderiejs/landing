'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { SEAT } from '@/lib/site';

// The seat form: what "Reserve a seat" opens. One field, a seat that is
// scarce for a true reason (two builds a week), and a confirmation that
// says an email with the promise is on its way. See lib/site.ts for what
// happens when no service is connected.

type SeatContextValue = { enabled: boolean; open: (from?: HTMLElement | null) => void };

const SeatContext = createContext<SeatContextValue>({ enabled: false, open: () => {} });

export function useSeat() {
  return useContext(SeatContext);
}

type Phase = 'ask' | 'sending' | 'done';

export default function SeatProvider({ children }: { children: ReactNode }) {
  const t = useTranslations('common.seat');
  const enabled = Boolean(SEAT.endpoint) || SEAT.preview;
  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>('ask');
  const [email, setEmail] = useState('');
  const [failed, setFailed] = useState(false);
  const back = useRef<HTMLElement | null>(null);
  const card = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const doneTitle = useRef<HTMLHeadingElement>(null);

  const open = useCallback((from?: HTMLElement | null) => {
    back.current = from ?? (document.activeElement as HTMLElement | null);
    setPhase('ask');
    setEmail('');
    setFailed(false);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // back to the button that opened it, without moving the page
    const target = back.current;
    back.current = null;
    if (target?.isConnected) target.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('f-seat-open', isOpen);
    if (!isOpen) return;
    const timer = window.setTimeout(() => input.current?.focus(), 30);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && phase === 'done') doneTitle.current?.focus();
  }, [isOpen, phase]);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        close();
        return;
      }
      if (e.key !== 'Tab' || !card.current) return;
      // keep the Tab key inside the form while it is open
      const stops = Array.from(card.current.querySelectorAll<HTMLElement>('button, input')).filter(
        (n) => n.getClientRects().length > 0 && !(n as HTMLButtonElement).disabled,
      );
      if (stops.length === 0) return;
      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const inside = active ? stops.includes(active) : false;
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !card.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [isOpen, close]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const address = email.trim();
    if (!address || !input.current?.checkValidity()) {
      setFailed(true);
      input.current?.focus();
      return;
    }
    if (!SEAT.endpoint) {
      // preview: nothing is sent, and the confirmation says so
      setPhase('done');
      return;
    }
    setPhase('sending');
    // A real form posted into a hidden frame: the page stays where it is,
    // and the service answers the visitor by email.
    let sink = document.querySelector<HTMLIFrameElement>('iframe[name="f-seat-sink"]');
    if (!sink) {
      sink = document.createElement('iframe');
      sink.name = 'f-seat-sink';
      sink.title = '';
      sink.hidden = true;
      sink.tabIndex = -1;
      sink.setAttribute('aria-hidden', 'true');
      document.body.appendChild(sink);
    }
    const form = document.createElement('form');
    form.method = 'post';
    form.action = SEAT.endpoint;
    form.target = 'f-seat-sink';
    form.hidden = true;
    const field = document.createElement('input');
    field.type = 'hidden';
    field.name = SEAT.field;
    field.value = address;
    form.appendChild(field);
    document.body.appendChild(form);
    let over = false;
    const end = () => {
      if (over) return;
      over = true;
      form.remove();
      setPhase('done');
    };
    sink.addEventListener('load', end, { once: true });
    window.setTimeout(end, 4000);
    form.submit();
  }

  return (
    <SeatContext.Provider value={{ enabled, open }}>
      {children}
      {enabled && (
        <div
          id="f-seat"
          className="f-seat"
          role="dialog"
          aria-modal="true"
          aria-labelledby={phase === 'done' ? 'f-seat-done-title' : 'f-seat-title'}
          hidden={!isOpen}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="f-seat__card" ref={card}>
            <button type="button" className="f-seat__close" aria-label={t('close')} onClick={close}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
            {phase !== 'done' ? (
              <div className="f-seat__ask">
                <p className="f-seat__seats">{t('seats')}</p>
                <h2 className="f-seat__title" id="f-seat-title">
                  {t('title')}
                </h2>
                <p className="f-seat__lede">{t('lede')}</p>
                <form className="f-seat__form" noValidate onSubmit={submit}>
                  <label className="f-seat__label" htmlFor="f-seat-email">
                    {t('fieldLabel')}
                  </label>
                  <div className="f-seat__row">
                    <input
                      ref={input}
                      id="f-seat-email"
                      className="f-seat__input"
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      autoCapitalize="off"
                      spellCheck={false}
                      placeholder={t('placeholder')}
                      aria-describedby="f-seat-error"
                      aria-invalid={failed || undefined}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (failed) setFailed(false);
                      }}
                    />
                    <button type="submit" className="f-seat__submit" disabled={phase === 'sending'}>
                      {phase === 'sending' ? t('sending') : t('submit')}
                    </button>
                  </div>
                  <p id="f-seat-error" className="f-seat__error" role="alert">
                    {failed ? t('error') : ''}
                  </p>
                  <ol className="f-seat__next">
                    <li>{t('next1')}</li>
                    <li>{t('next2')}</li>
                    <li>{t('next3')}</li>
                  </ol>
                  <p className="f-seat__small">{t('small')}</p>
                </form>
              </div>
            ) : (
              <div className="f-seat__done">
                <h2 className="f-seat__title" id="f-seat-done-title" tabIndex={-1} ref={doneTitle}>
                  {t('doneTitle')}
                </h2>
                <p className="f-seat__lede">{t('doneText', { email: email.trim() })}</p>
                {!SEAT.endpoint && <p className="f-seat__preview">{t('previewNote')}</p>}
                <button type="button" className="f-seat__ok" onClick={close}>
                  {t('doneButton')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </SeatContext.Provider>
  );
}
