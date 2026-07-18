import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/advocate/requests — list legal requests matching advocate's specialty
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  }

  const profile = await db.advocateProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, specialty: true, licenseVerified: true },
  });

  if (!profile) {
    return NextResponse.json({ error: "Advokat profili topilmadi" }, { status: 404 });
  }

  if (!profile.licenseVerified) {
    return NextResponse.json({ error: "Profilingiz tasdiqlanmagan" }, { status: 403 });
  }

  const url = new URL(req.url);
  const filter = url.searchParams.get("filter"); // "matching" | "all" | "responded"

  const where: Record<string, unknown> = { status: "OPEN" };
  if (filter === "matching") {
    where.category = profile.specialty;
  } else if (filter === "responded") {
    where.status = { in: ["OPEN", "RESPONDING"] };
    where.responses = { some: { advocateId: profile.id } };
  }

  const requests = await db.legalRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 30,
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      region: true,
      city: true,
      clientType: true,
      isUrgent: true,
      status: true,
      budgetMin: true,
      budgetMax: true,
      viewsCount: true,
      responsesCount: true,
      createdAt: true,
      responses: {
        where: { advocateId: profile.id },
        select: { id: true, isAccepted: true },
      },
    },
  });

  return NextResponse.json({
    requests: requests.map((r) => ({
      ...r,
      hasResponded: r.responses.length > 0,
      postedAgo: formatTimeAgo(r.createdAt),
    })),
  });
}

function formatTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} daqiqa oldin`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} soat oldin`;
  const days = Math.floor(hours / 24);
  return `${days} kun oldin`;
}
