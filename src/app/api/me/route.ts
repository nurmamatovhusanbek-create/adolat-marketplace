import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/me — current user info
export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ user: null });
  }

  // Load fresh data from DB (in case role/status changed)
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      status: true,
      avatarUrl: true,
      createdAt: true,
      advocateProfile: {
        select: {
          id: true,
          slug: true,
          titleUz: true,
          verified: true,
          licenseVerified: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ user: null });
  }

  // Count drafts + active requests for the dashboard
  const [draftCount, activeRequestCount, messageCount] = await Promise.all([
    db.documentDraft.count({
      where: { userId: user.id, status: { in: ["DRAFT", "COMPLETED"] } },
    }),
    db.legalRequest.count({
      where: { userId: user.id, status: { in: ["OPEN", "RESPONDING", "ACCEPTED"] } },
    }),
    db.message.count({
      where: { receiverId: user.id, isRead: false },
    }),
  ]);

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      status: user.status,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      hasAdvocateProfile: !!user.advocateProfile,
      advocateProfile: user.advocateProfile,
      counts: {
        drafts: draftCount,
        activeRequests: activeRequestCount,
        unreadMessages: messageCount,
      },
    },
  });
}
