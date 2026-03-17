# Current Feature

## Status

<!-- Not Started | In Progress | Complete -->

## Goals

<!-- What does success look like? -->

## Notes

<!-- Additional context, constraints, or details -->

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

### 2026-03-16 — Auth Pages Redesign — Card Layout + Labeled Inputs

- Installed ShadCN `Card` and `Label` components
- `SignInForm`, `RegisterForm`, and `check-email` page content wrapped in `Card` with `CardHeader`, `CardContent`, `CardFooter`
- All inputs on sign-in and register now have explicit `<Label>` with `htmlFor`/`id` pairing
- Title and description in `CardHeader`; fields/buttons in `CardContent`; footer nav links in `CardFooter`

### 2026-03-16 — Email Verification on Register

- Installed `resend` package; created `src/lib/resend.ts` (singleton client with env guard) and `src/lib/email.ts` (`sendVerificationEmail`)
- `POST /api/auth/register` now generates a UUID token, stores it in `VerificationToken` (24h TTL), and sends a verification email via Resend from `onboarding@resend.dev`
- Created `GET /api/auth/verify-email` — validates token, sets `user.emailVerified`, deletes token, redirects to `/sign-in?verified=1`; expired tokens redirect to `/sign-in?error=expired_token`
- Created `src/app/(auth)/check-email/page.tsx` — shown after registration with mail icon, user's email address, spam hint, and back-to-sign-in link
- `src/auth.ts` credentials `authorize` throws `Error("EmailNotVerified")` for users without `emailVerified`
- Sign-in action detects `EmailNotVerified` via `error.cause.err.message` and returns a specific message
- Sign-in form shows success toast on `?verified=1` and error toasts for `invalid_token` / `expired_token`
- GitHub OAuth users bypass verification entirely
- Added `RESEND_API_KEY` to `.env.example`
- Added `scripts/delete-test-users.ts` and `db:delete-test-users` npm script

### 2026-03-16 — Auth UI — Sign In, Register & Sign Out

- Created `src/app/(auth)/sign-in/` — server page with `SignInForm` client component using `useActionState`; credentials form + GitHub OAuth button; shows success toast on redirect from register
- Created `src/app/(auth)/register/` — server page with `RegisterForm` client component; validates and posts to `/api/auth/register`; redirects to `/sign-in?registered=1` on success
- Both auth pages grouped under `(auth)` route group
- Created `src/components/shared/UserAvatar.tsx` — reusable avatar: uses GitHub `image` if present, otherwise generates initials from name
- Created `src/components/shared/WelcomeToast.tsx` — client component that fires a sign-in success toast when `?welcome=1` is in the URL, then removes the param
- Sidebar bottom area now shows real session user (avatar via `UserAvatar`, name, email)
- Avatar triggers a `DropdownMenu` with Profile navigation and Sign out (redirects to `/sign-in`)
- Installed ShadCN `DropdownMenu` (Base UI) and `Sonner` toast components; `<Toaster />` added to root layout
- Updated `auth.config.ts` with `pages.signIn: '/sign-in'` to use custom sign-in page
- Updated `proxy.ts` to redirect unauthenticated users to `/sign-in` instead of `/api/auth/signin`
- Sign-in actions append `?welcome=1` to redirect URL for post-login toast trigger

### 2026-03-16 — Auth Credentials — Email/Password Provider

- Added Credentials provider placeholder (`authorize: () => null`) to `src/auth.config.ts` (edge-compatible)
- Added GitHub import and Credentials override with bcrypt validation to `src/auth.ts` — looks up user, compares hashed password, returns safe user object
- Created `src/app/api/auth/register/route.ts` — `POST /api/auth/register` accepting name, email, password, confirmPassword with validation (match check, min 8 chars, duplicate check), bcrypt 12 rounds, returns `{ success, user }`
- `password` field was already present on User model — no migration required

### 2026-03-17 — Forgot Password

- Added `sendPasswordResetEmail` to `src/lib/email.ts`; applied `escapeHtml` to `displayName` in both email functions to prevent XSS
- `POST /api/auth/forgot-password` — generates UUID token stored in `VerificationToken` with `reset:<email>` identifier (1h TTL), sends reset email; always returns `{ success: true }` to prevent email enumeration; silently skips GitHub OAuth users (no password)
- `POST /api/auth/reset-password` — validates token, checks `reset:` prefix, checks expiry, updates bcrypt hash (12 rounds), deletes token (single-use); added `typeof` guards on password fields
- Created `/forgot-password` page with `ForgotPasswordForm` client component (email input, success state after submit)
- Created `/reset-password?token=...` page — server page redirects to `/forgot-password` if token absent; passes token to `ResetPasswordForm` client component
- `ResetPasswordForm` redirects to `/sign-in?password_reset=1` on success; `SignInForm` fires success toast on that param (consistent with `?verified=1` pattern)
- Added "Forgot password?" link inline with Password label on sign-in form

### 2026-03-17 — Profile Page

- Created `src/lib/db/profile.ts` with `getProfileData(userId)` — fetches user info, GitHub account detection, item type breakdown, total items/collections in parallel
- Added `/profile` to proxy protection in `src/proxy.ts`
- Created `src/app/profile/layout.tsx` — reuses `DashboardShell` with sidebar (mirrors dashboard layout pattern)
- Created `src/app/profile/page.tsx` — server component displaying: account card (avatar, name, email, account type, member since), usage stats (totals + per-type breakdown), conditional change password form, danger zone with delete account
- Created `src/app/profile/ChangePasswordForm.tsx` — client component; validates current password, POSTs to API, shows inline error or success toast
- Created `src/app/profile/DeleteAccountDialog.tsx` — `AlertDialog` confirmation before DELETE; redirects to `/sign-in` after deletion
- Created `POST /api/profile/change-password` — auth-gated; validates current bcrypt password, updates hash (12 rounds)
- Created `DELETE /api/profile/delete-account` — auth-gated; deletes user (all items/collections cascade)
- Installed ShadCN `AlertDialog` (Base UI variant)
- Change password section hidden for GitHub OAuth users (no password field)

### 2026-03-16 — Email Verification Toggle

- Created `src/lib/config.ts` exporting `EMAIL_VERIFICATION_ENABLED` (reads `REQUIRE_EMAIL_VERIFICATION` env var, defaults `false`)
- `POST /api/auth/register` sets `emailVerified` immediately when disabled; skips token generation and email send
- Response includes `requiresVerification` flag; register action redirects to `/check-email` or `/sign-in?registered=1` accordingly
- `src/auth.ts` credentials `authorize` only checks `emailVerified` when `EMAIL_VERIFICATION_ENABLED` is true
- Updated `.env.example` with `REQUIRE_EMAIL_VERIFICATION="false"` and explanatory comment
