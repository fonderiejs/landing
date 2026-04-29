# Foundrie UI: Design Direction Summary

## Theme Analysis Synthesis

### TokenWiz (Base Structure) ✅
**What to adopt:**
- ✅ Clean sidebar navigation with hierarchical menu
- ✅ Card-based dashboard layout
- ✅ Transaction/activity timeline patterns
- ✅ Tab-based filtering (multi-currency converter → multi-resource switcher)
- ✅ Progress indicators (sales progress → deployment progress)
- ✅ User dropdown with profile/settings

**What to skip:**
- ❌ ICO/token-specific terminology
- ❌ Cryptocurrency styling
- ❌ Heavy animations

### DefiBotX (Component Quality) ✅
**What to adopt:**
- ✅ **Rigorous component system:** Consistent Tailwind scale (`gap-4`, `p-6`, `text-sm`)
- ✅ **High information density:** Stacked metrics with secondary data
- ✅ **Data-first cards:** Metrics emphasized over decoration
- ✅ **Semantic structure:** Proper heading hierarchy, ARIA attributes
- ✅ **Grid-based responsive:** `grid-cols-12` system
- ✅ **Keyboard shortcuts:** `⌘K` search pattern
- ✅ **Restful routing:** Clear URL patterns

**What to avoid:**
- ❌ Excessive loading animations (`animate-pulse` everywhere)
- ❌ Overly dark default theme (we'll use light-first with dark mode)
- ❌ Trading-specific terminology

---

## Foundrie's Unique Design Direction

### Core Principle: "Developer Tool, Not Finance Dashboard"

**Inspiration Sources:**
1. **Vercel** - Deployment timeline, clean deployment cards, instant feedback
2. **Linear** - Minimal UI, keyboard-first, fast interactions, no clutter
3. **Stripe Dashboard** - Data clarity, excellent information architecture, trust-building
4. **GitHub** - Code-centric, diffs, version history, collaborative

### Visual Language

**Color Palette (Light Mode Primary):**
```
Primary: #5B5BD6 (Purple-Blue) - Actions, links
Success: #10B981 (Green) - Active deployments, success states
Warning: #F59E0B (Amber) - Breaking changes, warnings
Error: #EF4444 (Red) - Errors, failed deployments
Info: #3B82F6 (Blue) - Preview states, info

Neutrals:
Background: #F9FAFB (Very light gray)
Cards: #FFFFFF (White)
Borders: #E5E7EB (Light gray)
Text: #111827 (Almost black)
```

**Dark Mode:**
```
Background: #0A0A0F (Very dark blue-black)
Cards: #16161D (Dark surface)
Borders: #2A2A35 (Subtle borders)
Text: #E5E7EB (Light gray)
```

**Typography:**
```
Sans: Inter (body text, UI)
Mono: JetBrains Mono (code, resource names)
```

### Layout Philosophy

**Sidebar (240px):**
- Always visible on desktop
- Hamburger on mobile
- Collapsible sections
- Active state: 3px left border + background highlight
- Icons: Phosphor Icons (consistent weight)

**Content Area:**
- Max width: 1400px
- Padding: 24px (desktop), 16px (mobile)
- Cards have 20px internal padding
- 16px gap between cards

**Information Density:**
- Show data, hide chrome
- Every pixel serves a purpose
- Progressive disclosure (expand for details)
- Tooltips for context, not for core info

---

## Key Screens Breakdown

### 1. Chat Interface (Primary Entry Point)

**Why chat-first:**
- LLMs are the platform's core value prop
- Non-technical users need natural language
- Faster than clicking through forms
- Conversational iteration is key

**Design:**
```
┌────────────────────────────────────────────────────┐
│ 💬 Chat                                   [@] [🔔] │
├────────────────────────────────────────────────────┤
│                                                    │
│ 👤 You:                                           │
│ I want to track customer support tickets          │
│                                                    │
│ 🤖 Foundrie:                                      │
│ Created 'tickets' resource with:                  │
│                                                    │
│ ┌────────────────────────────────────────────┐   │
│ │ 🎫 tickets                                 │   │
│ │ 14 fields · 9 endpoints                    │   │
│ │                                            │   │
│ │ Fields: title, description, status, etc.   │   │
│ │ Roles: customer, support, admin            │   │
│ │                                            │   │
│ │ [👁 Preview] [🚀 Deploy to Production]     │   │
│ └────────────────────────────────────────────┘   │
│                                                    │
│ 👤 You:                                           │
│ Add email notifications when status changes       │
│                                                    │
│ 🤖 Foundrie:                                      │
│ Added workflow: status_changed → email_customer   │
│ [Updated Preview v2]                              │
│                                                    │
├────────────────────────────────────────────────────┤
│ [Type your message...]               [Send] [⌘↵] │
└────────────────────────────────────────────────────┘
```

**Key Features:**
- Embedded preview cards (not separate page)
- Inline actions (deploy without leaving chat)
- Code blocks with syntax highlighting
- Streaming responses (typing indicator)
- Example prompts in empty state

---

### 2. Deployments (Vercel-Inspired)

**Why this matters:**
- Versioning is core safety feature
- Users need confidence in rollback
- LLM context must be visible
- Diffs show what changed

**Design:**
```
┌────────────────────────────────────────────────────┐
│ 🚀 Deployments                                     │
├────────────────────────────────────────────────────┤
│                                                    │
│ ● v12  Add notifications              [🟢 Live]   │
│   2h ago · @john · Deployed successfully          │
│   💬 "Add notifications when tickets updated"     │
│   ✅ +1 resource  ⚠️ ~1 resource                   │
│   → [View Diff] [Rollback] [Logs]                 │
│                                                    │
│ ○ v11  Enhanced permissions        [Rolled Back]  │
│   1d ago · @sarah · Rolled back 18h ago           │
│   💬 "Let customers create tickets"               │
│   ⚠️ ~1 resource  🚨 Breaking changes             │
│   → [View Diff] [Restore]                         │
│                                                    │
│ ○ v10  Initial CRM                    [Preview]   │
│   3d ago · @john · preview-v10.foundrie.ai        │
│   💬 "Build a CRM with contacts & deals"          │
│   ✅ +3 resources                                  │
│   → [Test Preview] [Promote to Production]        │
└────────────────────────────────────────────────────┘
```

**Visual Hierarchy:**
- Status dots (●/○) show active/inactive
- Badges use semantic colors
- LLM prompt always visible (accountability)
- Changes summarized with icons
- Quick actions always accessible

---

### 3. Resources List

**Purpose:** Manage all resources (like GitHub repos list)

**Design:**
```
┌────────────────────────────────────────────────────┐
│ 📦 Resources                    [+ New Resource]   │
├────────────────────────────────────────────────────┤
│ [🔍 Search]  [Filter ▾]  [Sort: Updated ▾]        │
├────────────────────────────────────────────────────┤
│                                                    │
│ Core Resources (3)                                 │
│                                                    │
│ ┌────────────────────────────────────────────┐   │
│ │ 🏢 workspaces                     [Core]   │   │
│ │ Multi-tenant workspace management          │   │
│ │ 12 fields · 8 endpoints · 2d ago           │   │
│ └────────────────────────────────────────────┘   │
│                                                    │
│ Your Resources (5)                                 │
│                                                    │
│ ┌────────────────────────────────────────────┐   │
│ │ 🎫 tickets                       [Active]  │   │
│ │ Customer support ticket tracking           │   │
│ │ 14 fields · 9 endpoints · 2m ago           │   │
│ │ [View] [Edit] [API Docs] [···]             │   │
│ └────────────────────────────────────────────┘   │
│                                                    │
│ ┌────────────────────────────────────────────┐   │
│ │ 💬 comments                      [Active]  │   │
│ │ Comments on tickets                        │   │
│ │ 8 fields · 5 endpoints · 15m ago           │   │
│ │ [View] [Edit] [API Docs] [···]             │   │
│ └────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────┘
```

**Card Hover:**
- Subtle shadow increase
- Border highlight
- Actions fade in

---

### 4. Resource Detail (Code-Centric)

**Design:**
```
┌────────────────────────────────────────────────────┐
│ [← Back]  🎫 tickets          [Edit] [Delete]     │
├────────────────────────────────────────────────────┤
│                                                    │
│ ┌─ Overview ──────────────────────────────────┐  │
│ │ Label: Support Tickets                      │  │
│ │ Status: 🟢 Active (Deployed in v12)         │  │
│ │ Created: 3d ago by @john                    │  │
│ │ Updated: 2m ago by @sarah                   │  │
│ └─────────────────────────────────────────────┘  │
│                                                    │
│ [Schema] [Endpoints] [Permissions] [Hooks]        │
│                                                    │
│ ┌─ Schema (14 fields) ────────────────────────┐  │
│ │                                              │  │
│ │ Name            Type        Required         │  │
│ │ ─────────────────────────────────────────    │  │
│ │ id              uuid        ✓                │  │
│ │ workspace_id    uuid        ✓                │  │
│ │ title           string      ✓                │  │
│ │ description     text        ✓                │  │
│ │ status          enum        ✓                │  │
│ │ priority        enum        -                │  │
│ │ customer_id     uuid        ✓                │  │
│ │                                              │  │
│ │ [+ Add Field]                                │  │
│ └──────────────────────────────────────────────┘  │
│                                                    │
│ ┌─ API Endpoints (9) ──────────────────────────┐  │
│ │ POST   /v1/tickets         Create ticket    │  │
│ │ GET    /v1/tickets         List tickets     │  │
│ │ GET    /v1/tickets/:id     Get ticket       │  │
│ │ PUT    /v1/tickets/:id     Update ticket    │  │
│ │                                              │  │
│ │ [View API Documentation]                     │  │
│ └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

---

### 5. Dashboard (Quick Overview)

**Purpose:** High-level metrics, not a command center

**Design:**
```
┌────────────────────────────────────────────────────┐
│ 📊 Dashboard                           Prod ▾     │
├────────────────────────────────────────────────────┤
│ Welcome back, John 👋                              │
│                                                    │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐             │
│ │Res.  │ │API   │ │Dep.  │ │Users │             │
│ │24    │ │12.4K │ │v12   │ │156   │             │
│ │+3 ↗️ │ │+18%↗️│ │Live  │ │+12↗️ │             │
│ └──────┘ └──────┘ └──────┘ └──────┘             │
│                                                    │
│ ⚡ Quick Actions                                   │
│ [💬 Chat] [📦 New Resource] [🚀 Deploy] [👥 Invite]│
│                                                    │
│ 📈 API Usage (Last 7 Days)                        │
│ ┌────────────────────────────────────────────┐   │
│ │ [Simple line chart]                        │   │
│ │ 12,400 calls · 89% success                 │   │
│ └────────────────────────────────────────────┘   │
│                                                    │
│ 🕐 Recent Activity                                │
│ ○ @sarah deployed v12           2h ago            │
│ ○ @john edited tickets          3h ago            │
│ ○ @mark invited jane@co.com     Yesterday         │
└────────────────────────────────────────────────────┘
```

**Keep it simple:**
- 4 key metrics (not 20)
- One chart (not a dozen)
- Recent activity (not full audit log)
- Quick actions (most common tasks)

---

## Component Standards

### Buttons

**Primary:** Purple background, white text
```tsx
<Button variant="primary">Deploy to Production</Button>
```

**Secondary:** White background, gray border
```tsx
<Button variant="secondary">Cancel</Button>
```

**Ghost:** Transparent, hover shows background
```tsx
<Button variant="ghost">View Details</Button>
```

**Danger:** Red background (destructive actions)
```tsx
<Button variant="danger">Delete Resource</Button>
```

### Cards

**Default:**
- White background (light mode)
- 1px border (#E5E7EB)
- 8px border radius
- 20px padding
- Subtle shadow on hover

**Variants:**
- `Card` - Basic container
- `CardHeader` - Title + actions
- `CardContent` - Main content
- `CardFooter` - Bottom actions

### Tables

**High Density:**
- Compact row height (48px)
- Sticky header
- Hover highlights row
- Inline actions (right side)
- Sortable columns

### Forms

**Consistent:**
- Labels above inputs
- Helper text below
- Error states (red border + message)
- Success states (green checkmark)
- Loading states (spinner in button)

---

## Technical Stack

### Framework
- **Next.js 14+** (App Router)
- **React 18+**
- **TypeScript**

### Styling
- **Tailwind CSS** (utility-first)
- **CSS Variables** (for theming)

### Components
- **Radix UI** (headless primitives)
- **shadcn/ui** (pre-built components, copy-paste)

### Icons
- **Phosphor Icons** (consistent style)

### Code Editor
- **Monaco Editor** (VSCode engine)

### Charts
- **Recharts** (simple, React-native)

### Animation
- **Framer Motion** (for complex animations)
- **CSS transitions** (for simple hover states)

---

## Implementation Roadmap

### Week 1: Setup + Layout Shell
- [x] Create Next.js project with TypeScript
- [ ] Install Tailwind CSS
- [ ] Set up design tokens (CSS variables)
- [ ] Create layout components (Sidebar, TopBar, PageContainer)
- [ ] Build navigation structure
- [ ] Add dark mode toggle

### Week 2: Core Screens (Static)
- [ ] Chat interface (with mock messages)
- [ ] Resources list (with mock data)
- [ ] Resource detail (with mock schema)
- [ ] Deployment timeline (with mock versions)
- [ ] Dashboard (with mock metrics)

### Week 3: Components Library
- [ ] Button variants
- [ ] Card components
- [ ] Form components (Input, Select, Textarea)
- [ ] Table component
- [ ] Modal/Dialog
- [ ] Toast notifications

### Week 4: Interactive Features
- [ ] Chat input (send message simulation)
- [ ] Resource creation flow (mocked)
- [ ] Deployment actions (preview/rollback)
- [ ] Search functionality
- [ ] Filters/sorting

### Week 5: Polish
- [ ] Animations
- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Mobile responsive
- [ ] Accessibility audit

---

## Demo Script (For Stakeholders)

**1. Landing/Chat (30 seconds)**
- "This is Foundrie. You describe what you want to build, and it generates the backend infrastructure."
- Show chat interface, type: "I want to track customer support tickets"
- Show AI response with resource preview

**2. Deployment (30 seconds)**
- "Every change is versioned, just like Vercel."
- Click "Deploy to Production"
- Show deployment timeline with version history
- "If something breaks, one-click rollback."

**3. Resources (30 seconds)**
- "Here are all your resources. Each one is a database table + API endpoints + permissions."
- Click into "tickets" resource
- Show schema, endpoints, automatically generated

**4. Dashboard (15 seconds)**
- "Quick overview of your app's health."
- Show metrics, recent activity

**Total: 2 minutes** to communicate entire value prop

---

## Design Files Location

```
/microservices/app/
├── public/
│   ├── fonts/
│   │   ├── Inter-Regular.woff2
│   │   └── JetBrainsMono-Regular.woff2
│   └── images/
│       └── logo.svg
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing/Dashboard
│   │   ├── chat/
│   │   │   └── page.tsx       # Chat interface
│   │   ├── resources/
│   │   │   ├── page.tsx       # Resources list
│   │   │   └── [id]/
│   │   │       └── page.tsx   # Resource detail
│   │   ├── deployments/
│   │   │   ├── page.tsx       # Deployment timeline
│   │   │   └── [id]/
│   │   │       └── page.tsx   # Deployment detail
│   │   └── settings/
│   │       └── page.tsx       # Settings
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   └── PageContainer.tsx
│   │   ├── chat/
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ResourcePreview.tsx
│   │   │   └── ChatInput.tsx
│   │   ├── resources/
│   │   │   ├── ResourceCard.tsx
│   │   │   └── SchemaTable.tsx
│   │   └── deployments/
│   │       ├── DeploymentCard.tsx
│   │       └── DiffViewer.tsx
│   ├── lib/
│   │   ├── hooks/
│   │   │   ├── useTheme.ts
│   │   │   └── useChat.ts
│   │   └── utils.ts
│   └── styles/
│       └── globals.css        # Tailwind + design tokens
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Next Action: Start Building

**Recommendation:** Start with Week 1 tasks today
1. Initialize Next.js project
2. Install dependencies (Tailwind, Radix, shadcn/ui)
3. Set up design tokens
4. Build layout shell
5. Deploy to Vercel for preview

This will give you a **working prototype in 1 week** that you can demo to potential users/investors while Phase 1 backend is being built.

Ready to start? 🚀
