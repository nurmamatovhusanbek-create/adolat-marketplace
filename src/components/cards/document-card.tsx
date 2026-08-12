"use client";

import * as React from "react";
import {
  ArrowDown,
  ArrowRight,
  Clock,
  FileText,
  ShieldCheck,
  Sparkle,
  Star,
  Tag,
} from "@phosphor-icons/react/dist/ssr";
import { Card, CardBody, CardFooter } from "@/components/primitives/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/primitives/button";
import { Heading, Text } from "@/components/primitives/typography";
import { Seal } from "@/components/primitives/seal";
import { cn } from "@/lib/utils";

export interface DocumentCardData {
  id: string;
  slug: string;
  titleUz: string;
  category: string;
  categoryNameUz?: string;
  descriptionUz: string;
  pages: number;
  downloads: number;
  rating: number;
  priceUzs: number;
  isFree: boolean;
  isNew?: boolean;
  /**
   * When truthy, the verified Seal stamp is rendered next to the title.
   * A document is considered verified when it cites a legal basis
   * (legalBasisUz is set) — pass `true` to opt in, or leave undefined
   * and the Seal will appear automatically when legalBasisUz is present.
   */
  verified?: boolean;
  legalBasisUz?: string | null;
  estimatedFillMinutes: number;
  fieldsCount: number;
  formats: string[];
}

export interface DocumentCardProps {
  document: DocumentCardData;
  rank?: number;
  onSelect?: (doc: DocumentCardData) => void;
  className?: string;
}

export function DocumentCard({ document: doc, rank, onSelect, className }: DocumentCardProps) {
  // A document is "verified" if it explicitly opts in OR cites a legal basis.
  const isVerified = doc.verified ?? Boolean(doc.legalBasisUz);

  return (
    <Card variant="interactive" className={cn("group relative overflow-hidden", className)}>
      {rank !== undefined && rank < 3 && (
        <div className="absolute -left-2 -top-2 z-10 flex size-8 items-center justify-center rounded-full bg-foreground font-display text-xs font-bold text-background shadow-md">
          {rank + 1}
        </div>
      )}

      <CardBody className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" tone="neutral" size="sm">{doc.categoryNameUz ?? doc.category}</Badge>
          <div className="flex items-center gap-1.5">
            {doc.isFree && (
              <Badge variant="secondary" tone="success" size="sm">
                <Sparkle className="size-3" weight="fill" />
                Bepul
              </Badge>
            )}
            {doc.isNew && (
              <Badge variant="secondary" tone="brand" size="sm">Yangi</Badge>
            )}
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
              SHR·{String(doc.slug).slice(0, 4).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2">
          {isVerified && (
            <div className="mt-0.5 shrink-0">
              <Seal size={20} variant="verified" ringText="VERIFIED" />
            </div>
          )}
          <Heading level={3} size="3" className="flex-1 line-clamp-2 group-hover:text-primary transition-colors">
            {doc.titleUz}
          </Heading>
        </div>
        <Text size="xs" tone="secondary" className="mt-1.5 line-clamp-2">{doc.descriptionUz}</Text>

        <div className="mt-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-1">
            <FileText className="size-3" weight="regular" />
            {doc.pages}b
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" weight="regular" />
            {doc.estimatedFillMinutes}d
          </span>
          <span className="flex items-center gap-1">
            <ArrowDown className="size-3" weight="regular" />
            {doc.downloads.toLocaleString("ru-RU")}
          </span>
          <span className="ml-auto flex items-center gap-1">
            <Star className="size-3 text-warning" weight="fill" />
            <span className="font-bold text-foreground">{doc.rating}</span>
          </span>
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          {doc.formats.map((f) => (
            <span key={f} className="rounded-md border border-border bg-secondary/40 px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase text-muted-foreground">
              {f}
            </span>
          ))}
          <span className="ml-auto text-[10px] font-mono text-muted-foreground">{doc.fieldsCount} maydon</span>
        </div>
      </CardBody>

      <CardFooter className="justify-between">
        {doc.isFree ? (
          <div className="flex items-center gap-1.5 font-display text-base font-bold text-success">
            <Sparkle className="size-4" weight="fill" />
            Bepul
          </div>
        ) : (
          <div className="flex items-center gap-1.5 font-display text-base font-bold text-foreground">
            <Tag className="size-4 text-primary" weight="regular" />
            {doc.priceUzs.toLocaleString("ru-RU")} so'm
          </div>
        )}
        <Button size="sm" variant="outline" onClick={() => onSelect?.(doc)}>
          Ko'rish
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" weight="bold" />
        </Button>
      </CardFooter>

      {doc.legalBasisUz && (
        <div className="flex items-start gap-1 border-t border-dashed border-border px-6 py-2 text-[10px] text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-3 shrink-0 text-success" weight="regular" />
          <span className="line-clamp-1">{doc.legalBasisUz}</span>
        </div>
      )}
    </Card>
  );
}
