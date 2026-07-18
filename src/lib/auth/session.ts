import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth-options";
import type { Session } from "next-auth";

/**
 * Get the current authenticated session on the server side.
 * Returns null if not authenticated.
 */
export async function getSession(): Promise<Session | null> {
  return getServerSession(authOptions);
}

/**
 * Require authentication. Throws AUTH_REQUIRED if not signed in.
 * Returns the session if authenticated.
 */
export async function requireAuth(): Promise<Session> {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("AUTH_REQUIRED");
  }
  return session;
}

/**
 * Require a specific role. Throws AUTHZ_DENIED if not allowed.
 */
export async function requireRole(
  roles: Array<"CLIENT" | "ADVOCATE" | "ADMIN">
): Promise<Session> {
  const session = await requireAuth();
  if (!roles.includes(session.user.role)) {
    throw new Error("AUTHZ_DENIED");
  }
  return session;
}

/**
 * Standard error response for unauthenticated requests.
 */
export function unauthenticatedResponse() {
  return Response.json(
    { error: "Avtorizatsiya talab qilinadi", code: "AUTH_REQUIRED" },
    { status: 401 }
  );
}

/**
 * Standard error response for forbidden requests.
 */
export function forbiddenResponse() {
  return Response.json(
    { error: "Sizda bu amalga ruxsat yo'q", code: "AUTHZ_DENIED" },
    { status: 403 }
  );
}

/**
 * Standard error response for rate-limited requests.
 */
export function rateLimitedResponse(retryAfterMs: number) {
  return Response.json(
    {
      error: "Juda ko'p so'rov. Keyinroq urinib ko'ring.",
      code: "RATE_LIMITED",
      retryAfterMs,
    },
    {
      status: 429,
      headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
    }
  );
}
