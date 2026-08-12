#!/usr/bin/env node
/**
 * Seed script — imports all 54 court-claims-v4 templates into the database.
 *
 * For each template, creates:
 *   - LegalDocument row (slug, title, category, subcategory, description, etc.)
 *   - DocumentTemplate row (fieldsSchema JSON, bodySchema JSON)
 *
 * Idempotent: if a template with the same slug already exists, it's updated.
 *
 * Usage:
 *   node scripts/seed-court-claims.js
 *   # or
 *   bun scripts/seed-court-claims.js
 */

const { PrismaClient } = require("@prisma/client");
const path = require("path");

// Load the JSON directly via fs (no ESM import issues)
const fs = require("fs");
const libraryJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../src/lib/documents/templates/court-claims-v4.json"), "utf-8"),
);

const prisma = new PrismaClient();

/**
 * Convert a v4.0 CourtClaimTemplate into the legacy DocumentTemplateData
 * format (sections array) for storage in fieldsSchema.
 */
function toLegacySections(template, commonFieldGroups) {
  const sections = [];

  const groupLabels = {
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

  for (const groupId of template.uses_common_groups) {
    const groupFields = commonFieldGroups[groupId];
    if (groupFields && groupFields.length > 0) {
      // Normalize fields: rename label_uz → label
      const normalizedFields = groupFields.map(f => ({
        id: f.id,
        label: f.label_uz || f.label,
        type: f.type,
        required: f.required ?? false,
        maxLength: f.maxLength,
        defaultValue: f.defaultValue,
        hint: f.hint,
        options: f.options,
        placeholder: f.placeholder,
      }));
      sections.push({
        id: groupId,
        title: groupLabels[groupId] || groupId,
        fields: normalizedFields,
      });
    }
  }

  // Content fields as final section
  if (template.content_fields && template.content_fields.length > 0) {
    const normalizedContent = template.content_fields.map(f => ({
      id: f.id,
      label: f.label_uz || f.label,
      type: f.type,
      required: f.required ?? false,
      maxLength: f.maxLength,
      defaultValue: f.defaultValue,
      hint: f.hint,
      options: f.options,
      placeholder: f.placeholder,
    }));
    sections.push({
      id: "content_fields",
      title: "Asosiy maydonlar",
      fields: normalizedContent,
    });
  }

  return { sections };
}

/**
 * Convert body_template string + relief_items + attachments into a body JSON
 * (array of structured items) for the bodySchema column.
 */
function toBodySchema(template) {
  const body = [];

  // Header — court + forum
  body.push({ type: "text", content: template.forum, style: "subheading" });
  body.push({ type: "spacer" });

  // Body template — split by newlines into paragraphs
  const lines = template.body_template.split("\n").filter(l => l.trim());
  for (const line of lines) {
    body.push({ type: "text", content: line, style: "paragraph" });
  }

  // Relief items as a bulleted list
  if (template.relief_items && template.relief_items.length > 0) {
    body.push({ type: "spacer" });
    body.push({ type: "text", content: "So'rayman:", style: "subheading" });
    for (const item of template.relief_items) {
      body.push({ type: "text", content: item, style: "list_item" });
    }
  }

  // Attachments
  if (template.attachments && template.attachments.length > 0) {
    body.push({ type: "spacer" });
    body.push({ type: "text", content: "Ilojalar:", style: "subheading" });
    for (const att of template.attachments) {
      body.push({ type: "text", content: att, style: "list_item" });
    }
  }

  return body;
}

/**
 * Convert category_path array → top-level category + subcategory string.
 */
function toCategoryFields(template) {
  const cp = Array.isArray(template.category_path)
    ? template.category_path
    : template.category_path.split(">").map(s => s.trim());

  const top = cp[0] || "Boshqa";
  const sub = cp.slice(1).join(" > ") || null;

  // Map top-level Uzbek category to the existing DOCUMENT_CATEGORIES ids
  // (used by the marketplace UI for filtering)
  const catMap = {
    "Sudga oid hujjatlar": "sud",
    "Arizalar": "ariza",
    "Notarial tasdiqlanadigan hujjatlar": "notarial",
    "Ma'muriy sud ishlari": "administrativ",
  };
  const categoryId = catMap[top] || "boshqa";

  return { category: categoryId, subcategory: sub, topCategory: top };
}

/**
 * Estimate page count based on body_template length + relief items.
 */
function estimatePages(template) {
  const len = template.body_template.length
    + (template.relief_items || []).join("").length
    + (template.attachments || []).join("").length;
  // Rough: 1500 chars per page (Cyrillic + Latin mixed)
  return Math.max(1, Math.ceil(len / 1500));
}

/**
 * Estimate fill time based on total field count.
 */
function estimateFillMinutes(template, commonFieldGroups) {
  let fieldCount = template.content_fields.length;
  for (const groupId of template.uses_common_groups) {
    const g = commonFieldGroups[groupId];
    if (g) fieldCount += g.length;
  }
  // Rough: 30 seconds per field
  return Math.max(5, Math.round(fieldCount * 0.5));
}

async function main() {
  console.log("=".repeat(60));
  console.log("Seeding court-claims-v4 templates into the database...");
  console.log("=".repeat(60));
  console.log();

  const lib = libraryJson;
  console.log(`Library version: ${lib.meta.version}`);
  console.log(`Templates to import: ${lib.templates.length}`);
  console.log(`Common field groups: ${Object.keys(lib.common_field_groups).length}`);
  console.log();

  let created = 0;
  let updated = 0;
  let skipped = 0;
  const errors = [];

  for (const template of lib.templates) {
    try {
      const slug = template.id;
      const { category, subcategory, topCategory } = toCategoryFields(template);
      const sections = toLegacySections(template, lib.common_field_groups);
      const body = toBodySchema(template);
      const pages = estimatePages(template);
      const fillMinutes = estimateFillMinutes(template, lib.common_fieldGroups || lib.common_field_groups);

      const legalBasis = (template.legal_basis || []).join("; ");
      const tagsJson = JSON.stringify([
        template.forum,
        topCategory,
        ...(template.uses_common_groups || []),
      ].filter(Boolean));

      // Upsert LegalDocument
      const legalDoc = await prisma.legalDocument.upsert({
        where: { slug },
        update: {
          titleUz: template.name_uz,
          category,
          subcategory,
          descriptionUz: template.notes || template.name_uz,
          pages,
          legalBasisUz: legalBasis || null,
          tagsJson,
          lastUpdated: new Date(),
        },
        create: {
          slug,
          titleUz: template.name_uz,
          category,
          subcategory,
          descriptionUz: template.notes || template.name_uz,
          pages,
          isFree: true,
          isPopular: false,
          isNew: true,
          rating: 0,
          downloads: 0,
          legalBasisUz: legalBasis || null,
          tagsJson,
        },
      });

      // Upsert DocumentTemplate
      const existingTemplate = await prisma.documentTemplate.findUnique({
        where: { documentId: legalDoc.id },
      });

      if (existingTemplate) {
        await prisma.documentTemplate.update({
          where: { documentId: legalDoc.id },
          data: {
            fieldsSchema: JSON.stringify(sections),
            bodySchema: JSON.stringify(body),
            estimatedFillMinutes: fillMinutes,
            version: 4,
            updatedAt: new Date(),
          },
        });
        updated++;
      } else {
        await prisma.documentTemplate.create({
          data: {
            documentId: legalDoc.id,
            fieldsSchema: JSON.stringify(sections),
            bodySchema: JSON.stringify(body),
            estimatedFillMinutes: fillMinutes,
            version: 4,
          },
        });
        created++;
      }

      console.log(`  ✓ ${slug} — ${template.name_uz.substring(0, 60)}...`);
    } catch (err) {
      skipped++;
      errors.push({ id: template.id, error: err.message });
      console.error(`  ✗ ${template.id} — ${err.message}`);
    }
  }

  console.log();
  console.log("=".repeat(60));
  console.log("Seed complete!");
  console.log(`  Created: ${created}`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped (errors): ${skipped}`);
  if (errors.length > 0) {
    console.log();
    console.log("Errors:");
    for (const e of errors) {
      console.log(`  ${e.id}: ${e.error}`);
    }
  }
  console.log("=".repeat(60));
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
