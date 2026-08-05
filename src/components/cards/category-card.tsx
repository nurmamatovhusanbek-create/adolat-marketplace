"use client";

import * as React from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Card, CardBody } from "@/components/primitives/card";
import { Badge } from "@/components/ui/badge";
import { Heading, Text } from "@/components/primitives/typography";
import { DynamicIcon } from "@/components/marketplace/dynamic-icon";
import { cn } from "@/lib/utils";

export interface CategoryCardData {
  id: string;
  nameUz: string;
  descriptionUz: string;
  icon: string;
  count: number;
  subcategories: string[];
  color?: string;
}

export interface CategoryCardProps {
  category: CategoryCardData;
  onSelect?: (cat: CategoryCardData) => void;
  className?: string;
}

const COLOR_MAP: Record<string, { bg: string; text: string; hoverBg: string }> = {
  emerald: { bg: "bg-success/10", text: "text-success", hoverBg: "group-hover:bg-success/15" },
  amber: { bg: "bg-warning/10", text: "text-warning", hoverBg: "group-hover:bg-warning/20" },
  rose: { bg: "bg-primary/10", text: "text-primary", hoverBg: "group-hover:bg-primary/15" },
  violet: { bg: "bg-accent-2/10", text: "text-accent-2", hoverBg: "group-hover:bg-accent-2/15" },
  sky: { bg: "bg-info/10", text: "text-info", hoverBg: "group-hover:bg-info/15" },
  teal: { bg: "bg-success/10", text: "text-success", hoverBg: "group-hover:bg-success/15" },
};

export function CategoryCard({ category: cat, onSelect, className }: CategoryCardProps) {
  const colors = COLOR_MAP[cat.color ?? "rose"] ?? COLOR_MAP.rose;

  return (
    <Card variant="interactive" padding="md" className={cn("group relative overflow-hidden", className)}>
      <div className="absolute left-0 top-0 h-full w-1 bg-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="flex items-start justify-between">
        <div className={cn("flex size-12 items-center justify-center rounded-xl transition-colors duration-200", colors.bg, colors.text, colors.hoverBg)}>
          <DynamicIcon name={cat.icon} className="size-6" />
        </div>
        <Badge variant="soft" tone="neutral" size="sm" className="font-mono">{cat.count} hujjat</Badge>
      </div>

      <Heading level={3} size="4" className="mt-5">{cat.nameUz}</Heading>
      <Text size="sm" tone="secondary" className="mt-1.5 line-clamp-2">{cat.descriptionUz}</Text>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {cat.subcategories.slice(0, 3).map((sub) => (
          <span key={sub} className="rounded-md bg-secondary/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {sub}
          </span>
        ))}
        {cat.subcategories.length > 3 && (
          <span className="text-[11px] font-medium text-muted-foreground">+{cat.subcategories.length - 3}</span>
        )}
      </div>

      <div className="mt-5 flex items-center gap-1 font-mono text-xs font-semibold uppercase tracking-wider text-primary opacity-0 transition-all duration-200 group-hover:opacity-100">
        Ko'rish
        <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" weight="bold" />
      </div>
    </Card>
  );
}
