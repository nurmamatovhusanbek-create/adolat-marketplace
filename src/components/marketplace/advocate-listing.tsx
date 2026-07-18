"use client";

import { useMemo } from "react";
import {
  Briefcase,
  ChatCircle,
  Clock,
  Lightning,
  MagnifyingGlass,
  MapPin,
  SealCheck,
  SlidersHorizontal,
  Star,
  TrendUp,
  Users,
  Wallet,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ADVOCATES, SPECIALTIES, REGIONS } from "@/lib/marketplace/data";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { formatPrice } from "@/lib/marketplace/format";
import type { Advocate, Specialty, Region } from "@/lib/marketplace/types";
import { openChatWith } from "@/components/chat/chat-panel";
import { cn } from "@/lib/utils";

export function AdvocateListing() {
  const store = useMarketplaceStore();
  const {
    advocateSearch,
    advocateSpecialty,
    advocateRegion,
    advocateSortBy,
    advocateOnlyVerified,
    advocateOnlyOnline,
    setAdvocateSearch,
    setAdvocateSpecialty,
    setAdvocateRegion,
    setAdvocateSortBy,
    setAdvocateOnlyVerified,
    setAdvocateOnlyOnline,
    resetAdvocateFilters,
    setActiveAdvocate,
  } = store;

  const filtered = useMemo(() => {
    let list = [...ADVOCATES];

    if (advocateSearch.trim()) {
      const q = advocateSearch.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.titleUz.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.expertise.some((e) => e.toLowerCase().includes(q))
      );
    }

    if (advocateSpecialty !== "all") {
      list = list.filter(
        (a) =>
          a.specialty === advocateSpecialty ||
          a.secondarySpecialties.includes(advocateSpecialty as Specialty)
      );
    }

    if (advocateRegion !== "all") {
      list = list.filter((a) => a.region === advocateRegion);
    }

    if (advocateOnlyVerified) list = list.filter((a) => a.verified);
    if (advocateOnlyOnline) list = list.filter((a) => a.online);

    // Sort
    switch (advocateSortBy) {
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "experience":
        list.sort((a, b) => b.experienceYears - a.experienceYears);
        break;
      case "price-asc":
        list.sort((a, b) => a.consultationFee.amount - b.consultationFee.amount);
        break;
      case "price-desc":
        list.sort((a, b) => b.consultationFee.amount - a.consultationFee.amount);
        break;
      case "response":
        list.sort((a, b) => a.responseTimeHours - b.responseTimeHours);
        break;
    }

    return list;
  }, [
    advocateSearch,
    advocateSpecialty,
    advocateRegion,
    advocateOnlyVerified,
    advocateOnlyOnline,
    advocateSortBy,
  ]);

  const activeFiltersCount =
    (advocateSpecialty !== "all" ? 1 : 0) +
    (advocateRegion !== "all" ? 1 : 0) +
    (advocateOnlyVerified ? 1 : 0) +
    (advocateOnlyOnline ? 1 : 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          <Users weight="regular" className="h-7 w-7 text-accent" />
          Advokatlar katalogi
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {ADVOCATES.length} tasdiqlangan advokat orasidan o'zingizga mosini toping
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <MagnifyingGlass weight="regular" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={advocateSearch}
            onChange={(e) => setAdvocateSearch(e.target.value)}
            placeholder="Ism, soha yoki shahar bo'yicha qidiring..."
            className="h-12 pl-12 text-base"
          />
        </div>

        {/* Mobile filter trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden" size="lg">
              <SlidersHorizontal weight="regular" className="h-5 w-5" />
              {activeFiltersCount > 0 && (
                <Badge className="ml-1 h-5 min-w-5 justify-center bg-foreground text-background text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] overflow-y-auto p-0">
            <SheetHeader className="border-b p-4">
              <SheetTitle>Filtrlar</SheetTitle>
            </SheetHeader>
            <FilterPanel
              specialty={advocateSpecialty}
              region={advocateRegion}
              onlyVerified={advocateOnlyVerified}
              onlyOnline={advocateOnlyOnline}
              onSpecialty={setAdvocateSpecialty}
              onRegion={setAdvocateRegion}
              onOnlyVerified={setAdvocateOnlyVerified}
              onOnlyOnline={setAdvocateOnlyOnline}
              onReset={resetAdvocateFilters}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Layout: sidebar + main */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Sidebar - desktop */}
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-20">
            <Card className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-1.5 text-sm font-bold">
                  <SlidersHorizontal weight="regular" className="h-4 w-4 text-accent" />
                  Filtrlash
                </h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetAdvocateFilters}
                    className="flex items-center gap-1 text-xs text-accent hover:underline"
                  >
                    <X weight="regular" className="h-3 w-3" />
                    Tozalash ({activeFiltersCount})
                  </button>
                )}
              </div>
              <FilterPanel
                specialty={advocateSpecialty}
                region={advocateRegion}
                onlyVerified={advocateOnlyVerified}
                onlyOnline={advocateOnlyOnline}
                onSpecialty={setAdvocateSpecialty}
                onRegion={setAdvocateRegion}
                onOnlyVerified={setAdvocateOnlyVerified}
                onOnlyOnline={setAdvocateOnlyOnline}
                onReset={resetAdvocateFilters}
              />
            </Card>
          </div>
        </aside>

        {/* Results */}
        <div className="lg:col-span-9">
          {/* Sort bar */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Topildi: <strong className="text-foreground">{filtered.length}</strong> advokat
            </p>
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">Saralash:</Label>
              <Select value={advocateSortBy} onValueChange={(v) => setAdvocateSortBy(v as typeof advocateSortBy)}>
                <SelectTrigger className="h-9 w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Reyting bo'yicha</SelectItem>
                  <SelectItem value="experience">Tajriba bo'yicha</SelectItem>
                  <SelectItem value="response">Tez javob</SelectItem>
                  <SelectItem value="price-asc">Arzon narx</SelectItem>
                  <SelectItem value="price-desc">Qimmat narx</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results list */}
          {filtered.length === 0 ? (
            <Card className="p-12 text-center">
              <Users weight="regular" className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
              <h3 className="text-base font-bold text-foreground">Advokat topilmadi</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Filtrlarni o'zgartirib qayta urinib ko'ring.
              </p>
              <Button onClick={resetAdvocateFilters} variant="outline" className="mt-4">
                Filtrlarni tozalash
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {filtered.map((adv) => (
                <AdvocateListItem key={adv.id} adv={adv} onSelect={() => setActiveAdvocate(adv)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdvocateListItem({ adv, onSelect }: { adv: Advocate; onSelect: () => void }) {
  const spec = SPECIALTIES[adv.specialty];
  return (
    <Card className="p-5 hover:-translate-y-0.5 hover:shadow-beautiful-md hover:border-accent/30 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Photo */}
        <div className="flex shrink-0 items-start gap-3 sm:flex-col sm:items-center">
          <div className="relative">
            <img
              src={adv.photo}
              alt={adv.name}
              className="h-16 w-16 rounded-xl border border-border object-cover"
            />
            {adv.online && (
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-emerald-500" />
            )}
          </div>
        </div>

        {/* Main info */}
        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onSelect}
                  className="text-base font-bold text-foreground hover:text-accent sm:text-lg"
                >
                  {adv.name}
                </button>
                {adv.verified && <SealCheck weight="fill" className="h-4 w-4 text-accent" />}
                {adv.topRated && (
                  <Badge className="bg-accent text-accent-foreground text-[10px]">TOP-10</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{adv.titleUz}</p>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  <Star weight="fill" className="h-3.5 w-3.5 fill-accent text-accent" />
                  <strong className="text-foreground">{adv.rating}</strong>
                  <span>({adv.reviewsCount})</span>
                </span>
                <span className="flex items-center gap-0.5">
                  <MapPin weight="regular" className="h-3.5 w-3.5" />
                  {adv.city}
                </span>
                <span className="flex items-center gap-0.5">
                  <Clock weight="regular" className="h-3.5 w-3.5" />
                  {adv.responseTimeHours} soat javob
                </span>
                <span className="flex items-center gap-0.5">
                  <Briefcase weight="regular" className="h-3.5 w-3.5" />
                  {adv.experienceYears} yil
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Konsultatsiya
              </div>
              <div className="text-base font-bold text-foreground">
                dan {formatPrice(adv.consultationFee.amount, adv.consultationFee.currency)}
              </div>
              <div
                className={cn(
                  "mt-1 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium",
                  adv.responseTimeHours <= 1
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                )}
              >
                <Lightning weight="fill" className="h-2.5 w-2.5" />
                {adv.responseTimeHours} soat javob
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-[11px]">
              {spec.uz}
            </Badge>
            {adv.secondarySpecialties.slice(0, 2).map((s) => (
              <Badge key={s} variant="outline" className="text-[11px]">
                {SPECIALTIES[s].uz}
              </Badge>
            ))}
          </div>

          {/* Expertise preview */}
          <p className="mt-2.5 line-clamp-1 text-xs text-muted-foreground">
            <strong className="text-foreground">Mutaxassislik:</strong>{" "}
            {adv.expertise.slice(0, 4).join(" · ")}
          </p>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <TrendUp weight="regular" className="h-3.5 w-3.5 text-emerald-600" />
                {adv.successRate}% muvaffaqiyat
              </span>
              <span>{adv.casesResolved}+ ish</span>
              <span className="flex items-center gap-1">
                <Wallet weight="regular" className="h-3.5 w-3.5" />
                {adv.languages.map((l) => l.toUpperCase()).join(" · ")}
              </span>
            </div>
            <div className="flex gap-1.5">
              <Button size="sm" variant="outline" onClick={onSelect} className="h-8">
                Profil
              </Button>
              <Button size="sm" onClick={() => openChatWith(adv.userId ?? adv.id, adv.name)} className="h-8 gap-1">
                <ChatCircle weight="regular" className="h-3.5 w-3.5" />
                Bog'lanish
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function FilterPanel({
  specialty,
  region,
  onlyVerified,
  onlyOnline,
  onSpecialty,
  onRegion,
  onOnlyVerified,
  onOnlyOnline,
  onReset,
}: {
  specialty: Specialty | "all";
  region: Region | "all";
  onlyVerified: boolean;
  onlyOnline: boolean;
  onSpecialty: (s: Specialty | "all") => void;
  onRegion: (r: Region | "all") => void;
  onOnlyVerified: (v: boolean) => void;
  onOnlyOnline: (v: boolean) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-5">
      {/* Specialty */}
      <div>
        <Label className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Huquq sohasi
        </Label>
        <Select value={specialty} onValueChange={(v) => onSpecialty(v as Specialty | "all")}>
          <SelectTrigger className="h-9 w-full">
            <SelectValue placeholder="Barchasi" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="all">Barchasi</SelectItem>
            {Object.entries(SPECIALTIES).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v.uz}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Region */}
      <div>
        <Label className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Viloyat
        </Label>
        <Select value={region} onValueChange={(v) => onRegion(v as Region | "all")}>
          <SelectTrigger className="h-9 w-full">
            <SelectValue placeholder="Barchasi" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="all">Barchasi</SelectItem>
            {Object.entries(REGIONS).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v.uz}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Toggles */}
      <div className="space-y-2.5">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Qo'shimcha
        </Label>
        <div className="flex items-center justify-between rounded-md border border-border bg-card p-2.5">
          <Label htmlFor="verified" className="cursor-pointer text-sm">
            Tasdiqlanganlar
          </Label>
          <Switch id="verified" checked={onlyVerified} onCheckedChange={onOnlyVerified} />
        </div>
        <div className="flex items-center justify-between rounded-md border border-border bg-card p-2.5">
          <Label htmlFor="online" className="cursor-pointer text-sm">
            Hozir onlayn
          </Label>
          <Switch id="online" checked={onlyOnline} onCheckedChange={onOnlyOnline} />
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={onReset} className="w-full">
        Filtrlarni tozalash
      </Button>
    </div>
  );
}
