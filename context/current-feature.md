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
