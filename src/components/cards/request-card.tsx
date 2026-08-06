"use client";

import * as React from "react";
import {
  ArrowRight,
  BuildingOffice,
  ChatCircle,
  Clock,
  Eye,
  Fire,
  MapPin,
  User,
  Wallet,
} from "@phosphor-icons/react/dist/ssr";
import { Card, CardBody, CardFooter } from "@/components/primitives/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/primitives/button";
import { Heading } from "@/components/primitives/typography";
import { cn } from "@/lib/utils";

export interface RequestCardData {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  region: string;
  regionLabel: string;
  city?: string;
  clientType: "individual" | "business";
  isUrgent: boolean;
  budgetMin?: number | null;
  budgetMax?: number | null;
  viewsCount: number;
  responsesCount: number;
  postedAgo: string;
}

export interface RequestCardProps {
  request: RequestCardData;
  rank?: number;
  onRespond?: (req: RequestCardData) => void;
  className?: string;
}

export function RequestCard({ request: req, rank, onRespond, className }: RequestCardProps) {
  return (
    <Card variant="interactive" padding="md" className={cn("group relative flex flex-col", className)}>
      {rank !== undefined && (
        <div className="absolute right-4 top-4 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          №{String(rank + 1).padStart(2, "0")}
        </div>
      )}

      <CardBody className="pb-3" padding="none">
        <div className="mb-2 flex flex-wrap items-center gap-1.5 pr-12">
          <Badge variant="soft" tone="neutral" size="sm">{req.categoryLabel}</Badge>
          {req.isUrgent && (
            <Badge variant="soft" tone="danger" size="sm">
              <Fire className="size-3" weight="fill" />
              Shoshilinch
            </Badge>
          )}
          <Badge variant="outline" tone="neutral" size="sm">
            {req.clientType === "business" ? (
              <span className="flex items-center gap-1"><BuildingOffice className="size-3" weight="regular" /> Biznes</span>
            ) : (
              <span className="flex items-center gap-1"><User className="size-3" weight="regular" /> Jismoniy</span>
            )}
          </Badge>
        </div>

        <Heading level={3} size="4" className="group-hover:text-primary transition-colors">{req.title}</Heading>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{req.description}</p>

        {req.budgetMin != null && req.budgetMax != null && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 px-3 py-2 text-xs">
            <Wallet className="size-4 text-success" weight="duotone" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-success">Byudjet:</span>
            <span className="font-semibold text-success">
              {req.budgetMin.toLocaleString("ru-RU")} — {req.budgetMax.toLocaleString("ru-RU")} so'm
            </span>
          </div>
        )}
      </CardBody>

      <CardFooter divider={false} className="mt-auto justify-between border-t border-border pt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground" padding="none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <MapPin className="size-3" weight="regular" />
            {req.regionLabel}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" weight="regular" />
            {req.postedAgo}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="size-3" weight="regular" />
            {req.viewsCount}
          </span>
          <span className="flex items-center gap-1">
            <ChatCircle className="size-3" weight="regular" />
            {req.responsesCount} javob
          </span>
        </div>
        <Button size="sm" variant="ghost" tone="brand" className="h-7 gap-1 px-2 text-[11px]">
          Javob berish
          <ArrowRight className="size-3" weight="bold" />
        </Button>
      </CardFooter>
    </Card>
  );
}
