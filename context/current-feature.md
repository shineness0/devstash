## Current Feature: Auth Credentials - Email/Password Provider

## Status

In Progress

## Goals

- Add `password` field to User model (if not already present) via migration
- Add Credentials provider placeholder (`authorize: () => null`) to `auth.config.ts`
- Override Credentials provider in `auth.ts` with bcrypt validation logic
- Create `POST /api/auth/register` route accepting name, email, password, confirmPassword
  - Validate passwords match
  - Check if user already exists
  - Hash password with bcryptjs
  - Create user in DB
  - Return success/error response

## Notes

- bcryptjs is already installed
- Follow the split-config pattern: placeholder in `auth.config.ts`, real logic in `auth.ts`
- GitHub OAuth must continue to work after this change
- Test: registration via curl, then sign in at `/api/auth/signin`, verify redirect to `/dashboard`

## History

<!-- Keep this updated. Earliest to latest -->

### 2026-03-13 — Prisma 7 + Neon PostgreSQL Setup

- Installed Prisma 7 with `@prisma/adapter-pg`, `pg`, and `tsx` dev tooling
- Created `prisma/schema.prisma` with full schema (User, Item, ItemType, Collection, ItemCollection, Tag + NextAuth models)
- Configured `prisma.config.ts` with `dotenv` for `DATABASE_URL`, migration path, and seed command
- Created `src/lib/prisma.ts` singleton using `PrismaPg` driver adapter (Prisma 7 requirement)
- Ran initial migration (`20260313194414_init`) against Neon dev branch
- Seeded 7 system item types (snippet, prompt, command, note, file, image, link)
- Added `scripts/test-db.ts` for verifying DB connection and seeded data
- Added `db:generate`, `db:migrate`, `db:seed`, `db:studio`, `db:test` npm scripts
- Added `.env.example` with required environment variable templates
- Excluded `prisma/` from Next.js TypeScript compilation

### 2026-03-13 — Initial Next.js Setup

- Created Next.js app with TypeScript, Tailwind CSS v4, and App Router
- Removed default Next.js boilerplate (SVGs, default page content, globals.css defaults)
- Added `CLAUDE.md` and `context/` files for project documentation and AI interaction guidelines
- Pushed initial codebase to GitHub (`shineness0/devstash`)

### 2026-03-13 — Dashboard UI Phase 1

- Initialized ShadCN UI (base-nova style, Tailwind v4 compatible)
- Installed `Button` and `Input` ShadCN components
- Created `/dashboard` route with layout and page
- Set dark mode as default via `dark` class on `<html>`
- Fixed dark mode CSS by using `var(--background)` / `var(--foreground)` directly on `body`
- Built `TopBar` component with search input and "New Item" button (display only)
- Added sidebar and main area placeholders (`<h2>Sidebar</h2>`, `<h2>Main</h2>`)

### 2026-03-13 — Dashboard UI Phase 2

- Created `DashboardShell` client component managing sidebar collapse and mobile drawer state
- Built `Sidebar` component with collapsible desktop behavior (w-60 ↔ w-14) and mobile slide-in drawer
- Added Quick Access section (All Items, Favorites, Recently Used, Pinned with counts)
- Added Types section with colored icons linking to `/items/[type]s` with item counts from mock data
- Added Favorite Collections and Recent Collections sections
- Added user avatar area at bottom (initials, name, email, Pro badge)
- Updated `TopBar` with hamburger menu button (mobile/tablet only) to open sidebar drawer
- Fixed Geist font not applying — corrected circular CSS variable reference (`--font-sans: var(--font-geist-sans)`)

### 2026-03-13 — Dashboard UI Phase 3

- Built main content area as server component
- Added `StatsCards` component with 4 stat cards (total items, collections, favorite items, favorite collections)
- Added `CollectionCard` component with folder icon colored by default type, item count
- Added `ItemCard` component with type icon, content preview (monospace for snippets/commands), language + tag badges, pin/favorite indicators
- Dashboard page sections: stats → recent collections → pinned items → 10 recent items (sorted by `createdAt` desc)
- Removed double padding from `DashboardShell` main element (each page now controls its own padding)

### 2026-03-14 — Seed Sample Data

- Installed `bcryptjs` for password hashing
- Expanded `prisma/seed.ts` with demo user (`demo@devstash.io` / `12345678`, bcrypt 12 rounds)
- Added 5 collections with 18 items total (fully linked, tagged, idempotent):
  - **React Patterns** — 3 TypeScript snippets (custom hooks, component patterns, utilities)
  - **AI Workflows** — 3 prompts (code review, docs generation, refactoring)
  - **DevOps** — 1 Docker/CI snippet, 1 deploy command, 2 real doc links
  - **Terminal Commands** — 4 commands (git, docker, process management, npm)
  - **Design Resources** — 4 real links (Tailwind, shadcn, Radix, Lucide)
- Updated `scripts/test-db.ts` to verify demo user, collections, items, and tags

### 2026-03-14 — Dashboard Collections — Real Data

- Created `src/lib/db/collections.ts` with `getRecentCollections()` and `getDashboardStats()` Prisma queries
- Updated `CollectionCard` to accept real Prisma data (removed mock-data dependency)
- Collection card top border color derived from most-used item type in the collection
- Small type icons (up to 5) displayed per card showing all content types present
- Updated dashboard page to fetch collections and stats from Neon DB in parallel
- Items sections (pinned/recent) still use mock data — to be replaced in a future feature

### 2026-03-14 — Dashboard Items — Real Data

- Created `src/lib/db/items.ts` with `getPinnedItems()` and `getRecentItems()` Prisma queries
- Replaced mock item data (pinned and recent) in dashboard with real Neon DB data
- Item card icon/border derived from item type
- Displays item type tags and all current card details
- Pinned section hidden when no pinned items exist

### 2026-03-14 — Stats & Sidebar — Real Data

- Created `src/lib/db/sidebar.ts` with `getSidebarData()` fetching item types (with counts), favorite/recent collections, and quick-access counts in parallel
- Sidebar item types now come from DB with real item counts, linking to `/items/[typename]`
- Favorite collections show star icon; recent collections show a colored circle based on dominant item type
- Added "View all collections" link at the bottom of the recent collections list → `/collections`
- Updated `DashboardShell` to accept `sidebarData` prop; layout fetches it as a server component
- Removed all mock-data usage from `Sidebar`

### 2026-03-14 — Add Pro Badge to Sidebar

- Installed ShadCN UI `Badge` component
- Added subtle `PRO` badge (outline variant, muted styling) next to `file` and `image` types in the sidebar Types section
- Badge is hidden when sidebar is collapsed
- `geistMono` removed from `<body>` class in `layout.tsx` (pre-existing cleanup)

### 2026-03-16 — Auth Setup — NextAuth v5 + GitHub OAuth

- Installed `next-auth@beta` and `@auth/prisma-adapter`
- Created `src/auth.config.ts` — edge-compatible config with GitHub provider only (no adapter)
- Created `src/auth.ts` — full config with `PrismaAdapter`, JWT session strategy, and `user.id` JWT/session callbacks
- Created `src/app/api/auth/[...nextauth]/route.ts` — GET/POST handler exports
- Created `src/proxy.ts` — Next.js 16 route protection; redirects unauthenticated users from `/dashboard/*` to sign-in with `callbackUrl`
- Created `src/types/next-auth.d.ts` — extends `Session` type with `user.id`
- Added `export const dynamic = 'force-dynamic'` to dashboard layout to prevent prerender failures
- Updated `.env.example` with `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`

### 2026-03-15 — Code Audit Quick Wins

- Added explicit `DATABASE_URL` guard in `src/lib/prisma.ts` — throws a clear error on startup if env var is missing (replaces `!` non-null assertion)
- Extracted `TYPE_ICON_MAP` to `src/lib/constants/item-types.ts` — consolidated duplicate icon maps from `ItemCard.tsx`, `CollectionCard.tsx`, and `Sidebar.tsx` into a single shared constant
- Removed redundant raw `background-color`/`color` declarations from `body` in `globals.css` (`@apply` handles both)
- Added `@@index([userId, updatedAt])` to `Collection` model via migration `20260315080019_add_collection_user_id_updated_at_index` — covers `ORDER BY updatedAt DESC` queries filtered by user
