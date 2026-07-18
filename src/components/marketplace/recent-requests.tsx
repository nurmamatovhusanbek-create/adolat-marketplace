"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  Eye,
  ChatCircle,
  ArrowRight,
  BuildingOffice,
  User,
  Fire,
  Wallet,
} from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "./category-grid";
import { SPECIALTIES, DOCUMENT_CATEGORIES, REGIONS } from "@/lib/marketplace/data";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { useInView } from "@/hooks/use-in-view";
import { formatPrice } from "@/lib/marketplace/format";
import type { DocumentCategory, Specialty } from "@/lib/marketplace/types";
import { cn } from "@/lib/utils";

interface ApiRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  region: string;
  city: string;
  clientType: string;
  isUrgent: boolean;
  status: string;
  budgetMin: number | null;
  budgetMax: number | null;
  viewsCount: number;
  responsesCount: number;
  createdAt: string;
  postedAgo: string;
}

export function RecentRequests() {
  const { setView, setPostRequestOpen } = useMarketplaceStore();
  const [requests, setRequests] = useState<ApiRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridRef, gridInView] = useInView<HTMLDivElement>();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/requests?page=1&pageSize=6");
        if (!res.ok) return;
        const data = await res.json();
        setRequests(data.requests ?? []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getCategoryLabel = (cat: string) => {
    if (cat in SPECIALTIES) return SPECIALTIES[cat as Specialty].uz;
    const c = DOCUMENT_CATEGORIES.find((x) => x.id === (cat as DocumentCategory));
    return c?.nameUz ?? cat;
  };

  return (
    <section className="bg-secondary/30 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="So'rovlar taxtasi"
          title="So'nggi huquqiy so'rovlar"
          description="Mijozlar tomonidan joylangan huquqiy so'rovlar. Advokat sifatida javob berishingiz yoki o'xshash so'rov joylash imkoniyatini ko'ring."
          action={
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setView("requests")}>
                Barchasi
                <ArrowRight className="size-4" weight="bold" />
              </Button>
              <Button
                tone="brand"
                onClick={() => setPostRequestOpen(true)}
              >
                So'rov joylash
              </Button>
            </div>
          }
        />

        {loading ? (
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="flex flex-col gap-3 p-6">
                <div className="flex gap-1.5">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-9 w-24 rounded-lg" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div
            ref={gridRef}
            className={cn(
              "reveal-stagger mt-10 grid gap-5 lg:grid-cols-2",
              gridInView && "in-view"
            )}
          >
            {requests.map((req, idx) => (
              <Card
                key={req.id}
                className="group relative flex flex-col gap-3 p-6 hover:-translate-y-0.5 hover:shadow-beautiful-md hover:border-accent/30"
              >
                <div className="absolute right-4 top-4 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  №{String(idx + 1).padStart(2, "0")}
                </div>

                <div className="flex items-start justify-between gap-3 pr-12">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-1.5">
                      <Badge variant="soft" tone="neutral" size="sm">
                        {getCategoryLabel(req.category)}
                      </Badge>
                      {req.isUrgent && (
                        <Badge variant="soft" tone="danger" size="sm">
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
                    </div>
                    <h3 className="font-serif text-lg font-bold leading-snug tracking-tight text-foreground group-hover:text-accent transition-colors">
                      {req.title}
                    </h3>
                  </div>
                </div>

                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{req.description}</p>

                {req.budgetMin && req.budgetMax && (
                  <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 px-3 py-2 text-xs">
                    <Wallet className="size-4 text-success" weight="duotone" />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-success">Byudjet:</span>
                    <span className="font-semibold text-success">
                      {formatPrice(req.budgetMin)} — {formatPrice(req.budgetMax)}
                    </span>
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between border-t border-border pt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" weight="regular" />
                      {REGIONS[req.region as keyof typeof REGIONS]?.uz ?? req.city}
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
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
