// Addresses and settings the whole site shares.

export const MAIL = 'hello@fonderiejs.com';

export const LINKS = {
  github: 'https://github.com/fonderiejs/fonderie',
  docs: 'https://github.com/fonderiejs/fonderie#readme',
  packages: 'https://www.npmjs.com/org/fonderie',
  roadmap: 'https://github.com/orgs/fonderiejs/projects',
  discord: 'https://discord.gg/EcZnGfdBhj',
  x: 'https://x.com/fonderiejs',
} as const;

export function mailto(subject?: string, body?: string) {
  const query = [
    subject ? `subject=${encodeURIComponent(subject)}` : '',
    body ? `body=${encodeURIComponent(body)}` : '',
  ]
    .filter(Boolean)
    .join('&');
  return `mailto:${MAIL}${query ? `?${query}` : ''}`;
}

// The seat form ("Reserve a seat").
//
// NEXT_PUBLIC_SEAT_ENDPOINT is the address of the service that stores a
// request and sends the visitor the email that states the promise. The
// form posts one field there (NEXT_PUBLIC_SEAT_FIELD, "email" by default).
//
// With no endpoint a published site must not pretend: the button then
// opens the visitor's own mail program with a message that asks for a
// seat. In development, or with NEXT_PUBLIC_SEAT_PREVIEW=1, the form opens
// as a preview that says on the page that nothing was sent or saved.
export const SEAT = {
  endpoint: process.env.NEXT_PUBLIC_SEAT_ENDPOINT ?? '',
  field: process.env.NEXT_PUBLIC_SEAT_FIELD ?? 'email',
  preview: process.env.NEXT_PUBLIC_SEAT_PREVIEW === '1' || process.env.NODE_ENV !== 'production',
};
