# Nexus API Contract Foundation

Phase: 3 - Real API Contract Foundation  
Primary backend target: NestJS REST APIs  
Validation: Zod  
Frontend API entrypoint: `/lib/api`

## Goals

- Standardize API response shapes.
- Standardize pagination.
- Standardize validation and error responses.
- Prepare current mocked API flows to migrate cleanly to real backend endpoints.
- Keep UI components free of direct API calls.

## Response Format

All production API responses should use a `success` discriminant.

Success:

```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2026-06-16T00:00:00.000Z",
    "requestId": "optional-request-id"
  }
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload.",
    "fields": [
      {
        "field": "title",
        "message": "Title is required."
      }
    ],
    "requestId": "optional-request-id"
  }
}
```

## Pagination Format

Paginated responses should include pagination metadata.

```json
{
  "success": true,
  "data": [],
  "meta": {
    "timestamp": "2026-06-16T00:00:00.000Z",
    "pagination": {
      "page": 1,
      "pageSize": 24,
      "total": 100,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

## Error Codes

Supported foundation error codes:

- `BAD_REQUEST`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `CONFLICT`
- `VALIDATION_ERROR`
- `RATE_LIMITED`
- `INTERNAL_ERROR`

## Frontend Usage

Use exports from `/lib/api/contracts`:

```ts
import {
  createApiError,
  createApiSuccess,
  createPaginationMeta,
  paginationParamsSchema,
} from "@/lib/api/contracts";
```

All API calls must continue to go through:

```ts
import { apiRequest } from "@/lib/api";
```

## Validation Rules

- Use Zod schemas for request bodies, search params, and route params.
- Convert Zod errors into standardized field errors.
- Validate at API boundaries, not inside pure UI components.

## Mock-to-Backend Migration Path

Current state:

- Marketplace, CRM, and Events use local mock resolvers behind `/lib/api`.
- UI and modules never import mock data directly.

Migration path:

1. Keep module APIs unchanged.
2. Set `NEXT_PUBLIC_API_BASE_URL` to the backend URL.
3. `/lib/api/client.ts` bypasses local mocks when `NEXT_PUBLIC_API_BASE_URL` is set.
4. Backend endpoints return the standardized `success` envelope.
5. Module service and hook layers continue to consume typed data through `apiRequest`.

## Backend Contract Guidance

NestJS controllers should:

- Return the standard success envelope.
- Throw standardized HTTP exceptions with error codes.
- Use DTO validation equivalent to the Zod frontend contracts.
- Support pagination on collection endpoints.
- Include request IDs when available.

## Next Approval Gate

After this contract foundation, the recommended next backend-facing step is:

- Create module-level contract schemas for Marketplace, CRM, Events, and Bookings.
- Then implement Next.js route handlers or NestJS endpoints against those contracts.
