import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { advocateSearchSchema } from "@/lib/security/validators";
import { enforceRateLimit, RATE_LIMITS, getIpFromRequest } from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ip = getIpFromRequest(req);
  const rl = enforceRateLimit(`search:${ip}`, RATE_LIMITS.SEARCH);
  if (!rl.allowed) return NextResponse.json({ error: "Limit" }, { status: 429 });

  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());
  const parsed = advocateSearchSchema.safeParse(params);
  if (!parsed.success) return NextResponse.json({ error: "Bad params" }, { status: 422 });
  const { q, specialty, region, onlyVerified, onlyOnline, sortBy, page, pageSize } = parsed.data;

  const where: Record<string, unknown> = { user: { status: "ACTIVE" }, licenseVerified: true };
  if (specialty && specialty !== "all") { where.OR = [{ specialty }, { secondarySpecs: { contains: `"${specialty}"` } }]; }
  if (region && region !== "all") where.region = region;
  if (onlyVerified) where.verified = true;
  if (onlyOnline) where.online = true;
  if (q) { where.OR = [{ name: { contains: q } }, { titleUz: { contains: q } }, { city: { contains: q } }, { expertise: { contains: q } }]; }

  let orderBy: Record<string, "asc" | "desc"> = { rating: "desc" };
  if (sortBy === "experience") orderBy = { experienceYears: "desc" };
  else if (sortBy === "price-asc") orderBy = { consultationFee: "asc" };
  else if (sortBy === "price-desc") orderBy = { consultationFee: "desc" };
  else if (sortBy === "response") orderBy = { responseTimeHours: "asc" };

  const [advocates, total] = await Promise.all([
    db.advocateProfile.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize,
      select: { id: true, slug: true, titleUz: true, titleRu: true, specialty: true, secondarySpecs: true, region: true, city: true, experienceYears: true, licenseNumber: true, rating: true, reviewsCount: true, casesResolved: true, responseTimeHours: true, consultationFee: true, hourlyFee: true, languages: true, verified: true, topRated: true, online: true, bioUz: true, expertise: true, successRate: true, availability: true, tagsJson: true, user: { select: { name: true, id: true } } } }),
    db.advocateProfile.count({ where }),
  ]);

  return NextResponse.json({
    advocates: advocates.map((a) => ({
      id: a.id, userId: a.user.id, slug: a.slug, name: a.user.name, titleUz: a.titleUz, titleRu: a.titleRu,
      specialty: a.specialty, secondarySpecialties: JSON.parse(a.secondarySpecs), region: a.region, city: a.city,
      experienceYears: a.experienceYears, rating: a.rating, reviewsCount: a.reviewsCount, casesResolved: a.casesResolved,
      responseTimeHours: a.responseTimeHours, consultationFee: a.consultationFee, hourlyFee: a.hourlyFee,
      languages: JSON.parse(a.languages), verified: a.verified, topRated: a.topRated, online: a.online,
      bioUz: a.bioUz, expertise: JSON.parse(a.expertise), successRate: a.successRate, availability: a.availability,
      tags: JSON.parse(a.tagsJson), photo: `https://i.pravatar.cc/300?u=${a.id}`,
    })),
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
}
