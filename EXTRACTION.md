# Full Page Content Extraction — Fonderie Homepage

Source: `http://localhost:8080/` (HTTP 200)

---

## PAGE METADATA
- **URL:** http://localhost:8080/
- **Page Title:** Fonderie — The open standard for the SaaS backend
- **Meta Description:** Every SaaS rebuilds the same auth, billing, teams, and multi-tenancy before writing a single line of product code. Fonderie is the open standard for that infrastructure — a library that runs in your repo, on your server, against your database. Compose it in an afternoon; spend the rest on the part that's actually yours.
- **Language:** en

## NAVIGATION / HEADER
- **Logo text:** Fonderie (image lockup, alt="Fonderie")
- **Nav links:**
  - Product → /products
  - How it works → #how
  - GitHub → https://github.com/fonderiejs/fonderie
- **CTA buttons:** Get started → /contact
- **Mobile menu (burger) duplicates:** Product (/products), How it works (#how), GitHub (https://github.com/fonderiejs/fonderie)

## HERO SECTION
- **Eyebrow:** Open source · MIT · npm install @fonderie/core
- **Headline (H1):** Every SaaS rebuilds the same backend. Yours doesn't have to.
- **Body text:** Auth, billing, teams, permissions, multi-tenancy — two to three months of infrastructure before you write a single line of product code. Fonderie is the open standard for the parts every product shares, so you ship product on day one, not week nine.
- **Primary CTA:** `$ npm install @fonderie/core ⧉` (button, copy-to-clipboard; copies "npm install @fonderie/core")
- **Secondary CTA:** View on GitHub → https://github.com/fonderiejs/fonderie (GitHub icon)
- **Social proof (if any):** [none in hero]

- **Visual block — "Ledger" (Without vs With Fonderie):**
  - **Column 1 heading:** Without Fonderie · ~9 weeks
    - Week 1–2 — Auth setup
    - Week 3 — Team / org model
    - Week 4 — Stripe wiring
    - Week 5 — Email system
    - Week 6 — Permissions
    - Week 7 — Multi-tenancy
    - Week 8 — Remote config
    - Week 9 — Finally write product
    - Tally: Two months of code the world already wrote — re-shipping the same security flaws.
  - **Column 2 heading:** With Fonderie · 2 days
    - Day 1 — npm install
    - Day 1 — Register the modules you need
    - Day 1 — Write product logic
    - Day 2 — Ship to users
    - Tally: One open, audited standard for the shared parts — so you spend yourself on what's actually yours.

## META STRIP (below hero)
- Library, not a service
- Your server · your database
- MIT-licensed
- Free until your first customer

## THE PROBLEM
- **Eyebrow:** The problem
- **Section heading (H2):** Every SaaS rebuilds the same infrastructure before writing a single line of product code.
- **Body copy:** Whether it's a scheduling tool, an analytics platform, or a developer API, the first two to three months go to auth, billing, teams, permissions, and multi-tenancy — the same plumbing, re-derived from scratch, at startups and S&P 500s alike. Customers compare that to hiring a backend engineer for three months, not to a dev tool.
- **Pullquote (blockquote):** HTTP won because it standardized the boring parts — GET, POST, 2xx/4xx/5xx — and nobody has re-argued them since. The SaaS backend never got its standard. LLMs made this faster, not better: they're faster horses, improvising a new security model every session.
  - **Citation:** Fonderie is the engine — a standard, not more horses.

## THE SOLUTION
- **Eyebrow:** The solution
- **Section heading (H2):** Compose, don't regenerate.
- **Timeline step 1 title:** Install the suite
  - **Code snippet:**
    ```
    $ npm install @fonderie/core
    ```
    (Copy button labeled "Copy" → copies "npm install @fonderie/core")
- **Timeline step 2 title:** Register the modules you need
  - **Code snippet:**
    ```typescript
    // fonderie.config.ts — the wiring is the product
    import { defineApp } from "@fonderie/core";
    import { auth, billing, workspaces } from "@fonderie/core";

    export default defineApp({
      modules: [
        auth({ passkeys: true, oauth: ["google"] }),
        workspaces({ multiTenant: true }),   // one agency, ten clients
        billing({ provider: "stripe", seats: true }),
      ],
    });
    ```
- **Timeline step 3 title:** Write your product logic — the infrastructure is done
  - **Code snippet:**
    ```typescript
    // The auth, tenant scoping, and billing are already wired.
    // You write the part only you can write.
    export const createSchedule = workspace.action(async (ctx, input) => {
      // ctx.user, ctx.workspace, ctx.can() — all provided.
      return ctx.db.schedules.create(input);
    });
    ```
  - **Status pill:** Deployed · self-hosted · auditable

## PROOF
- **Eyebrow:** Proof
- **Section heading (H2):** We built the same SaaS three times. Only the Fonderie build shipped clean.
- **Body copy:** Same spec, same AI assistant, three from-scratch builds — one composing Fonderie modules, two without. Two of the three hand-built backends shipped a real, exploitable security hole. The Fonderie build had zero, in about a third of the code.
- **Table:**

  | Same SaaS, built 3× | Build A | Build B | Fonderie |
  |---|---|---|---|
  | Lines of backend code | ~4,200 | ~3,800 | ~1,300 |
  | Time to first deploy | 9 wks | 8 wks | 2 days |
  | Security vulnerabilities | 2 | 1 | 0 |
  | You own the source | Yes | Yes | Yes (MIT) |

## WHAT YOU GET
- **Eyebrow:** What you get
- **Section heading (H2):** The parts every product shares — done once, done right.
- **Body copy:** The individual pieces are free and open everywhere. The wiring, the opinions, and the cohesion between them are the product. Each module is plain TypeScript you own, register, and can read end to end.
- **Module cards:**
  - **@fonderie/core** — The app definition, module registry, and the standard shapes everything else composes into.
  - **Auth** — Sessions, passkeys, OAuth, and password flows — the security model, decided once and audited.
  - **Billing** — Subscriptions, seats, usage, and webhooks. Stripe out of the box; swap the provider behind it.
  - **Workspaces** — Teams, orgs, invites, and multi-tenancy. One agency, ten client tenants, zero re-implementation.
  - **Permissions** — Roles and `ctx.can()` checks scoped to the current tenant, wired through every action.
  - **Email & config** — Transactional email and remote configuration — the last two things you'd otherwise bolt on in week eight.
- **Footnote line:** Dependencies point one way — modules depend on core, never on your product. Your code stays yours.

## PRICING
- **Eyebrow:** Pricing
- **Section heading (H2):** Free until your first paying customer.
- **Value anchor:** ~~Hire a backend engineer for 3 months — $30–60k~~ → start with Fonderie today
  - **Sub:** You pay the moment your SaaS goes live and generates revenue — with the same billing module you use to charge your own users.
- **Pricing tiers:**
  - **Free · $0** — Building, pre-revenue. One project. — Full open-source core / Self-hosted, MIT / Every module
  - **Launched · $49/mo** — Live and earning, under $10k MRR. — Everything in Free / Update channel / Community support
  - **Growing · $149/mo** — Scaling with a team behind you. — Team features / Priority support / Multi-project
  - **Enterprise · Custom** — SSO, compliance, and an SLA. — SSO / SAML / Compliance & SLA / Design partner access

## THE DIFFERENCE
- **Eyebrow:** The difference
- **Section heading (H2):** A library, not a service.
- **Body copy:** You are Drizzle, not Supabase. Next.js, not Vercel. Fonderie is code in your `node_modules` — no Fonderie server is ever in your request path.
- **Comparison cards:**
  - **Hosted backends**
    - Where it runs — Their infrastructure, in your request path
    - Your data — Their database, their region, their outages
    - Ownership — Rented — per-MAU pricing, lock-in by design
    - Providers — Whatever they support, however they support it
  - **Fonderie**
    - Where it runs — Your process, your server — nothing in between
    - Your data — Your database. We never see it.
    - Ownership — Owned — MIT source you can read, fork, and audit
    - Providers — Swap Stripe, auth, or email without touching product code

## OBJECTIONS / FAQ (accordion — `<details>`)
- **Eyebrow:** Objections, answered
- **Section heading (H2):** The four questions everyone asks.
- **Q: Is this a service? Do you host my data?**
  A: No. Fonderie is a library, not a service — the way Drizzle is not Supabase and Next.js is not Vercel. It lives in your `node_modules`, runs inside your process, against your database, on your server. No Fonderie server is ever in your request path, and we never see or host your data.
- **Q: Can I swap Stripe for PayPal — or anything else?**
  A: Yes. The modules define the standard shape — subscriptions, seats, webhooks — and providers plug in behind it. Start on Stripe, move to Paddle, LemonSqueezy, PayPal, or your own processor without rewriting product code. The integration is the product; the provider is a detail.
- **Q: Is it only for new projects?**
  A: It shines on greenfield SaaS, where you skip two to three months of infrastructure outright. But every module is plain TypeScript you own and register yourself, so you can also adopt just one — say billing or workspaces — inside an existing codebase.
- **Q: What do I actually own?**
  A: All of it. Fonderie Core is MIT-licensed — read, fork, and modify every module at `github.com/fonderiejs/fonderie`. There's no dashboard to log into to keep your app running, no per-MAU meter, and no way for us to turn it off. What you pay for is the wiring, the opinions, and the ongoing cohesion between the pieces.

## FINAL CTA
- **Section heading (H2):** Spend month one on your product, not on auth.
- **Body:** One open, audited standard for the parts every SaaS shares. Compose it in an afternoon and get back to the only part that's actually yours.
- **Primary CTA:** `$ npm install @fonderie/core ⧉` (copy button → "npm install @fonderie/core")
- **Secondary CTA:** Star on GitHub → https://github.com/fonderiejs/fonderie
- **Ribbon tags:** Agencies: 10 client SaaS from one install · Solo founders: ship in a weekend · Teams: never re-implement orgs again

## FOOTER
- **Column — Product** (head links to /products): The SDK → /products#sdk · Core → /products#core · Connectors → /products#connectors
- **Column — Resources** (head links to /resources): Documentation → /resources#docs · Support → /resources#support
- **Column — Open source** (head links to https://github.com/fonderiejs/fonderie): GitHub → https://github.com/fonderiejs/fonderie · npm install @fonderie/core → https://github.com/fonderiejs/fonderie
- **Column — Company:** Contact → /contact · Press → /contact · Investors → /contact
- **Legal text:** © 2026 Fonderie, Inc.
- **Social links:** GitHub → https://github.com/fonderiejs/fonderie · X → https://x.com/fonderiejs
- **Theme switcher:** System / Light / Dark

---

## ALL LINKS

| Link Text | Href | Location |
|---|---|---|
| Fonderie (logo) | / | Nav |
| Product | /products | Nav |
| How it works | #how | Nav |
| GitHub | https://github.com/fonderiejs/fonderie | Nav |
| Get started | /contact | Nav CTA |
| View on GitHub | https://github.com/fonderiejs/fonderie | Hero |
| Star on GitHub | https://github.com/fonderiejs/fonderie | Final CTA |
| The SDK | /products#sdk | Footer |
| Core | /products#core | Footer |
| Connectors | /products#connectors | Footer |
| Documentation | /resources#docs | Footer |
| Support | /resources#support | Footer |
| GitHub | https://github.com/fonderiejs/fonderie | Footer |
| npm install @fonderie/core | https://github.com/fonderiejs/fonderie | Footer |
| Contact | /contact | Footer |
| Press | /contact | Footer |
| Investors | /contact | Footer |
| GitHub (icon) | https://github.com/fonderiejs/fonderie | Footer social |
| Fonderie on X | https://x.com/fonderiejs | Footer social |

## ALL BUTTONS

| Button Text | Action | Section |
|---|---|---|
| $ npm install @fonderie/core ⧉ | copy "npm install @fonderie/core" | Hero |
| Copy | copy "npm install @fonderie/core" | Solution step 1 |
| $ npm install @fonderie/core ⧉ | copy "npm install @fonderie/core" | Final CTA |
| Toggle menu (burger) | open mobile nav | Nav (mobile) |
| System / Light / Dark | set theme | Footer |

## STYLISTIC NOTES
- **Color scheme:** Warm-tinted, theme-switchable (System/Light/Dark; dark is emphasized as the default developer context). Single molten-orange accent, gold secondary. No gradients beyond a subtle hero glow.
- **Typography style:** Sans-serif for display/body; JetBrains Mono monospace used heavily for eyebrows, code, ledger, table figures, and CTAs.
- **Layout pattern:** Single centered column (max ~1040px) with full-width bordered section dividers; internal grids for the ledger (2-col), module cards, pricing (4-col), and comparison (2-col).
- **Visual density:** Code-heavy and editorial; minimal imagery (only the logo + inline SVG icons). No illustrations or stock art.
- **Tone observation:** Technical.

## NOTES ON DYNAMIC / HIDDEN CONTENT
- No modal dialogs, dropdown menus, cookie banner, or announcement bar.
- Only dynamic/hidden content: the FAQ `<details>` accordions (fully extracted above) and the mobile nav menu (duplicates the desktop nav links).
