"use client";

import { useEffect, useState } from "react";
import {
  Star,
  MapPin,
  SealCheck,
  ArrowRight,
  Lightning,
  ChatCircle,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "./category-grid";
import { SPECIALTIES } from "@/lib/marketplace/data";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { useInView } from "@/hooks/use-in-view";
import { formatPrice } from "@/lib/marketplace/format";
import type { Advocate } from "@/lib/marketplace/types";
import { openChatWith } from "@/components/chat/chat-panel";
import { cn } from "@/lib/utils";

interface ApiAdvocate {
  id: string;
  slug: string;
  name: string;
  titleUz: string;
  specialty: keyof typeof SPECIALTIES;
  secondarySpecialties: string[];
  region: string;
  city: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  casesResolved: number;
  responseTimeHours: number;
  consultationFee: number;
  hourlyFee: number;
  languages: string[];
  verified: boolean;
  topRated: boolean;
  online: boolean;
  bioUz: string;
  expertise: string[];
  successRate: number;
  availability: string;
  tags: string[];
  photo: string;
  userId?: string;
}

export function FeaturedAdvocates() {
  const { setView, setActiveAdvocate } = useMarketplaceStore();
  const [advocates, setAdvocates] = useState<ApiAdvocate[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridRef, gridInView] = useInView<HTMLDivElement>();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/advocates?page=1&pageSize=6&sortBy=rating");
        if (!res.ok) return;
        const data = await res.json();
        setAdvocates(data.advocates ?? []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const featured = advocates.slice(0, 6);

  return (
    <section className="bg-secondary/30 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Top advokatlar"
          title="Yuqori reytingli mutaxassislar"
          description="Eng ko'p so'rovlar bo'yicha tanlangan advokatlar. Tajriba, baholar va muvaffaqiyat ko'rsatkichi bo'yicha saralangan."
          action={
            <Button
              variant="outline"
              onClick={() => setView("advocates")}
            >
              Barchasini ko'rish
              <ArrowRight className="size-4" weight="bold" />
            </Button>
          }
        />

        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6">
                <div className="flex items-start gap-3">
                  <Skeleton className="size-14 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
                <div className="mt-3 flex gap-1.5">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3">
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-28 rounded-lg" />
                </div>
                <Skeleton className="mt-3 h-8 w-full rounded-lg" />
              </Card>
            ))}
          </div>
        ) : (
          <div
            ref={gridRef}
            className={cn(
              "reveal-stagger mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3",
              gridInView && "in-view"
            )}
          >
            {featured.map((adv) => {
              const spec = SPECIALTIES[adv.specialty];
              return (
                <Card
                  key={adv.id}
                  className="group relative flex flex-col overflow-hidden p-6 hover:-translate-y-1 hover:shadow-beautiful-lg hover:border-accent/30"
                >
                  {adv.online && (
                    <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-success">
                      <span className="size-1.5 rounded-full bg-success verified-pulse" />
                      onlayn
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={adv.photo}
                        alt={adv.name}
                        className="size-14 rounded-xl border border-border object-cover"
                      />
                      {adv.verified && (
                        <div className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-card bg-accent text-accent-foreground">
                          <SealCheck className="size-3" weight="fill" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-serif text-lg font-bold tracking-tight text-foreground">{adv.name}</h3>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{adv.titleUz}</p>
                      <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <Star className="size-3 text-warning" weight="fill" />
                          <span className="font-semibold text-foreground">{adv.rating}</span>
                          <span className="text-muted-foreground/70">({adv.reviewsCount})</span>
                        </span>
                        <span className="text-border">·</span>
                        <span className="flex items-center gap-0.5">
                          <MapPin className="size-3" weight="regular" />
                          {adv.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <Badge variant="soft" tone="neutral" size="sm">
                      {spec.uz}
                    </Badge>
                    {adv.secondarySpecialties.slice(0, 1).map((s) => (
                      <Badge key={s} variant="outline" tone="neutral" size="sm">
                        {SPECIALTIES[s as keyof typeof SPECIALTIES]?.uz ?? s}
                      </Badge>
                    ))}
                    {adv.tags.includes("TOP-10") && (
                      <Badge variant="soft" tone="warning" size="sm">
                        <Star className="size-3" weight="fill" />
                        TOP-10
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
                    <div>
                      <div className="font-serif text-lg font-bold text-foreground">{adv.experienceYears}</div>
                      <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Yil tajriba</div>
                    </div>
                    <div className="border-x border-border">
                      <div className="font-serif text-lg font-bold text-foreground">{adv.casesResolved}</div>
                      <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Ishlar</div>
                    </div>
                    <div>
                      <div className="font-serif text-lg font-bold text-success">{adv.successRate}%</div>
                      <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Muvaffaqiyat</div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
                    <div>
                      <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
                        Konsultatsiya
                      </div>
                      <div className="font-serif text-sm font-bold text-foreground">
                        dan {formatPrice(adv.consultationFee)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveAdvocate(adv as Advocate)}
                      >
                        Profil
                      </Button>
                      <Button
                        size="sm"
                        tone="brand"
                        onClick={() => openChatWith(adv.userId ?? adv.id, adv.name)}
                      >
                        <ChatCircle className="size-3.5" weight="regular" />
                        Bog'lanish
                      </Button>
                    </div>
                  </div>

                  {/* Response time strip */}
                  <div
                    className={cn(
                      "mt-3 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-medium",
                      adv.responseTimeHours <= 1
                        ? "bg-success/10 text-success"
                        : adv.responseTimeHours <= 3
                          ? "bg-warning/10 text-warning"
                          : "bg-secondary text-muted-foreground"
                    )}
                  >
                    <Lightning className="size-3" weight="fill" />
                    {adv.responseTimeHours} soat ichida javob beradi
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
