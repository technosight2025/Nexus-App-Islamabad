import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  canAccessDashboardPath,
  getDefaultDashboardPath,
  resolveNexusRole,
  type NexusUserMetadata,
} from "@/lib/auth/roles";

const isDashboardRoute = createRouteMatcher(["/client(.*)", "/professional(.*)", "/admin(.*)"]);
const isAuthRoute = createRouteMatcher(["/login(.*)", "/register(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  if (isDashboardRoute(request)) {
    await auth.protect();

    const authState = await auth();
    const metadata = authState.sessionClaims?.metadata as NexusUserMetadata | undefined;
    const role = resolveNexusRole(metadata?.role);

    if (!canAccessDashboardPath(role, pathname)) {
      return NextResponse.redirect(new URL(getDefaultDashboardPath(role), request.url));
    }
  }

  const authState = await auth();

  if (isAuthRoute(request) && authState.userId) {
    return NextResponse.redirect(new URL("/professional/crm", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
