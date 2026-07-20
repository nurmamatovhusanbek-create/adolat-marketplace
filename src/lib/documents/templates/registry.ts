import { courtClaimsLibrarySchema } from "@/lib/security/validators";
import type { CourtClaimsLibrary, CourtClaimTemplate, DocumentField } from "@/lib/documents/template";
import { courtClaimToLegacyTemplate, getAllCourtClaimFieldIds } from "@/lib/documents/template";

// ============================================================================
// Court Claims Library — loader & registry
// Loads the v4.0 JSON library (54 templates) and provides typed accessors.
// ============================================================================

// Use fs + path to load the JSON at runtime (avoids bundling a 151KB JSON
// into the type-checker's memory, which OOMs on low-memory build machines).
import fs from "node:fs";
import path from "node:path";

let cachedLibrary: CourtClaimsLibrary | null = null;
let cachedRawJson: unknown | null = null;

/**
 * Load raw JSON (cached).
 */
function loadRawJson(): unknown {
  if (cachedRawJson) return cachedRawJson;
  const jsonPath = path.join(process.cwd(), "src/lib/documents/templates/court-claims-v4.json");
  const raw = fs.readFileSync(jsonPath, "utf-8");
  cachedRawJson = JSON.parse(raw);
  return cachedRawJson;
}

/**
 * Load and validate the entire library. Cached after first call.
 * Throws if the JSON doesn't match the expected schema.
 */
export function loadLibrary(): CourtClaimsLibrary {
  if (cachedLibrary) return cachedLibrary;
  const raw = loadRawJson();
  const parsed = courtClaimsLibrarySchema.parse(raw) as unknown as CourtClaimsLibrary;
  cachedLibrary = parsed;
  return parsed;
}

/**
 * Get all common_field_groups keyed by ID.
 * Each group is a reusable collection of fields (court, plaintiff_individual, etc.)
 */
export function getCommonFieldGroups(): Record<string, DocumentField[]> {
  return loadLibrary().common_field_groups;
}

/**
 * Get a specific common_field_group by ID.
 */
export function getCommonFieldGroup(groupId: string): DocumentField[] | undefined {
  return loadLibrary().common_field_groups[groupId];
}

/**
 * List all 54 court claim templates.
 */
export function getAllTemplates(): CourtClaimTemplate[] {
  return loadLibrary().templates;
}

/**
 * Find a template by ID. Returns undefined if not found.
 */
export function getTemplateById(id: string): CourtClaimTemplate | undefined {
  return loadLibrary().templates.find(t => t.id === id);
}

/**
 * List all unique top-level categories (first element of category_path).
 */
export function getTopLevelCategories(): string[] {
  const lib = loadLibrary();
  const tops = new Set<string>();
  for (const t of lib.templates) {
    const cp = t.category_path;
    if (Array.isArray(cp) && cp.length > 0) {
      tops.add(cp[0]);
    } else if (typeof cp === "string") {
      tops.add(cp.split(">")[0].trim());
    }
  }
  return Array.from(tops).sort();
}

/**
 * List all templates grouped by their full category_path.
 * Returns a tree of categories → subcategories → templates.
 */
export interface CategoryNode {
  name: string;
  path: string;
  templates: CourtClaimTemplate[];
  children: Record<string, CategoryNode>;
}

export function getTemplatesByCategoryTree(): CategoryNode {
  const root: CategoryNode = { name: "root", path: "", templates: [], children: {} };
  const lib = loadLibrary();

  for (const t of lib.templates) {
    const cp = Array.isArray(t.category_path)
      ? t.category_path
      : t.category_path.split(">").map(s => s.trim());

    let current = root;
    let pathAccum = "";
    for (const part of cp) {
      pathAccum = pathAccum ? `${pathAccum} > ${part}` : part;
      if (!current.children[part]) {
        current.children[part] = { name: part, path: pathAccum, templates: [], children: {} };
      }
      current = current.children[part];
    }
    current.templates.push(t);
  }

  return root;
}

/**
 * Convert a v4.0 CourtClaimTemplate into the legacy DocumentTemplateData format
 * (sections array) for the existing editor UI.
 */
export function getLegacyTemplate(id: string) {
  const template = getTemplateById(id);
  if (!template) return undefined;
  const groups = getCommonFieldGroups();
  return courtClaimToLegacyTemplate(template, groups);
}

/**
 * Get all field IDs for a v4.0 template (common groups + content_fields).
 * Used as the allowlist for substitution.
 */
export function getAllFieldIdsForTemplate(id: string): Set<string> {
  const template = getTemplateById(id);
  if (!template) return new Set();
  const groups = getCommonFieldGroups();
  return getAllCourtClaimFieldIds(template, groups);
}

/**
 * Search templates by query string. Matches against name_uz and category_path.
 */
export function searchTemplates(query: string): CourtClaimTemplate[] {
  const lib = loadLibrary();
  const q = query.trim().toLowerCase();
  if (!q) return lib.templates;
  return lib.templates.filter(t => {
    const name = t.name_uz.toLowerCase();
    const cp = Array.isArray(t.category_path)
      ? t.category_path.join(" ").toLowerCase()
      : t.category_path.toLowerCase();
    return name.includes(q) || cp.includes(q);
  });
}

/**
 * Filter templates by forum (e.g. "fuqarolik sudi", "iqtisodiy sud", "notarius").
 */
export function filterByForum(forum: string): CourtClaimTemplate[] {
  return loadLibrary().templates.filter(t => t.forum === forum);
}

/**
 * Get library stats — counts by category, forum, etc.
 */
export function getLibraryStats() {
  const lib = loadLibrary();
  const byForum = new Map<string, number>();
  const byTopCat = new Map<string, number>();
  for (const t of lib.templates) {
    byForum.set(t.forum, (byForum.get(t.forum) ?? 0) + 1);
    const cp = Array.isArray(t.category_path) ? t.category_path : t.category_path.split(">").map(s => s.trim());
    const top = cp[0] ?? "Other";
    byTopCat.set(top, (byTopCat.get(top) ?? 0) + 1);
  }
  return {
    totalTemplates: lib.templates.length,
    totalFieldGroups: Object.keys(lib.common_field_groups).length,
    byForum: Object.fromEntries(byForum),
    byTopCategory: Object.fromEntries(byTopCat),
  };
}
