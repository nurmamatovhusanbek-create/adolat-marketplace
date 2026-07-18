import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { enforceRateLimit, RATE_LIMITS, getIpFromRequest } from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/conversations/[id]/messages — fetch conversation history with pagination
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  }
  const { id } = await params;

  // Verify user is participant
  const conv = await db.conversation.findUnique({
    where: { id },
    select: { participants: { select: { id: true } } },
  });
  if (!conv) {
    return NextResponse.json({ error: "Suhbat topilmadi" }, { status: 404 });
  }
  const isParticipant = conv.participants.some((p) => p.id === session.user.id);
  if (!isParticipant) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  // Pagination
  const url = new URL(req.url);
  const cursor = url.searchParams.get("cursor"); // ISO date string
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "50"), 100);

  const messages = await db.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    select: {
      id: true,
      senderId: true,
      receiverId: true,
      content: true,
      attachments: true,
      isRead: true,
      readAt: true,
      createdAt: true,
    },
  });

  const hasMore = messages.length > limit;
  const items = hasMore ? messages.slice(0, -1) : messages;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  // Parse attachments JSON
  const parsed = items.map((m) => ({
    ...m,
    attachments: (() => {
      try { return JSON.parse(m.attachments); } catch { return []; }
    })(),
  }));

  return NextResponse.json({
    messages: parsed.reverse(), // chronological order
    nextCursor,
  });
}
