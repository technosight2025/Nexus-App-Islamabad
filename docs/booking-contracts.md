# Nexus Booking Contracts

Phase: 4 - Module-Level Contract Schemas  
Module: `/modules/bookings`

## Scope

This phase defines the Booking API contract before UI or backend implementation.

Included:

- Booking domain types
- Create booking input contract
- Update booking input contract
- Confirm booking input contract
- Booking filters contract
- Standard API response contracts

## Endpoint Targets

Future backend endpoints should follow these contracts:

- `GET /bookings`
- `POST /bookings`
- `GET /bookings/:id`
- `PATCH /bookings/:id`
- `POST /bookings/confirm`

## Booking Flow Coverage

The contracts support:

1. Select service
2. Choose package
3. Enter event details
4. Select event date
5. Confirm pricing summary
6. Confirm booking/payment

## Validation Rules

Implemented in `modules/bookings/contracts.ts`:

- Required tenant, client, listing, professional, and service IDs
- ISO datetime validation for event dates
- Required event title, type, venue, and city
- Non-negative pricing values
- PKR currency contract
- Booking status lifecycle
- Paginated filters

## Next Approval Gate

Recommended next step:

- Build the Bookings module implementation:
  - `api.ts`
  - `service.ts`
  - `hooks.ts`
  - local mocked API resolver behind `/lib/api`

Not included yet:

- Booking UI
- Backend route handlers
- Payment gateway integration
