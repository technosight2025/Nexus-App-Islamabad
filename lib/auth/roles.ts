export const NEXUS_ROLES = [
  "client",
  "professional",
  "venue_owner",
  "rental_owner",
  "admin",
] as const;

export type NexusRole = (typeof NEXUS_ROLES)[number];

export interface NexusUserMetadata {
  role?: NexusRole;
  tenantId?: string;
}

export interface NexusAuthenticatedUser {
  id: string;
  email?: string;
  name?: string;
  role: NexusRole;
  tenantId?: string;
}

export const DEFAULT_NEXUS_ROLE: NexusRole = "client";

export const dashboardAccessByRole: Record<NexusRole, readonly string[]> = {
  admin: ["/admin", "/client", "/professional"],
  client: ["/client"],
  professional: ["/professional"],
  rental_owner: ["/professional"],
  venue_owner: ["/professional"],
};

export function isNexusRole(value: unknown): value is NexusRole {
  return typeof value === "string" && NEXUS_ROLES.includes(value as NexusRole);
}

export function resolveNexusRole(value: unknown): NexusRole {
  return isNexusRole(value) ? value : DEFAULT_NEXUS_ROLE;
}

export function canAccessDashboardPath(role: NexusRole, pathname: string) {
  return dashboardAccessByRole[role].some((allowedPath) => pathname.startsWith(allowedPath));
}

export function getDefaultDashboardPath(role: NexusRole) {
  if (role === "admin") {
    return "/admin";
  }

  if (role === "client") {
    return "/client";
  }

  return "/professional/crm";
}
