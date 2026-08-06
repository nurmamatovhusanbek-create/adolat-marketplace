"use client";

import { useEffect, useState } from "react";
import { Container, Section, Grid, Stack } from "@/components/primitives/layout";
import { Heading, Text } from "@/components/primitives/typography";
import { Button } from "@/components/primitives/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdvocateCard, type AdvocateCardData } from "@/components/cards/advocate-card";
import { SectionHeader } from "@/components/marketplace/section-header";
import { SPECIALTIES } from "@/lib/marketplace/data";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { openChatWith } from "@/components/chat/chat-panel";
import type { Advocate } from "@/lib/marketplace/types";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export function FeaturedAdvocatesSection({ limit = 6 }: { limit?: number }) {
  const { setView, setActiveAdvocate } = useMarketplaceStore();
  const [advocates, setAdvocates] = useState<AdvocateCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/advocates?page=1&pageSize=${limit}&sortBy=rating`);
        if (!res.ok) return;
        const data = await res.json();
        const mapped: AdvocateCardData[] = (data.advocates ?? []).map((a: Record<string, unknown>) => ({
          id: a.id as string,
          name: a.name as string,
          titleUz: a.titleUz as string,
          photo: a.photo as string,
          specialty: SPECIALTIES[a.specialty as keyof typeof SPECIALTIES]?.uz ?? (a.specialty as string),
          city: a.city as string,
          rating: a.rating as number,
          reviewsCount: a.reviewsCount as number,
          experienceYears: a.experienceYears as number,
          casesResolved: a.casesResolved as number,
          successRate: a.successRate as number,
          responseTimeHours: a.responseTimeHours as number,
          consultationFee: a.consultationFee as number,
          verified: a.verified as boolean,
          online: a.online as boolean,
          topRated: (a.tags as string[])?.includes("TOP-10"),
          userId: a.userId as string | undefined,
        }));
        setAdvocates(mapped);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, [limit]);

  return (
    <Section spacing="lg" variant="alt">
      <Container size="xl">
        <SectionHeader
          eyebrow="Top advokatlar"
          title="Yuqori reytingli mutaxassislar"
          description="Eng ko'p so'rovlar bo'yicha tanlangan advokatlar. Tajriba, baholar va muvaffaqiyat ko'rsatkichi bo'yicha saralangan."
          action={
            <Button variant="outline" onClick={() => setView("advocates")}>
              Barchasini ko'rish
              <ArrowRight className="size-4" weight="bold" />
            </Button>
          }
        />

        {loading ? (
          <Grid cols={{ base: 1, sm: 2, lg: 3 }} gap="md" className="mt-10">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start gap-3">
                  <Skeleton className="size-14 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
                <Skeleton className="mt-4 h-20" />
                <Skeleton className="mt-4 h-12" />
              </div>
            ))}
          </Grid>
        ) : (
          <Grid cols={{ base: 1, sm: 2, lg: 3 }} gap="md" className="mt-10">
            {advocates.map((adv) => (
              <AdvocateCard
                key={adv.id}
                advocate={adv}
                onSelect={(a) => setActiveAdvocate(a as unknown as Advocate)}
                onContact={(a) => openChatWith(a.userId ?? a.id, a.name)}
              />
            ))}
          </Grid>
        )}
      </Container>
    </Section>
  );
}
