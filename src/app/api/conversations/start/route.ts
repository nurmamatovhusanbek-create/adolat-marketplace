import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { audit } from "@/lib/security/audit";
import { enforceRateLimit, RATE_LIMITS, getIpFromRequest } from "@/lib/security/rate-limit";
import { nanoid } from "nanoid";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Auth required" }, { status: 401 });
  const ip = getIpFromRequest(req);
  const rl = enforceRateLimit(`conv-start:${session.user.id}`, RATE_LIMITS.MESSAGE);
  if (!rl.allowed) return NextResponse.json({ error: "Rate limit" }, { status: 429 });

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad request" }, { status: 400 }); }

  let receiverId = body?.receiverId;
  if (!receiverId || typeof receiverId !== "string" || receiverId.length < 5) {
    return NextResponse.json({ error: "receiverId is required" }, { status: 422 });
  }

  if (receiverId === session.user.id) return NextResponse.json({ error: "Cannot chat with yourself" }, { status: 400 });

  // If receiverId is an advocate profile ID, look up the actual user ID
  const advocateProfile = await db.advocateProfile.findUnique({ where: { id: receiverId }, select: { userId: true } });
  if (advocateProfile) {
    receiverId = advocateProfile.userId;
  }

  // Verify receiver exists
  const receiver = await db.user.findUnique({ where: { id: receiverId }, select: { id: true, name: true, status: true } });
  if (!receiver || receiver.status !== "ACTIVE") return NextResponse.json({ error: "User not found" }, { status: 404 });

  const [a, b] = [session.user.id, receiverId].sort();
  const participantHash = `${a}__${b}`;

  let conversation = await db.conversation.findUnique({
    where: { participantHash },
    include: { participants: { select: { id: true, name: true, email: true, role: true, advocateProfile: { select: { slug: true, titleUz: true, verified: true } } } } },
  });

  if (!conversation) {
    conversation = await db.conversation.create({
      data: { id: nanoid(), participantHash, participants: { connect: [{ id: session.user.id }, { id: receiverId }] } },
      include: { participants: { select: { id: true, name: true, email: true, role: true, advocateProfile: { select: { slug: true, titleUz: true, verified: true } } } } },
    });
    await audit({ userId: session.user.id, action: "message_send", resourceType: "conversation", resourceId: conversation.id, metadata: { receiverId, receiverName: receiver.name }, ipAddress: ip });
  }

  return NextResponse.json({ conversation });
}
