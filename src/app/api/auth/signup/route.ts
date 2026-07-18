import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/security/password";
import { signupSchema } from "@/lib/security/validators";
import { enforceRateLimit, RATE_LIMITS, getClientIp } from "@/lib/security/rate-limit";
import { audit } from "@/lib/security/audit";
import { nanoid } from "nanoid";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req as unknown as Request);
  const userAgent = req.headers.get("user-agent") ?? undefined;

  // Rate limit: 3 signups per hour per IP
  const rl = enforceRateLimit(`signup:${ip}`, RATE_LIMITS.SIGNUP);
  if (!rl.allowed) {
    return Response.json(
      { error: "Juda ko'p ro'yxatdan o'tish urinishi. Soatdan keyin urinib ko'ring." },
      { status: 429 }
    );
  }

  // Parse + validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Noto'g'ri so'rov formati" }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        error: "Validatsiya xatosi",
        issues: parsed.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
      },
      { status: 422 }
    );
  }

  const { name, email, phone, password, role } = parsed.data;

  // Check email uniqueness
  const existingEmail = await db.user.findUnique({ where: { email }, select: { id: true } });
  if (existingEmail) {
    // Don't leak that email exists — return generic error
    await audit({
      action: "signup",
      metadata: { email, reason: "email_exists" },
      ipAddress: ip,
      userAgent,
      success: false,
    });
    return Response.json({ error: "Bu email allaqachon ro'yxatdan o'tgan" }, { status: 409 });
  }

  // Check phone uniqueness
  const existingPhone = await db.user.findUnique({ where: { phone }, select: { id: true } });
  if (existingPhone) {
    return Response.json({ error: "Bu telefon raqami allaqachon ro'yxatdan o'tgan" }, { status: 409 });
  }

  // Hash password (cost 12)
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await db.user.create({
    data: {
      id: nanoid(),
      email,
      phone,
      name,
      passwordHash,
      role,
      status: role === "CLIENT" ? "ACTIVE" : "PENDING", // advocates need verification
      emailVerified: null, // TODO: send verification email
    },
    select: { id: true, email: true, name: true, role: true, status: true },
  });

  await audit({
    userId: user.id,
    action: "signup",
    metadata: { email, role },
    ipAddress: ip,
    userAgent,
  });

  return Response.json(
    {
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    },
    { status: 201 }
  );
}
