import { NextRequest, NextResponse } from "next/server";
import {
  loadLibrary,
  getTemplatesByCategoryTree,
  getTemplateById,
  getLegacyTemplate,
  searchTemplates,
  getLibraryStats,
} from "@/lib/documents/templates/registry";

export const runtime = "nodejs";

/**
 * GET /api/court-claims
 *
 * Query params:
 *   - id=<templateId>      → return single template (legacy format + raw v4)
 *   - q=<search>           → search by name/category
 *   - view=tree            → return templates grouped by category tree
 *   - view=stats           → return library stats (counts by forum/category)
 *   - (default)            → return all templates as flat list
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const q = url.searchParams.get("q");
  const view = url.searchParams.get("view");

  try {
    // Single template by ID
    if (id) {
      const template = getTemplateById(id);
      if (!template) {
        return NextResponse.json({ error: "Shablon topilmadi" }, { status: 404 });
      }
      const legacy = getLegacyTemplate(id);
      return NextResponse.json({
        template,
        legacyTemplate: legacy,
      });
    }

    // Stats view
    if (view === "stats") {
      return NextResponse.json(getLibraryStats());
    }

    // Tree view
    if (view === "tree" && !q) {
      return NextResponse.json(getTemplatesByCategoryTree());
    }

    // Search or list
    const templates = q ? searchTemplates(q) : loadLibrary().templates;

    return NextResponse.json({
      meta: loadLibrary().meta,
      count: templates.length,
      templates: templates.map(t => ({
        id: t.id,
        name_uz: t.name_uz,
        category_path: t.category_path,
        forum: t.forum,
        legal_basis: t.legal_basis,
        content_fields_count: t.content_fields.length,
        relief_items_count: t.relief_items.length,
        uses_common_groups: t.uses_common_groups,
        notes: t.notes,
      })),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server xatosi", details: err instanceof Error ? err.message : undefined },
      { status: 500 },
    );
  }
}
