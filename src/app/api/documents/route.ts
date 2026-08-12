import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { documentSearchSchema } from "@/lib/security/validators";
import { enforceRateLimit, RATE_LIMITS, getIpFromRequest } from "@/lib/security/rate-limit"

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/documents — list / search documents
export async function GET(req: NextRequest) {
  const ip = getIpFromRequest(req);
  const rl = enforceRateLimit(`search:${ip}`, RATE_LIMITS.SEARCH);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Qidirish chegarasi oshdi" }, { status: 429 });
  }

  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  const category = url.searchParams.get("category");
  const priceFilter = url.searchParams.get("priceFilter");
  const sortBy = url.searchParams.get("sortBy");
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const pageSize = Math.min(parseInt(url.searchParams.get("pageSize") ?? "24"), 50);

  // If slug is provided, return single document with template
  if (slug) {
    const doc = await db.legalDocument.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        titleUz: true,
        titleRu: true,
        category: true,
        subcategory: true,
        descriptionUz: true,
        descriptionRu: true,
        pages: true,
        downloads: true,
        rating: true,
        priceUzs: true,
        isFree: true,
        isPopular: true,
        isNew: true,
        legalBasisUz: true,
        lastUpdated: true,
        tagsJson: true,
        template: { select: { fieldsSchema: true, bodySchema: true, estimatedFillMinutes: true } },
      },
    });
    if (!doc) {
      return NextResponse.json({ error: "Hujjat topilmadi" }, { status: 404 });
    }
    return NextResponse.json({ document: doc });
  }

  const q = url.searchParams.get("q");
  const where: Record<string, unknown> = { isActive: true };
  if (category && category !== "all") where.category = category;
  if (priceFilter === "free") where.isFree = true;
  if (priceFilter === "paid") where.isFree = false;
  if (q) {
    where.OR = [
      { titleUz: { contains: q } },
      { titleRu: { contains: q } },
      { descriptionUz: { contains: q } },
      { descriptionRu: { contains: q } },
      { tagsJson: { contains: q } },
    ];
  }

  let orderBy: Record<string, "asc" | "desc"> = { downloads: "desc" };
  switch (sortBy) {
    case "rating": orderBy = { rating: "desc" }; break;
    case "newest": orderBy = { lastUpdated: "desc" }; break;
    case "popular": default: orderBy = { downloads: "desc" }; break;
  }

  const [docs, total] = await Promise.all([
    db.legalDocument.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        slug: true,
        titleUz: true,
        titleRu: true,
        category: true,
        subcategory: true,
        descriptionUz: true,
        descriptionRu: true,
        pages: true,
        downloads: true,
        rating: true,
        priceUzs: true,
        isFree: true,
        isPopular: true,
        isNew: true,
        legalBasisUz: true,
        lastUpdated: true,
        tagsJson: true,
        template: { select: { estimatedFillMinutes: true, fieldsSchema: true } },
      },
    }),
    db.legalDocument.count({ where }),
  ]);

  return NextResponse.json({
    documents: docs.map((d) => {
      let fieldsCount = 0;
      try {
        const schema = JSON.parse(d.template?.fieldsSchema ?? '{"sections":[]}');
        fieldsCount = schema.sections.reduce(
          (acc: number, s: { fields: unknown[] }) => acc + s.fields.length,
          0
        );
      } catch {}

      return {
        id: d.id,
        slug: d.slug,
        titleUz: d.titleUz,
        titleRu: d.titleRu,
        category: d.category,
        subcategory: d.subcategory,
        descriptionUz: d.descriptionUz,
        pages: d.pages,
        downloads: d.downloads,
        rating: d.rating,
        priceUzs: d.priceUzs,
        isFree: d.isFree,
        isPopular: d.isPopular,
        isNew: d.isNew,
        legalBasisUz: d.legalBasisUz,
        lastUpdated: d.lastUpdated,
        tags: JSON.parse(d.tagsJson),
        estimatedFillMinutes: d.template?.estimatedFillMinutes ?? 10,
        fieldsCount,
        formats: ["pdf", "docx"],
      };
    }),
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
}
