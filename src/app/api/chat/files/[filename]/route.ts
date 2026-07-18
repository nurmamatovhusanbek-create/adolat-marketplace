import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "storage", "uploads");

// GET /api/chat/files/[filename] — download a chat attachment
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Strict filename validation (no path traversal)
  if (!/^[A-Za-z0-9_-]+\.(jpg|jpeg|png|webp|gif|pdf|doc|docx|txt)$/.test(filename)) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const filepath = path.join(UPLOAD_DIR, filename);
  try {
    const data = await fs.readFile(filepath);
    const ext = path.extname(filename).slice(1).toLowerCase();
    const mimeMap: Record<string, string> = {
      jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
      webp: "image/webp", gif: "image/gif", pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      txt: "text/plain; charset=utf-8",
    };
    return new NextResponse(data, {
      headers: {
        "Content-Type": mimeMap[ext] || "application/octet-stream",
        "Content-Length": String(data.length),
        "Cache-Control": "private, max-age=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
