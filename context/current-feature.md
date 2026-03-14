## Current Feature

## Status

## Goals

## Note

## History

<!-- Keep this updated. Earliest to latest -->

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
