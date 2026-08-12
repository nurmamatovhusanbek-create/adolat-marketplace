import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { nanoid } from "nanoid";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/documents — list all documents with templates
export async function GET() {
  const session = await getSession();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  const docs = await db.legalDocument.findMany({
    orderBy: { createdAt: "desc" },
    include: { template: true },
  });

  return NextResponse.json({
    documents: docs.map((d) => ({
      id: d.id,
      slug: d.slug,
      titleUz: d.titleUz,
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
      isActive: d.isActive,
      hasTemplate: !!d.template,
      fieldsCount: d.template ? (() => { try { const s = JSON.parse(d.template.fieldsSchema); return s.sections?.reduce((a: number, s: any) => a + s.fields?.length, 0) ?? 0; } catch { return 0; } })() : 0,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    })),
  });
}

// POST /api/admin/documents — create new document + template
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad request" }, { status: 400 }); }

  const { titleUz, titleRu, slug, category, subcategory, descriptionUz, pages, priceUzs, isFree, legalBasisUz, fieldsSchema, bodySchema } = body;

  if (!titleUz || !slug || !category) {
    return NextResponse.json({ error: "titleUz, slug, category are required" }, { status: 422 });
  }

  // Check slug uniqueness
  const existing = await db.legalDocument.findUnique({ where: { slug } });
  if (existing) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });

  const doc = await db.legalDocument.create({
    data: {
      id: nanoid(),
      titleUz, titleRu: titleRu || titleUz, slug, category,
      subcategory: subcategory || "", descriptionUz: descriptionUz || "",
      descriptionRu: descriptionUz || "",
      pages: pages || 1, downloads: 0, rating: 0,
      priceUzs: priceUzs || 0, isFree: isFree ?? true,
      isPopular: false, isNew: true,
      legalBasisUz: legalBasisUz || "",
      lastUpdated: new Date(), tagsJson: "[]",
    },
  });

  if (fieldsSchema && bodySchema) {
    await db.documentTemplate.create({
      data: {
        id: nanoid(),
        documentId: doc.id,
        fieldsSchema: typeof fieldsSchema === "string" ? fieldsSchema : JSON.stringify(fieldsSchema),
        bodySchema: typeof bodySchema === "string" ? bodySchema : JSON.stringify(bodySchema),
        estimatedFillMinutes: 10,
        version: 1,
      },
    });
  }

  return NextResponse.json({ ok: true, document: doc }, { status: 201 });
}
