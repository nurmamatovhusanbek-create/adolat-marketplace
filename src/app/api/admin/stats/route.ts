import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/stats — platform-wide statistics
export async function GET() {
  const session = await getSession();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  const [
    totalUsers, totalAdvocates, totalClients, totalAdmins,
    pendingApprovals, verifiedAdvocates,
    totalDocuments, totalDrafts, totalRequests, openRequests,
    totalConversations, totalMessages, totalAuditLogs,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { role: "ADVOCATE" } }),
    db.user.count({ where: { role: "CLIENT" } }),
    db.user.count({ where: { role: "ADMIN" } }),
    db.advocateProfile.count({ where: { licenseVerified: false } }),
    db.advocateProfile.count({ where: { verified: true } }),
    db.legalDocument.count(),
    db.documentDraft.count(),
    db.legalRequest.count(),
    db.legalRequest.count({ where: { status: "OPEN" } }),
    db.conversation.count(),
    db.message.count(),
    db.auditLog.count(),
  ]);

  // Recent activity (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentSignups = await db.user.count({ where: { createdAt: { gte: sevenDaysAgo } } });
  const recentDownloads = await db.auditLog.count({
    where: { action: "doc_download", createdAt: { gte: sevenDaysAgo } },
  });
  const recentRequests = await db.legalRequest.count({
    where: { createdAt: { gte: sevenDaysAgo } },
  });
  const recentMessages = await db.message.count({
    where: { createdAt: { gte: sevenDaysAgo } },
  });

  return NextResponse.json({
    users: { total: totalUsers, advocates: totalAdvocates, clients: totalClients, admins: totalAdmins },
    advocates: { pending: pendingApprovals, verified: verifiedAdvocates },
    documents: { total: totalDocuments, drafts: totalDrafts },
    requests: { total: totalRequests, open: openRequests },
    messaging: { conversations: totalConversations, messages: totalMessages },
    audit: { totalLogs: totalAuditLogs },
    recent: {
      signups: recentSignups,
      downloads: recentDownloads,
      requests: recentRequests,
      messages: recentMessages,
    },
  });
}
