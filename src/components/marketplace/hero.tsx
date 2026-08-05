"use client";

import { useState } from "react";
import {
  MagnifyingGlass,
  Users,
  FileText,
  ArrowRight,
  Sparkle,
  Star,
  SealCheck,
  ShieldCheck,
  Lightning,
  Waveform,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { PLATFORM_STATS } from "@/lib/marketplace/data";
import { cn } from "@/lib/utils";

type SearchMode = "advocates" | "documents";

export function Hero() {
  const { setView, setAdvocateSearch, setDocumentSearch, setPostRequestOpen } = useMarketplaceStore();
  const [mode, setMode] = useState<SearchMode>("advocates");
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "advocates") {
      setAdvocateSearch(query);
      setView("advocates");
    } else {
      setDocumentSearch(query);
      setView("documents");
    }
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-hero-radial">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" aria-hidden />

      {/* Animated gradient orbs — pulsing with staggered delays */}
      <div className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl animate-pulse" aria-hidden />
      <div className="pointer-events-none absolute -right-32 top-40 h-80 w-80 rounded-full bg-accent/12 blur-3xl animate-pulse [animation-delay:700ms]" aria-hidden />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-accent-2/10 blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
          {/* Left: editorial copy + search */}
          <div className="lg:col-span-7">
            {/* Eyebrow — prominent badge with separator */}
            <div className="mb-6 flex items-center gap-3">
              <Badge variant="soft" tone="brand" size="sm" className="h-8 px-4 text-xs font-semibold shadow-glow">
                <Sparkle className="size-3.5" weight="fill" />
                O'zbekiston #1 huquqiy platforma
              </Badge>
              <span className="hidden h-px w-12 bg-border sm:block" />
              <span className="hidden font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:block">
                {new Date().toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>

            {/* Dramatic headline with gradient text */}
            <h1 className="text-balance font-serif text-5xl font-black leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-8xl">
              Huquqiy masalalarni{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="bg-gradient-to-r from-primary via-accent to-accent-2 bg-clip-text text-transparent italic">
                  bir joyda
                </span>
                <svg
                  className="absolute -bottom-1 left-0 w-full text-primary"
                  viewBox="0 0 200 8"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M2 5.5C50 2.5 150 2.5 198 5.5"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              yeching
            </h1>

            <p className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Tasdiqlangan advokatlarni toping, 700+ tayyor huquqiy hujjat namunalarini
              yuklab oling yoki huquqiy so'rovingizni joylang va bir necha soat ichida
              mutaxassislar javob bersin.
            </p>

            {/* Dual search — enhanced toggle */}
            <form onSubmit={handleSearch} className="mt-12">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Qidiruv turi:
                </span>
                <div className="inline-flex rounded-xl border border-border bg-card p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setMode("advocates")}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
                      mode === "advocates"
                        ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg scale-105"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    <Users className="size-4" weight={mode === "advocates" ? "fill" : "regular"} />
                    Advokat
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("documents")}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
                      mode === "documents"
                        ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg scale-105"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    <FileText className="size-4" weight={mode === "documents" ? "fill" : "regular"} />
                    Hujjat
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <MagnifyingGlass
                    className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
                    weight="regular"
                  />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={
                      mode === "advocates"
                        ? "Masalan: oilaviy huquq, Toshkent..."
                        : "Masalan: mehnat shartnomasi, ijara..."
                    }
                    size="lg"
                    className="h-14 rounded-xl border-2 bg-card/80 pl-12 text-base backdrop-blur-sm shadow-lg transition-all duration-200 focus-visible:border-primary focus-visible:shadow-xl"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  tone="brand"
                  className="h-14 px-8 text-base font-semibold rounded-xl shadow-lg transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-105 hover:shadow-xl"
                >
                  Qidirish
                  <ArrowRight className="size-4" weight="bold" />
                </Button>
              </div>

              {/* Popular tags — with bounce easing */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono uppercase tracking-wider text-muted-foreground">Mashhur:</span>
                {["Ajrashish", "Mehnat shartnomasi", "MChJ ochish", "Ijara shartnomasi"].map((tag, i) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setQuery(tag);
                      setMode(tag.includes("shartnoma") || tag.includes("hujjat") ? "documents" : "advocates");
                    }}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-95",
                      i === 0
                        ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </form>

            {/* Trust badges — larger icons, semantic colors */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <SealCheck className="size-5 text-primary" weight="fill" />
                <span className="font-medium">Litsenziyalangan advokatlar</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-success" weight="fill" />
                <span className="font-medium">Adliya vazirligi tomonidan tasdiqlangan</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="size-5 text-warning" weight="fill" />
                <span className="font-medium">{PLATFORM_STATS.satisfactionRate}% mijozlar mamnunligi</span>
              </div>
            </div>
          </div>

          {/* Right: stats panel — glass morphism + dramatic */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Editorial label with live indicator */}
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

              {/* Stats card — rounded-3xl, backdrop-blur, shadow-2xl, decorative orb */}
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-6 shadow-2xl backdrop-blur-xl">
                {/* Decorative gradient orb inside card */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" aria-hidden />

                <div className="relative grid grid-cols-2 gap-x-6 gap-y-5">
                  <StatBox
                    value={PLATFORM_STATS.advocatesCount.toLocaleString("ru-RU") + "+"}
                    label="Tasdiqlangan advokatlar"
                    icon={<Users className="size-5 text-primary" weight="duotone" />}
                  />
                  <StatBox
                    value={PLATFORM_STATS.documentsCount + "+"}
                    label="Hujjat namunalari"
                    icon={<FileText className="size-5 text-accent" weight="duotone" />}
                  />
                  <StatBox
                    value={PLATFORM_STATS.requestsResolved.toLocaleString("ru-RU") + "+"}
                    label="Yechilgan so'rovlar"
                    icon={<ShieldCheck className="size-5 text-success" weight="duotone" />}
                  />
                  <StatBox
                    value={PLATFORM_STATS.avgResponseHours + " soat"}
                    label="O'rtacha javob"
                    icon={<Lightning className="size-5 text-warning" weight="duotone" />}
                  />
                </div>

                {/* Mini list of online advocates */}
                <div className="relative mt-6 border-t border-border pt-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Hozir onlayn advokatlar
                    </p>
                    <span className="text-xs font-bold text-foreground">52</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[12, 45, 33, 44, 68, 20, 49, 51].slice(0, 6).map((n, i) => (
                        <img
                          key={n}
                          src={`https://i.pravatar.cc/64?img=${n}`}
                          alt="Advokat"
                          className="size-10 rounded-full border-2 border-card object-cover transition-transform duration-200 hover:scale-110 hover:-translate-y-1"
                          style={{ zIndex: 10 - i }}
                        />
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

              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Ma'lumotlar har 5 daqiqada yangilanadi
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatBox({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group">
      <div className="mb-2 flex items-center justify-between">
        <div className="rounded-lg bg-secondary/50 p-2 transition-colors group-hover:bg-primary/10">
          {icon}
        </div>
        <span className="size-2 rounded-full bg-success shadow-glow" aria-hidden />
      </div>
      <div className="font-serif text-3xl font-black tracking-tight text-foreground">{value}</div>
      <div className="mt-1 text-[11px] font-medium leading-tight text-muted-foreground">{label}</div>
    </div>
  );
}
