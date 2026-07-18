import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { audit } from "@/lib/security/audit";
import { getIpFromRequest } from "@/lib/security/rate-limit";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const approveSchema = z.object({
  advocateId: z.string().min(10).max(30),
  action: z.enum(["approve", "reject"]),
});

// POST /api/admin/approve — approve or reject an advocate
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }
  const ip = getIpFromRequest(req);

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const parsed = approveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validatsiya xatosi" }, { status: 422 });
  }

  const { advocateId, action } = parsed.data;

  const advocate = await db.advocateProfile.findUnique({
    where: { id: advocateId },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  if (!advocate) {
    return NextResponse.json({ error: "Advokat topilmadi" }, { status: 404 });
  }

  if (action === "approve") {
    await db.advocateProfile.update({
      where: { id: advocateId },
      data: {
        licenseVerified: true,
        verified: true,
      },
    });
    await db.user.update({
      where: { id: advocate.user.id },
      data: { status: "ACTIVE" },
    });
    await audit({
      userId: session.user.id,
      action: "advocate_verify",
      resourceType: "advocate",
      resourceId: advocateId,
      metadata: { advocateName: advocate.user.name, action: "approved" },
      ipAddress: ip,
    });
    return NextResponse.json({ ok: true, action: "approved", advocateName: advocate.user.name });
  } else {
    // Reject: suspend the user and mark profile as unverified
    await db.advocateProfile.update({
      where: { id: advocateId },
      data: { licenseVerified: false, verified: false },
    });
    await db.user.update({
      where: { id: advocate.user.id },
      data: { status: "SUSPENDED" },
    });
    await audit({
      userId: session.user.id,
      action: "advocate_verify",
      resourceType: "advocate",
      resourceId: advocateId,
      metadata: { advocateName: advocate.user.name, action: "rejected" },
      ipAddress: ip,
      success: false,
    });
    return NextResponse.json({ ok: true, action: "rejected", advocateName: advocate.user.name });
  }
}
