import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { audit } from "@/lib/security/audit";
import { enforceRateLimit, RATE_LIMITS, getIpFromRequest } from "@/lib/security/rate-limit"
import { validateDraftValues, parseTemplate } from "@/lib/documents/template";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const saveDraftSchema = z.object({
  documentId: z.string().min(10).max(30),
  fieldValues: z.record(z.string(), z.unknown()),
  draftId: z.union([z.string().min(10).max(30), z.null()]).optional(),
});

// GET /api/drafts — list current user's drafts
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  }

  const drafts = await db.documentDraft.findMany({
    where: {
      userId: session.user.id,
      status: { in: ["DRAFT", "COMPLETED"] },
    },
    include: {
      document: {
        select: {
          id: true,
          slug: true,
          titleUz: true,
          category: true,
          pages: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    drafts: drafts.map((d) => ({
      id: d.id,
      status: d.status,
      version: d.version,
      downloadCount: d.downloadCount,
      lastDownloadedAt: d.lastDownloadedAt,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      expiresAt: d.expiresAt,
      document: d.document,
    })),
  });
}

// POST /api/drafts — create or update a draft (autosave)
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  }
  const ip = getIpFromRequest(req);

  // Rate limit: 60 saves per 10 min
  const rl = enforceRateLimit(`draft-save:${session.user.id}`, RATE_LIMITS.DRAFT_SAVE);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Saqlash chegarasi oshdi" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const parsed = saveDraftSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validatsiya xatosi", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  // Load document + template to validate values
  const doc = await db.legalDocument.findUnique({
    where: { id: parsed.data.documentId },
    include: { template: true },
  });
  if (!doc || !doc.template) {
    return NextResponse.json({ error: "Hujjat topilmadi" }, { status: 404 });
  }

  const template = parseTemplate(doc.template.fieldsSchema);
  // For autosave we allow partial values — required validation happens on download
  const partialValues = validateDraftValues(template, parsed.data.fieldValues);

  // If updating existing draft, verify ownership (IDOR protection)
  if (parsed.data.draftId) {
    const existing = await db.documentDraft.findUnique({
      where: { id: parsed.data.draftId },
      select: { userId: true, version: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Draf topilmadi" }, { status: 404 });
    }
    if (existing.userId !== session.user.id) {
      await audit({
        userId: session.user.id,
        action: "authz_denied",
        resourceType: "draft",
        resourceId: parsed.data.draftId,
        ipAddress: ip,
        success: false,
      });
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
    }

    const updated = await db.documentDraft.update({
      where: { id: parsed.data.draftId },
      data: {
        fieldValues: JSON.stringify(partialValues.sanitized),
        version: { increment: 1 },
      },
      select: { id: true, version: true, updatedAt: true },
    });

    return NextResponse.json({
      ok: true,
      draft: updated,
      validationErrors: partialValues.errors,
    });
  }

  // Create new draft
  const draft = await db.documentDraft.create({
    data: {
      userId: session.user.id,
      documentId: parsed.data.documentId,
      fieldValues: JSON.stringify(partialValues.sanitized),
      status: "DRAFT",
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
    select: { id: true, version: true, updatedAt: true },
  });

  await audit({
    userId: session.user.id,
    action: "draft_create",
    resourceType: "draft",
    resourceId: draft.id,
    ipAddress: ip,
  });

  return NextResponse.json(
    {
      ok: true,
      draft,
      validationErrors: partialValues.errors,
    },
    { status: 201 }
  );
}
