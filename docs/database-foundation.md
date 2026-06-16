# Nexus Database Foundation

Phase: 2 - Database Foundation  
Database target: PostgreSQL  
ORM: Prisma

## Scope

This phase establishes a PostgreSQL-ready data model for Nexus.

Included:

- Prisma schema
- Prisma Client helper
- Seed script
- Database environment template

## Core Models

- Tenant
- User
- Listing
- Booking
- Event
- Media
- Lead
- LeadNote
- LeadTask
- Payment
- Message

## Commands

Generate Prisma Client:

```bash
npm run db:generate
```

Run local migrations:

```bash
npm run db:migrate
```

Seed local database:

```bash
npm run db:seed
```

Open Prisma Studio:

```bash
npm run db:studio
```

## Environment

Set `DATABASE_URL` in `.env.local`:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nexus?schema=public"
```

## Notes

- The schema is multi-tenant from the start.
- Monetary values use `Decimal`.
- Clerk identity is mapped through `User.clerkId`.
- Event Memories are represented by `Event` and `Media`.
- CRM is represented by `Lead`, `LeadNote`, and `LeadTask`.
- Payment provider details are stored as provider IDs and JSON metadata.
