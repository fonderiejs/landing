# Foundrie Platform: UI/UX Specification

## Design Philosophy

**Core Principles:**
- **Developer-First, Not Finance-First:** Clean, modern, functional (think Vercel, Linear, Stripe) not flashy crypto dashboards
- **Information Density Without Clutter:** Show relevant data clearly, avoid empty space for the sake of whitespace
- **Action-Oriented:** Every screen should make the next step obvious
- **Progressive Disclosure:** Simple by default, powerful when needed
- **AI-Native:** Chat interface is primary, traditional UI is secondary

**Visual Direction:**
- Base: TokenWiz's clean card-based layout and navigation
- Enhancement: DefiBotX's rigorous component quality and data density
- Avoid: Overly animated spaceship dashboards, neon gradients, excessive shadows
- Inspiration: Vercel's deployment UI, Linear's task management, Stripe's dashboard clarity

---

## Color System

### Primary Colors
```css
--primary-600: #5B5BD6;      /* Primary actions, links */
--primary-500: #7C7CE0;      /* Hover states */
--primary-400: #9D9DE9;      /* Subtle highlights */

--success-600: #10B981;      /* Success states, active deployments */
--warning-600: #F59E0B;      /* Warnings, breaking changes */
--error-600: #EF4444;        /* Errors, failed deployments */
--info-600: #3B82F6;         /* Info, preview states */
```

### Neutral Colors (Light Mode)
```css
--gray-50: #F9FAFB;          /* Page background */
--gray-100: #F3F4F6;         /* Card backgrounds */
--gray-200: #E5E7EB;         /* Borders, dividers */
--gray-300: #D1D5DB;         /* Disabled states */
--gray-400: #9CA3AF;         /* Placeholder text */
--gray-500: #6B7280;         /* Secondary text */
--gray-600: #4B5563;         /* Body text */
--gray-700: #374151;         /* Headings */
--gray-900: #111827;         /* Primary text */
--white: #FFFFFF;            /* Card surfaces */
```

### Neutral Colors (Dark Mode)
```css
--dark-bg: #0A0A0F;          /* Page background */
--dark-surface: #16161D;     /* Card backgrounds */
--dark-border: #2A2A35;      /* Borders */
--dark-text-primary: #E5E7EB;
--dark-text-secondary: #9CA3AF;
```

---

## Typography

**Font Stack:**
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Menlo', monospace;
```

**Type Scale:**
```css
--text-xs: 0.75rem;    /* 12px - Labels, metadata */
--text-sm: 0.875rem;   /* 14px - Body text, table cells */
--text-base: 1rem;     /* 16px - Primary body */
--text-lg: 1.125rem;   /* 18px - Subheadings */
--text-xl: 1.25rem;    /* 20px - Card titles */
--text-2xl: 1.5rem;    /* 24px - Page headings */
--text-3xl: 1.875rem;  /* 30px - Hero headings */
```

---

## Component Library

### 1. Navigation Components

#### Sidebar Navigation (TokenWiz-inspired)
```
┌─────────────────────────┐
│ 🔷 Foundrie             │ Logo
├─────────────────────────┤
│ 💬 Chat                 │ Primary: LLM interface
│ 📦 Resources            │ Resource management
│ 🚀 Deployments          │ Version history
│ 👥 Team                 │ Workspace members
│ ⚙️  Settings            │ Configuration
├─────────────────────────┤
│ 📚 Docs                 │ Secondary links
│ 🆘 Support              │
└─────────────────────────┘
```

**Specs:**
- Width: 240px collapsed, 280px expanded
- Background: --gray-100 (light) / --dark-surface (dark)
- Active state: Primary color left border (3px) + bg highlight
- Icons: Phosphor Icons (24px)
- Collapsible on mobile (hamburger)

#### Top Bar
```
┌────────────────────────────────────────────────────────────┐
│ [☰] MyApp › Production          [🔍 Search]    [@] [🔔] [⚙] │
└────────────────────────────────────────────────────────────┘
```

**Components:**
- Workspace/Environment switcher (dropdown)
- Global search (Cmd+K)
- User avatar (dropdown menu)
- Notifications badge
- Quick settings

---

### 2. Layout Components

#### Page Container
```
<div class="page-container">
  <header class="page-header">
    <h1>Page Title</h1>
    <div class="actions">
      <Button>Primary Action</Button>
    </div>
  </header>

  <div class="page-content">
    {/* Main content */}
  </div>
</div>
```

**Specs:**
- Max width: 1400px
- Padding: 24px (desktop), 16px (mobile)
- Background: --gray-50

#### Card Component (Primary Building Block)
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardActions>
      <IconButton>...</IconButton>
    </CardActions>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    {/* Footer actions */}
  </CardFooter>
</Card>
```

**Specs:**
- Background: --white (light) / --dark-surface (dark)
- Border: 1px solid --gray-200
- Border radius: 8px
- Padding: 20px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Hover: Shadow increases slightly

---

### 3. Data Display Components

#### Table (High Density)
```
┌──────────────────────────────────────────────────────────┐
│ Name          Type       Status    Updated      Actions  │
├──────────────────────────────────────────────────────────┤
│ tickets       Resource   ✓ Active  2 mins ago   [•••]   │
│ comments      Resource   ✓ Active  1 hour ago   [•••]   │
│ users         Core       ✓ Active  -            [•••]   │
└──────────────────────────────────────────────────────────┘
```

**Features:**
- Sortable columns
- Filters (dropdowns above table)
- Pagination or infinite scroll
- Row hover highlights
- Inline actions (dropdown menu)
- Dense mode toggle

#### Deployment Timeline (Vercel-inspired)
```
┌──────────────────────────────────────────────────────────┐
│ ● v12 - Add real-time notifications      [ACTIVE] [Live]│
│   2 hours ago by @john                                   │
│   + 2 resources added, ~ 1 modified                      │
│   ↳ preview-v12.foundrie.ai                             │
│                                                          │
│ ○ v11 - Enhanced permissions              [ROLLED_BACK] │
│   1 day ago by @sarah                                    │
│   ~ 1 resource modified                                  │
│   ↳ [Rollback] [View Diff]                             │
│                                                          │
│ ○ v10 - Initial setup                     [DEPLOYED]    │
│   3 days ago by @john                                    │
└──────────────────────────────────────────────────────────┘
```

**Visual Indicators:**
- Timeline line (left side)
- Status badges (colored)
- Expandable details
- Quick actions (inline buttons)

#### Stat Cards (Dashboard)
```
┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐
│ Resources          │ │ API Calls          │ │ Active Users       │
│ 24                 │ │ 12.4K              │ │ 156                │
│ +3 this week  ↗️   │ │ +18% ↗️            │ │ +12 today ↗️       │
└────────────────────┘ └────────────────────┘ └────────────────────┘
```

**Specs:**
- Icon (top left, subtle color)
- Large number (primary metric)
- Trend indicator (% change, arrow)
- Small chart (optional sparkline)

---

### 4. Form Components

#### Input Field
```tsx
<FormField>
  <Label>Resource Name</Label>
  <Input
    placeholder="e.g., support_tickets"
    helperText="Use snake_case for resource names"
    error={errors.name}
  />
</FormField>
```

**Variants:**
- Text input
- Textarea
- Select dropdown
- Multi-select (tags)
- Date picker
- Toggle switch
- Radio group
- Checkbox

#### Code Editor (Monaco)
```
┌──────────────────────────────────────────────────────────┐
│ resource:                                                 │
│   name: tickets                                          │
│   label: Support Tickets                                 │
│   schema:                                                │
│     fields:                                              │
│       title:                                             │
│         type: string                                     │
│         required: true                                   │
└──────────────────────────────────────────────────────────┘
```

**Features:**
- Syntax highlighting (YAML, JSON, SQL)
- Line numbers
- Minimap (for long files)
- Vim mode (optional)
- Autocomplete
- Error highlighting

---

### 5. Interactive Components

#### Chat Interface (Primary Feature)
```
┌──────────────────────────────────────────────────────────┐
│ 💬 Build with AI                                    [⚙️] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ 👤 You: I want to track customer support tickets        │
│                                                          │
│ 🤖 Foundrie: I've created a support ticket system with: │
│                                                          │
│    ┌────────────────────────────────────────────────┐  │
│    │ Resource: tickets                               │  │
│    │ Fields: title, description, status, priority   │  │
│    │ Roles: customer, support, admin                │  │
│    │                                                 │  │
│    │ [View Preview] [Deploy to Production]          │  │
│    └────────────────────────────────────────────────┘  │
│                                                          │
│ 👤 You: Add email notifications when status changes    │
│                                                          │
│ 🤖 Foundrie: Added workflow:                            │
│    - When status changes → notify customer via email    │
│    [Updated Preview] [Deploy]                           │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ [Type a message...]                            [Send ↵] │
└──────────────────────────────────────────────────────────┘
```

**Features:**
- Message bubbles (user vs AI)
- Embedded previews (cards within chat)
- Code blocks with syntax highlighting
- Action buttons (deploy, preview, view code)
- Streaming responses (typing indicator)
- Conversation history
- Example prompts (empty state)

#### Diff Viewer (Deployment Comparison)
```
┌──────────────────────────────────────────────────────────┐
│ Changes in v12                                           │
├──────────────────────────────────────────────────────────┤
│ ✅ resources/notifications.yaml                          │
│   + Added resource: notifications                        │
│   + Fields: title, message, read, user_id               │
│                                                          │
│ ⚠️  resources/tickets.yaml                               │
│   ~ Modified permissions:                                │
│     - create: [admin, support]                          │
│     + create: [admin, support, customer]                │
│                                                          │
│ 🗑️ resources/old_system.yaml                            │
│   - Deleted (no longer used)                            │
└──────────────────────────────────────────────────────────┘
```

**Icons:**
- ✅ Added (green)
- ⚠️ Modified (yellow)
- 🗑️ Deleted (red)

---

## Screen Designs

### Screen 1: Chat Interface (Primary Entry Point)

**Purpose:** Natural language resource generation

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  💬 Chat                                   [@] [🔔] │
│            ├──────────────────────────────────────────────────────┤
│  💬 Chat   │                                                      │
│  📦 Res.   │              [Empty State]                          │
│  🚀 Deploy │                                                      │
│  👥 Team   │    🚀 What would you like to build?                 │
│  ⚙️  Set.  │                                                      │
│            │    Try:                                              │
│            │    • "I want to track customer support tickets"      │
│            │    • "Add a CRM with contacts and deals"            │
│            │    • "Build a task management system"               │
│            │                                                      │
│            │    Or describe your app in your own words...        │
│            │                                                      │
│            ├──────────────────────────────────────────────────────┤
│            │ [Type your idea here...]                   [Send ↵] │
└────────────┴──────────────────────────────────────────────────────┘
```

**States:**
1. **Empty State:** Welcome message + example prompts
2. **Conversation:** Message thread with embedded previews
3. **Loading:** Typing indicator with animated dots
4. **Generated:** Resource preview card with actions

**Components:**
- ChatMessage (user/assistant variants)
- ResourcePreviewCard (inline in chat)
- CodeBlock (syntax highlighted)
- ActionButtons (Deploy, Preview, Edit)

---

### Screen 2: Resources List

**Purpose:** Manage all resources in workspace

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  📦 Resources                      [+ New Resource] │
├────────────┼──────────────────────────────────────────────────────┤
│            │  [Search]  [Filter: All ▾]  [Sort: Updated ▾]      │
│            ├──────────────────────────────────────────────────────┤
│            │                                                      │
│            │  Core Resources (Platform)                          │
│            │  ┌──────────────────────────────────────────────┐  │
│            │  │ 🏢 workspaces                                │  │
│            │  │ Multi-tenant workspace management            │  │
│            │  │ 12 fields · 8 endpoints · Updated 2d ago     │  │
│            │  └──────────────────────────────────────────────┘  │
│            │                                                      │
│            │  ┌──────────────────────────────────────────────┐  │
│            │  │ 👤 users                                     │  │
│            │  │ User authentication and profiles             │  │
│            │  │ 18 fields · 12 endpoints · Updated 1w ago    │  │
│            │  └──────────────────────────────────────────────┘  │
│            │                                                      │
│            │  Your Resources (3)                                 │
│            │  ┌──────────────────────────────────────────────┐  │
│            │  │ 🎫 tickets                          [🟢 Active] │  │
│            │  │ Customer support ticket tracking             │  │
│            │  │ 14 fields · 9 endpoints · Updated 2m ago     │  │
│            │  │ [View] [Edit] [API Docs] [•••]              │  │
│            │  └──────────────────────────────────────────────┘  │
│            │                                                      │
│            │  ┌──────────────────────────────────────────────┐  │
│            │  │ 💬 comments                        [🟢 Active] │  │
│            │  │ Comments on tickets                          │  │
│            │  │ 8 fields · 5 endpoints · Updated 15m ago     │  │
│            │  │ [View] [Edit] [API Docs] [•••]              │  │
│            │  └──────────────────────────────────────────────┘  │
└────────────┴──────────────────────────────────────────────────────┘
```

**Card Hover State:**
- Subtle shadow increase
- Actions become visible
- Border highlight

---

### Screen 3: Resource Detail

**Purpose:** View/edit single resource definition

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  📦 Resources › tickets                             │
├────────────┼──────────────────────────────────────────────────────┤
│            │  [< Back]  🎫 tickets              [Edit] [Delete]  │
│            ├──────────────────────────────────────────────────────┤
│            │                                                      │
│            │  ┌─ Overview ─────────────────────────────────────┐ │
│            │  │ Label: Support Tickets                         │ │
│            │  │ Description: Customer support ticket tracking  │ │
│            │  │ Status: 🟢 Active (Deployed in v12)            │ │
│            │  │ Created: 3 days ago by @john                   │ │
│            │  │ Updated: 2 minutes ago by @sarah               │ │
│            │  └────────────────────────────────────────────────┘ │
│            │                                                      │
│            │  📋 [Schema] [Endpoints] [Permissions] [Hooks]      │
│            │  ┌──────────────────────────────────────────────┐  │
│            │  │ Schema (14 fields)                           │  │
│            │  │                                              │  │
│            │  │  Name              Type        Required      │  │
│            │  │  ──────────────────────────────────────────  │  │
│            │  │  id                uuid        Yes           │  │
│            │  │  workspace_id      uuid        Yes           │  │
│            │  │  title             string      Yes           │  │
│            │  │  description       text        Yes           │  │
│            │  │  status            enum        Yes           │  │
│            │  │  priority          enum        No            │  │
│            │  │  customer_id       uuid        Yes           │  │
│            │  │  assigned_to_id    uuid        No            │  │
│            │  │  created_at        timestamp   Yes           │  │
│            │  │  updated_at        timestamp   Yes           │  │
│            │  │                                              │  │
│            │  │  [+ Add Field]                               │  │
│            │  └──────────────────────────────────────────────┘  │
│            │                                                      │
│            │  ┌─ API Endpoints (9) ───────────────────────────┐ │
│            │  │ POST   /v1/tickets              Create ticket │ │
│            │  │ GET    /v1/tickets              List tickets  │ │
│            │  │ GET    /v1/tickets/:id          Get ticket    │ │
│            │  │ PUT    /v1/tickets/:id          Update ticket │ │
│            │  │ DELETE /v1/tickets/:id          Delete ticket │ │
│            │  │ POST   /v1/tickets/:id/assign   Assign        │ │
│            │  │                                                │ │
│            │  │ [View API Docs]                                │ │
│            │  └────────────────────────────────────────────────┘ │
└────────────┴──────────────────────────────────────────────────────┘
```

**Tabs:**
- Schema: Field list with types
- Endpoints: API routes
- Permissions: Role-based access rules
- Hooks: Before/after action logic
- Settings: Advanced options

---

### Screen 4: Deployments (Vercel-style)

**Purpose:** Version history with preview/rollback

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  🚀 Deployments                         [History ▾] │
├────────────┼──────────────────────────────────────────────────────┤
│            │  [Search]  [Filter: All ▾]  [Environment: Prod ▾]  │
│            ├──────────────────────────────────────────────────────┤
│            │                                                      │
│            │  ● v12 - Add real-time notifications                │
│            │  ├ 2 hours ago by @john                    [🟢 Live]│
│            │  ├ LLM Prompt: "Add notifications when tickets..."  │
│            │  ├ Changes:                                          │
│            │  │  ✅ +1 resource (notifications)                  │
│            │  │  ⚠️ ~1 resource (tickets - added hooks)          │
│            │  ├ Migration: 00012_add_notifications.sql           │
│            │  └ [View Diff] [View Code] [Rollback]               │
│            │                                                      │
│            │  ○ v11 - Enhanced permissions           [Rolled Back]│
│            │  ├ 1 day ago by @sarah                               │
│            │  ├ LLM Prompt: "Let customers create tickets"       │
│            │  ├ Changes:                                          │
│            │  │  ⚠️ ~1 resource (tickets - permissions)          │
│            │  │  🚨 Breaking changes detected                    │
│            │  ├ Rolled back 18 hours ago (bug found)             │
│            │  └ [View Diff] [Restore This Version]               │
│            │                                                      │
│            │  ○ v10 - Initial CRM setup                  [Draft] │
│            │  ├ 3 days ago by @john                               │
│            │  ├ LLM Prompt: "Build a CRM with contacts & deals"  │
│            │  ├ Preview: https://preview-v10.foundrie.ai         │
│            │  └ [Test Preview] [Promote to Production]           │
│            │                                                      │
│            │  ○ v9 - Add comments to tickets           [Deployed]│
│            │  ├ 5 days ago by @sarah                              │
│            │  ├ Changes:                                          │
│            │  │  ✅ +1 resource (comments)                       │
│            │  └ [View Details]                                    │
└────────────┴──────────────────────────────────────────────────────┘
```

**Status Indicators:**
- 🟢 Live (green dot + badge)
- 🔵 Preview (blue dot + badge)
- ⚫ Deployed (gray dot)
- 🔴 Rolled Back (red dot)
- ⚪ Draft (hollow dot)

**Interaction:**
- Click deployment → Expand details
- Hover → Show quick actions
- Timeline line connects versions

---

### Screen 5: Deployment Detail (Expanded)

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  🚀 Deployments › v12                      [⚙️] [×] │
├────────────┼──────────────────────────────────────────────────────┤
│            │  [< Back to List]                          [🟢 Live] │
│            │                                                      │
│            │  v12 - Add real-time notifications                  │
│            │  Deployed 2 hours ago by @john                      │
│            │                                                      │
│            │  📋 [Overview] [Changes] [Migrations] [Logs]        │
│            │  ┌──────────────────────────────────────────────┐  │
│            │  │ Overview                                     │  │
│            │  │                                              │  │
│            │  │ LLM Conversation:                            │  │
│            │  │ ┌────────────────────────────────────────┐  │  │
│            │  │ │ 👤 You: "Add notifications when        │  │  │
│            │  │ │       tickets are assigned or updated" │  │  │
│            │  │ │                                         │  │  │
│            │  │ │ 🤖 Foundrie: "Created notifications    │  │  │
│            │  │ │       resource with email/in-app..."   │  │  │
│            │  │ └────────────────────────────────────────┘  │  │
│            │  │                                              │  │
│            │  │ Deployment Summary:                          │  │
│            │  │ • Started: 14:32:15 UTC                      │  │
│            │  │ • Completed: 14:32:47 UTC (32 seconds)       │  │
│            │  │ • Status: Success ✓                          │  │
│            │  │ • Previous version: v11                      │  │
│            │  │                                              │  │
│            │  │ Changes:                                     │  │
│            │  │ ✅ Added 1 resource                          │  │
│            │  │ ⚠️  Modified 1 resource                      │  │
│            │  │ 🗑️ Deleted 0 resources                       │  │
│            │  │                                              │  │
│            │  │ [View Full Diff] [Download Deployment Log]   │  │
│            │  └──────────────────────────────────────────────┘  │
│            │                                                      │
│            │  🚨 Danger Zone                                     │
│            │  ┌──────────────────────────────────────────────┐  │
│            │  │ [Rollback to Previous Version (v11)]         │  │
│            │  └──────────────────────────────────────────────┘  │
└────────────┴──────────────────────────────────────────────────────┘
```

---

### Screen 6: Dashboard (Overview)

**Purpose:** High-level metrics and quick actions

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  📊 Dashboard                  Production ▾  [@][🔔]│
├────────────┼──────────────────────────────────────────────────────┤
│            │  Welcome back, John 👋                              │
│            │                                                      │
│            │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│            │  │ Resour. │ │ API     │ │ Deploy. │ │ Users   │  │
│            │  │ 24      │ │ 12.4K   │ │ v12     │ │ 156     │  │
│            │  │ +3 ↗️   │ │ +18% ↗️ │ │ Active  │ │ +12 ↗️  │  │
│            │  └─────────┘ └─────────┘ └─────────┘ └─────────┘  │
│            │                                                      │
│            │  ⚡ Quick Actions                                    │
│            │  ┌──────────────────────────────────────────────┐  │
│            │  │ [💬 Chat with AI]  [📦 New Resource]        │  │
│            │  │ [🚀 Deploy]        [👥 Invite Team]         │  │
│            │  └──────────────────────────────────────────────┘  │
│            │                                                      │
│            │  📈 API Usage (Last 7 Days)                         │
│            │  ┌──────────────────────────────────────────────┐  │
│            │  │    [Line chart showing API call trends]      │  │
│            │  │    12,400 calls · 89% success rate           │  │
│            │  └──────────────────────────────────────────────┘  │
│            │                                                      │
│            │  🕐 Recent Activity                                 │
│            │  ┌──────────────────────────────────────────────┐  │
│            │  │ ○ @sarah deployed v12            2 hours ago │  │
│            │  │ ○ @john edited tickets resource  3 hours ago │  │
│            │  │ ○ @mark invited jane@co.com      Yesterday   │  │
│            │  └──────────────────────────────────────────────┘  │
└────────────┴──────────────────────────────────────────────────────┘
```

---

### Screen 7: Settings

**Purpose:** Workspace configuration

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  ⚙️ Settings                                        │
├────────────┼──────────────────────────────────────────────────────┤
│            │  📋 [General] [Team] [Billing] [API Keys] [Advanced]│
│            │                                                      │
│            │  General Settings                                    │
│            │  ┌──────────────────────────────────────────────┐  │
│            │  │ Workspace Name                               │  │
│            │  │ [My Awesome App                          ]   │  │
│            │  │                                              │  │
│            │  │ Workspace URL                                │  │
│            │  │ https://[myapp].foundrie.app                 │  │
│            │  │                                              │  │
│            │  │ Environment                                  │  │
│            │  │ ○ Development                                │  │
│            │  │ ● Production                                 │  │
│            │  │                                              │  │
│            │  │ [Save Changes]                               │  │
│            │  └──────────────────────────────────────────────┘  │
│            │                                                      │
│            │  Danger Zone                                        │
│            │  ┌──────────────────────────────────────────────┐  │
│            │  │ ⚠️  Delete Workspace                         │  │
│            │  │ This action cannot be undone.                │  │
│            │  │                                              │  │
│            │  │ [Delete Workspace...]                        │  │
│            │  └──────────────────────────────────────────────┘  │
└────────────┴──────────────────────────────────────────────────────┘
```

---

## Mobile Responsive Behavior

### Breakpoints
```css
--mobile: 640px;
--tablet: 768px;
--desktop: 1024px;
--wide: 1280px;
```

### Mobile Adaptations
1. **Sidebar:** Collapses to hamburger menu (overlay)
2. **Top Bar:** Simplified (workspace switcher + menu button)
3. **Cards:** Full width, stacked vertically
4. **Tables:** Horizontal scroll or card view
5. **Chat:** Full screen mode
6. **Forms:** Single column layout

---

## Animation & Interactions

### Transitions
```css
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;
```

**Apply to:**
- Hover states (buttons, cards, links)
- Modal open/close
- Sidebar expand/collapse
- Tab switches
- Loading states

### Loading States
1. **Skeleton Screens:** For initial page loads
2. **Spinners:** For actions (button loading state)
3. **Progress Bars:** For deployments
4. **Shimmer Effect:** For table loading

### Micro-interactions
- ✅ Checkmarks animate in (scale + fade)
- ❌ Error shake animation
- 🎉 Success confetti (optional, can be disabled)
- 📋 "Copied!" tooltip on copy actions
- ↗️ Trend arrows pulse slightly

---

## Implementation Priority

### Phase 1: Core Screens (Week 1-2)
1. ✅ Layout shell (sidebar + top bar + page container)
2. ✅ Chat interface (empty state + message thread)
3. ✅ Resources list
4. ✅ Resource detail
5. ✅ Basic components (Card, Button, Input, Table)

### Phase 2: Deployment Features (Week 3)
6. ✅ Deployment timeline
7. ✅ Deployment detail
8. ✅ Diff viewer

### Phase 3: Dashboard & Settings (Week 4)
9. ✅ Dashboard overview
10. ✅ Settings pages
11. ✅ Team management

### Phase 4: Polish (Week 5)
12. ✅ Dark mode
13. ✅ Mobile responsive
14. ✅ Animations
15. ✅ Loading states

---

## Component Library to Use

**Recommended:** Build custom components on top of a headless UI library

**Options:**
1. **Radix UI** (Recommended)
   - Headless, accessible components
   - Full control over styling
   - Great TypeScript support

2. **Headless UI** (Tailwind team)
   - Similar to Radix
   - Excellent docs

3. **shadcn/ui** (Pre-built components)
   - Beautiful default styles
   - Based on Radix + Tailwind
   - Copy-paste, fully customizable

**Do NOT use:**
- Material UI (too opinionated, heavy)
- Ant Design (looks dated, hard to customize)
- Chakra UI (performance issues)

---

## Design Tokens (CSS Variables)

```css
:root {
  /* Spacing */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);

  /* Z-index */
  --z-dropdown: 1000;
  --z-modal: 2000;
  --z-toast: 3000;
  --z-tooltip: 4000;
}
```

---

## Accessibility Checklist

- ✅ Semantic HTML (header, nav, main, section)
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Focus indicators (visible outline)
- ✅ Color contrast ratio > 4.5:1
- ✅ Alt text on images
- ✅ Form labels associated with inputs
- ✅ Error messages announced to screen readers
- ✅ Skip to content link

---

## Next Steps

1. **Set up Next.js project** with TypeScript + Tailwind
2. **Install component library** (Radix UI or shadcn/ui)
3. **Create design tokens** (CSS variables)
4. **Build layout shell** (sidebar + top bar)
5. **Implement chat interface** (primary screen)
6. **Add mock data** for all screens
7. **Deploy to Vercel** for preview

This UI can be built **without backend integration** - all data can be mocked initially. Once Phase 1 backend is ready, swap mock data for real API calls.
