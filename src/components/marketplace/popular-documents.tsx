"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Container, Section, Grid } from "@/components/primitives/layout";
import { Button } from "@/components/primitives/button";
import { DocumentCard, type DocumentCardData } from "@/components/cards/document-card";
import { SectionHeader } from "./section-header";
import { DOCUMENT_CATEGORIES } from "@/lib/marketplace/data";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

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

function toCardData(doc: ApiDoc): DocumentCardData {
  const cat = DOCUMENT_CATEGORIES.find((c) => c.id === doc.category);
  return {
    id: doc.id,
    slug: doc.slug,
    titleUz: doc.titleUz,
    category: doc.category,
    categoryNameUz: cat?.nameUz,
    descriptionUz: doc.descriptionUz,
    pages: doc.pages,
    downloads: doc.downloads,
    rating: doc.rating,
    priceUzs: doc.priceUzs,
    isFree: doc.isFree,
    isNew: doc.isNew,
    legalBasisUz: doc.legalBasisUz,
    estimatedFillMinutes: doc.estimatedFillMinutes,
    fieldsCount: doc.fieldsCount,
    formats: doc.formats,
  };
}

/** Skeleton card — shaped like DocumentCard, using .skeleton-shimmer (§5). */
function DocumentCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div className="skeleton-shimmer h-5 w-20" />
        <div className="skeleton-shimmer h-4 w-12" />
      </div>
      <div className="skeleton-shimmer mt-3 h-5 w-3/4" />
      <div className="skeleton-shimmer mt-2 h-3 w-full" />
      <div className="skeleton-shimmer mt-2 h-3 w-2/3" />
      <div className="mt-4 flex items-center gap-3">
        <div className="skeleton-shimmer h-3 w-8" />
        <div className="skeleton-shimmer h-3 w-8" />
        <div className="skeleton-shimmer h-3 w-8" />
      </div>
      <div className="skeleton-shimmer mt-4 h-10 w-full" />
    </div>
  );
}

export function PopularDocuments() {
  const { setView, setActiveDocument } = useMarketplaceStore();
  const [docs, setDocs] = useState<ApiDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView<HTMLDivElement>();

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
    <Section spacing="lg" variant="default">
      <Container size="xl">
        <SectionHeader
          eyebrow="Eng ko'p yuklanganlar"
          title="Mashhur hujjat namunalari"
          description="Foydalanuvchilarimiz eng ko'p yuklab olgan tayyor hujjatlar. Hammasi O'zbekiston qonunchiligiga muvofiq tayyorlangan."
          action={
            <Button variant="outline" onClick={() => setView("documents")} className="gap-1.5">
              Barcha hujjatlar
              <ArrowRight weight="regular" className="h-3.5 w-3.5" />
            </Button>
          }
        />

        <div
          ref={ref}
          className={cn("mt-10 reveal-stagger", inView && "in-view")}
        >
          {loading ? (
            <Grid cols={{ base: 1, sm: 2, lg: 3 }} gap="md">
              {Array.from({ length: 6 }).map((_, i) => (
                <DocumentCardSkeleton key={i} />
              ))}
            </Grid>
          ) : docs.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <p className="text-sm text-muted-foreground">
                Hozircha mashhur hujjatlar mavjud emas. Keyinroq urinib ko'ring.
              </p>
            </div>
          ) : (
            <Grid cols={{ base: 1, sm: 2, lg: 3 }} gap="md">
              {docs.map((doc, idx) => (
                <DocumentCard
                  key={doc.id}
                  document={toCardData(doc)}
                  rank={idx}
                  onSelect={(d) => setActiveDocument(d as never)}
                />
              ))}
            </Grid>
          )}
        </div>
      </Container>
    </Section>
  );
}
