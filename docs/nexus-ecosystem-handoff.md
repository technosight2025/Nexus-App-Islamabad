# Nexus Ecosystem - Full Developer Handoff

Version: 1.0  
Scope: Marketplace + CRM + Bookings + Event Memories + Admin + Infrastructure  
Reference: Figma Component System + Ecosystem Architecture

## 1. Product Overview

Nexus is a multi-tenant Creative Production Operating System for Pakistan.

It includes:

- Marketplace (Airbnb + Fiverr model)
- Professional CRM (HoneyBook model)
- Booking system
- Event management
- Event Memories (QR + AI gallery system)
- Admin + analytics layer

## 2. System Architecture

### 2.1 Frontend

- Next.js App Router
- React 19+
- TypeScript
- Tailwind CSS
- Zustand for state management
- React Query for server state

### 2.2 Backend

- NestJS on Node.js
- REST APIs as the primary interface
- WebSockets for Event Memories live updates

### 2.3 Database

PostgreSQL with a multi-tenant schema.

Core tables:

- users
- roles
- listings
- bookings
- events
- media
- messages
- payments
- leads

### 2.4 Storage

- Cloudflare R2 for images and videos
- CDN via Cloudflare

### 2.5 Authentication

Clerk is recommended.

Use role-based access control.

Roles:

- Client
- Professional
- Venue Owner
- Rental Owner
- Admin

## 3. Domain Module Breakdown

### 3.1 Marketplace Module

Purpose: discovery layer using an Airbnb + Fiverr hybrid model.

Core features:

- Search listings
- Filter system
- Category browsing
- Professional profiles
- Venue profiles
- Rental profiles

API endpoints:

- `GET /listings`
- `GET /listings/:id`
- `POST /listings`
- `GET /search`
- `GET /categories`

UI components:

- ListingCard
- FilterSidebar
- SearchBar
- CategoryGrid

### 3.2 Professional Profile Module

Features:

- Portfolio gallery
- Packages
- Reviews
- Availability
- Contact CTA

API:

- `GET /professionals/:id`
- `POST /professionals/update`
- `GET /reviews`

### 3.3 Booking System

Flow:

1. Select service
2. Choose package
3. Enter event details
4. Confirm pricing
5. Payment

API:

- `POST /bookings`
- `GET /bookings`
- `PATCH /bookings/:id`
- `POST /bookings/confirm`

Business rules:

Booking status:

- pending
- confirmed
- completed
- cancelled

### 3.4 CRM Module

Purpose: manage professional leads and clients.

Features:

- Kanban pipeline
- Lead tracking
- Notes
- Follow-ups
- Quotes

API:

- `GET /crm/leads`
- `POST /crm/leads`
- `PATCH /crm/leads/:id`

### 3.5 Event Module

Features:

- Event creation
- QR code generation
- Guest uploads
- Live gallery

API:

- `POST /events`
- `GET /events/:id`
- `POST /events/:id/upload`
- `GET /events/:id/media`

### 3.6 Event Memories

Core differentiator.

Features:

- QR-based uploads
- Real-time media feed
- AI tagging
- Album generation
- Highlight video creation

WebSocket events:

- `event:media_uploaded`
- `event:gallery_updated`

AI services:

- auto-tagging
- face clustering, optional future scope
- highlight generation

### 3.7 Payment Module

Features:

- Deposits
- Installments
- Escrow system, future scope
- Vendor payouts

API:

- `POST /payments/create`
- `POST /payments/confirm`
- `GET /payments/history`

### 3.8 Admin Panel

Features:

- User management
- Listing moderation
- Revenue tracking
- System analytics

API:

- `GET /admin/users`
- `GET /admin/listings`
- `GET /admin/analytics`

## 4. Frontend Architecture

### 4.1 Project Structure

```text
/app
  /(public)
    page.tsx
    marketplace/
    professionals/
    venues/
  /(dashboard)
    client/
    professional/
    admin/
  /(auth)
  /(events)
  /(booking)
  /(memories)

/components
  /ui
  /cards
  /forms
  /layout

/lib
  api.ts
  auth.ts
  utils.ts

/hooks
/services
/store
```

### 4.2 Component Architecture

Core component tree:

UI components:

- Button
- Input
- Modal
- Badge
- Tabs

Cards:

- ListingCard
- VenueCard
- ProfessionalCard
- EventCard
- BookingCard

Layout:

- Navbar
- Sidebar
- Footer

## 5. Data Models

### 5.1 User Model

```ts
interface User {
  id: string;
  name: string;
  email: string;
  role: "client" | "professional" | "venue_owner" | "admin";
  createdAt: Date;
}
```

### 5.2 Listing Model

```ts
interface Listing {
  id: string;
  title: string;
  category: string;
  price: number;
  location: string;
  rating: number;
  images: string[];
  ownerId: string;
}
```

### 5.3 Booking Model

```ts
interface Booking {
  id: string;
  userId: string;
  listingId: string;
  date: Date;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  totalAmount: number;
}
```

### 5.4 Event Model

```ts
interface Event {
  id: string;
  title: string;
  date: Date;
  location: string;
  qrCode: string;
  createdBy: string;
}
```

### 5.5 Media Model

```ts
interface Media {
  id: string;
  eventId: string;
  type: "image" | "video";
  url: string;
  uploadedBy: string;
  createdAt: Date;
}
```

## 6. API Architecture Rules

Standards:

- REST-first
- JSON responses
- Pagination required
- Standardized error format

Response format:

```json
{
  "success": true,
  "data": {},
  "error": "optional error message"
}
```

## 7. Security Architecture

Authentication:

- JWT or Clerk session
- Role-based guards

API security:

- Rate limiting
- Input validation with Zod
- CORS protection

Database security:

- Row-level security
- Encrypted sensitive fields
- Audit logs

## 8. Testing Strategy

### 8.1 Unit Tests

Tools:

- Jest or Vitest

Coverage target:

- 80%

### 8.2 Integration Tests

Focus areas:

- API + DB flows
- Booking system
- Auth system

### 8.3 End-to-End Tests

Tool:

- Playwright

Scenarios:

- User booking flow
- Professional onboarding
- Event memory upload flow

### 8.4 Load Testing

Tool:

- k6

Scenarios:

- 1K concurrent users
- 10K concurrent users

### 8.5 Security Testing

- Snyk
- GitHub Dependabot
- npm audit

## 9. CI/CD Pipeline

```text
GitHub Push
   ↓
Lint + Typecheck
   ↓
Unit Tests
   ↓
Security Scan
   ↓
Build
   ↓
Deploy Staging
   ↓
Manual Approval
   ↓
Deploy Production
```

Tools:

- GitHub Actions
- Vercel
- Railway

## 10. Environment Strategy

Environments:

- Development, local
- Staging, QA
- Production

Each environment should have:

- Separate database
- Separate storage
- Separate API keys

## 11. Performance Targets

- Homepage load under 2s
- Search results under 1s
- Dashboard under 2s
- Upload response under 3s

## 12. Monitoring

Tools:

- Sentry for errors
- PostHog for analytics
- Lighthouse for performance

## 13. Deployment Strategy

Phase 1:

- Marketplace only
- One city pilot

Phase 2:

- Booking + CRM

Phase 3:

- Event Memories

Phase 4:

- Payments + scaling

## 14. Critical Systems

These must be production-stable before launch:

- Authentication
- Search system
- Listing system
- Booking flow
- Payment flow
- Event upload system
- QR system
- Admin moderation
- Notifications
- Backup + recovery

## 15. Reference Architectures

| System | Reference |
| --- | --- |
| Marketplace | Airbnb |
| Services | Fiverr |
| CRM | HoneyBook |
| Event OS | Zennvue |
| Galleries | Pixieset |
| Events | Eventbrite |
| UI System | Notion |
| Payments | Stripe |

## Final Delivery Summary

This handoff defines:

- Full backend architecture
- Frontend structure
- Database schema
- API system
- Security model
- Testing strategy
- CI/CD pipeline
- Deployment phases
