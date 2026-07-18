"use client";

import {
  ArrowRight,
  TrendUp,
  ShieldCheck,
  Users,
  Wallet,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { useMarketplaceStore } from "@/lib/marketplace/store";

export function AdvocateCTA() {
  const { setView } = useMarketplaceStore();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="relative overflow-hidden rounded-3xl bg-foreground px-6 py-12 text-background shadow-beautiful-xl sm:px-12 lg:py-16">
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-10" aria-hidden />
        <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-accent/20 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-warning/15 blur-3xl" aria-hidden />

        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-accent" />
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Advokatlar uchun
              </p>
            </div>
            <h2 className="text-balance font-serif text-3xl font-bold leading-tight tracking-tight text-background sm:text-4xl lg:text-5xl">
              Mijozlar bazasiga kiring va{" "}
              <span className="italic text-accent">daromadingizni</span> oshiring
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-background/80">
              Bepul ro'yxatdan o'ting, profilingizni yarating va oyiga o'rtacha 30+ yangi
              mijozga ega bo'ling. Tasdiqlangan advokatlar platformada ustuvor ko'rsatiladi.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                size="lg"
                tone="brand"
                onClick={() => setView("for-advocates")}
              >
                <Sparkle className="size-4" weight="fill" />
                Bepul ro'yxatdan o'tish
                <ArrowRight className="size-4" weight="bold" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setView("for-advocates")}
                className="border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background"
              >
                Batafsil ma'lumot
              </Button>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card2
              icon={<TrendUp className="size-5" weight="duotone" />}
              value="+30 oyiga"
              label="O'rtacha yangi mijozlar"
              accent
            />
            <Card2
              icon={<Wallet className="size-5" weight="duotone" />}
              value="0% komissiya"
              label="Birinchi 3 mijoz uchun"
            />
            <Card2
              icon={<ShieldCheck className="size-5" weight="duotone" />}
              value="1284+"
              label="Faol advokatlar"
            />
            <Card2
              icon={<Users className="size-5" weight="duotone" />}
              value="14 viloyat"
              label="Bozorga kirish"
              accent
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Card2({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-5 backdrop-blur-sm ${accent ? "border-accent/30 bg-accent/10" : "border-background/15 bg-background/5"}`}>
      <div className={`mb-3 flex size-9 items-center justify-center rounded-lg ${accent ? "bg-accent/20 text-accent" : "bg-background/15 text-background"}`}>
        {icon}
      </div>
      <div className="font-serif text-xl font-bold text-background">{value}</div>
      <div className="mt-1 text-xs text-background/70">{label}</div>
    </div>
  );
}
