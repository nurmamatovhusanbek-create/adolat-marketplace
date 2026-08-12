import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/conversations/[id]/read — mark all messages as read
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  }
  const { id } = await params;

  // Verify membership
  const conv = await db.conversation.findUnique({
    where: { id },
    select: { participants: { select: { id: true } } },
  });
  if (!conv) return NextResponse.json({ error: "Suhbat topilmadi" }, { status: 404 });
  if (!conv.participants.some((p) => p.id === session.user.id)) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  const result = await db.message.updateMany({
    where: { conversationId: id, receiverId: session.user.id, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });

  return NextResponse.json({ ok: true, updated: result.count });
}
