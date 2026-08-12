import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/audit-logs — paginated audit log viewer
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const pageSize = Math.min(parseInt(url.searchParams.get("pageSize") ?? "50"), 100);
  const action = url.searchParams.get("action");

  const where: Record<string, unknown> = {};
  if (action && action !== "all") where.action = action;

  const [logs, total] = await Promise.all([
    db.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: { select: { name: true, email: true, role: true } },
      },
    }),
    db.auditLog.count({ where }),
  ]);

  return NextResponse.json({
    logs: logs.map((l) => ({
      id: l.id,
      action: l.action,
      resourceType: l.resourceType,
      resourceId: l.resourceId,
      metadata: (() => { try { return JSON.parse(l.metadata); } catch { return {}; } })(),
      ipAddress: l.ipAddress,
      userAgent: l.userAgent,
      success: l.success,
      createdAt: l.createdAt,
      user: l.user ? { name: l.user.name, email: l.user.email, role: l.user.role } : null,
    })),
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
}
