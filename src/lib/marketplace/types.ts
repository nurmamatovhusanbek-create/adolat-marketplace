// Type definitions for the legal marketplace

export type Specialty =
  | "family"
  | "criminal"
  | "civil"
  | "corporate"
  | "tax"
  | "labor"
  | "real-estate"
  | "intellectual"
  | "administrative"
  | "international";

export type Region =
  | "tashkent-city"
  | "tashkent-region"
  | "samarkand"
  | "bukhara"
  | "andijan"
  | "fergana"
  | "namangan"
  | "kashkadarya"
  | "surkhandarya"
  | "navoi"
  | "jizzakh"
  | "sirdarya"
  | "khorezm"
  | "karakalpakstan";

export type Language = "uz" | "ru" | "en";

export type Currency = "UZS" | "USD";

export interface Advocate {
  id: string;
  userId?: string; // user.id from API (for chat)
  slug: string;
  name: string;
  photo: string;
  titleUz: string;
  titleRu: string;
  specialty: Specialty;
  secondarySpecialties: Specialty[];
  region: Region;
  city: string;
  experienceYears: number;
  licenseNumber: string;
  rating: number;
  reviewsCount: number;
  casesResolved: number;
  responseTimeHours: number;
  consultationFee: { amount: number; currency: Currency };
  hourlyFee: { amount: number; currency: Currency };
  languages: Language[];
  verified: boolean;
  topRated: boolean;
  online: boolean;
  bioUz: string;
  bioRu: string;
  education: { degree: string; institution: string; year: number }[];
  expertise: string[];
  successRate: number;
  availability: "available" | "busy" | "away";
  tags: string[];
}

export type DocumentCategory =
  | "contracts"
  | "applications"
  | "personal"
  | "notarial"
  | "court"
  | "corporate";

export interface DocumentCategoryMeta {
  id: DocumentCategory;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  descriptionUz: string;
  icon: string;
  color: string;
  count: number;
  subcategories: string[];
}

export interface LegalDocument {
  id: string;
  slug: string;
  titleUz: string;
  titleRu: string;
  category: DocumentCategory;
  subcategory: string;
  descriptionUz: string;
  descriptionRu: string;
  pages: number;
  downloads: number;
  rating: number;
  priceUzs: number;
  isFree: boolean;
  isPopular: boolean;
  isNew: boolean;
  formats: ("pdf" | "docx" | "online")[];
  fieldsCount: number;
  estimatedFillMinutes: number;
  legalBasisUz: string;
  lastUpdated: string;
  tags: string[];
}

export type RequestStatus = "open" | "responding" | "closed";

export interface LegalRequest {
  id: string;
  titleUz: string;
  descriptionUz: string;
  category: DocumentCategory | Specialty;
  budgetUzs: { min: number; max: number } | null;
  city: string;
  region: Region;
  postedAgo: string;
  responsesCount: number;
  viewsCount: number;
  status: RequestStatus;
  clientType: "individual" | "business";
  isUrgent: boolean;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorRoleUz: string;
  organization: string;
  quoteUz: string;
  rating: number;
}

export type ViewType =
  | "home"
  | "advocates"
  | "documents"
  | "requests"
  | "post-request"
  | "how-it-works"
  | "for-advocates"
  | "advocate-dashboard"
  | "admin-panel";
