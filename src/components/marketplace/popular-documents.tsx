"use client";

import { useEffect, useState } from "react";
import { Download, Star, Clock, FileText, ArrowRight, Sparkles, Tag, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./category-grid";
import { DOCUMENT_CATEGORIES } from "@/lib/marketplace/data";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import type { LegalDocument } from "@/lib/marketplace/types";
import { formatDownloads, formatPrice } from "@/lib/marketplace/format";

interface ApiDoc {
  id: string;
  slug: string;
  titleUz: string;
  category: string;
  subcategory: string;
  descriptionUz: string;
  pages: number;
  downloads: number;
  rating: number;
  priceUzs: number;
  isFree: boolean;
  isPopular: boolean;
  isNew: boolean;
  legalBasisUz: string | null;
  lastUpdated: string;
  tags: string[];
  estimatedFillMinutes: number;
  fieldsCount: number;
  formats: string[];
}

export function PopularDocuments() {
  const { setView, setActiveDocument } = useMarketplaceStore();
  const [docs, setDocs] = useState<ApiDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/documents?page=1&pageSize=6&sortBy=popular");
        if (!res.ok) return;
        const data = await res.json();
        setDocs(data.documents ?? []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Eng ko'p yuklanganlar"
        title="Mashhur hujjat namunalari"
        description="Foydalanuvchilarimiz eng ko'p yuklab olgan tayyor hujjatlar. Hammasi O'zbekiston qonunchiligiga muvofiq tayyorlangan."
        action={
          <Button variant="outline" onClick={() => setView("documents")} className="gap-1.5">
            Barcha hujjatlar
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        }
      />

      {loading ? (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-64 animate-pulse border-border bg-secondary/40" />
          ))}
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc, idx) => {
            const cat = DOCUMENT_CATEGORIES.find((c) => c.id === doc.category);
            return (
              <Card
                key={doc.id}
                onClick={() => setActiveDocument(doc as LegalDocument)}
                className="group relative flex cursor-pointer flex-col border-border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-hard"
              >
                {/* Editorial rank badge for top 3 */}
                {idx < 3 && (
                  <div className="absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-foreground font-serif text-xs font-bold text-background shadow-hard-sm">
                    {idx + 1}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-[11px]">
                    {cat?.nameUz}
                  </Badge>
                  <div className="flex gap-1.5">
                    {doc.isFree && (
                      <Badge className="bg-trust-verified/15 text-trust-verified hover:bg-trust-verified/15">
                        <Sparkles className="mr-0.5 h-2.5 w-2.5" />
                        Bepul
                      </Badge>
                    )}
                    {doc.isNew && (
                      <Badge className="bg-accent/15 text-accent hover:bg-accent/15">Yangi</Badge>
                    )}
                  </div>
                </div>

                <h3 className="mt-3 line-clamp-2 font-serif text-base font-bold leading-snug text-foreground group-hover:text-accent">
                  {doc.titleUz}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{doc.descriptionUz}</p>

                {/* Meta row — editorial mono-style */}
                <div className="mt-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {doc.pages}b
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {doc.estimatedFillMinutes}d
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {formatDownloads(doc.downloads)}
                  </span>
                  <span className="ml-auto flex items-center gap-1">
                    <Star className="h-3 w-3 fill-trust-premium text-trust-premium" />
                    <span className="font-bold text-foreground">{doc.rating}</span>
                  </span>
                </div>

                {/* Formats */}
                <div className="mt-3 flex items-center gap-1.5">
                  {doc.formats.map((f) => (
                    <span
                      key={f}
                      className="rounded border border-border bg-secondary/40 px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase text-muted-foreground"
                    >
                      {f}
                    </span>
                  ))}
                  <span className="ml-auto text-[10px] font-mono text-muted-foreground">
                    {doc.fieldsCount} maydon
                  </span>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <div>
                    {doc.isFree ? (
                      <div className="flex items-center gap-1.5 font-serif text-base font-bold text-trust-verified">
                        <Sparkles className="h-4 w-4" />
                        Bepul
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 font-serif text-base font-bold text-foreground">
                        <Tag className="h-4 w-4 text-accent" />
                        {formatPrice(doc.priceUzs)}
                      </div>
                    )}
                  </div>
                  <Button size="sm" variant="outline" className="gap-1 transition-colors group-hover:bg-foreground group-hover:text-background">
                    Ko'rish
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </div>

                {/* Legal basis footer — Trust & Authority pattern */}
                {doc.legalBasisUz && (
                  <div className="mt-3 flex items-start gap-1 border-t border-dashed border-border pt-2 text-[10px] text-muted-foreground">
                    <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-trust-verified" />
                    <span className="line-clamp-1">{doc.legalBasisUz}</span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
