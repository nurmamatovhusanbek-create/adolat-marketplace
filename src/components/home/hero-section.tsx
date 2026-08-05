"use client";

import * as React from "react";
import { Sparkle, SealCheck, ShieldCheck, Star, Lightning, Waveform, Users, FileText, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Container, Section, Grid, Stack } from "@/components/primitives/layout";
import { Heading, Text } from "@/components/primitives/typography";
import { Badge } from "@/components/ui/badge";
import { UnifiedSearch, type SearchType } from "@/components/search/unified-search";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { PLATFORM_STATS } from "@/lib/marketplace/data";

export function HeroSection() {
  const { setView, setAdvocateSearch, setDocumentSearch } = useMarketplaceStore();

  const handleSearch = (query: string, mode: SearchType) => {
    if (mode === "advocates") {
      setAdvocateSearch(query);
      setView("advocates");
    } else if (mode === "documents") {
      setDocumentSearch(query);
      setView("documents");
    } else {
      setView("requests");
    }
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Section spacing="xl" variant="default" className="relative overflow-hidden bg-hero-radial">
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute -left-20 top-20 size-64 rounded-full bg-primary/15 blur-3xl animate-pulse" aria-hidden />
      <div className="pointer-events-none absolute -right-32 top-40 size-80 rounded-full bg-accent/12 blur-3xl animate-pulse [animation-delay:700ms]" aria-hidden />
      <div className="pointer-events-none absolute bottom-0 left-1/2 size-96 -translate-x-1/2 rounded-full bg-accent-2/10 blur-3xl" aria-hidden />

      <Container size="xl" className="relative">
        <Grid cols={{ base: 1, lg: 2 }} gap="xl">
          {/* Left: Value Proposition */}
          <Stack gap="lg" align="start">
            <div className="flex items-center gap-3">
              <Badge variant="soft" tone="brand" size="sm" className="h-8 px-4 text-xs font-semibold shadow-glow">
                <Sparkle className="size-3.5" weight="fill" />
                O'zbekiston #1 Huquqiy Platformasi
              </Badge>
              <span className="hidden h-px w-12 bg-border sm:block" />
              <span className="hidden font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:block">
                {new Date().toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>

            <Heading level={1} size="8" font="accent" tone="primary" className="leading-[1.05]">
              Adolatli yechimlar,{" "}
              <span className="bg-gradient-to-r from-primary via-accent-2 to-accent bg-clip-text text-transparent italic">
                bir joyda
              </span>
            </Heading>

            <Text size="lg" tone="secondary" maxW="xl" pretty>
              Tasdiqlangan advokatlar, 700+ hujjat namunalari va professional huquqiy maslahat — hammasi bir platformada.
            </Text>

            <UnifiedSearch
              modes={["advocates", "documents", "requests"]}
              defaultMode="advocates"
              onSearch={handleSearch}
              className="w-full max-w-xl"
            />

            <Stack direction="row" gap="lg" wrap>
              <TrustBadge icon={<SealCheck className="size-5 text-primary" weight="fill" />} label="Litsenziyalangan advokatlar" />
              <TrustBadge icon={<ShieldCheck className="size-5 text-success" weight="fill" />} label="Adliya vazirligi tasdiqlagan" />
              <TrustBadge icon={<Star className="size-5 text-warning" weight="fill" />} label={`${PLATFORM_STATS.satisfactionRate}% mijozlar mamnunligi`} />
            </Stack>
          </Stack>

          {/* Right: Live Stats Card */}
          <div className="relative">
            <LiveStatsCard />
          </div>
        </Grid>
      </Container>
    </Section>
  );
}

function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon}
      <Text size="sm" weight="medium">{label}</Text>
    </div>
  );
}

function LiveStatsCard() {
  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Jonli statistika
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-medium text-success">
          <Waveform className="size-3" weight="fill" />
          <span className="size-2 rounded-full bg-success shadow-glow verified-pulse" />
          onlayn
        </span>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-6 shadow-elevation-4 backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-primary/10 blur-3xl" aria-hidden />

        <div className="relative grid grid-cols-2 gap-x-6 gap-y-5">
          <StatBox value={PLATFORM_STATS.advocatesCount.toLocaleString("ru-RU") + "+"} label="Tasdiqlangan advokatlar" icon={<Users className="size-5 text-primary" weight="duotone" />} />
          <StatBox value={PLATFORM_STATS.documentsCount + "+"} label="Hujjat namunalari" icon={<FileText className="size-5 text-accent" weight="duotone" />} />
          <StatBox value={PLATFORM_STATS.requestsResolved.toLocaleString("ru-RU") + "+"} label="Yechilgan so'rovlar" icon={<ShieldCheck className="size-5 text-success" weight="duotone" />} />
          <StatBox value={PLATFORM_STATS.avgResponseHours + " soat"} label="O'rtacha javob" icon={<Lightning className="size-5 text-warning" weight="duotone" />} />
        </div>

        <div className="relative mt-6 border-t border-border pt-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Hozir onlayn advokatlar</p>
            <span className="text-xs font-bold text-foreground">52</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[12, 45, 33, 44, 68, 20].map((n, i) => (
                <img key={n} src={`https://i.pravatar.cc/64?img=${n}`} alt="Advokat" className="size-10 rounded-full border-2 border-card object-cover transition-transform duration-200 hover:scale-110 hover:-translate-y-1" style={{ zIndex: 10 - i }} />
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground">+47</span>
                <span className="text-xs text-muted-foreground">advokat</span>
              </div>
              <span className="text-[10px] text-muted-foreground">javob berishga tayyor</span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Ma'lumotlar har 5 daqiqada yangilanadi</p>
    </div>
  );
}

function StatBox({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="group">
      <div className="mb-2 flex items-center justify-between">
        <div className="rounded-lg bg-secondary/50 p-2 transition-colors group-hover:bg-primary/10">{icon}</div>
        <span className="size-2 rounded-full bg-success shadow-glow" aria-hidden />
      </div>
      <div className="font-serif text-3xl font-black tracking-tight text-foreground">{value}</div>
      <div className="mt-1 text-[11px] font-medium leading-tight text-muted-foreground">{label}</div>
    </div>
  );
}
