import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { audit } from "@/lib/security/audit";
import { enforceRateLimit, RATE_LIMITS, getIpFromRequest } from "@/lib/security/rate-limit"
import { validateDraftValues, parseTemplate, parseBody, renderBody, parseDraftValues } from "@/lib/documents/template";
import { generateDocx, generatePdf } from "@/lib/documents/generate";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const generateSchema = z.object({
  format: z.enum(["pdf", "docx"]),
  values: z.record(z.string(), z.unknown()),
  draftId: z.string().optional(),
});

// GET — download a previously saved draft
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  }

  const { slug } = await params;
  const ip = getIpFromRequest(req);

  // Rate limit: 10 downloads per hour per user
  const rl = enforceRateLimit(`download:${session.user.id}`, RATE_LIMITS.DOWNLOAD);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Yuklab olish chegarasi oshdi" }, { status: 429 });
  }

  const doc = await db.legalDocument.findUnique({
    where: { slug },
    include: { template: true },
  });
  if (!doc || !doc.template) {
    return NextResponse.json({ error: "Hujjat topilmadi" }, { status: 404 });
  }

  // Find latest draft for this user
  const draft = await db.documentDraft.findFirst({
    where: {
      userId: session.user.id,
      documentId: doc.id,
      status: { in: ["DRAFT", "COMPLETED"] },
    },
    orderBy: { updatedAt: "desc" },
  });
  if (!draft) {
    return NextResponse.json({ error: "Saqlangan draf topilmadi" }, { status: 404 });
  }

  // Parse + validate stored values
  const template = parseTemplate(doc.template.fieldsSchema);
  const storedValues = parseDraftValues(draft.fieldValues);
  const values = validateDraftValues(template, storedValues).sanitized;

  const body = parseBody(doc.template.bodySchema);
  const rendered = renderBody(body, values);

  // Increment download counter
  await db.documentDraft.update({
    where: { id: draft.id },
    data: {
      lastDownloadedAt: new Date(),
      lastDownloadFormat: "pdf",
      downloadCount: { increment: 1 },
    },
  });
  await db.legalDocument.update({
    where: { id: doc.id },
    data: { downloads: { increment: 1 } },
  });

  await audit({
    userId: session.user.id,
    action: "doc_download",
    resourceType: "document",
    resourceId: doc.id,
    metadata: { format: "pdf", draftId: draft.id },
    ipAddress: ip,
  });

  const buffer = await generatePdf(doc.titleUz, rendered);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slug}.pdf"`,
      "Cache-Control": "private, no-cache",
    },
  });
}

// POST — generate a document with submitted values (also auto-saves draft)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  }

  const { slug } = await params;
  const ip = getIpFromRequest(req);

  // Rate limit
  const rl = enforceRateLimit(`download:${session.user.id}`, RATE_LIMITS.DOWNLOAD);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Yuklab olish chegarasi oshdi" }, { status: 429 });
  }

  // Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }
  const parsed = generateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validatsiya xatosi", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  // Load document + template
  const doc = await db.legalDocument.findUnique({
    where: { slug },
    include: { template: true },
  });
  if (!doc || !doc.template) {
    return NextResponse.json({ error: "Hujjat topilmadi" }, { status: 404 });
  }

  // Validate user values against template
  const template = parseTemplate(doc.template.fieldsSchema);
  const validation = validateDraftValues(template, parsed.data.values);
  if (!validation.ok) {
    return NextResponse.json(
      {
        error: "Maydonlar to'liq to'ldirilmagan",
        issues: validation.errors,
      },
      { status: 422 }
    );
  }

  // Save/update draft (so user can resume later)
  const draft = await db.documentDraft.upsert({
    where: { id: parsed.data.draftId ?? "nonexistent" },
    update: {
      fieldValues: JSON.stringify(validation.sanitized),
      status: "COMPLETED",
      lastDownloadedAt: new Date(),
      lastDownloadFormat: parsed.data.format,
      downloadCount: { increment: 1 },
    },
    create: {
      id: undefined,
      userId: session.user.id,
      documentId: doc.id,
      fieldValues: JSON.stringify(validation.sanitized),
      status: "COMPLETED",
      lastDownloadedAt: new Date(),
      lastDownloadFormat: parsed.data.format,
      downloadCount: 1,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
  });

  // Render body
  const bodySchema = parseBody(doc.template.bodySchema);
  const rendered = renderBody(bodySchema, validation.sanitized);

  // Generate file
  const buffer =
    parsed.data.format === "docx"
      ? await generateDocx(doc.titleUz, rendered)
      : await generatePdf(doc.titleUz, rendered);

  // Increment document downloads counter
  await db.legalDocument.update({
    where: { id: doc.id },
    data: { downloads: { increment: 1 } },
  });

  await audit({
    userId: session.user.id,
    action: "doc_download",
    resourceType: "document",
    resourceId: doc.id,
    metadata: { format: parsed.data.format, draftId: draft.id },
    ipAddress: ip,
  });

  const contentType =
    parsed.data.format === "docx"
      ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      : "application/pdf";
  const filename = `${slug}.${parsed.data.format}`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-cache",
      "X-Draft-Id": draft.id,
    },
  });
}
