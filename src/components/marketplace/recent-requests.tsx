"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Container, Section, Grid } from "@/components/primitives/layout";
import { Button } from "@/components/primitives/button";
import { RequestCard, type RequestCardData } from "@/components/cards/request-card";
import { SectionHeader } from "./section-header";
import { SPECIALTIES, DOCUMENT_CATEGORIES, REGIONS } from "@/lib/marketplace/data";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { useInView } from "@/hooks/use-in-view";
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

function toCardData(req: ApiRequest): RequestCardData {
  const categoryLabel =
    req.category in SPECIALTIES
      ? SPECIALTIES[req.category as Specialty].uz
      : DOCUMENT_CATEGORIES.find((x) => x.id === (req.category as DocumentCategory))?.nameUz ?? req.category;
  const regionLabel = REGIONS[req.region as keyof typeof REGIONS]?.uz ?? req.city;
  return {
    id: req.id,
    title: req.title,
    description: req.description,
    category: req.category,
    categoryLabel,
    region: req.region,
    regionLabel,
    city: req.city,
    clientType: (req.clientType === "business" ? "business" : "individual") as "individual" | "business",
    isUrgent: req.isUrgent,
    statusLabel: req.status === "open" ? "Ochiq" : undefined,
    budgetMin: req.budgetMin,
    budgetMax: req.budgetMax,
    viewsCount: req.viewsCount,
    responsesCount: req.responsesCount,
    postedAgo: req.postedAgo,
  };
}

/** Skeleton card — shaped like RequestCard, using .skeleton-shimmer (§5). */
function RequestCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-1.5">
        <div className="skeleton-shimmer h-5 w-20" />
        <div className="skeleton-shimmer h-5 w-16" />
        <div className="skeleton-shimmer h-5 w-14" />
      </div>
      <div className="skeleton-shimmer mt-3 h-5 w-3/4" />
      <div className="skeleton-shimmer mt-2 h-3 w-full" />
      <div className="skeleton-shimmer mt-2 h-3 w-5/6" />
      <div className="skeleton-shimmer mt-4 h-8 w-2/3" />
    </div>
  );
}

export function RecentRequests() {
  const { setView, setPostRequestOpen } = useMarketplaceStore();
  const [requests, setRequests] = useState<ApiRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView<HTMLDivElement>();

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

  return (
    <Section spacing="lg" variant="alt">
      <Container size="xl">
        <SectionHeader
          eyebrow="So'rovlar taxtasi"
          title="So'nggi huquqiy so'rovlar"
          description="Mijozlar tomonidan joylangan huquqiy so'rovlar. Advokat sifatida javob berishingiz yoki o'xshash so'rov joylash imkoniyatini ko'ring."
          action={
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setView("requests")} className="gap-1.5">
                Barchasi
                <ArrowRight weight="regular" className="h-3.5 w-3.5" />
              </Button>
              <Button
                onClick={() => setPostRequestOpen(true)}
                tone="brand"
                className="gap-1.5"
              >
                So'rov joylash
              </Button>
            </div>
          }
        />

        <div ref={ref} className={cn("mt-10 reveal-stagger", inView && "in-view")}>
          {loading ? (
            <Grid cols={{ base: 1, lg: 2 }} gap="md">
              {Array.from({ length: 4 }).map((_, i) => (
                <RequestCardSkeleton key={i} />
              ))}
            </Grid>
          ) : requests.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <p className="text-sm text-muted-foreground">
                Hozircha so'rovlar mavjud emas. Birinchi bo'lib so'rov joylang!
              </p>
            </div>
          ) : (
            <Grid cols={{ base: 1, lg: 2 }} gap="md">
              {requests.map((req, idx) => (
                <RequestCard
                  key={req.id}
                  request={toCardData(req)}
                  rank={idx}
                />
              ))}
            </Grid>
          )}
        </div>
      </Container>
    </Section>
  );
}
