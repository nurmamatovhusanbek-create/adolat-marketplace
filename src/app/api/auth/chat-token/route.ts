import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { getSession } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/auth/chat-token — issue a short-lived JWT for socket.io authentication
// The token is signed with NEXTAUTH_SECRET (same as NextAuth uses) and verified
// by the chat-service on socket.io handshake.
export async function POST() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  }

  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
  const token = await new SignJWT({
    email: session.user.email,
    role: session.user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.user.id)
    .setIssuedAt()
    .setExpirationTime("5m") // short-lived
    .sign(secret);

  return NextResponse.json({ token, expiresIn: 300 });
}
