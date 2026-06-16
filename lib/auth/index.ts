export {
  canAccessDashboardPath,
  dashboardAccessByRole,
  DEFAULT_NEXUS_ROLE,
  getDefaultDashboardPath,
  isNexusRole,
  NEXUS_ROLES,
  resolveNexusRole,
} from "@/lib/auth/roles";
export type { NexusAuthenticatedUser, NexusRole, NexusUserMetadata } from "@/lib/auth/roles";
export { getCurrentNexusRole, getCurrentNexusUser, requireNexusUser } from "@/lib/auth/server";
