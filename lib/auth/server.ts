import { auth, currentUser } from "@clerk/nextjs/server";
import {
  DEFAULT_NEXUS_ROLE,
  resolveNexusRole,
  type NexusAuthenticatedUser,
  type NexusUserMetadata,
} from "@/lib/auth/roles";

export async function getCurrentNexusUser(): Promise<NexusAuthenticatedUser | null> {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const metadata = user.publicMetadata as NexusUserMetadata;
  const primaryEmail = user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId);

  return {
    id: user.id,
    email: primaryEmail?.emailAddress,
    name: user.fullName ?? user.username ?? undefined,
    role: resolveNexusRole(metadata.role),
    tenantId: metadata.tenantId,
  };
}

export async function requireNexusUser(): Promise<NexusAuthenticatedUser> {
  const user = await getCurrentNexusUser();

  if (!user) {
    const authState = await auth();
    authState.redirectToSignIn();
    throw new Error("Authentication required.");
  }

  return user;
}

export async function getCurrentNexusRole() {
  const user = await getCurrentNexusUser();
  return user?.role ?? DEFAULT_NEXUS_ROLE;
}
