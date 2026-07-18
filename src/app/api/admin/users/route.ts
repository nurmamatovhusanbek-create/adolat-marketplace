import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/users — list all users with pagination
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const pageSize = Math.min(parseInt(url.searchParams.get("pageSize") ?? "50"), 100);
  const role = url.searchParams.get("role");

  const where: Record<string, unknown> = {};
  if (role && role !== "all") where.role = role;

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
        lastLoginIp: true,
        advocateProfile: { select: { id: true, slug: true, licenseVerified: true, verified: true } },
        _count: {
          select: {
            drafts: true,
            requests: true,
            sentMessages: true,
          },
        },
      },
    }),
    db.user.count({ where }),
  ]);

  return NextResponse.json({
    users: users.map((u) => ({
      ...u,
      draftsCount: u._count.drafts,
      requestsCount: u._count.requests,
      messagesCount: u._count.sentMessages,
      _count: undefined,
    })),
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
}
