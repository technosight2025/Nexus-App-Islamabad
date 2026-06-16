import { z } from "zod";

export const apiErrorCodeSchema = z.enum([
  "BAD_REQUEST",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "NOT_FOUND",
  "CONFLICT",
  "VALIDATION_ERROR",
  "RATE_LIMITED",
  "INTERNAL_ERROR",
]);

export const apiFieldErrorSchema = z.object({
  field: z.string().min(1),
  message: z.string().min(1),
});

export const apiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: apiErrorCodeSchema,
    message: z.string().min(1),
    fields: z.array(apiFieldErrorSchema).optional(),
    requestId: z.string().optional(),
  }),
});

export const apiMetaSchema = z.object({
  requestId: z.string().optional(),
  timestamp: z.string().datetime(),
});

export const paginationParamsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(24),
});

export const paginationMetaSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export function apiSuccessResponseSchema<TSchema extends z.ZodType>(dataSchema: TSchema) {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
    meta: apiMetaSchema.extend({}).passthrough().optional(),
  });
}

export function paginatedApiSuccessResponseSchema<TSchema extends z.ZodType>(itemSchema: TSchema) {
  return z.object({
    success: z.literal(true),
    data: z.array(itemSchema),
    meta: apiMetaSchema.extend({
      pagination: paginationMetaSchema,
    }),
  });
}

export function apiContractResponseSchema<TSchema extends z.ZodType>(dataSchema: TSchema) {
  return z.discriminatedUnion("success", [apiSuccessResponseSchema(dataSchema), apiErrorResponseSchema]);
}

export function paginatedApiContractResponseSchema<TSchema extends z.ZodType>(itemSchema: TSchema) {
  return z.discriminatedUnion("success", [paginatedApiSuccessResponseSchema(itemSchema), apiErrorResponseSchema]);
}
