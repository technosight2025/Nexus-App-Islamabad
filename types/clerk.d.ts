import type { NexusRole } from "@/lib/auth/roles";

declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: NexusRole;
      tenantId?: string;
    };
  }
}

export {};
