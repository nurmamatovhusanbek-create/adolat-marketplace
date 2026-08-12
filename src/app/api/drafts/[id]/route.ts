import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { audit } from "@/lib/security/audit";
import { getIpFromRequest } from "@/lib/security/rate-limit"
import { parseDraftValues } from "@/lib/documents/template";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/drafts/[id] — get a specific draft (with values)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  }
  const { id } = await params;

  const draft = await db.documentDraft.findUnique({
    where: { id },
    include: {
      document: {
        select: {
          id: true,
          slug: true,
          titleUz: true,
          category: true,
          subcategory: true,
          pages: true,
          descriptionUz: true,
          isFree: true,
          priceUzs: true,
          legalBasisUz: true,
          template: { select: { fieldsSchema: true, bodySchema: true, estimatedFillMinutes: true } },
        },
      },
    },
  });

  if (!draft) {
    return NextResponse.json({ error: "Draf topilmadi" }, { status: 404 });
  }

  // Ownership check (IDOR protection)
  if (draft.userId !== session.user.id) {
    await audit({
      userId: session.user.id,
      action: "authz_denied",
      resourceType: "draft",
      resourceId: id,
      ipAddress: getIpFromRequest(req),
      success: false,
    });
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  const values = parseDraftValues(draft.fieldValues);
  return NextResponse.json({
    draft: {
      id: draft.id,
      status: draft.status,
      version: draft.version,
      downloadCount: draft.downloadCount,
      lastDownloadedAt: draft.lastDownloadedAt,
      createdAt: draft.createdAt,
      updatedAt: draft.updatedAt,
      expiresAt: draft.expiresAt,
      values,
      document: draft.document,
    },
  });
}

// DELETE /api/drafts/[id] — soft-delete a draft
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  }
  const { id } = await params;
  const ip = getIpFromRequest(req);

  const draft = await db.documentDraft.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!draft) {
    return NextResponse.json({ error: "Draf topilmadi" }, { status: 404 });
  }
  if (draft.userId !== session.user.id) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  await db.documentDraft.update({
    where: { id },
    data: { status: "DELETED" },
  });

  await audit({
    userId: session.user.id,
    action: "draft_delete",
    resourceType: "draft",
    resourceId: id,
    ipAddress: ip,
  });

  return NextResponse.json({ ok: true });
}
