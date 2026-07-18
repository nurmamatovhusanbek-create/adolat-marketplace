"use client";

import { useEffect, useState } from "react";
import {
  Star,
  MapPin,
  BadgeCheck,
  ArrowRight,
  Zap,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./category-grid";
import { SPECIALTIES } from "@/lib/marketplace/data";
import { useMarketplaceStore } from "@/lib/marketplace/store";
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
}

export function FeaturedAdvocates() {
  const { setView, setActiveAdvocate } = useMarketplaceStore();
  const [advocates, setAdvocates] = useState<ApiAdvocate[]>([]);
  const [loading, setLoading] = useState(true);

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
    <section className="bg-secondary/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Top advokatlar"
          title="Yuqori reytingli mutaxassislar"
          description="Eng ko'p so'rovlar bo'yicha tanlangan advokatlar. Tajriba, baholar va muvaffaqiyat ko'rsatkichi bo'yicha saralangan."
          action={
            <Button
              variant="outline"
              onClick={() => setView("advocates")}
              className="gap-1.5"
            >
              Barchasini ko'rish
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          }
        />

        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-72 animate-pulse border-border bg-secondary/40" />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((adv) => {
              const spec = SPECIALTIES[adv.specialty];
              return (
                <Card
                  key={adv.id}
                  className="group relative flex flex-col overflow-hidden border-border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-hard"
                >
                  {/* Online indicator strip */}
                  {adv.online && (
                    <div className="absolute right-0 top-0 flex items-center gap-1 bg-trust-verified/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-trust-verified">
                      <span className="h-1.5 w-1.5 rounded-full bg-trust-verified verified-pulse" />
                      onlayn
                    </div>
                  )}

                  {/* Top row: photo + name + verify */}
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={adv.photo}
                        alt={adv.name}
                        className="h-14 w-14 rounded-lg border border-border object-cover"
                      />
                      {adv.verified && (
                        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-accent text-accent-foreground">
                          <BadgeCheck className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-serif text-base font-bold text-foreground">{adv.name}</h3>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{adv.titleUz}</p>
                      <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-trust-premium text-trust-premium" />
                          <span className="font-semibold text-foreground">{adv.rating}</span>
                          <span>({adv.reviewsCount})</span>
                        </span>
                        <span className="text-border">·</span>
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-3 w-3" />
                          {adv.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Specialty badge */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="text-[11px]">
                      {spec.uz}
                    </Badge>
                    {adv.secondarySpecialties.slice(0, 1).map((s) => (
                      <Badge key={s} variant="outline" className="text-[11px]">
                        {SPECIALTIES[s as keyof typeof SPECIALTIES]?.uz ?? s}
                      </Badge>
                    ))}
                    {adv.tags.includes("TOP-10") && (
                      <Badge className="gap-1 bg-trust-premium/15 text-trust-premium hover:bg-trust-premium/15">
                        <Star className="h-2.5 w-2.5 fill-trust-premium" />
                        TOP-10
                      </Badge>
                    )}
                  </div>

                  {/* Stats — editorial 3-col grid */}
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
                    <div>
                      <div className="font-serif text-base font-bold text-foreground">{adv.experienceYears}</div>
                      <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Yil tajriba</div>
                    </div>
                    <div className="border-x border-border">
                      <div className="font-serif text-base font-bold text-foreground">{adv.casesResolved}</div>
                      <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Ishlar</div>
                    </div>
                    <div>
                      <div className="font-serif text-base font-bold text-trust-verified">{adv.successRate}%</div>
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
                        className="h-8"
                      >
                        Profil
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => openChatWith(adv.userId ?? adv.id, adv.name)}
                        className="h-8 gap-1 bg-foreground text-background hover:bg-foreground/90"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        Bog'lanish
                      </Button>
                    </div>
                  </div>

                  {/* Response time strip */}
                  <div
                    className={cn(
                      "mt-3 flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-medium",
                      adv.responseTimeHours <= 1
                        ? "bg-trust-verified/10 text-trust-verified"
                        : adv.responseTimeHours <= 3
                          ? "bg-trust-premium/10 text-trust-premium"
                          : "bg-secondary text-muted-foreground"
                    )}
                  >
                    <Zap className="h-3 w-3" />
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
