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
      <div className="absolute inset-0 bg-grid-pattern opacity-40" aria-hidden />
      <div className="pointer-events-none absolute -left-32 top-32 hidden size-96 rounded-full bg-accent/8 blur-3xl lg:block" aria-hidden />
      <div className="pointer-events-none absolute -right-32 top-64 hidden size-96 rounded-full bg-info/8 blur-3xl lg:block" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: editorial copy + search (7/12) */}
          <div className="lg:col-span-7">
            {/* Eyebrow */}
            <div className="rise rise-1 mb-6 flex items-center gap-3 text-xs">
              <span className="font-mono uppercase tracking-[0.2em] text-muted-foreground">
                {new Date().toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span className="h-px flex-1 bg-border" />
              <Badge variant="soft" tone="brand" size="sm">
                <Sparkle className="size-3" weight="fill" />
                O'zbekiston #1 huquqiy marketplace
              </Badge>
            </div>

            {/* Headline */}
            <h1 className="rise rise-2 text-balance font-serif text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Huquqiy masalalarni{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="italic text-accent">bir joyda</span>
                <svg
                  className="absolute -bottom-1 left-0 w-full text-accent"
                  viewBox="0 0 200 8"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M2 5.5C50 2.5 150 2.5 198 5.5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              yeching
            </h1>

            {/* Subtitle */}
            <p className="rise rise-3 mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Tasdiqlangan advokatlarni toping, 700+ tayyor huquqiy hujjat namunalarini
              yuklab oling yoki huquqiy so'rovingizni joylang va bir necha soat ichida
              mutaxassislar javob bersin.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="rise rise-4 mt-10">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Qidiruv turi:
                </span>
                <div className="inline-flex rounded-xl border border-border bg-card p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setMode("advocates")}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium",
                      "transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)]",
                      mode === "advocates"
                        ? "bg-foreground text-background shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Users className="size-3.5" weight={mode === "advocates" ? "fill" : "regular"} />
                    Advokat
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("documents")}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium",
                      "transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)]",
                      mode === "documents"
                        ? "bg-foreground text-background shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <FileText className="size-3.5" weight={mode === "documents" ? "fill" : "regular"} />
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
                    className="pl-12 shadow-beautiful-sm focus-visible:shadow-beautiful-md"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  tone="brand"
                  className="h-12 px-8 text-base shadow-beautiful-md hover:shadow-beautiful-lg"
                >
                  Qidirish
                  <ArrowRight className="size-4" weight="bold" />
                </Button>
              </div>

              {/* Popular tags */}
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
                      "rounded-full border px-3 py-1 text-xs font-medium",
                      "transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)]",
                      "active:scale-[0.98]",
                      i === 0
                        ? "border-accent/40 bg-accent/8 text-accent hover:bg-accent/12"
                        : "border-border bg-card text-muted-foreground hover:border-accent/40 hover:text-accent"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </form>

            {/* Trust badges */}
            <div className="rise rise-5 mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <SealCheck className="size-4 text-accent" weight="fill" />
                Barcha advokatlar litsenziyalangan
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-success" weight="fill" />
                Adliya vazirligi tomonidan tasdiqlangan
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="size-4 text-warning" weight="fill" />
                {PLATFORM_STATS.satisfactionRate}% mijozlar mamnunligi
              </div>
            </div>
          </div>

          {/* Right: stat panel (5/12) */}
          <div className="rise rise-3 lg:col-span-5">
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  Jonli statistika
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-medium text-success">
                  <span className="size-1.5 rounded-full bg-success verified-pulse" />
                  onlayn
                </span>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-beautiful-md">
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <StatBox
                    value={PLATFORM_STATS.advocatesCount.toLocaleString("ru-RU") + "+"}
                    label="Tasdiqlangan advokatlar"
                    icon={<Users className="size-4 text-accent" weight="duotone" />}
                  />
                  <StatBox
                    value={PLATFORM_STATS.documentsCount + "+"}
                    label="Hujjat namunalari"
                    icon={<FileText className="size-4 text-accent" weight="duotone" />}
                  />
                  <StatBox
                    value={PLATFORM_STATS.requestsResolved.toLocaleString("ru-RU") + "+"}
                    label="Yechilgan so'rovlar"
                    icon={<ShieldCheck className="size-4 text-success" weight="duotone" />}
                  />
                  <StatBox
                    value={PLATFORM_STATS.avgResponseHours + " soat"}
                    label="O'rtacha javob"
                    icon={<Star className="size-4 text-warning" weight="duotone" />}
                  />
                </div>

                <div className="mt-6 border-t border-border pt-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Hozir onlayn advokatlar
                    </p>
                    <span className="text-xs font-bold text-foreground font-mono">52</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[12, 45, 33, 44, 68, 20, 49, 51].slice(0, 6).map((n, i) => (
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
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        {icon}
        <span className="size-1.5 rounded-full bg-success" aria-hidden />
      </div>
      <div className="font-serif text-3xl font-bold tracking-tight text-foreground">{value}</div>
      <div className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{label}</div>
    </div>
  );
}
