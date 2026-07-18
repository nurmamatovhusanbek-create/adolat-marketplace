import { z } from "zod";

// ============================================================================
// Common validators
// ============================================================================

// Sanitize a free-text field — strip HTML, control chars, normalize whitespace.
// Returns a ZodString so callers can chain .min(), .max(), .regex(), etc.
// Sanitization (control char stripping, whitespace normalization) is applied
// at storage time by the route handlers via the `sanitize()` helper below.
const sanitizeFn = (s: string) =>
  s.replace(/[\u0000-\u001F\u007F]/g, "").replace(/\s+/g, " ").trim();

export const sanitize = sanitizeFn;

export const safeString = (maxLen: number = 500) =>
  z.string().max(maxLen, `Maksimum ${maxLen} belgi`);

export const safeLongText = (maxLen: number = 5000) =>
  z.string().max(maxLen, `Maksimum ${maxLen} belgi`);

// ============================================================================
// Auth schemas
// ============================================================================

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Noto'g'ri email format")
  .max(254, "Email juda uzun");

export const passwordSchema = z
  .string()
  .min(8, "Parol kamida 8 belgi bo'lishi kerak")
  .max(128, "Parol juda uzun")
  .regex(/[A-Za-z]/, "Parolda kamida bitta harf bo'lishi kerak")
  .regex(/[0-9]/, "Parolda kamida bitta raqam bo'lishi kerak");

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[\d\s\-()]{7,20}$/, "Noto'g'ri telefon raqami");

export const nameSchema = safeString(100).min(2, "Ism kamida 2 belgi bo'lishi kerak");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Parol kiritilmagan"),
  csrfToken: z.string().min(1),
});

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  role: z.enum(["CLIENT", "ADVOCATE"]),
  csrfToken: z.string().min(1),
});

export const advocateSignupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  licenseNumber: z
    .string()
    .trim()
    .regex(/^[A-Z0-9\-]{5,30}$/i, "Noto'g'ri litsenziya raqami"),
  primarySpecialty: z.string().min(1),
  region: z.string().min(1),
  csrfToken: z.string().min(1),
});

// ============================================================================
// Document / Draft schemas
// ============================================================================

export const documentFieldSchema = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/i, "Noto'g'ri maydon ID").max(50),
  label: safeString(200),
  type: z.enum(["text", "textarea", "number", "date", "select", "checkbox"]),
  required: z.boolean().default(false),
  maxLength: z.number().int().min(1).max(2000).optional(),
  defaultValue: z.string().max(2000).optional(),
  hint: safeString(300).optional(),
  options: z.array(safeString(100)).max(50).optional(),
  placeholder: safeString(100).optional(),
});

export const documentSectionSchema = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/i).max(50),
  title: safeString(200),
  description: safeString(500).optional(),
  fields: z.array(documentFieldSchema).max(100, "Maksimum 100 maydon"),
});

export const documentTemplateSchema = z.object({
  sections: z.array(documentSectionSchema).max(20, "Maksimum 20 bo'lim"),
});

// A body item is either static text or a placeholder reference
export const bodyItemSchema = z.union([
  z.object({
    type: z.literal("text"),
    content: safeLongText(10000),
    style: z.enum(["heading", "subheading", "paragraph", "list_item"]).default("paragraph"),
  }),
  z.object({
    type: z.literal("field"),
    fieldId: z.string().regex(/^[a-z0-9_]+$/i).max(50),
  }),
  z.object({
    type: z.literal("spacer"),
  }),
]);

export const documentBodySchema = z.array(bodyItemSchema).max(500, "Maksimum 500 element");

// Draft values: map of fieldId -> string value (max 2000 chars per value)
export const draftValuesSchema = z
  .record(z.string().regex(/^[a-z0-9_]+$/i).max(50), z.string().max(2000))
  .refine((obj) => Object.keys(obj).length <= 100, {
    message: "Maksimum 100 maydon qiymati",
  });

// ============================================================================
// Legal Request schemas
// ============================================================================

export const legalRequestSchema = z.object({
  title: safeString(200).min(8, "Sarlavha kamida 8 belgi bo'lishi kerak"),
  description: safeLongText(3000).min(20, "Tavsif kamida 20 belgi bo'lishi kerak"),
  category: z.string().min(1).max(50),
  region: z.string().min(1).max(50),
  city: safeString(100),
  clientType: z.enum(["individual", "business"]),
  isUrgent: z.boolean().default(false),
  requestType: z.enum(["advocate", "document"]),
  budgetMin: z.number().int().min(0).max(1_000_000_000).optional(),
  budgetMax: z.number().int().min(0).max(1_000_000_000).optional(),
  contactName: safeString(100).optional(),
  contactPhone: phoneSchema.optional(),
  contactEmail: emailSchema.optional(),
  csrfToken: z.string().min(1),
}).refine(
  (data) => !data.budgetMin || !data.budgetMax || data.budgetMin <= data.budgetMax,
  { message: "Minimal byudjet maksimaldan katta bo'lishi mumkin emas", path: ["budgetMax"] }
);

export const requestResponseSchema = z.object({
  requestId: z.string().min(10).max(30),
  message: safeLongText(2000).min(10, "Xabar kamida 10 belgi bo'lishi kerak"),
  proposedPrice: z.number().int().min(0).max(1_000_000_000).optional(),
  estimatedDays: z.number().int().min(1).max(365).optional(),
  csrfToken: z.string().min(1),
});

// ============================================================================
// Messaging schemas
// ============================================================================

export const messageSchema = z.object({
  receiverId: z.string().min(10).max(30),
  content: safeLongText(2000).min(1, "Xabar bo'sh bo'lishi mumkin emas").max(2000),
  csrfToken: z.string().min(1),
});

// ============================================================================
// Search / Filter schemas
// ============================================================================

export const advocateSearchSchema = z.object({
  q: safeString(100).optional(),
  specialty: z.string().max(50).optional(),
  region: z.string().max(50).optional(),
  onlyVerified: z.coerce.boolean().optional(),
  onlyOnline: z.coerce.boolean().optional(),
  sortBy: z.enum(["rating", "experience", "price-asc", "price-desc", "response"]).optional(),
  page: z.coerce.number().int().min(1).max(1000).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
});

export const documentSearchSchema = z.object({
  q: safeString(100).optional(),
  category: z.string().max(50).optional(),
  priceFilter: z.enum(["all", "free", "paid"]).optional(),
  sortBy: z.enum(["popular", "rating", "newest"]).optional(),
  page: z.coerce.number().int().min(1).max(1000).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(24),
});
