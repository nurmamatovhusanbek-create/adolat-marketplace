"use client";

import { useEffect, useState, useMemo } from "react";
import {
  ArrowRight,
  Clock,
  DownloadSimple,
  FileText,
  MagnifyingGlass,
  SlidersHorizontal,
  Sparkle,
  Star,
  Tag,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { DOCUMENT_CATEGORIES } from "@/lib/marketplace/data";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { formatDownloads, formatPrice } from "@/lib/marketplace/format";
import type { LegalDocument } from "@/lib/marketplace/types";
import { cn } from "@/lib/utils";

interface ApiDoc {
  id: string; slug: string; titleUz: string; category: string; subcategory: string;
  descriptionUz: string; pages: number; downloads: number; rating: number;
  priceUzs: number; isFree: boolean; isPopular: boolean; isNew: boolean;
  legalBasisUz: string | null; lastUpdated: string; tags: string[];
  estimatedFillMinutes: number; fieldsCount: number; formats: string[];
}

export function DocumentListing() {
  const { documentSearch, documentCategory, documentPriceFilter, documentSortBy,
    setDocumentSearch, setDocumentCategory, setDocumentPriceFilter,
    setDocumentSortBy, resetDocumentFilters, setActiveDocument } = useMarketplaceStore();

  const [docs, setDocs] = useState<ApiDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/documents?page=1&pageSize=100");
        if (!res.ok) return;
        const data = await res.json();
        setDocs(data.documents ?? []);

        // Count by category
        const counts: Record<string, number> = {};
        for (const d of data.documents ?? []) {
          counts[d.category] = (counts[d.category] || 0) + 1;
        }
        setCategoryCounts(counts);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  // Client-side filter + sort (since we fetch all)
  const filtered = useMemo(() => {
    let list = [...docs];

    if (documentSearch.trim()) {
      const q = documentSearch.toLowerCase();
      list = list.filter(d =>
        d.titleUz?.toLowerCase().includes(q) ||
        d.descriptionUz?.toLowerCase().includes(q) ||
        d.subcategory?.toLowerCase().includes(q)
      );
    }
    if (documentCategory !== "all") {
      list = list.filter(d => d.category === documentCategory);
    }
    if (documentPriceFilter === "free") list = list.filter(d => d.isFree);
    if (documentPriceFilter === "paid") list = list.filter(d => !d.isFree);

    switch (documentSortBy) {
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "newest": list.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()); break;
      case "popular": default: list.sort((a, b) => b.downloads - a.downloads); break;
    }
    return list;
  }, [docs, documentSearch, documentCategory, documentPriceFilter, documentSortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="flex items-center gap-2 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          <FileText weight="regular" className="h-7 w-7 text-primary" />
          Hujjat namunalari katalogi
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {docs.length}+ huquqiy hujjat namunalari. O'zbekiston qonunchiligiga muvofiq tayyorlangan.
        </p>
      </div>

      {/* Search */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <MagnifyingGlass weight="regular" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input value={documentSearch} onChange={(e) => setDocumentSearch(e.target.value)}
            placeholder="Hujjat nomi yoki kalit so'z bo'yicha qidiring..."
            className="h-12 pl-12 text-base" />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden" size="lg">
              <SlidersHorizontal weight="regular" className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] overflow-y-auto p-0">
            <SheetHeader className="border-b p-4"><SheetTitle>Filtrlar</SheetTitle></SheetHeader>
            <FilterPanel category={documentCategory} priceFilter={documentPriceFilter} sortBy={documentSortBy}
              onCategory={setDocumentCategory} onPriceFilter={setDocumentPriceFilter}
              onSortBy={setDocumentSortBy} onReset={resetDocumentFilters} categoryCounts={categoryCounts} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Category chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button onClick={() => setDocumentCategory("all")}
          className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            documentCategory === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary")}>
          Barchasi ({docs.length})
        </button>
        {DOCUMENT_CATEGORIES.map((cat) => {
          const count = categoryCounts[cat.id] || 0;
          if (count === 0) return null;
          return (
            <button key={cat.id} onClick={() => setDocumentCategory(cat.id)}
              className={cn("flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                documentCategory === cat.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary")}>
              {cat.nameUz}
              <span className="text-[10px] opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Sidebar */}
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-20">
            <Card className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-1.5 text-sm font-bold">
                  <SlidersHorizontal weight="regular" className="h-4 w-4 text-primary" /> Filtrlash
                </h2>
                {(documentCategory !== "all" || documentPriceFilter !== "all" || documentSortBy !== "popular") && (
                  <button onClick={resetDocumentFilters} className="flex items-center gap-1 text-xs text-primary hover:underline">
                    <X weight="regular" className="h-3 w-3" /> Tozalash
                  </button>
                )}
              </div>
              <FilterPanel category={documentCategory} priceFilter={documentPriceFilter} sortBy={documentSortBy}
                onCategory={setDocumentCategory} onPriceFilter={setDocumentPriceFilter}
                onSortBy={setDocumentSortBy} onReset={resetDocumentFilters} categoryCounts={categoryCounts} />
            </Card>
          </div>
        </aside>

        {/* Results */}
        <div className="lg:col-span-9">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Topildi: <strong className="text-foreground">{filtered.length}</strong> hujjat
            </p>
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">Saralash:</Label>
              <Select value={documentSortBy} onValueChange={(v) => setDocumentSortBy(v as typeof documentSortBy)}>
                <SelectTrigger className="h-9 w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Mashhur</SelectItem>
                  <SelectItem value="rating">Reyting</SelectItem>
                  <SelectItem value="newest">Yangilar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[1,2,3,4].map(i => <Card key={i} className="flex h-64 flex-col p-5"><Skeleton className="h-5 w-20 rounded-full" /><Skeleton className="mt-3 h-5 w-3/4" /><Skeleton className="mt-1.5 h-3 w-full" /><Skeleton className="mt-1.5 h-3 w-5/6" /><div className="mt-auto flex items-center justify-between border-t border-border pt-3"><Skeleton className="h-6 w-20" /><Skeleton className="h-9 w-24 rounded-lg" /></div></Card>)}
            </div>
          ) : filtered.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText weight="regular" className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
              <h3 className="font-serif text-base font-bold">Hujjat topilmadi</h3>
              <p className="mt-1 text-sm text-muted-foreground">Filtrlarni o'zgartirib qayta urinib ko'ring.</p>
              <Button onClick={resetDocumentFilters} variant="outline" className="mt-4">Filtrlarni tozalash</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filtered.map((doc, idx) => {
                const cat = DOCUMENT_CATEGORIES.find(c => c.id === doc.category);
                return (
                  <Card key={doc.id} onClick={() => setActiveDocument(doc as unknown as LegalDocument)}
                    className="group relative flex cursor-pointer flex-col p-5 hover:-translate-y-1 hover:shadow-beautiful-lg hover:border-accent/30">
                    {idx < 3 && (
                      <div className="absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-foreground font-serif text-xs font-bold text-background shadow-hard-sm">
                        {idx + 1}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-[11px]">{cat?.nameUz ?? doc.category}</Badge>
                      <div className="flex gap-1.5">
                        {doc.isFree && <Badge className="bg-emerald-600 text-white text-[11px] hover:bg-emerald-600"><Sparkle weight="fill" className="mr-0.5 h-2.5 w-2.5" />Bepul</Badge>}
                        {doc.isNew && <Badge className="bg-accent text-accent-foreground text-[11px]">Yangi</Badge>}
                      </div>
                    </div>
                    <h3 className="mt-3 line-clamp-2 font-serif text-base font-bold leading-snug text-foreground group-hover:text-primary">{doc.titleUz}</h3>
                    <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{doc.descriptionUz}</p>
                    <div className="mt-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      <span className="flex items-center gap-1"><FileText weight="regular" className="h-3 w-3" />{doc.pages}b</span>
                      <span className="flex items-center gap-1"><Clock weight="regular" className="h-3 w-3" />{doc.estimatedFillMinutes}d</span>
                      <span className="flex items-center gap-1"><DownloadSimple weight="regular" className="h-3 w-3" />{formatDownloads(doc.downloads)}</span>
                      <span className="ml-auto flex items-center gap-1"><Star weight="fill" className="h-3 w-3 fill-accent text-accent" /><span className="font-bold text-foreground">{doc.rating}</span></span>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="rounded border border-border bg-secondary/40 px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase">PDF</span>
                      <span className="rounded border border-border bg-secondary/40 px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase">DOCX</span>
                      <span className="ml-auto text-[11px] text-muted-foreground">{doc.fieldsCount} maydon</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      {doc.isFree ? (
                        <div className="flex items-center gap-1.5 font-serif text-base font-bold text-emerald-700"><Sparkle weight="fill" className="h-4 w-4" />Bepul</div>
                      ) : (
                        <div className="flex items-center gap-1.5 font-serif text-base font-bold text-foreground"><Tag weight="regular" className="h-4 w-4 text-accent" />{formatPrice(doc.priceUzs)}</div>
                      )}
                      <Button size="sm" variant="outline" className="gap-1 transition-colors group-hover:bg-foreground group-hover:text-background">
                        Ko'rish <ArrowRight weight="bold" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Button>
                    </div>
                    {doc.legalBasisUz && (
                      <div className="mt-3 flex items-start gap-1 border-t border-dashed border-border pt-2 text-[10px] text-muted-foreground">
                        <FileText weight="regular" className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                        <span className="line-clamp-1">{doc.legalBasisUz}</span>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterPanel({ category, priceFilter, sortBy, onCategory, onPriceFilter, onSortBy, onReset, categoryCounts }: {
  category: string; priceFilter: string; sortBy: string;
  onCategory: (c: string) => void; onPriceFilter: (f: string) => void; onSortBy: (s: string) => void;
  onReset: () => void; categoryCounts: Record<string, number>;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kategoriya</Label>
        <Select value={category} onValueChange={onCategory}>
          <SelectTrigger className="h-9 w-full"><SelectValue /></SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="all">Barchasi</SelectItem>
            {DOCUMENT_CATEGORIES.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.nameUz} ({categoryCounts[c.id] || 0})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Narx</Label>
        <ToggleGroup type="single" value={priceFilter} onValueChange={(v) => onPriceFilter(v || "all")} className="flex w-full justify-stretch">
          <ToggleGroupItem value="all" className="flex-1 text-xs">Hammasi</ToggleGroupItem>
          <ToggleGroupItem value="free" className="flex-1 text-xs">Bepul</ToggleGroupItem>
          <ToggleGroupItem value="paid" className="flex-1 text-xs">Pullik</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div>
        <Label className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Saralash</Label>
        <Select value={sortBy} onValueChange={onSortBy}>
          <SelectTrigger className="h-9 w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Mashhur</SelectItem>
            <SelectItem value="rating">Reyting</SelectItem>
            <SelectItem value="newest">Yangilar</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="outline" size="sm" onClick={onReset} className="w-full">Filtrlarni tozalash</Button>
    </div>
  );
}
