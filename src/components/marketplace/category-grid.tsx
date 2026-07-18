"use client";

import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DynamicIcon } from "./dynamic-icon";
import { DOCUMENT_CATEGORIES } from "@/lib/marketplace/data";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import type { DocumentCategory } from "@/lib/marketplace/types";
import { cn } from "@/lib/utils";

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; hoverBg: string }> = {
  emerald: {
    bg: "bg-trust-verified/8",
    text: "text-trust-verified",
    border: "border-trust-verified/20",
    hoverBg: "group-hover:bg-trust-verified/15",
  },
  amber: {
    bg: "bg-trust-premium/10",
    text: "text-trust-premium",
    border: "border-trust-premium/25",
    hoverBg: "group-hover:bg-trust-premium/20",
  },
  rose: {
    bg: "bg-accent/8",
    text: "text-accent",
    border: "border-accent/20",
    hoverBg: "group-hover:bg-accent/15",
  },
  violet: {
    bg: "bg-chart-3/8",
    text: "text-chart-3",
    border: "border-chart-3/20",
    hoverBg: "group-hover:bg-chart-3/15",
  },
  sky: {
    bg: "bg-chart-3/8",
    text: "text-chart-3",
    border: "border-chart-3/20",
    hoverBg: "group-hover:bg-chart-3/15",
  },
  teal: {
    bg: "bg-trust-verified/8",
    text: "text-trust-verified",
    border: "border-trust-verified/20",
    hoverBg: "group-hover:bg-trust-verified/15",
  },
};

export function CategoryGrid() {
  const { setView, setDocumentCategory } = useMarketplaceStore();

  const handleCategoryClick = (cat: DocumentCategory) => {
    setDocumentCategory(cat);
    setView("documents");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Hujjat katalogi"
        title="Hujjat namunalari bo'yicha kategoriyalar"
        description="Yuridik shaxslar, ko'chmas mulk, sud ishlari va boshqa 700+ tayyor hujjat namunalari. Kerakli kategoriyani tanlang."
      />

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {DOCUMENT_CATEGORIES.map((cat) => {
          const colors = COLOR_MAP[cat.color] ?? COLOR_MAP.emerald;
          return (
            <Card
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="group relative cursor-pointer overflow-hidden border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-hard"
            >
              {/* Hard shadow accent line on hover */}
              <div className="absolute left-0 top-0 h-full w-1 bg-accent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-lg transition-colors",
                    colors.bg,
                    colors.text,
                    colors.hoverBg
                  )}
                >
                  <DynamicIcon name={cat.icon} className="h-6 w-6" />
                </div>
                <Badge variant="outline" className="border-border text-[10px] font-mono">
                  {cat.count} hujjat
                </Badge>
              </div>

              <h3 className="mt-5 font-serif text-lg font-bold text-foreground">{cat.nameUz}</h3>
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

              <div className="mt-5 flex items-center gap-1 font-mono text-xs font-semibold uppercase tracking-wider text-accent opacity-0 transition-opacity group-hover:opacity-100">
                Ko'rish
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
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
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div className="max-w-2xl">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-px w-8 bg-accent" />
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
        </div>
        <h2 className="text-balance font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
