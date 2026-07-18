import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/categories — list all document categories with counts
export async function GET() {
  const docs = await db.legalDocument.findMany({
    where: { isActive: true },
    select: { category: true },
  });
  const counts: Record<string, number> = {};
  for (const d of docs) {
    counts[d.category] = (counts[d.category] ?? 0) + 1;
  }
  return NextResponse.json({ counts });
}
