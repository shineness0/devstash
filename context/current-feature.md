# Current Feature

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
