# Nexus Project Plan

Version: 1.0  
Role: Senior project manager, development to launch and scale  
Working style: One step at a time, approval required before moving to the next step

## 1. Project Mission

Build Nexus into a production-grade, multi-tenant Creative Production Operating System for Pakistan.

Nexus must support:

- Marketplace discovery for creative professionals, venues, rentals, and production services
- Professional CRM for leads, clients, follow-ups, and quotes
- Booking and payment flows
- Event creation and Event Memories with QR uploads and live galleries
- Admin moderation, analytics, and system operations
- Scalable infrastructure for launch, growth, and future AI media features

## 2. Current Foundation Status

Already established:

- Next.js 15 App Router foundation
- TypeScript strict mode
- Tailwind CSS
- React Query setup
- Project folder structure
- Cursor rules for Nexus development
- Developer handoff documentation
- Marketplace module and UI foundation
- CRM module, Kanban UI, and professional CRM page
- Events module, event creation UI, live gallery UI, and event detail page
- Mock API layer behind `/lib/api`
- Draft PR and passing verification checks

## 3. Project Management Rule

We will work in controlled approval gates.

For every major step:

1. Define the goal.
2. Explain why it matters.
3. List the implementation options.
4. Recommend one option.
5. Ask for approval.
6. Build only the approved step.
7. Verify quality.
8. Report completion and ask for the next approval.

No major foundation decision should be implemented without approval.

## 4. Phase Roadmap

### Phase 0 - Product and Architecture Control

Goal: Lock the rules, roadmap, and project operating model.

Deliverables:

- Developer handoff document
- Cursor project rules
- Project plan and approval gates
- Architecture boundaries
- Launch sequencing

Status: In progress

Approval gate:

- Approve this project plan as the operating model.

### Phase 1 - Auth and Multi-Tenant Foundation

Goal: Establish identity, roles, sessions, and tenant boundaries.

Required work:

- Clerk setup
- `/lib/auth` helpers
- role definitions
- route guards
- dashboard access rules
- tenant ownership model
- `.env.example`

Key roles:

- Client
- Professional
- Venue Owner
- Rental Owner
- Admin

Decision needed:

- Use Clerk as recommended, or choose another auth provider.

Recommendation:

- Use Clerk for speed, security, and role/session management.

### Phase 2 - Database Foundation

Goal: Create the persistent data layer.

Required work:

- Prisma setup
- PostgreSQL schema
- multi-tenant models
- seed data
- `/lib/db` client
- migration workflow

Core models:

- User
- Role
- Tenant
- Listing
- Booking
- Event
- Media
- Lead
- Payment
- Message

Decision needed:

- Prisma + PostgreSQL from the start, or schema planning first.

Recommendation:

- Start Prisma + PostgreSQL schema immediately because all business modules need persistence.

### Phase 3 - Real API Contract

Goal: Replace local mock behavior with production-ready API contracts.

Required work:

- standard API response format
- pagination
- error format
- Zod validation
- server-side API client rules
- API environment switching
- NestJS backend contract planning

Decision needed:

- Build API route handlers in Next.js first, or define NestJS contract first.

Recommendation:

- Define contracts first, then implement backend endpoints. This avoids frontend/backend drift.

### Phase 4 - Marketplace MVP

Goal: Make the public discovery layer usable.

Required work:

- real listing data
- category browsing
- listing detail pages
- professional cards
- venue/rental profiles
- search filters
- SEO metadata

MVP success criteria:

- Users can search and browse listings.
- Users can view a listing detail page.
- Users can contact or start booking from listing pages.

### Phase 5 - Booking MVP

Goal: Build the service booking flow.

Required work:

- bookings module
- multi-step booking UI
- event details step
- pricing summary
- booking confirmation
- booking status lifecycle

Statuses:

- pending
- confirmed
- completed
- cancelled

### Phase 6 - CRM MVP

Goal: Make professional lead management operational.

Already started:

- CRM module
- Kanban board
- lead detail drawer
- professional CRM page

Remaining work:

- real persisted leads
- notes creation
- follow-up tasks
- quotes
- notifications
- lead source tracking

### Phase 7 - Event Memories MVP

Goal: Launch the QR upload and live gallery differentiator.

Already started:

- events module
- event creation UI
- QR generator UI
- live event gallery
- event detail route

Remaining work:

- real uploads to Cloudflare R2
- signed upload URLs
- guest upload page
- moderation flow
- WebSocket live updates
- album generation workflow

### Phase 8 - Payments Foundation

Goal: Support deposits, confirmations, and future payouts.

Required work:

- payments module
- payment intent creation
- payment confirmation
- booking deposit handling
- payment history
- payout-ready data model

Decision needed:

- Stripe, local payment gateway, or hybrid strategy.

Recommendation:

- Design gateway-agnostic interfaces first because Pakistan payment support may require local providers.

### Phase 9 - Admin and Operations

Goal: Give operators control over the marketplace.

Required work:

- admin dashboard
- user management
- listing moderation
- media moderation
- analytics
- audit logs

### Phase 10 - Launch Readiness

Goal: Prepare Nexus for a controlled city pilot.

Required work:

- production environment
- staging environment
- CI/CD
- Sentry
- PostHog
- backup plan
- security review
- load testing
- launch checklist

Pilot recommendation:

- Start with one city and a focused set of professional categories.

### Phase 11 - Scale-Up

Goal: Expand beyond MVP safely.

Scale-up areas:

- more cities
- venue owners
- rental owners
- AI tagging
- highlight generation
- vendor payouts
- advanced analytics
- mobile app readiness

## 5. Immediate Next-Step Options

The foundation needs these next steps in priority order.

### Option A - Auth Foundation

Build Clerk auth, role handling, route guards, and `/lib/auth`.

Pros:

- Unlocks dashboards safely
- Required for multi-tenancy
- Required before real booking, CRM, and admin workflows

Risks:

- Role design must be correct early

Recommended: Yes

### Option B - Database Foundation

Set up Prisma, PostgreSQL models, and seed data.

Pros:

- Unlocks real persisted data
- Reduces dependency on mocks
- Clarifies backend schema early

Risks:

- Schema decisions affect all modules

Recommended: Yes, after auth decision

### Option C - Booking Module

Build booking business module and first booking flow.

Pros:

- Moves toward monetizable marketplace flow

Risks:

- Needs auth, listings, and database to be production-real

Recommended: Not before Auth + DB

### Option D - Admin Foundation

Build user/listing/media moderation foundation.

Pros:

- Important for production control

Risks:

- Depends on auth, roles, and database

Recommended: After Auth + DB

## 6. Recommended First Approval Request

Recommended next step:

Approve Phase 1: Auth and Multi-Tenant Foundation.

Recommended implementation direction:

- Use Clerk
- Define roles in `/types` or `/lib/auth`
- Add `/lib/auth` helpers
- Add dashboard route guard structure
- Add `.env.example`
- Keep database integration as the next approval gate

## 7. Decision Log

| Date | Decision | Status |
| --- | --- | --- |
| 2026-06-16 | Use approval-gated project management flow | Proposed |
| 2026-06-16 | Next recommended phase is Auth Foundation | Proposed |

## 8. Approval Checklist

Before each step starts, confirm:

- Scope is clear
- Files/folders are correct
- Risks are understood
- Recommended option is approved
- Verification commands are defined

Before each step is considered complete:

- TypeScript passes
- Lint passes
- Build passes
- Audit passes
- Changes are committed and pushed
- PR is updated
- Next approval request is provided
