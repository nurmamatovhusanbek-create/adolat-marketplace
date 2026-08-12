import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/approvals — list pending advocate approvals
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  // Find advocate profiles that are NOT verified yet
  const pending = await db.advocateProfile.findMany({
    where: { licenseVerified: false },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          status: true,
          createdAt: true,
          lastLoginAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    approvals: pending.map((a) => ({
      id: a.id,
      slug: a.slug,
      name: a.user.name,
      email: a.user.email,
      phone: a.user.phone,
      titleUz: a.titleUz,
      specialty: a.specialty,
      region: a.region,
      city: a.city,
      licenseNumber: a.licenseNumber,
      licenseVerified: a.licenseVerified,
      experienceYears: a.experienceYears,
      bioUz: a.bioUz,
      expertise: JSON.parse(a.expertise),
      languages: JSON.parse(a.languages),
      education: JSON.parse(a.education),
      userStatus: a.user.status,
      createdAt: a.createdAt,
      lastLoginAt: a.user.lastLoginAt,
    })),
  });
}
