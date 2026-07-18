import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { audit } from "@/lib/security/audit";
import { enforceRateLimit, RATE_LIMITS, getIpFromRequest } from "@/lib/security/rate-limit";
import { nanoid } from "nanoid";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sendSchema = z.object({
  conversationId: z.string().min(10).max(30),
  receiverId: z.string().min(10).max(30),
  content: z.string().max(2000),
  attachments: z.array(z.object({
    filename: z.string(),
    originalName: z.string(),
    size: z.number(),
    mimeType: z.string(),
    url: z.string(),
  })).max(5).optional(),
});

// POST /api/conversations/send — send a message (REST alternative to WebSocket)
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  }
  const ip = getIpFromRequest(req);

  const rl = enforceRateLimit(`msg:${session.user.id}`, RATE_LIMITS.MESSAGE);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Xabarlar chegarasi oshdi" }, { status: 429 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const parsed = sendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validatsiya xatosi", issues: parsed.error.issues }, { status: 422 });
  }

  const { conversationId, receiverId, content, attachments } = parsed.data;

  if (!content.trim() && (!attachments || attachments.length === 0)) {
    return NextResponse.json({ error: "Bo'sh xabar" }, { status: 422 });
  }

  // Verify conversation + membership
  const conv = await db.conversation.findUnique({
    where: { id: conversationId },
    select: { participants: { select: { id: true } } },
  });
  if (!conv) return NextResponse.json({ error: "Suhbat topilmadi" }, { status: 404 });
  if (!conv.participants.some((p) => p.id === session.user.id)) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  // Create message
  const message = await db.message.create({
    data: {
      id: nanoid(),
      conversationId,
      senderId: session.user.id,
      receiverId,
      content: content || "",
      attachments: JSON.stringify(attachments || []),
    },
  });

  // Update conversation lastMessageAt
  await db.conversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: new Date() },
  });

  await audit({
    userId: session.user.id,
    action: "message_send",
    resourceType: "message",
    resourceId: message.id,
    metadata: { conversationId, receiverId },
    ipAddress: ip,
  });

  return NextResponse.json({
    message: {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      receiverId: message.receiverId,
      content: message.content,
      attachments: attachments || [],
      isRead: false,
      readAt: null,
      createdAt: message.createdAt,
    },
  }, { status: 201 });
}
