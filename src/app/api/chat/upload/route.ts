import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getSession } from "@/lib/auth/session";
import { audit } from "@/lib/security/audit";
import { getIpFromRequest, enforceRateLimit, RATE_LIMITS } from "@/lib/security/rate-limit";
import { nanoid } from "nanoid";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "storage", "uploads");
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME = [
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
  }
  const ip = getIpFromRequest(req);

  const rl = enforceRateLimit(`chat-upload:${session.user.id}`, { limit: 20, windowMs: 10 * 60 * 1000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Yuklash chegarasi oshdi" }, { status: 429 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "Fayl topilmadi" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Fayl juda katta (max 10 MB)" }, { status: 413 });
    }

    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json({ error: `Noto'g'ri fayl turi: ${file.type}` }, { status: 415 });
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const ext = path.extname(file.name).toLowerCase();
    const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf", ".doc", ".docx", ".txt"].includes(ext) ? ext : "";
    const filename = `${nanoid(16)}${safeExt}`;
    const bytes = await file.arrayBuffer();
    await fs.writeFile(path.join(UPLOAD_DIR, filename), Buffer.from(bytes));

    await audit({
      userId: session.user.id,
      action: "message_send",
      resourceType: "file",
      resourceId: filename,
      metadata: { originalName: file.name, size: file.size, mime: file.type },
      ipAddress: ip,
    });

    return NextResponse.json({
      ok: true,
      file: {
        filename,
        originalName: file.name,
        size: file.size,
        mimeType: file.type,
        url: `/api/chat/files/${filename}`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Yuklash amalga oshmadi" }, { status: 500 });
  }
}
