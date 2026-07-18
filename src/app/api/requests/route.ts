import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { audit } from "@/lib/security/audit";
import { enforceRateLimit, RATE_LIMITS, getIpFromRequest } from "@/lib/security/rate-limit"
import { legalRequestSchema } from "@/lib/security/validators";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/requests — list open legal requests (public)
export async function GET(req: NextRequest) {
  const ip = getIpFromRequest(req);
  const rl = enforceRateLimit(`search:${ip}`, RATE_LIMITS.SEARCH);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Qidirish chegarasi oshdi" }, { status: 429 });
  }

  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const clientType = url.searchParams.get("clientType");
  const q = url.searchParams.get("q");
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const pageSize = Math.min(parseInt(url.searchParams.get("pageSize") ?? "20"), 50);

  const where: Record<string, unknown> = { status: "OPEN" };
  if (category && category !== "all") where.category = category;
  if (clientType && clientType !== "all") where.clientType = clientType;
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { city: { contains: q } },
    ];
  }

  const [requests, total] = await Promise.all([
    db.legalRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
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
      },
    }),
    db.legalRequest.count({ where }),
  ]);

  return NextResponse.json({
    requests: requests.map((r) => ({
      ...r,
      // Compute "postedAgo" — simple, in the user's locale
      postedAgo: formatTimeAgo(r.createdAt),
    })),
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
}

// POST /api/requests — create a new legal request (auth required)
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  }
  const ip = getIpFromRequest(req);

  const rl = enforceRateLimit(`request-post:${session.user.id}`, RATE_LIMITS.REQUEST_POST);
  if (!rl.allowed) {
    return NextResponse.json({ error: "So'rov joylash chegarasi oshdi" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const parsed = legalRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validatsiya xatosi", issues: parsed.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })) },
      { status: 422 }
    );
  }

  const r = parsed.data;
  const request = await db.legalRequest.create({
    data: {
      userId: session.user.id,
      title: r.title,
      description: r.description,
      category: r.category,
      region: r.region,
      city: r.city,
      clientType: r.clientType,
      isUrgent: r.isUrgent,
      status: "OPEN",
      budgetMin: r.budgetMin,
      budgetMax: r.budgetMax,
      contactName: r.contactName,
      contactPhone: r.contactPhone,
      contactEmail: r.contactEmail,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  await audit({
    userId: session.user.id,
    action: "request_post",
    resourceType: "request",
    resourceId: request.id,
    metadata: { title: r.title, category: r.category },
    ipAddress: ip,
  });

  return NextResponse.json({ ok: true, request }, { status: 201 });
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
