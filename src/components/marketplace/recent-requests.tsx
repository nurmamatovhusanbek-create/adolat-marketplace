"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  Eye,
  MessageSquare,
  ArrowRight,
  Building2,
  User,
  Flame,
  Wallet,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./category-grid";
import { SPECIALTIES, DOCUMENT_CATEGORIES, REGIONS } from "@/lib/marketplace/data";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { formatPrice } from "@/lib/marketplace/format";
import type { DocumentCategory, Specialty } from "@/lib/marketplace/types";

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
    <section className="bg-secondary/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="So'rovlar taxtasi"
          title="So'nggi huquqiy so'rovlar"
          description="Mijozlar tomonidan joylangan huquqiy so'rovlar. Advokat sifatida javob berishingiz yoki o'xshash so'rov joylash imkoniyatini ko'ring."
          action={
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setView("requests")} className="gap-1.5">
                Barchasi
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                onClick={() => setPostRequestOpen(true)}
                className="gap-1.5 bg-foreground text-background hover:bg-foreground/90"
              >
                So'rov joylash
              </Button>
            </div>
          }
        />

        {loading ? (
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="h-40 animate-pulse border-border bg-secondary/40" />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {requests.map((req, idx) => (
              <Card
                key={req.id}
                className="group relative flex flex-col gap-3 border-border bg-card p-5 transition-all hover:border-accent/30 hover:shadow-hard-sm"
              >
                {/* Editorial rank number */}
                <div className="absolute right-4 top-4 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  №{String(idx + 1).padStart(2, "0")}
                </div>

                <div className="flex items-start justify-between gap-3 pr-12">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-1.5">
                      <Badge variant="secondary" className="text-[11px]">
                        {getCategoryLabel(req.category)}
                      </Badge>
                      {req.isUrgent && (
                        <Badge className="gap-1 bg-trust-urgent/15 text-trust-urgent hover:bg-trust-urgent/15">
                          <Flame className="h-2.5 w-2.5" />
                          Shoshilinch
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-[11px]">
                        {req.clientType === "business" ? (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-2.5 w-2.5" /> Biznes
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <User className="h-2.5 w-2.5" /> Jismoniy
                          </span>
                        )}
                      </Badge>
                    </div>
                    <h3 className="font-serif text-base font-bold leading-snug text-foreground group-hover:text-accent">
                      {req.title}
                    </h3>
                  </div>
                </div>

                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{req.description}</p>

                {req.budgetMin && req.budgetMax && (
                  <div className="flex items-center gap-2 rounded-md border border-trust-verified/20 bg-trust-verified/5 px-3 py-1.5 text-xs">
                    <Wallet className="h-4 w-4 text-trust-verified" />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-trust-verified">Byudjet:</span>
                    <span className="font-semibold text-trust-verified">
                      {formatPrice(req.budgetMin)} — {formatPrice(req.budgetMax)}
                    </span>
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between border-t border-border pt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {REGIONS[req.region as keyof typeof REGIONS]?.uz ?? req.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {req.postedAgo}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {req.viewsCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {req.responsesCount} javob
                    </span>
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 gap-1 px-2 text-[11px] text-accent hover:bg-accent/10">
                    Javob berish
                    <ArrowRight className="h-3 w-3" />
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
