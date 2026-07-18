import { z } from "zod";
import {
  documentTemplateSchema,
  documentBodySchema,
  draftValuesSchema,
} from "@/lib/security/validators";

// ============================================================================
// Types
// ============================================================================

export type FieldType = "text" | "textarea" | "number" | "date" | "select" | "checkbox";

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

export type BodyItem =
  | { type: "text"; content: string; style?: "heading" | "subheading" | "paragraph" | "list_item" }
  | { type: "field"; fieldId: string }
  | { type: "spacer" };

export type DocumentBody = BodyItem[];

export type DraftValues = Record<string, string>;

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

    // Coerce to string (checkbox -> "true"|"false", number -> str)
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
    if (field.type === "number") {
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
// Returns the same structure as DocumentBody but with field refs replaced
// by rendered text items.
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
