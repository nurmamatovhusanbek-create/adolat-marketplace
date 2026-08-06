"use client";

import { Container, Section, Stack, Grid } from "@/components/primitives/layout";
import { Heading, Text } from "@/components/primitives/typography";
import { Button } from "@/components/primitives/button";
import {
  ArrowRight,
  ShieldCheck,
  Sparkle,
  TrendUp,
  Users,
  Wallet,
} from "@phosphor-icons/react/dist/ssr";
import { useMarketplaceStore } from "@/lib/marketplace/store";

export function CTASection() {
  const { setView } = useMarketplaceStore();

  return (
    <Section spacing="lg" variant="default">
      <Container size="xl">
        <div className="relative overflow-hidden rounded-3xl bg-foreground px-6 py-12 text-background shadow-elevation-5 sm:px-12 lg:py-16">
          <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-10" aria-hidden />
          <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-primary/20 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-accent/15 blur-3xl" aria-hidden />

          <Grid cols={{ base: 1, lg: 2 }} gap="lg" className="relative items-center">
            <Stack gap="md" align="start">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-primary" />
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">Advokatlar uchun</p>
              </div>
              <Heading level={2} size="6" font="accent" tone="inverse" className="leading-tight">
                Mijozlar bazasiga kiring va{" "}
                <span className="italic text-primary">daromadingizni</span> oshiring
              </Heading>
              <Text size="lg" className="text-background/80" maxW="xl">
                Bepul ro'yxatdan o'ting, profilingizni yarating va oyiga o'rtacha 30+ yangi mijozga ega bo'ling.
              </Text>
              <Stack direction="row" gap="sm" wrap>
                <Button size="lg" tone="brand" onClick={() => setView("for-advocates")}>
                  <Sparkle className="size-4" weight="fill" />
                  Bepul ro'yxatdan o'tish
                  <ArrowRight className="size-4" weight="bold" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => setView("for-advocates")} className="border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background">
                  Batafsil ma'lumot
                </Button>
              </Stack>
            </Stack>

            <Grid cols={{ base: 2 }} gap="md">
              <StatCard icon={<TrendUp className="size-5" weight="duotone" />} value="+30 oyiga" label="O'rtacha yangi mijozlar" accent />
              <StatCard icon={<Wallet className="size-5" weight="duotone" />} value="0% komissiya" label="Birinchi 3 mijoz uchun" />
              <StatCard icon={<ShieldCheck className="size-5" weight="duotone" />} value="1284+" label="Faol advokatlar" />
              <StatCard icon={<Users className="size-5" weight="duotone" />} value="14 viloyat" label="Bozorga kirish" accent />
            </Grid>
          </Grid>
        </div>
      </Container>
    </Section>
  );
}

function StatCard({ icon, value, label, accent }: { icon: React.ReactNode; value: string; label: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 backdrop-blur-sm ${accent ? "border-primary/30 bg-primary/10" : "border-background/15 bg-background/5"}`}>
      <div className={`mb-3 flex size-9 items-center justify-center rounded-lg ${accent ? "bg-primary/20 text-primary" : "bg-background/15 text-background"}`}>{icon}</div>
      <div className="font-serif text-xl font-bold text-background">{value}</div>
      <div className="mt-1 text-xs text-background/70">{label}</div>
    </div>
  );
}
