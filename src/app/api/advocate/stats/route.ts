import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/advocate/stats — dashboard stats for the logged-in advocate
export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  }

  const profile = await db.advocateProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, slug: true, licenseVerified: true, verified: true, userId: true },
  });

  if (!profile) {
    return NextResponse.json({ error: "Advokat profili topilmadi" }, { status: 404 });
  }

  // Check if approved
  if (!profile.licenseVerified) {
    return NextResponse.json({
      approved: false,
      message: "Profilingiz administrator tomonidan tasdiqlash kutilmoqda",
      profile: { slug: profile.slug, licenseVerified: profile.licenseVerified },
    });
  }

  // Get stats
  const [
    totalResponses, acceptedResponses,
    conversations, unreadMessages,
    profileViews, rating, reviewsCount, casesResolved,
  ] = await Promise.all([
    db.requestResponse.count({ where: { advocateId: profile.id } }),
    db.requestResponse.count({ where: { advocateId: profile.id, isAccepted: true } }),
    db.conversation.count({ where: { participants: { some: { id: session.user.id } } } }),
    db.message.count({ where: { receiverId: session.user.id, isRead: false } }),
    db.legalRequest.count({ where: { responses: { some: { advocateId: profile.id } } } }),
    db.advocateProfile.findUnique({
      where: { id: profile.id },
      select: { rating: true, reviewsCount: true, casesResolved: true, successRate: true },
    }),
    db.review.count({ where: { advocateId: profile.id } }),
    db.advocateProfile.findUnique({ where: { id: profile.id }, select: { casesResolved: true } }),
  ]);

  // Recent requests in advocate's specialty
  const advocateProfile = await db.advocateProfile.findUnique({
    where: { id: profile.id },
    select: { specialty: true, region: true },
  });

  const matchingRequests = await db.legalRequest.count({
    where: {
      status: "OPEN",
      category: advocateProfile?.specialty,
    },
  });

  return NextResponse.json({
    approved: true,
    stats: {
      totalResponses,
      acceptedResponses,
      conversations,
      unreadMessages,
      matchingRequests,
      rating: rating?.rating ?? 0,
      reviewsCount: rating?.reviewsCount ?? 0,
      casesResolved: rating?.casesResolved ?? 0,
      successRate: rating?.successRate ?? 0,
    },
    profile: { slug: profile.slug },
  });
}
