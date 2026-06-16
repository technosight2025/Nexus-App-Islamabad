# AGENTS.md

## Cursor Cloud specific instructions

Nexus is a single Next.js 15 (App Router, React 19, TypeScript) web app. There is no
separate backend service in this repo yet — it is the frontend foundation plus scaffolding
for a future API/database layer. Package manager is **npm** (see `package-lock.json`).

### Services / how to run
- Dev server: `npm run dev` (http://localhost:3000). This is the primary way to run the app.
- Lint: `npm run lint`  •  Types: `npm run typecheck`  •  Prod build: `npm run build`.
- There is **no automated test runner configured** yet (no `test` script). The handoff doc
  lists Jest/Vitest/Playwright as future scope only — do not assume tests exist.

### Non-obvious gotchas
- **Clerk runs in "keyless mode" in dev when the Clerk env vars are empty.** You do NOT need
  real Clerk keys to boot the app or browse public pages (`/`, `/marketplace`, `/event/[id]`).
  Real `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` are only needed to exercise
  real auth flows. Protected dashboard routes (`/professional/crm`, `/client*`, `/admin*`) are
  gated by Clerk middleware and will redirect to a Clerk sign-in in keyless mode.
- **The UI is driven by in-memory mock data** (`lib/api/mock-*.ts`), so **Postgres is NOT
  required** to run or browse the marketplace/CRM/events/bookings screens. Prisma
  (`prisma/schema.prisma`, `lib/db`) is scaffolding for a future backend; `npm run db:migrate`
  and `npm run db:seed` require a running Postgres reachable via `DATABASE_URL`.
- Copy `.env.example` to `.env` for local dev. All values can stay at their defaults for
  browsing the app; only fill in real Clerk keys / `DATABASE_URL` when working on auth or DB.
- The app's actual code currently lives on the `cursor/nexus-foundation-*` branch; the `main`
  branch only contains the README. The startup update script is guarded so it is a no-op when
  `package.json` is absent.
