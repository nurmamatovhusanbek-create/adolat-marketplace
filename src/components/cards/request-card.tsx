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
import { Heading, Text } from "@/components/primitives/typography";
import { Seal } from "@/components/primitives/seal";
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
  /** When true, the request shows the verified Seal — used for approved/verified requests. */
  approved?: boolean;
  /** Free-form status label (e.g. "Ochiq", "Yopilgan") rendered as a small badge. */
  statusLabel?: string;
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

/**
 * RequestCard — shared card for legal requests, used by:
 *  - requests-page.tsx (full board)
 *  - recent-requests.tsx (homepage section)
 *
 * Per §3.3 (reference codes) and §3.2 (the Seal):
 *  - Top-right of the card header always shows `REQ·XXXX` (last 4 of id)
 *  - When `approved` is true, the Seal stamp appears next to the title
 *  - Hover physics are identical to every other card type (§6)
 */
export function RequestCard({ request: req, rank, onRespond, className }: RequestCardProps) {
  return (
    <Card
      variant="interactive"
      className={cn("group relative flex flex-col", className)}
    >
      {/* Reference code — systematic, top-right of header (§3.3) */}
      <div className="absolute right-4 top-4 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {rank !== undefined && <span>№{String(rank + 1).padStart(2, "0")}</span>}
        <span>REQ·{String(req.id).slice(-4).toUpperCase()}</span>
      </div>

      <CardBody className="pb-3">
        <div className="mb-2 flex flex-wrap items-center gap-1.5 pr-28">
          <Badge variant="secondary" tone="neutral" size="sm">{req.categoryLabel}</Badge>
          {req.isUrgent && (
            <Badge variant="secondary" tone="danger" size="sm">
              <Fire className="size-3" weight="fill" />
              Shoshilinch
            </Badge>
          )}
          <Badge variant="outline" tone="neutral" size="sm">
            {req.clientType === "business" ? (
              <span className="flex items-center gap-1">
                <BuildingOffice className="size-3" weight="regular" /> Biznes
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <User className="size-3" weight="regular" /> Jismoniy
              </span>
            )}
          </Badge>
          {req.statusLabel && (
            <Badge variant="secondary" tone="success" size="sm">{req.statusLabel}</Badge>
          )}
        </div>

        <div className="flex items-start gap-2">
          {req.approved && (
            <div className="mt-0.5 shrink-0">
              <Seal size={20} variant="verified" ringText="APPROVED" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <Heading level={3} size="4" className="group-hover:text-primary transition-colors">
              {req.title}
            </Heading>
          </div>
        </div>
        <Text size="sm" tone="secondary" className="mt-1 line-clamp-2">{req.description}</Text>

        {req.budgetMin != null && req.budgetMax != null && (
          <div className="mt-3 flex items-center gap-2 rounded-md border border-success/20 bg-stamp-tint px-3 py-2 text-xs">
            <Wallet className="size-4 text-success" weight="duotone" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-success">Byudjet:</span>
            <span className="font-semibold text-success">
              {req.budgetMin.toLocaleString("ru-RU")} — {req.budgetMax.toLocaleString("ru-RU")} so'm
            </span>
          </div>
        )}
      </CardBody>

      <CardFooter
        divider={false}
        className="mt-auto justify-between border-t border-border pt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
      >
        <div className="flex flex-wrap items-center gap-3">
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
        <Button
          size="sm"
          variant="ghost"
          tone="brand"
          className="h-7 gap-1 px-2 text-[11px]"
          onClick={() => onRespond?.(req)}
        >
          Javob berish
          <ArrowRight className="size-3" weight="bold" />
        </Button>
      </CardFooter>
    </Card>
  );
}
