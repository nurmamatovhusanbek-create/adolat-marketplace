import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { audit } from "@/lib/security/audit";
import { getIpFromRequest } from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/conversations — list current user's conversations
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  }

  const conversations = await db.conversation.findMany({
    where: { participants: { some: { id: session.user.id } } },
    orderBy: { lastMessageAt: "desc" },
    include: {
      participants: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          advocateProfile: { select: { slug: true, titleUz: true, verified: true } },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          content: true,
          createdAt: true,
          senderId: true,
          attachments: true,
        },
      },
      _count: {
        select: {
          messages: {
            where: { receiverId: session.user.id, isRead: false },
          },
        },
      },
    },
  });

  return NextResponse.json({
    conversations: conversations.map((c) => ({
      id: c.id,
      participantHash: c.participantHash,
      lastMessageAt: c.lastMessageAt,
      createdAt: c.createdAt,
      participants: c.participants.map((p) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        role: p.role,
        isAdvocate: !!p.advocateProfile,
        advocateProfile: p.advocateProfile,
      })),
      lastMessage: c.messages[0] ?? null,
      unreadCount: c._count.messages,
    })),
  });
}
