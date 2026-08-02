# Full Page Content Extraction — Fonderie Homepage

Source: `http://localhost:8080/` (HTTP 200) — reflects committed state `73845dd`.

---

## PAGE METADATA
- **URL:** http://localhost:8080/
- **Page Title:** Fonderie — The open standard for the SaaS backend
- **Meta Description:** Every SaaS rebuilds the same auth, billing, teams, and multi-tenancy before writing a single line of product code. Fonderie is the open standard for that infrastructure — a library that runs in your repo, on your server, against your database. Compose it in an afternoon; spend the rest on the part that's actually yours.
- **Language:** en

## NAVIGATION / HEADER
- **Logo text:** Fonderie (image lockup, alt="Fonderie")
- **Nav links:**
  - The solution → #how
  - Packages → #packages
  - GitHub → https://github.com/fonderiejs/fonderie
- **CTA buttons:** Get started → https://github.com/fonderiejs/fonderie (target="_blank" rel="noopener noreferrer")
- **Mobile menu (burger) duplicates:** The solution (#how), Packages (#packages), GitHub (https://github.com/fonderiejs/fonderie)

## HERO SECTION
- **Eyebrow:** Open source · MIT · npx @fonderie/create
- **Headline (H1):** The open standard for the SaaS backend.
- **Subheadline / Body text:** Auth, billing, teams, permissions, multi-tenancy — two to three months of infrastructure before you write a single line of product code. Fonderie standardizes the parts every product shares, so you ship product on day one, not week nine. Your AI assistant composes the modules; you write what matters.
- **Primary CTA:** `$ npx @fonderie/create my-saas ⧉` (button, copy-to-clipboard → copies "npx @fonderie/create my-saas")
- **Secondary CTA:** View on GitHub → https://github.com/fonderiejs/fonderie (GitHub icon)
- **Social proof (line 1):** MIT-licensed · Open source on GitHub · Zero external servers in your stack
- **Social proof (line 2 / maturity badge):** Pre-1.0 and production-ready. MIT-licensed. Auditable end to end.

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
    - Day 1 — npx @fonderie/create
    - Day 1 — Register the modules you need
    - Day 1 — Write product logic
    - Day 2 — Ship to users
    - Tally: One open, audited standard for the shared parts — so you spend yourself on what's actually yours.
  - **Value anchor (below ledger):** Hiring a backend engineer for 3 months: ~~$30–60k~~.  Starting with Fonderie: free and open source.

## AI-COMPATIBILITY BADGE STRIP (below hero)
- **Lead:** 🤖 Works with
- **Pills:** Claude Code · Cursor · Codex · Windsurf · Any code-reading AI

## META STRIP
- `npx @fonderie/create` scaffolding
- Your server · your database
- MIT-licensed
- ★ Free and open source (visually emphasized — bold + star)

## THE PROBLEM
- **Eyebrow:** The problem
- **Section heading (H2):** Every SaaS rebuilds the same infrastructure before writing a single line of product code.
- **Body copy:** Whether you're building a scheduling tool or an analytics platform, you still have to build auth, billing, team management, and permissions before you can build your actual product. That's two to three months spent on infrastructure that has nothing to do with why your customers will pay you.

## BUILT FOR VIBE CODERS
- **Eyebrow:** Built for vibe coders
- **Section heading (H2):** Your AI already knows how to use this.
- **Body copy:** Your AI reads the module, understands the standard shape, and composes it correctly. No guessed auth. No hallucinated endpoints. Just proven modules, wired together.
- **Comparison cards (dot markers, no numbering):**
  - **Without Fonderie**
    - AI regenerates auth from scratch
    - Different every session — no shared standard
    - Ships the same security holes, again
  - **With Fonderie**
    - AI reads `@fonderie/auth`
    - Composes the standard shape, the same way every time
    - Audited, consistent, secure — by default

## THE SOLUTION (id="how")
- **Eyebrow:** The solution
- **Section heading (H2):** Compose, don't regenerate.
- **Timeline step 1 title:** Scaffold your project
  - **Code snippet:**
    ```
    $ npx @fonderie/create my-saas
    ```
    (Copy button labeled "Copy" → copies "npx @fonderie/create my-saas")
  - **Step caption:** Select your modules. The CLI installs dependencies and wires a working project — auth, billing, workspaces — in one command.
- **Timeline step 2 title:** Let your AI compose the wiring
  - **Body:** Your assistant reads the module definitions and generates the config. You describe your product; it handles the plumbing.
  - **Chat bubble (user):** Add auth with Google OAuth, team workspaces with multi-tenancy, and Stripe billing with per-seat pricing.
  - **Code snippet (AI-generated):**
    ```typescript
    // fonderie.config.ts — generated by your AI
    import { defineApp } from "@fonderie/core";
    import { auth } from "@fonderie/auth";
    import { billing } from "@fonderie/billing";
    import { workspaces } from "@fonderie/workspaces";

    export default defineApp({
      modules: [
        auth({ oauth: ["google"], passkeys: true }),
        workspaces({ multiTenant: true }),
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
- **Body copy:** Same spec, three from-scratch builds — one composing Fonderie modules, two without. Two of the three hand-built backends shipped a real, exploitable security hole. The Fonderie build had zero, in about a third of the code.
- **Table:**

  | Same SaaS, built 3× | Build A | Build B | Fonderie |
  |---|---|---|---|
  | Lines of backend code | ~4,200 | ~3,800 | ~1,300 |
  | Time to first deploy | 9 wks | 8 wks | 2 days *(enlarged)* |
  | Security vulnerabilities | 2 *(red)* | 1 *(red)* | 0 *(enlarged, accent)* |
  | You own the source | Yes | Yes | Yes (MIT) |

  *(Fonderie column is tinted with a warm accent background.)*
- **Caption below table:** Internal benchmark. Results vary by project complexity.

## THE PACKAGES (id="packages")
- **Eyebrow:** The packages
- **Section heading (H2):** Real packages, on the real registry.
- **Body copy:** Every module is plain TypeScript. Install what you need. Own what you ship. Each one is open on npm — click through and read the code before you trust it.
- **Package cards (each links to npm; badge reads "npm ↗"; author "Fonderie Labs"):**
  - **@fonderie/core** — npm ↗ — App definition, module registry, and standard shapes. — tags: core, registry — Fonderie Labs — → https://www.npmjs.com/package/@fonderie/core
  - **@fonderie/auth** — npm ↗ — Sessions, passkeys, OAuth, and password flows. — tags: auth, security — Fonderie Labs — → https://www.npmjs.com/package/@fonderie/auth
  - **@fonderie/billing** — npm ↗ — Subscriptions, seats, usage, and webhooks. — tags: billing, stripe — Fonderie Labs — → https://www.npmjs.com/package/@fonderie/billing
  - **@fonderie/workspaces** — npm ↗ — Teams, orgs, invites, and multi-tenancy. — tags: teams, multi-tenant — Fonderie Labs — → https://www.npmjs.com/package/@fonderie/workspaces
  - **@fonderie/permissions** — npm ↗ — Roles and tenant-scoped access checks. — tags: rbac, access — Fonderie Labs — → https://www.npmjs.com/package/@fonderie/permissions
  - **@fonderie/courier** — npm ↗ — Email, SMS, and push notification dispatch. — tags: email, notifications — Fonderie Labs — → https://www.npmjs.com/package/@fonderie/courier
- **Footnote line:** Dependencies point one way — modules depend on core, never on your product. Your code stays yours.

## PRICING (id="pricing")
- **Eyebrow:** Pricing
- **Section heading (H2):** Free and open source.
- **Body copy:** Every module is MIT-licensed and self-hosted. No credit card required. No usage limits. No vendor lock-in.
- **Plan card — Free · $0:**
  - Full open-source core
  - All modules: auth, billing, workspaces, permissions, courier, config
  - Self-hosted on your infrastructure
  - MIT license — read, fork, modify
  - **CTA:** Get started on GitHub → https://github.com/fonderiejs/fonderie (new tab)
- **Footnote line:** Managed hosting and commercial support are on the roadmap. Star us on GitHub to be notified. (→ https://github.com/fonderiejs/fonderie)

## THE DIFFERENCE
- **Eyebrow:** The difference
- **Section heading (H2):** A library, not a service.
- **Body copy:** Fonderie is a library, not a service. It runs in your project, on your server, against your database. We never see your data, never touch your requests, and can't turn your app off.
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
  A: No. Fonderie is a library that runs in your project — not a hosted service. Your code, your server, your database. We never host your data.
- **Q: Can I swap Stripe for PayPal — or anything else?**
  A: Yes. The integration is the product; the provider is a detail. Start on Stripe, move to Paddle, PayPal, or your own processor without touching product code.
- **Q: Is it only for new projects?**
  A: Greenfield is where it shines — you skip months of infrastructure outright. But every module is plain TypeScript, so you can adopt just one (billing, workspaces) inside an existing codebase too.
- **Q: What do I actually own?**
  A: All of it. Fonderie Core is MIT-licensed — read, fork, and modify every module. No dashboard to keep your app running, no per-MAU meter, no way for us to turn it off. The value is the wiring and the cohesion between the pieces; the code is yours.

## FINAL CTA
- **Section heading (H2):** Spend month one on your product, not on auth.
- **Body:** One open, audited standard for the parts every SaaS shares. Compose it in an afternoon and get back to the only part that's actually yours.
- **Primary CTA:** `$ npx @fonderie/create my-saas ⧉` (copy button → "npx @fonderie/create my-saas")
- **Secondary CTA:** Star on GitHub → https://github.com/fonderiejs/fonderie
- **System-prompt CTA:** Make your AI Fonderie-aware. System prompts for Claude Code and Cursor ship with the repo — grab them on GitHub → (→ https://github.com/fonderiejs/fonderie)
- **Ribbon tags:** Vibe coders: your AI composes the backend, you write the product · Agencies: scaffold client SaaS in hours, not weeks · Solo founders: ship in a weekend · Teams: stop re-implementing org management

## FOOTER
- **Column — Open source** (head → https://github.com/fonderiejs/fonderie): GitHub → https://github.com/fonderiejs/fonderie · npm install @fonderie/core → https://www.npmjs.com/package/@fonderie/core
- **Column — Company:** Contact → /contact · X / Twitter → https://x.com/fonderiejs
- **Legal text:** © 2026 Fonderie, Inc.
- **Social links:** GitHub → https://github.com/fonderiejs/fonderie · X (Fonderie on X) → https://x.com/fonderiejs
- **Theme switcher:** System / Light / Dark

---

## ALL LINKS

| Link Text | Href | Location |
|---|---|---|
| Fonderie (logo) | / | Nav |
| The solution | #how | Nav |
| Packages | #packages | Nav |
| GitHub | https://github.com/fonderiejs/fonderie | Nav |
| Get started | https://github.com/fonderiejs/fonderie | Nav CTA (new tab) |
| View on GitHub | https://github.com/fonderiejs/fonderie | Hero |
| @fonderie/core | https://www.npmjs.com/package/@fonderie/core | Packages |
| @fonderie/auth | https://www.npmjs.com/package/@fonderie/auth | Packages |
| @fonderie/billing | https://www.npmjs.com/package/@fonderie/billing | Packages |
| @fonderie/workspaces | https://www.npmjs.com/package/@fonderie/workspaces | Packages |
| @fonderie/permissions | https://www.npmjs.com/package/@fonderie/permissions | Packages |
| @fonderie/courier | https://www.npmjs.com/package/@fonderie/courier | Packages |
| Get started on GitHub → | https://github.com/fonderiejs/fonderie | Pricing |
| Star us on GitHub | https://github.com/fonderiejs/fonderie | Pricing footnote |
| grab them on GitHub → (system prompts) | https://github.com/fonderiejs/fonderie | Final CTA |
| Star on GitHub | https://github.com/fonderiejs/fonderie | Final CTA |
| GitHub | https://github.com/fonderiejs/fonderie | Footer (Open source) |
| npm install @fonderie/core | https://www.npmjs.com/package/@fonderie/core | Footer |
| Contact | /contact | Footer (Company) |
| X / Twitter | https://x.com/fonderiejs | Footer (Company) |
| GitHub (icon) | https://github.com/fonderiejs/fonderie | Footer social |
| Fonderie on X | https://x.com/fonderiejs | Footer social |

## ALL BUTTONS

| Button Text | Action | Section |
|---|---|---|
| $ npx @fonderie/create my-saas ⧉ | copy "npx @fonderie/create my-saas" | Hero |
| Copy | copy "npx @fonderie/create my-saas" | Solution step 1 |
| $ npx @fonderie/create my-saas ⧉ | copy "npx @fonderie/create my-saas" | Final CTA |
| Toggle menu (burger) | open mobile nav | Nav (mobile) |
| System / Light / Dark | set theme | Footer |

## STYLISTIC NOTES
- **Color scheme:** Warm-tinted, theme-switchable (System/Light/Dark). Single molten-orange accent, gold secondary; one red used only for the vuln counts. Subtle hero glow, no heavy gradients.
- **Typography style:** Sans-serif display/body; JetBrains Mono monospace for eyebrows, code, ledger, table figures, CTAs, package names/badges, the AI badge strip, and the hero social-proof lines.
- **Layout pattern:** Single centered column (max ~1040px) with full-width bordered section dividers; internal grids for ledger (2-col), vibe-coder comparison (2-col), package registry (auto-fit ~3-col), and the difference comparison (2-col); pricing is a single narrow card.
- **Visual density:** Code-heavy and editorial; minimal imagery (logo + inline SVG icons only) plus a colored proof table, chat bubble, and bordered grids. No illustrations/stock art.
- **Tone observation:** Technical.

## NOTES ON DYNAMIC / HIDDEN CONTENT
- No modal dialogs, cookie banner, or announcement bar.
- Dynamic content: FAQ `<details>` accordions (fully extracted above), the mobile nav menu (duplicates desktop links), and hover/lift micro-interactions on links, buttons, cards, package cards, and table rows.
