"use client";

import * as React from "react";
import {
  ChatCircle,
  Lightning,
  MapPin,
  SealCheck,
  Star,
} from "@phosphor-icons/react/dist/ssr";
import { Card, CardBody, CardFooter } from "@/components/primitives/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/primitives/button";
import { Heading, Text } from "@/components/primitives/typography";
import { Stack } from "@/components/primitives/layout";
import { Seal } from "@/components/primitives/seal";
import { cn } from "@/lib/utils";

export interface AdvocateCardData {
  id: string;
  name: string;
  titleUz: string;
  photo: string;
  specialty: string;
  secondarySpecialties?: string[];
  city: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  casesResolved: number;
  successRate: number;
  responseTimeHours: number;
  consultationFee: number;
  verified: boolean;
  online: boolean;
  topRated?: boolean;
  userId?: string;
}

export interface AdvocateCardProps {
  advocate: AdvocateCardData;
  onSelect?: (adv: AdvocateCardData) => void;
  onContact?: (adv: AdvocateCardData) => void;
  className?: string;
}

export function AdvocateCard({ advocate, onSelect, onContact, className }: AdvocateCardProps) {
  return (
    <Card variant="interactive" className={cn("group relative overflow-hidden", className)}>
      {advocate.online && (
        <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded bg-stamp-green/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-stamp-green">
          <span className="size-1 rounded-full bg-stamp-green" />
          ONLAYN
        </div>
      )}

      <CardBody className="pb-3">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <img
              src={advocate.photo}
              alt={advocate.name}
              className="size-14 rounded-md border border-border object-cover"
            />
            {advocate.verified && (
              <div className="absolute -bottom-1 -right-1">
                <Seal size={20} variant="verified" ringText="VERIFIED" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <Heading level={3} size="3" className="truncate">{advocate.name}</Heading>
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                ADV·{String(advocate.id).slice(-4).toUpperCase()}
              </span>
            </div>
            <Text size="xs" tone="secondary" className="mt-0.5 line-clamp-2">{advocate.titleUz}</Text>
            <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <Star className="size-3 text-warning" weight="fill" />
                <span className="font-semibold text-foreground">{advocate.rating}</span>
                <span className="text-muted-foreground/70">({advocate.reviewsCount})</span>
              </span>
              <span className="text-border">·</span>
              <span className="flex items-center gap-0.5">
                <MapPin className="size-3" weight="regular" />
                {advocate.city}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge variant="secondary" tone="neutral" size="sm">{advocate.specialty}</Badge>
          {advocate.topRated && (
            <Badge variant="secondary" tone="warning" size="sm">
              <Star className="size-3" weight="fill" />
              TOP-10
            </Badge>
          )}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
          <div>
            <div className="font-display text-lg font-bold text-foreground">{advocate.experienceYears}</div>
            <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Yil tajriba</div>
          </div>
          <div className="border-x border-border">
            <div className="font-display text-lg font-bold text-foreground">{advocate.casesResolved}</div>
            <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Ishlar</div>
          </div>
          <div>
            <div className="font-display text-lg font-bold text-success">{advocate.successRate}%</div>
            <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Muvaffaqiyat</div>
          </div>
        </div>
      </CardBody>

      <CardFooter className="justify-between">
        <div>
          <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Konsultatsiya</div>
          <div className="font-display text-sm font-bold text-foreground">dan {advocate.consultationFee.toLocaleString("ru-RU")} so'm</div>
        </div>
        <Stack direction="row" gap="sm">
          <Button size="sm" variant="outline" onClick={() => onSelect?.(advocate)}>Profil</Button>
          <Button size="sm" tone="brand" onClick={() => onContact?.(advocate)}>
            <ChatCircle className="size-3.5" weight="regular" />
            Bog'lanish
          </Button>
        </Stack>
      </CardFooter>

      <div className={cn(
        "flex items-center justify-center gap-1.5 px-6 py-2 text-[11px] font-medium",
        advocate.responseTimeHours <= 1 ? "bg-success/10 text-success" : advocate.responseTimeHours <= 3 ? "bg-warning/10 text-warning" : "bg-secondary text-muted-foreground"
      )}>
        <Lightning className="size-3" weight="fill" />
        {advocate.responseTimeHours} soat ichida javob beradi
      </div>
    </Card>
  );
}
