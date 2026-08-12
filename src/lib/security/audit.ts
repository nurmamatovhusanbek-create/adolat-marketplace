import { db } from "@/lib/db";

// ============================================================================
// Audit log helper
// ============================================================================

export type AuditAction =
  | "login_success"
  | "login_failed"
  | "logout"
  | "signup"
  | "password_change"
  | "password_reset_request"
  | "password_reset_done"
  | "draft_create"
  | "draft_update"
  | "draft_delete"
  | "doc_download"
  | "doc_view"
  | "request_post"
  | "request_response"
  | "request_accept"
  | "message_send"
  | "advocate_verify"
  | "advocate_profile_update"
  | "rate_limit_hit"
  | "authz_denied"
  | "validation_failed"
  | "account_suspend"
  | "account_restore";

export interface AuditContext {
  userId?: string;
  action: AuditAction;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  success?: boolean;
}

/**
 * Write an audit log entry. Never throws — logging failures should not
 * break the request flow. Errors are surfaced to console only.
 */
export async function audit(ctx: AuditContext): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        userId: ctx.userId ?? null,
        action: ctx.action,
        resourceType: ctx.resourceType ?? null,
        resourceId: ctx.resourceId ?? null,
        metadata: JSON.stringify(ctx.metadata ?? {}),
        ipAddress: ctx.ipAddress ?? null,
        userAgent: ctx.userAgent ?? null,
        success: ctx.success ?? true,
      },
    });
  } catch (err) {
    // Audit log must never break business logic
    console.error("[audit] failed to write audit log:", err);
  }
}

/**
 * Get the current authenticated user ID from a NextAuth-style session object.
 * Returns null if not authenticated.
 */
export function requireUserId(session: { user?: { id?: string } } | null): string | null {
  return session?.user?.id ?? null;
}

/**
 * Ensure a user has one of the allowed roles. Throws if not.
 * Usage: `assertRole(session, ["ADMIN"])`
 */
export function assertRole(
  session: { user?: { role?: string } } | null,
  roles: string[]
): void {
  const role = session?.user?.role;
  if (!role || !roles.includes(role)) {
    throw new Error("AUTHZ_DENIED");
  }
}
