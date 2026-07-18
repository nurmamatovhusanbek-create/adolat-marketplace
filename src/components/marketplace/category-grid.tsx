"use client";

import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DynamicIcon } from "./dynamic-icon";
import { DOCUMENT_CATEGORIES } from "@/lib/marketplace/data";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { useInView } from "@/hooks/use-in-view";
import type { DocumentCategory } from "@/lib/marketplace/types";
import { cn } from "@/lib/utils";

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; hoverBg: string }> = {
  emerald: {
    bg: "bg-success/10",
    text: "text-success",
    border: "border-success/20",
    hoverBg: "group-hover:bg-success/15",
  },
  amber: {
    bg: "bg-warning/10",
    text: "text-warning",
    border: "border-warning/25",
    hoverBg: "group-hover:bg-warning/20",
  },
  rose: {
    bg: "bg-accent/10",
    text: "text-accent",
    border: "border-accent/20",
    hoverBg: "group-hover:bg-accent/15",
  },
  violet: {
    bg: "bg-info/10",
    text: "text-info",
    border: "border-info/20",
    hoverBg: "group-hover:bg-info/15",
  },
  sky: {
    bg: "bg-info/10",
    text: "text-info",
    border: "border-info/20",
    hoverBg: "group-hover:bg-info/15",
  },
  teal: {
    bg: "bg-success/10",
    text: "text-success",
    border: "border-success/20",
    hoverBg: "group-hover:bg-success/15",
  },
};

export function CategoryGrid() {
  const { setView, setDocumentCategory } = useMarketplaceStore();
  const [gridRef, gridInView] = useInView<HTMLDivElement>();

  const handleCategoryClick = (cat: DocumentCategory) => {
    setDocumentCategory(cat);
    setView("documents");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeader
        eyebrow="Hujjat katalogi"
        title="Hujjat namunalari bo'yicha kategoriyalar"
        description="Yuridik shaxslar, ko'chmas mulk, sud ishlari va boshqa 700+ tayyor hujjat namunalari. Kerakli kategoriyani tanlang."
      />

      <div
        ref={gridRef}
        className={cn(
          "reveal-stagger mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3",
          gridInView && "in-view"
        )}
      >
        {DOCUMENT_CATEGORIES.map((cat) => {
          const colors = COLOR_MAP[cat.color] ?? COLOR_MAP.emerald;
          return (
            <Card
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="group relative cursor-pointer overflow-hidden p-6 hover:-translate-y-1 hover:shadow-beautiful-md hover:border-accent/30"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-accent opacity-0 transition-opacity duration-200 ease-[cubic-bezier(0.2,0,0,1)] group-hover:opacity-100" />

              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    "flex size-12 items-center justify-center rounded-xl transition-colors duration-200",
                    colors.bg,
                    colors.text,
                    colors.hoverBg
                  )}
                >
                  <DynamicIcon name={cat.icon} className="size-6" />
                </div>
                <Badge variant="soft" tone="neutral" size="sm" className="font-mono">
                  {cat.count} hujjat
                </Badge>
              </div>

              <h3 className="mt-5 font-serif text-xl font-bold tracking-tight text-foreground">{cat.nameUz}</h3>
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {cat.descriptionUz}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {cat.subcategories.slice(0, 3).map((sub) => (
                  <span
                    key={sub}
                    className="rounded-md bg-secondary/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                  >
                    {sub}
                  </span>
                ))}
                {cat.subcategories.length > 3 && (
                  <span className="text-[11px] font-medium text-muted-foreground">
                    +{cat.subcategories.length - 3}
                  </span>
                )}
              </div>

              <div className="mt-5 flex items-center gap-1 font-mono text-xs font-semibold uppercase tracking-wider text-accent opacity-0 transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)] group-hover:opacity-100">
                Ko'rish
                <ArrowRight className="size-3.5 transition-transform duration-200 ease-[cubic-bezier(0.2,0,0,1)] group-hover:translate-x-1" weight="bold" />
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "reveal-on-scroll flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end",
        inView && "in-view"
      )}
    >
      <div className="max-w-2xl">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-px w-8 bg-accent" />
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
        </div>
        <h2 className="text-balance font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
