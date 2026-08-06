"use client";

import * as React from "react";
import {
  ArrowRight,
  FileText,
  Lightning,
  SealCheck,
  ShieldCheck,
  Star,
  Users,
  Waveform,
} from "@phosphor-icons/react/dist/ssr";
import { Container, Section, Grid, Stack } from "@/components/primitives/layout";
import { Heading, Text } from "@/components/primitives/typography";
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
      <Container size="xl" className="relative">
        <Grid cols={{ base: 1, lg: 2 }} gap="xl">
          {/* Left: Value Proposition */}
          <Stack gap="lg" align="start">
            {/* Registry-style eyebrow — monospace reference code + date */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                REG·001
              </span>
              <span className="h-px w-8 bg-border" />
              <span className="font-mono text-xs text-muted-foreground">
                {new Date().toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>

            <Heading level={1} size="7" font="display" tone="primary" className="leading-[1.1]">
              Adolatli yechimlar,{" "}
              <span className="text-primary">
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
              <TrustBadge icon={<SealCheck className="size-4 text-stamp-green" weight="fill" />} label="Litsenziyalangan advokatlar" />
              <TrustBadge icon={<ShieldCheck className="size-4 text-stamp-green" weight="fill" />} label="Adliya vazirligi tasdiqlagan" />
              <TrustBadge icon={<Star className="size-4 text-warning" weight="fill" />} label={`${PLATFORM_STATS.satisfactionRate}% mijozlar mamnunligi`} />
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
      {/* Header — registry style */}
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          JONLI STATISTIKA
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] font-medium text-stamp-green">
          <Waveform className="size-3" weight="fill" />
          <span className="size-1.5 rounded-full bg-stamp-green" />
          ONLAYN
        </span>
      </div>

      {/* Card — document-edge: 4px radius, hairline border, shadow-sm */}
      <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          <StatBox
            refCode="ADV"
            value={PLATFORM_STATS.advocatesCount.toLocaleString("ru-RU") + "+"}
            label="Tasdiqlangan advokatlar"
            icon={<Users className="size-5 text-primary" weight="duotone" />}
          />
          <StatBox
            refCode="SHR"
            value={PLATFORM_STATS.documentsCount + "+"}
            label="Hujjat namunalari"
            icon={<FileText className="size-5 text-seal" weight="duotone" />}
          />
          <StatBox
            refCode="YEC"
            value={PLATFORM_STATS.requestsResolved.toLocaleString("ru-RU") + "+"}
            label="Yechilgan so'rovlar"
            icon={<ShieldCheck className="size-5 text-stamp-green" weight="duotone" />}
          />
          <StatBox
            refCode="JVB"
            value={PLATFORM_STATS.avgResponseHours + " soat"}
            label="O'rtacha javob"
            icon={<Lightning className="size-5 text-warning" weight="duotone" />}
          />
        </div>

        {/* Online advocates — registry footer */}
        <div className="mt-6 border-t border-border pt-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              ONLAYN ADVOKATLAR
            </p>
            <span className="font-mono text-xs font-bold text-foreground">52</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[12, 45, 33, 44, 68, 20].map((n, i) => (
                <img
                  key={n}
                  src={`https://i.pravatar.cc/64?img=${n}`}
                  alt="Advokat"
                  className="size-9 rounded-full border-2 border-card object-cover"
                  style={{ zIndex: 10 - i }}
                />
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-semibold text-foreground">+47</span>
                <span className="text-xs text-muted-foreground">advokat</span>
              </div>
              <span className="text-[10px] text-muted-foreground">javob berishga tayyor</span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        Ma'lumotlar har 5 daqiqada yangilanadi
      </p>
    </div>
  );
}

/**
 * StatBox — Registry direction: each stat has a monospace reference code
 * (ADV·1284, SHR·697, etc.) rendered as part of the card, not decoration.
 */
function StatBox({
  refCode,
  value,
  label,
  icon,
}: {
  refCode: string;
  value: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group">
      <div className="mb-2 flex items-center justify-between">
        <div className="rounded-md bg-secondary/60 p-1.5 transition-colors group-hover:bg-primary/10">
          {icon}
        </div>
        <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
          {refCode}
        </span>
      </div>
      <div className="font-display text-2xl font-bold tracking-tight text-foreground">{value}</div>
      <div className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{label}</div>
    </div>
  );
}
