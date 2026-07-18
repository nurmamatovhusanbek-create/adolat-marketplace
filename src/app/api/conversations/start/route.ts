import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { audit } from "@/lib/security/audit";
import { getIpFromRequest } from "@/lib/security/rate-limit";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/security/rate-limit";
import { nanoid } from "nanoid";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const startSchema = z.object({
  receiverId: z.string().min(10).max(30),
});

// POST /api/conversations/start — start or get existing conversation with another user
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  }
  const ip = getIpFromRequest(req);

  // Rate limit
  const rl = enforceRateLimit(`conv-start:${session.user.id}`, RATE_LIMITS.MESSAGE);
  if (!rl.allowed) {
    return NextResponse.json({ error: "So'rovlar chegarasi oshdi" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const parsed = startSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validatsiya xatosi" }, { status: 422 });
  }

  const { receiverId } = parsed.data;
  if (receiverId === session.user.id) {
    return NextResponse.json({ error: "O'zingiz bilan suhbat boshlamay olmaysiz" }, { status: 400 });
  }

  // Verify receiver exists and is active
  const receiver = await db.user.findUnique({
    where: { id: receiverId },
    select: { id: true, name: true, status: true, role: true },
  });
  if (!receiver || receiver.status !== "ACTIVE") {
    return NextResponse.json({ error: "Foydalanuvchi topilmadi" }, { status: 404 });
  }

  // Compute deterministic participantHash — sorted user IDs
  const [a, b] = [session.user.id, receiverId].sort();
  const participantHash = `${a}__${b}`;

  // Try to find existing conversation
  let conversation = await db.conversation.findUnique({
    where: { participantHash },
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
    },
  });

  if (!conversation) {
    // Create new conversation
    conversation = await db.conversation.create({
      data: {
        id: nanoid(),
        participantHash,
        participants: { connect: [{ id: session.user.id }, { id: receiverId }] },
      },
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
      },
    });
    await audit({
      userId: session.user.id,
      action: "message_send",
      resourceType: "conversation",
      resourceId: conversation.id,
      metadata: { receiverId, receiverName: receiver.name },
      ipAddress: ip,
    });
  }

  return NextResponse.json({ conversation });
}
