"use client";

import { useMemo } from "react";
import {
  Star,
  Download,
  Clock,
  FileText,
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  Tag,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LEGAL_DOCUMENTS, DOCUMENT_CATEGORIES } from "@/lib/marketplace/data";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { formatDownloads, formatPrice } from "@/lib/marketplace/format";
import type { DocumentCategory, LegalDocument } from "@/lib/marketplace/types";
import { DynamicIcon } from "./dynamic-icon";
import { cn } from "@/lib/utils";

export function DocumentListing() {
  const store = useMarketplaceStore();
  const {
    documentSearch,
    documentCategory,
    documentPriceFilter,
    documentSortBy,
    setDocumentSearch,
    setDocumentCategory,
    setDocumentPriceFilter,
    setDocumentSortBy,
    resetDocumentFilters,
    setActiveDocument,
  } = store;

  const filtered = useMemo(() => {
    let list = [...LEGAL_DOCUMENTS];

    if (documentSearch.trim()) {
      const q = documentSearch.toLowerCase();
      list = list.filter(
        (d) =>
          d.titleUz.toLowerCase().includes(q) ||
          d.titleRu.toLowerCase().includes(q) ||
          d.descriptionUz.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (documentCategory !== "all") {
      list = list.filter((d) => d.category === documentCategory);
    }

    if (documentPriceFilter === "free") list = list.filter((d) => d.isFree);
    if (documentPriceFilter === "paid") list = list.filter((d) => !d.isFree);

    switch (documentSortBy) {
      case "popular":
        list.sort((a, b) => b.downloads - a.downloads);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
        break;
    }

    return list;
  }, [documentSearch, documentCategory, documentPriceFilter, documentSortBy]);

  const activeFiltersCount =
    (documentCategory !== "all" ? 1 : 0) +
    (documentPriceFilter !== "all" ? 1 : 0) +
    (documentSortBy !== "popular" ? 1 : 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          <FileText className="h-7 w-7 text-accent" />
          Hujjat namunalari katalogi
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {LEGAL_DOCUMENTS.length}+ huquqiy hujjat namunalari. O'zbekiston qonunchiligiga
          muvofiq tayyorlangan, advokat ishtirokisiz to'ldirishingiz mumkin.
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={documentSearch}
            onChange={(e) => setDocumentSearch(e.target.value)}
            placeholder="Hujjat nomi yoki kalit so'z bo'yicha qidiring..."
            className="h-12 pl-12 text-base"
          />
        </div>

        {/* Mobile filter trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden" size="lg">
              <SlidersHorizontal className="h-5 w-5" />
              {activeFiltersCount > 0 && (
                <Badge className="ml-1 h-5 min-w-5 justify-center bg-foreground text-background text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] overflow-y-auto p-0">
            <SheetHeader className="border-b p-4">
              <SheetTitle>Filtrlar</SheetTitle>
            </SheetHeader>
            <FilterPanel
              category={documentCategory}
              priceFilter={documentPriceFilter}
              sortBy={documentSortBy}
              onCategory={setDocumentCategory}
              onPriceFilter={setDocumentPriceFilter}
              onSortBy={setDocumentSortBy}
              onReset={resetDocumentFilters}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Category quick chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setDocumentCategory("all")}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            documentCategory === "all"
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-accent"
          )}
        >
          Barchasi
        </button>
        {DOCUMENT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setDocumentCategory(cat.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              documentCategory === cat.id
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-accent"
            )}
          >
            <DynamicIcon name={cat.icon} className="h-3.5 w-3.5" />
            {cat.nameUz}
            <span className="ml-1 text-[10px] opacity-70">{cat.count}</span>
          </button>
        ))}
      </div>

      {/* Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Sidebar - desktop */}
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-20">
            <Card className="border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-1.5 text-sm font-bold">
                  <SlidersHorizontal className="h-4 w-4 text-accent" />
                  Filtrlash
                </h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetDocumentFilters}
                    className="flex items-center gap-1 text-xs text-accent hover:underline"
                  >
                    <X className="h-3 w-3" />
                    Tozalash
                  </button>
                )}
              </div>
              <FilterPanel
                category={documentCategory}
                priceFilter={documentPriceFilter}
                sortBy={documentSortBy}
                onCategory={setDocumentCategory}
                onPriceFilter={setDocumentPriceFilter}
                onSortBy={setDocumentSortBy}
                onReset={resetDocumentFilters}
              />
            </Card>
          </div>
        </aside>

        {/* Results */}
        <div className="lg:col-span-9">
          {/* Sort bar */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Topildi: <strong className="text-foreground">{filtered.length}</strong> hujjat
            </p>
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">Saralash:</Label>
              <Select value={documentSortBy} onValueChange={(v) => setDocumentSortBy(v as typeof documentSortBy)}>
                <SelectTrigger className="h-9 w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Mashhur</SelectItem>
                  <SelectItem value="rating">Reyting</SelectItem>
                  <SelectItem value="newest">Yangilar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <Card className="border-border p-12 text-center">
              <FileText className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
              <h3 className="text-base font-bold text-foreground">Hujjat topilmadi</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Filtrlarni o'zgartirib qayta urinib ko'ring.
              </p>
              <Button onClick={resetDocumentFilters} variant="outline" className="mt-4">
                Filtrlarni tozalash
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filtered.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} onSelect={() => setActiveDocument(doc)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DocumentCard({ doc, onSelect }: { doc: LegalDocument; onSelect: () => void }) {
  const cat = DOCUMENT_CATEGORIES.find((c) => c.id === doc.category);
  return (
    <Card
      onClick={onSelect}
      className="group flex cursor-pointer flex-col border-border p-5 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            "bg-secondary text-accent"
          )}
        >
          <DynamicIcon name={cat?.icon ?? "FileText"} className="h-5 w-5" />
        </div>
        <div className="flex gap-1.5">
          {doc.isFree && (
            <Badge className="bg-emerald-600 text-white text-[11px] hover:bg-emerald-600">Bepul</Badge>
          )}
          {doc.isNew && (
            <Badge className="bg-accent text-accent-foreground text-[11px]">Yangi</Badge>
          )}
          {doc.isPopular && (
            <Badge variant="secondary" className="text-[11px]">
              Mashhur
            </Badge>
          )}
        </div>
      </div>

      <h3 className="mt-3 line-clamp-2 text-sm font-bold leading-snug text-foreground group-hover:text-accent">
        {doc.titleUz}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{doc.descriptionUz}</p>

      <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          {doc.pages} bet
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {doc.estimatedFillMinutes} daq.
        </span>
        <span className="flex items-center gap-1">
          <Download className="h-3 w-3" />
          {formatDownloads(doc.downloads)}
        </span>
        <span className="ml-auto flex items-center gap-1">
          <Star className="h-3 w-3 fill-accent text-accent" />
          <strong className="text-foreground">{doc.rating}</strong>
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        {doc.isFree ? (
          <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-700">
            <Sparkles className="h-4 w-4" />
            Bepul
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
            <Tag className="h-4 w-4 text-accent" />
            {formatPrice(doc.priceUzs)}
          </div>
        )}
        <Button size="sm" variant="outline" className="gap-1 group-hover:bg-foreground group-hover:text-accent-foreground">
          Ko'rish
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </Card>
  );
}

function FilterPanel({
  category,
  priceFilter,
  sortBy,
  onCategory,
  onPriceFilter,
  onSortBy,
  onReset,
}: {
  category: DocumentCategory | "all";
  priceFilter: "all" | "free" | "paid";
  sortBy: "popular" | "rating" | "newest";
  onCategory: (c: DocumentCategory | "all") => void;
  onPriceFilter: (f: "all" | "free" | "paid") => void;
  onSortBy: (s: "popular" | "rating" | "newest") => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-5">
      {/* Category */}
      <div>
        <Label className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Kategoriya
        </Label>
        <Select value={category} onValueChange={(v) => onCategory(v as DocumentCategory | "all")}>
          <SelectTrigger className="h-9 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="all">Barchasi</SelectItem>
            {DOCUMENT_CATEGORIES.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.nameUz} ({c.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price */}
      <div>
        <Label className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Narx
        </Label>
        <ToggleGroup
          type="single"
          value={priceFilter}
          onValueChange={(v) => onPriceFilter((v as typeof priceFilter) || "all")}
          className="flex w-full justify-stretch"
        >
          <ToggleGroupItem value="all" className="flex-1 text-xs">
            Hammasi
          </ToggleGroupItem>
          <ToggleGroupItem value="free" className="flex-1 text-xs">
            Bepul
          </ToggleGroupItem>
          <ToggleGroupItem value="paid" className="flex-1 text-xs">
            Pullik
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Sort */}
      <div>
        <Label className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Saralash
        </Label>
        <Select value={sortBy} onValueChange={(v) => onSortBy(v as typeof sortBy)}>
          <SelectTrigger className="h-9 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Mashhur</SelectItem>
            <SelectItem value="rating">Reyting</SelectItem>
            <SelectItem value="newest">Yangilar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" size="sm" onClick={onReset} className="w-full">
        Filtrlarni tozalash
      </Button>
    </div>
  );
}
