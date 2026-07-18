import { create } from "zustand";
import type {
  ViewType,
  Specialty,
  Region,
  DocumentCategory,
  Advocate,
  LegalDocument,
} from "./types";

interface MarketplaceState {
  // Navigation
  currentView: ViewType;
  setView: (view: ViewType) => void;

  // Active advocate (for detail modal)
  activeAdvocate: Advocate | null;
  setActiveAdvocate: (a: Advocate | null) => void;

  // Active document (for detail modal)
  activeDocument: LegalDocument | null;
  setActiveDocument: (d: LegalDocument | null) => void;

  // Active document for editor (full-screen constructor)
  editorDocumentSlug: string | null;
  setEditorDocumentSlug: (s: string | null) => void;
  editorDraftId: string | null;
  setEditorDraftId: (id: string | null) => void;

  // Post-request modal
  isPostRequestOpen: boolean;
  setPostRequestOpen: (open: boolean) => void;

  // Auth modal
  isAuthOpen: boolean;
  authMode: "signin" | "signup";
  setAuthOpen: (open: boolean, mode?: "signin" | "signup") => void;

  // Dashboard overlay
  isDashboardOpen: boolean;
  setDashboardOpen: (open: boolean) => void;

  // Advocate filters (hh.uz-style)
  advocateSearch: string;
  advocateSpecialty: Specialty | "all";
  advocateRegion: Region | "all";
  advocateSortBy: "rating" | "experience" | "price-asc" | "price-desc" | "response";
  advocateOnlyVerified: boolean;
  advocateOnlyOnline: boolean;
  setAdvocateSearch: (s: string) => void;
  setAdvocateSpecialty: (s: Specialty | "all") => void;
  setAdvocateRegion: (r: Region | "all") => void;
  setAdvocateSortBy: (s: MarketplaceState["advocateSortBy"]) => void;
  setAdvocateOnlyVerified: (v: boolean) => void;
  setAdvocateOnlyOnline: (v: boolean) => void;
  resetAdvocateFilters: () => void;

  // Document filters
  documentSearch: string;
  documentCategory: DocumentCategory | "all";
  documentPriceFilter: "all" | "free" | "paid";
  documentSortBy: "popular" | "rating" | "newest";
  setDocumentSearch: (s: string) => void;
  setDocumentCategory: (c: DocumentCategory | "all") => void;
  setDocumentPriceFilter: (f: MarketplaceState["documentPriceFilter"]) => void;
  setDocumentSortBy: (s: MarketplaceState["documentSortBy"]) => void;
  resetDocumentFilters: () => void;
}

export const useMarketplaceStore = create<MarketplaceState>((set) => ({
  currentView: "home",
  setView: (view) => set({ currentView: view }),

  activeAdvocate: null,
  setActiveAdvocate: (a) => set({ activeAdvocate: a }),

  activeDocument: null,
  setActiveDocument: (d) => set({ activeDocument: d }),

  isPostRequestOpen: false,
  setPostRequestOpen: (open) => set({ isPostRequestOpen: open }),

  isAuthOpen: false,
  authMode: "signin",
  setAuthOpen: (open, mode) => set({ isAuthOpen: open, authMode: mode ?? "signin" }),

  isDashboardOpen: false,
  setDashboardOpen: (open) => set({ isDashboardOpen: open }),

  editorDocumentSlug: null,
  setEditorDocumentSlug: (s) => set({ editorDocumentSlug: s }),
  editorDraftId: null,
  setEditorDraftId: (id) => set({ editorDraftId: id }),

  advocateSearch: "",
  advocateSpecialty: "all",
  advocateRegion: "all",
  advocateSortBy: "rating",
  advocateOnlyVerified: false,
  advocateOnlyOnline: false,
  setAdvocateSearch: (s) => set({ advocateSearch: s }),
  setAdvocateSpecialty: (s) => set({ advocateSpecialty: s }),
  setAdvocateRegion: (r) => set({ advocateRegion: r }),
  setAdvocateSortBy: (s) => set({ advocateSortBy: s }),
  setAdvocateOnlyVerified: (v) => set({ advocateOnlyVerified: v }),
  setAdvocateOnlyOnline: (v) => set({ advocateOnlyOnline: v }),
  resetAdvocateFilters: () =>
    set({
      advocateSearch: "",
      advocateSpecialty: "all",
      advocateRegion: "all",
      advocateSortBy: "rating",
      advocateOnlyVerified: false,
      advocateOnlyOnline: false,
    }),

  documentSearch: "",
  documentCategory: "all",
  documentPriceFilter: "all",
  documentSortBy: "popular",
  setDocumentSearch: (s) => set({ documentSearch: s }),
  setDocumentCategory: (c) => set({ documentCategory: c }),
  setDocumentPriceFilter: (f) => set({ documentPriceFilter: f }),
  setDocumentSortBy: (s) => set({ documentSortBy: s }),
  resetDocumentFilters: () =>
    set({
      documentSearch: "",
      documentCategory: "all",
      documentPriceFilter: "all",
      documentSortBy: "popular",
    }),
}));
