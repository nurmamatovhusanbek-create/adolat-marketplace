// Convert the v3.0 templates JSON into our database format
// and update the startup.js to seed them
const fs = require("fs");
const path = require("path");

const rawData = fs.readFileSync(path.join(__dirname, "..", "upload", "Pasted Content_1784358927945.txt"), "utf8");
const data = JSON.parse(rawData);

const commonGroups = data.common_field_groups;
const templates = data.templates;

// Map category_path to our categories
function mapCategory(categoryPath) {
  if (categoryPath.includes("Da'vo ariza")) return { category: "court", subcategory: "Da'vo arizalari" };
  if (categoryPath.includes("Apellyatsiya") || categoryPath.includes("Kassatsiya") || categoryPath.includes("Taftish")) return { category: "court", subcategory: "Apellyatsiya, kassatsiya shikoyatlari" };
  if (categoryPath.includes("Ariza") && categoryPath.includes("sud")) return { category: "court", subcategory: "Arizalar" };
  if (categoryPath.includes("Shartnoma")) return { category: "contracts", subcategory: "Boshqa turdagi shartnomalar" };
  if (categoryPath.includes("notarial") || categoryPath.includes("Notarial") || categoryPath.includes("Vasiyatnoma") || categoryPath.includes("Ishonchnoma")) return { category: "notarial", subcategory: "Arizalar" };
  if (categoryPath.includes("Davlat organi") || categoryPath.includes("umumiy ariza")) return { category: "applications", subcategory: "Jismoniy shaxslarga oid" };
  return { category: "court", subcategory: "Boshqa" };
}

// Build fields schema from common groups + content fields
function buildFieldsSchema(template) {
  const sections = [];

  // Add common groups as sections
  for (const groupId of template.uses_common_groups || []) {
    const groupFields = commonGroups[groupId];
    if (groupFields) {
      sections.push({
        id: groupId,
        title: getGroupTitle(groupId),
        fields: groupFields.map(f => ({
          id: f.id,
          label: f.label_uz,
          type: f.type === "money" ? "number" : f.type,
          required: f.required || false,
          maxLength: f.type === "textarea" ? 2000 : 500,
          hint: f.hint,
          options: f.options,
          placeholder: f.hint,
        })),
      });
    }
  }

  // Add plaintiff group
  if (template.plaintiff_group === "plaintiff_individual_or_legal" || template.plaintiff_group === "plaintiff_individual") {
    sections.push({
      id: "plaintiff",
      title: "Da'vogar (jismoniy shaxs)",
      fields: commonGroups.plaintiff_individual.map(f => ({
        id: f.id, label: f.label_uz, type: f.type === "money" ? "number" : f.type,
        required: f.required || false, maxLength: f.type === "textarea" ? 2000 : 500,
        hint: f.hint, options: f.options, placeholder: f.hint,
      })),
    });
  }
  if (template.plaintiff_group === "plaintiff_individual_or_legal" || template.plaintiff_group === "plaintiff_legal") {
    sections.push({
      id: "plaintiff_org",
      title: "Da'vogar (yuridik shaxs)",
      fields: commonGroups.plaintiff_legal.map(f => ({
        id: f.id, label: f.label_uz, type: f.type === "money" ? "number" : f.type,
        required: f.required || false, maxLength: f.type === "textarea" ? 2000 : 500,
        hint: f.hint, options: f.options, placeholder: f.hint,
      })),
    });
  }

  // Add defendant group
  if (template.defendant_group === "defendant_individual_or_legal" || template.defendant_group === "defendant_individual") {
    sections.push({
      id: "defendant",
      title: "Javobgar (jismoniy shaxs)",
      fields: commonGroups.defendant_individual.map(f => ({
        id: f.id, label: f.label_uz, type: f.type === "money" ? "number" : f.type,
        required: f.required || false, maxLength: f.type === "textarea" ? 2000 : 500,
        hint: f.hint, options: f.options, placeholder: f.hint,
      })),
    });
  }
  if (template.defendant_group === "defendant_individual_or_legal" || template.defendant_group === "defendant_legal") {
    sections.push({
      id: "defendant_org",
      title: "Javobgar (yuridik shaxs)",
      fields: commonGroups.defendant_legal.map(f => ({
        id: f.id, label: f.label_uz, type: f.type === "money" ? "number" : f.type,
        required: f.required || false, maxLength: f.type === "textarea" ? 2000 : 500,
        hint: f.hint, options: f.options, placeholder: f.hint,
      })),
    });
  }

  // Add content fields
  if (template.content_fields && template.content_fields.length > 0) {
    sections.push({
      id: "content",
      title: "Da'vo mazmuni",
      fields: template.content_fields.map(f => ({
        id: f.id, label: f.label_uz, type: f.type === "money" ? "number" : f.type,
        required: f.required || false, maxLength: f.type === "textarea" ? 3000 : 500,
        hint: f.hint, options: f.options, placeholder: f.hint,
      })),
    });
  }

  return { sections };
}

function getGroupTitle(groupId) {
  const titles = {
    court: "Sud ma'lumotlari",
    plaintiff_individual: "Da'vogar (jismoniy shaxs)",
    plaintiff_legal: "Da'vogar (yuridik shaxs)",
    defendant_individual: "Javobgar (jismoniy shaxs)",
    defendant_legal: "Javobgar (yuridik shaxs)",
    representative: "Vakil (agar bor bo'lsa)",
    claim_value_and_duty: "Da'vo bahosi va davlat boji",
    evidence: "Dalillar",
    case_reference: "Ish ma'lumotlari",
    notary_block: "Notarius ma'lumotlari",
    foreign_worker: "Chet ellik fuqaro ma'lumotlari",
  };
  return titles[groupId] || groupId;
}

// Build body schema from template
function buildBodySchema(template) {
  const body = [];

  // Title
  body.push({ type: "text", content: template.name_uz.toUpperCase(), style: "heading" });
  body.push({ type: "spacer" });

  // Court info
  if (template.uses_common_groups?.includes("court")) {
    body.push({ type: "text", content: "{{court_name}}", style: "paragraph" });
    body.push({ type: "text", content: "Ariza berilgan sana: {{filing_date}}", style: "paragraph" });
    body.push({ type: "spacer" });
  }

  // Plaintiff
  body.push({ type: "text", content: "DA'VOGAR:", style: "subheading" });
  if (template.plaintiff_group?.includes("individual")) {
    body.push({ type: "text", content: "F.I.Sh: {{plaintiff_full_name}}", style: "paragraph" });
    body.push({ type: "text", content: "Manzil: {{plaintiff_address}}", style: "paragraph" });
    body.push({ type: "text", content: "Telefon: {{plaintiff_phone}}", style: "paragraph" });
  }
  if (template.plaintiff_group?.includes("legal")) {
    body.push({ type: "text", content: "Tashkilot: {{plaintiff_org_name}}", style: "paragraph" });
    body.push({ type: "text", content: "Manzil: {{plaintiff_org_address}}", style: "paragraph" });
    body.push({ type: "text", content: "STIR: {{plaintiff_org_tin}}", style: "paragraph" });
  }
  body.push({ type: "spacer" });

  // Defendant
  body.push({ type: "text", content: "JAVOBGAR:", style: "subheading" });
  if (template.defendant_group?.includes("individual")) {
    body.push({ type: "text", content: "F.I.Sh: {{defendant_full_name}}", style: "paragraph" });
    body.push({ type: "text", content: "Manzil: {{defendant_address}}", style: "paragraph" });
  }
  if (template.defendant_group?.includes("legal")) {
    body.push({ type: "text", content: "Tashkilot: {{defendant_org_name}}", style: "paragraph" });
    body.push({ type: "text", content: "Manzil: {{defendant_org_address}}", style: "paragraph" });
  }
  body.push({ type: "spacer" });

  // Representative
  if (template.uses_common_groups?.includes("representative")) {
    body.push({ type: "text", content: "VAKIL: {{rep_full_name}}", style: "paragraph" });
    body.push({ type: "text", content: "Ishonchnoma: {{rep_poa_details}}", style: "paragraph" });
    body.push({ type: "spacer" });
  }

  // Content
  body.push({ type: "text", content: "DA'VO ARIZASI", style: "heading" });
  for (const field of template.content_fields || []) {
    body.push({ type: "text", content: `${field.label_uz}:`, style: "paragraph" });
    body.push({ type: "field", fieldId: field.id });
    body.push({ type: "spacer" });
  }

  // Relief items
  if (template.relief_items && template.relief_items.length > 0) {
    body.push({ type: "text", content: "SO'ROV:", style: "heading" });
    for (const item of template.relief_items) {
      body.push({ type: "text", content: item, style: "list_item" });
    }
    body.push({ type: "spacer" });
  }

  // Attachments
  if (template.attachments && template.attachments.length > 0) {
    body.push({ type: "text", content: "ILOVA QILINADIGAN HUJJATLAR:", style: "subheading" });
    for (const att of template.attachments) {
      body.push({ type: "text", content: `• ${att}`, style: "list_item" });
    }
    body.push({ type: "spacer" });
  }

  // Legal basis
  if (template.legal_basis && template.legal_basis.length > 0) {
    body.push({ type: "text", content: "HUQUQIY ASOS:", style: "subheading" });
    for (const basis of template.legal_basis) {
      body.push({ type: "text", content: `• ${basis}`, style: "list_item" });
    }
    body.push({ type: "spacer" });
  }

  // Signature
  body.push({ type: "text", content: "Sana: {{filing_date}}", style: "paragraph" });
  body.push({ type: "text", content: "Imzo: ____________________", style: "paragraph" });

  return body;
}

// Generate the seed code
const output = templates.map(t => {
  const cat = mapCategory(t.category_path || "");
  const fieldsSchema = buildFieldsSchema(t);
  const bodySchema = buildBodySchema(t);
  const fieldCount = fieldsSchema.sections.reduce((acc, s) => acc + s.fields.length, 0);

  return {
    slug: t.id,
    titleUz: t.name_uz,
    titleRu: t.name_uz,
    category: cat.category,
    subcategory: cat.subcategory,
    descriptionUz: t.notes || t.name_uz,
    pages: Math.ceil(fieldCount / 5),
    downloads: Math.floor(Math.random() * 5000) + 100,
    rating: 4.5 + Math.random() * 0.5,
    priceUzs: 0,
    isFree: true,
    isPopular: false,
    isNew: true,
    legalBasisUz: (t.legal_basis || []).join("; "),
    fieldsSchema: JSON.stringify(fieldsSchema),
    bodySchema: JSON.stringify(bodySchema),
    estimatedFillMinutes: Math.ceil(fieldCount / 3),
    fieldCount,
  };
});

console.log(`Generated ${output.length} document templates`);
console.log(`Total fields: ${output.reduce((a, d) => a + d.fieldCount, 0)}`);

// Write as JSON for the startup script to consume
fs.writeFileSync(
  path.join(__dirname, "..", "scripts", "templates-data.json"),
  JSON.stringify(output, null, 2)
);
console.log("Written to scripts/templates-data.json");
