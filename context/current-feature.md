## Current Feature

## Status

In Progress

## Goals

Prisma + Neon PostgreSQL Setup

- Install Prisma 7 and configure with Neon PostgreSQL (serverless)
- Create initial schema based on data models in `@context/project-overview.md` (User, Item, ItemType, Collection, ItemCollection, Tag)
- Include NextAuth models (Account, Session, VerificationToken)
- Add appropriate indexes and cascade deletes
- Always use migrations (`prisma migrate dev`) — never `db push`

## Note

- Use Prisma 7 (has breaking changes — read upgrade guide before implementing)
- `DATABASE_URL` points to the dev branch on Neon; production branch is separate
- Review Prisma 7 upgrade guide and quickstart before writing any code

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
