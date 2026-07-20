import { z } from "zod";
import {
  documentTemplateSchema,
  documentBodySchema,
  draftValuesSchema,
} from "@/lib/security/validators";

// ============================================================================
// Field types — extended to support money + boolean per v4.0 schema
// ============================================================================

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "checkbox"
  | "money"     // NEW: currency-formatted number (so'm)
  | "boolean";  // NEW: yes/no toggle

export interface DocumentField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  maxLength?: number;
  defaultValue?: string;
  hint?: string;
  options?: string[];
  placeholder?: string;
}

export interface DocumentSection {
  id: string;
  title: string;
  description?: string;
  fields: DocumentField[];
}

export interface DocumentTemplateData {
  sections: DocumentSection[];
}

// ============================================================================
// Body items — for the structured body (sections-based) format
// ============================================================================

export type BodyItem =
  | { type: "text"; content: string; style?: "heading" | "subheading" | "paragraph" | "list_item" }
  | { type: "field"; fieldId: string }
  | { type: "spacer" };

export type DocumentBody = BodyItem[];

export type DraftValues = Record<string, string>;

// ============================================================================
// NEW: v4.0 template format — supports body_template string + common_field_groups
// ============================================================================

/**
 * A field group is a reusable collection of fields (e.g. court info, plaintiff info).
 * Templates reference these via `uses_common_groups`.
 */
export interface FieldGroup {
  id: string;
  fields: DocumentField[];
}

/**
 * The v4.0 template format used by court-claims-v4.json.
 *
 * Key differences from the legacy DocumentTemplateData:
 * - `body_template`: a single string with `{{field_id}}` placeholders (instead of DocumentBody array)
 * - `common_field_groups`: reusable field collections referenced by `uses_common_groups`
 * - `category_path`: hierarchical category (e.g. ["Sudga oid hujjatlar", "Da'vo arizalar", ...])
 * - `forum`: which court/authority this goes to
 * - `legal_basis`: array of statute references
 * - `relief_items`: array of prayer-for-relief sentences (with placeholders)
 * - `attachments`: array of attachment descriptions
 * - `notes`: optional notes for the user
 */
export interface CourtClaimTemplate {
  id: string;
  name_uz: string;
  category_path: string[] | string;
  forum: string;
  legal_basis?: string[];
  plaintiff_group?: string;
  defendant_group?: string;
  uses_common_groups: string[];
  content_fields: DocumentField[];
  relief_items: string[];
  attachments?: string[];
  notes?: string;
  body_template: string;
}

export interface CourtClaimsLibrary {
  meta: {
    title: string;
    description: string;
    version: string;
    source_inspiration?: string;
    field_types: string[];
    placeholder_syntax: string;
    usage_note: string;
    legal_disclaimer: string;
    party_name_aliases?: string;
  };
  common_field_groups: Record<string, DocumentField[]>;
  templates: CourtClaimTemplate[];
}

// ============================================================================
// Parsers — strictly validate every JSON we read from the DB
// ============================================================================

export function parseTemplate(json: string): DocumentTemplateData {
  const raw = JSON.parse(json);
  return documentTemplateSchema.parse(raw) as DocumentTemplateData;
}

export function parseBody(json: string): DocumentBody {
  const raw = JSON.parse(json);
  return documentBodySchema.parse(raw) as DocumentBody;
}

export function parseDraftValues(json: string): DraftValues {
  const raw = JSON.parse(json);
  return draftValuesSchema.parse(raw) as DraftValues;
}

// ============================================================================
// All field IDs that exist in a template — used as the allowlist for substitution
// ============================================================================

export function getAllFieldIds(template: DocumentTemplateData): Set<string> {
  const ids = new Set<string>();
  for (const section of template.sections) {
    for (const field of section.fields) {
      ids.add(field.id);
    }
  }
  return ids;
}

/**
 * Get all field IDs in a v4.0 CourtClaimTemplate (common groups + content_fields).
 */
export function getAllCourtClaimFieldIds(
  template: CourtClaimTemplate,
  groups: Record<string, DocumentField[]>,
): Set<string> {
  const ids = new Set<string>();
  for (const groupId of template.uses_common_groups) {
    const group = groups[groupId];
    if (group) {
      for (const field of group) {
        ids.add(field.id);
      }
    }
  }
  for (const field of template.content_fields) {
    ids.add(field.id);
  }
  return ids;
}

// ============================================================================
// Validation of submitted draft values against the template
// ============================================================================

export interface ValidationResult {
  ok: boolean;
  errors: Array<{ fieldId: string; message: string }>;
  sanitized: DraftValues;
}

/**
 * Validate user-submitted field values against a template.
 * - Strips unknown field IDs (anti-injection)
 * - Enforces required, type, maxLength per field
 * - Returns a clean, sanitized values map
 */
export function validateDraftValues(
  template: DocumentTemplateData,
  rawValues: Record<string, unknown>
): ValidationResult {
  const errors: Array<{ fieldId: string; message: string }> = [];
  const sanitized: DraftValues = {};
  const allowedIds = getAllFieldIds(template);

  // Build a quick lookup: fieldId -> field spec
  const fieldMap = new Map<string, DocumentField>();
  for (const section of template.sections) {
    for (const field of section.fields) {
      fieldMap.set(field.id, field);
    }
  }

  // Reject any submitted key not in the allowlist
  for (const [key, value] of Object.entries(rawValues)) {
    if (!allowedIds.has(key)) {
      // Silently drop unknown keys — don't leak that they were rejected
      continue;
    }

    const field = fieldMap.get(key);
    if (!field) continue;

    // Coerce to string (checkbox/boolean -> "true"|"false", number -> str)
    let strValue = "";
    if (typeof value === "string") {
      strValue = value;
    } else if (typeof value === "number") {
      strValue = String(value);
    } else if (typeof value === "boolean") {
      strValue = value ? "true" : "false";
    } else if (value === null || value === undefined) {
      strValue = "";
    } else {
      errors.push({ fieldId: key, message: "Noto'g'ri qiymat turi" });
      continue;
    }

    // Strip control chars
    strValue = strValue.replace(/[\u0000-\u001F\u007F]/g, "");
    // Trim
    strValue = strValue.trim();
    // Enforce maxLength
    const maxLen = field.maxLength ?? 500;
    if (strValue.length > maxLen) {
      strValue = strValue.slice(0, maxLen);
    }

    // Type-specific validation
    if (field.type === "number" || field.type === "money") {
      if (strValue && !/^-?\d+(\.\d+)?$/.test(strValue)) {
        errors.push({ fieldId: key, message: "Faqat raqam kiriting" });
        continue;
      }
    }
    if (field.type === "date") {
      if (strValue && !/^\d{4}-\d{2}-\d{2}$/.test(strValue)) {
        errors.push({ fieldId: key, message: "Sana formati: YYYY-MM-DD" });
        continue;
      }
    }
    if (field.type === "select" && field.options && strValue) {
      if (!field.options.includes(strValue)) {
        errors.push({ fieldId: key, message: "Ruxsat etilmagan qiymat" });
        continue;
      }
    }
    if (field.type === "boolean" || field.type === "checkbox") {
      if (strValue && !["true", "false"].includes(strValue)) {
        errors.push({ fieldId: key, message: "Qiymat true yoki false bo'lishi kerak" });
        continue;
      }
    }

    sanitized[key] = strValue;
  }

  // Check required fields
  for (const section of template.sections) {
    for (const field of section.fields) {
      if (field.required && !sanitized[field.id]) {
        errors.push({ fieldId: field.id, message: `${field.label} to'ldirilishi shart` });
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    sanitized,
  };
}

/**
 * Validate against a v4.0 CourtClaimTemplate (with common_field_groups).
 */
export function validateCourtClaimDraftValues(
  template: CourtClaimTemplate,
  groups: Record<string, DocumentField[]>,
  rawValues: Record<string, unknown>,
): ValidationResult {
  const errors: Array<{ fieldId: string; message: string }> = [];
  const sanitized: DraftValues = {};
  const allowedIds = getAllCourtClaimFieldIds(template, groups);

  // Build field lookup across common groups + content_fields
  const fieldMap = new Map<string, DocumentField>();
  for (const groupId of template.uses_common_groups) {
    const group = groups[groupId];
    if (group) {
      for (const field of group) {
        fieldMap.set(field.id, field);
      }
    }
  }
  for (const field of template.content_fields) {
    fieldMap.set(field.id, field);
  }

  // Same per-value validation as validateDraftValues
  for (const [key, value] of Object.entries(rawValues)) {
    if (!allowedIds.has(key)) continue;
    const field = fieldMap.get(key);
    if (!field) continue;

    let strValue = "";
    if (typeof value === "string") strValue = value;
    else if (typeof value === "number") strValue = String(value);
    else if (typeof value === "boolean") strValue = value ? "true" : "false";
    else if (value === null || value === undefined) strValue = "";
    else {
      errors.push({ fieldId: key, message: "Noto'g'ri qiymat turi" });
      continue;
    }

    strValue = strValue.replace(/[\u0000-\u001F\u007F]/g, "").trim();
    const maxLen = field.maxLength ?? 1000;
    if (strValue.length > maxLen) strValue = strValue.slice(0, maxLen);

    if (field.type === "number" || field.type === "money") {
      if (strValue && !/^-?\d+(\.\d+)?$/.test(strValue)) {
        errors.push({ fieldId: key, message: "Faqat raqam kiriting" });
        continue;
      }
    }
    if (field.type === "date" && strValue && !/^\d{4}-\d{2}-\d{2}$/.test(strValue)) {
      errors.push({ fieldId: key, message: "Sana formati: YYYY-MM-DD" });
      continue;
    }
    if (field.type === "select" && field.options && strValue && !field.options.includes(strValue)) {
      errors.push({ fieldId: key, message: "Ruxsat etilmagan qiymat" });
      continue;
    }
    if ((field.type === "boolean" || field.type === "checkbox") && strValue && !["true", "false"].includes(strValue)) {
      errors.push({ fieldId: key, message: "Qiymat true yoki false bo'lishi kerak" });
      continue;
    }

    sanitized[key] = strValue;
  }

  // Check required fields across all groups
  for (const groupId of template.uses_common_groups) {
    const group = groups[groupId];
    if (group) {
      for (const field of group) {
        if (field.required && !sanitized[field.id]) {
          errors.push({ fieldId: field.id, message: `${field.label} to'ldirilishi shart` });
        }
      }
    }
  }
  for (const field of template.content_fields) {
    if (field.required && !sanitized[field.id]) {
      errors.push({ fieldId: field.id, message: `${field.label} to'ldirilishi shart` });
    }
  }

  return { ok: errors.length === 0, errors, sanitized };
}

// ============================================================================
// HTML escape — use when rendering draft values into HTML preview
// ============================================================================

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ============================================================================
// Render the body template by substituting field values
// ============================================================================

export interface RenderedBodyItem {
  type: "heading" | "subheading" | "paragraph" | "list_item" | "spacer";
  text: string;
}

export function renderBody(
  body: DocumentBody,
  values: DraftValues
): RenderedBodyItem[] {
  const out: RenderedBodyItem[] = [];
  for (const item of body) {
    if (item.type === "text") {
      out.push({
        type: item.style ?? "paragraph",
        text: item.content,
      });
    } else if (item.type === "field") {
      out.push({
        type: "paragraph",
        text: values[item.fieldId] ?? "_____________________",
      });
    } else if (item.type === "spacer") {
      out.push({ type: "spacer", text: "" });
    }
  }
  return out;
}

/**
 * Render a v4.0 body_template string by substituting `{{field_id}}` placeholders.
 *
 * Per the meta.party_name_aliases note:
 * If plaintiff_group/defendant_group is `*_individual_or_legal`, the template
 * uses normalized placeholders like `{{plaintiff_name}}` / `{{plaintiff_address}}`
 * which are resolved at render time based on the user's choice (individual: full_name;
 * legal: org_name).
 *
 * This function takes a `partyChoice` map: { plaintiff: 'individual' | 'legal', defendant: 'individual' | 'legal' }
 * and resolves the normalized placeholders to the actual field values.
 */
export function renderBodyTemplate(
  bodyTemplate: string,
  values: DraftValues,
  partyChoice?: {
    plaintiff?: "individual" | "legal";
    defendant?: "individual" | "legal";
  },
): string {
  let out = bodyTemplate;

  // Resolve normalized party placeholders if partyChoice is provided
  if (partyChoice?.plaintiff) {
    if (partyChoice.plaintiff === "individual") {
      out = out.replace(/\{\{plaintiff_name\}\}/g, values["plaintiff_full_name"] || "_______________");
      out = out.replace(/\{\{plaintiff_address\}\}/g, values["plaintiff_address"] || "_______________");
    } else {
      out = out.replace(/\{\{plaintiff_name\}\}/g, values["plaintiff_org_name"] || "_______________");
      out = out.replace(/\{\{plaintiff_address\}\}/g, values["plaintiff_org_address"] || "_______________");
    }
  }
  if (partyChoice?.defendant) {
    if (partyChoice.defendant === "individual") {
      out = out.replace(/\{\{defendant_name\}\}/g, values["defendant_full_name"] || "_______________");
      out = out.replace(/\{\{defendant_address\}\}/g, values["defendant_address"] || "_______________");
    } else {
      out = out.replace(/\{\{defendant_name\}\}/g, values["defendant_org_name"] || "_______________");
      out = out.replace(/\{\{defendant_address\}\}/g, values["defendant_org_address"] || "_______________");
    }
  }

  // Replace all remaining `{{field_id}}` placeholders with field values
  // (or an underline placeholder if missing)
  out = out.replace(/\{\{([a-z0-9_]+)\}\}/gi, (match, fieldId: string) => {
    return values[fieldId] ?? "_______________";
  });

  return out;
}

/**
 * Render relief_items array — each item is a string with `{{field_id}}` placeholders.
 * Returns a list of resolved relief sentences.
 */
export function renderReliefItems(
  items: string[],
  values: DraftValues,
  partyChoice?: {
    plaintiff?: "individual" | "legal";
    defendant?: "individual" | "legal";
  },
): string[] {
  return items.map(item => renderBodyTemplate(item, values, partyChoice));
}

// ============================================================================
// Convert v4.0 CourtClaimTemplate → legacy DocumentTemplateData
// (so the existing editor UI can render it without major changes)
// ============================================================================

/**
 * Convert a v4.0 CourtClaimTemplate into the legacy DocumentTemplateData format
 * (sections array) by grouping fields by their common_field_groups.
 */
export function courtClaimToLegacyTemplate(
  template: CourtClaimTemplate,
  groups: Record<string, DocumentField[]>,
): DocumentTemplateData {
  const sections: DocumentSection[] = [];

  for (const groupId of template.uses_common_groups) {
    const groupFields = groups[groupId];
    if (groupFields && groupFields.length > 0) {
      sections.push({
        id: groupId,
        title: groupLabel(groupId),
        fields: groupFields,
      });
    }
  }

  // Content fields as the final "Asosiy maydonlar" section
  if (template.content_fields.length > 0) {
    sections.push({
      id: "content_fields",
      title: "Asosiy maydonlar",
      fields: template.content_fields,
    });
  }

  return { sections };
}

/**
 * Human-readable label for each common_field_group ID.
 */
function groupLabel(groupId: string): string {
  const labels: Record<string, string> = {
    court: "Sud ma'lumotlari",
    plaintiff_individual: "Da'vogar (jismoniy shaxs)",
    plaintiff_legal: "Da'vogar (yuridik shaxs)",
    plaintiff_individual_or_legal: "Da'vogar",
    defendant_individual: "Javobgar (jismoniy shaxs)",
    defendant_legal: "Javobgar (yuridik shaxs)",
    defendant_individual_or_legal: "Javobgar",
    representative: "Vakil",
    claim_value_and_duty: "Da'vo qiymati va davlat boji",
    evidence: "Dalillar",
    case_reference: "Ish ma'lumotlari",
    notary_block: "Notarius ma'lumotlari",
    foreign_worker: "Chet ellik ishchi",
    legal_fact_petitioner: "Arizachi (yuridik fakt)",
  };
  return labels[groupId] ?? groupId;
}
