"use client";

import { ArrowRight, TrendingUp, ShieldCheck, Users, Wallet, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMarketplaceStore } from "@/lib/marketplace/store";

export function AdvocateCTA() {
  const { setView } = useMarketplaceStore();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl bg-foreground px-6 py-12 text-background sm:px-12 lg:py-16">
        {/* Editorial newspaper texture */}
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-10" aria-hidden />
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-trust-premium/10 blur-3xl"
          aria-hidden
        />

        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-accent" />
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Advokatlar uchun
              </p>
            </div>
            <h2 className="text-balance font-serif text-3xl font-bold leading-tight tracking-tight text-background sm:text-4xl">
              Mijozlar bazasiga kiring va{" "}
              <span className="italic text-accent">daromadingizni</span> oshiring
            </h2>
            <p className="mt-4 max-w-xl text-balance text-sm leading-relaxed text-background/80 sm:text-base">
              Bepul ro'yxatdan o'ting, profilingizni yarating va oyiga o'rtacha 30+ yangi
              mijozga ega bo'ling. Tasdiqlangan advokatlar platformada ustuvor ko'rsatiladi.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => setView("for-advocates")}
                className="gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Bepul ro'yxatdan o'tish
                <ArrowRight className="h-4 w-4" />
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
              icon={<TrendingUp className="h-5 w-5" />}
              value="+30 oyiga"
              label="O'rtacha yangi mijozlar"
              accent
            />
            <Card2
              icon={<Wallet className="h-5 w-5" />}
              value="0% komissiya"
              label="Birinchi 3 mijoz uchun"
            />
            <Card2
              icon={<ShieldCheck className="h-5 w-5" />}
              value="1284+"
              label="Faol advokatlar"
            />
            <Card2
              icon={<Users className="h-5 w-5" />}
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
    <div className={`rounded-xl border p-5 backdrop-blur-sm ${accent ? "border-accent/30 bg-accent/10" : "border-background/15 bg-background/5"}`}>
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${accent ? "bg-accent/20 text-accent" : "bg-background/15 text-background"}`}>
        {icon}
      </div>
      <div className="font-serif text-xl font-bold text-background">{value}</div>
      <div className="mt-1 text-xs text-background/70">{label}</div>
    </div>
  );
}
