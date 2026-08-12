"use client";

import {
  ArrowRight,
  Briefcase,
  MagnifyingGlass,
} from "@phosphor-icons/react/dist/ssr";
import { Container, Section, Grid, Stack } from "@/components/primitives/layout";
import { Card } from "@/components/primitives/card";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RequestCard, type RequestCardData } from "@/components/cards/request-card";
import { LEGAL_REQUESTS, SPECIALTIES, DOCUMENT_CATEGORIES, REGIONS } from "@/lib/marketplace/data";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import type { DocumentCategory, Specialty } from "@/lib/marketplace/types";
import { useState } from "react";
import { toast } from "sonner";

function toCardData(
  req: (typeof LEGAL_REQUESTS)[number],
  getCategoryLabel: (c: DocumentCategory | Specialty) => string,
): RequestCardData {
  return {
    id: req.id,
    title: req.titleUz,
    description: req.descriptionUz,
    category: req.category,
    categoryLabel: getCategoryLabel(req.category),
    region: req.region,
    regionLabel: REGIONS[req.region]?.uz ?? req.city,
    city: req.city,
    clientType: req.clientType,
    isUrgent: req.isUrgent,
    statusLabel: req.status === "open" ? "Ochiq" : undefined,
    budgetMin: req.budgetUzs?.min ?? null,
    budgetMax: req.budgetUzs?.max ?? null,
    viewsCount: req.viewsCount,
    responsesCount: req.responsesCount,
    postedAgo: req.postedAgo,
  };
}

export function RequestsPage() {
  const { setPostRequestOpen } = useMarketplaceStore();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");

  const allCats = [
    ...Object.entries(SPECIALTIES).map(([k, v]) => ({ id: k as Specialty, label: v.uz })),
    ...DOCUMENT_CATEGORIES.map((c) => ({ id: c.id as DocumentCategory, label: c.nameUz })),
  ];

  const filtered = LEGAL_REQUESTS.filter((r) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (
        !r.titleUz.toLowerCase().includes(q) &&
        !r.descriptionUz.toLowerCase().includes(q) &&
        !r.city.toLowerCase().includes(q)
      )
        return false;
    }
    if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
    if (clientFilter !== "all" && r.clientType !== clientFilter) return false;
    return true;
  });

  const getCategoryLabel = (cat: DocumentCategory | Specialty) => {
    if (cat in SPECIALTIES) return SPECIALTIES[cat as Specialty].uz;
    return DOCUMENT_CATEGORIES.find((c) => c.id === cat)?.nameUz ?? cat;
  };

  const handleRespond = () => {
    toast.success("Javob yuborildi!", {
      description: "Mijoz javobingizni ko'rib chiqadi va tez orada bog'lanadi.",
    });
  };

  return (
    <Section spacing="md" variant="default" className="!py-8">
      <Container size="xl">
        {/* Page header */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              <Briefcase weight="regular" className="h-7 w-7 text-primary" />
              Huquqiy so'rovlar taxtasi
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Mijozlar tomonidan joylangan so'rovlar. Advokat sifatida javob bering va yangi mijozlar bilan tanishing.
            </p>
          </div>
          <Button onClick={() => setPostRequestOpen(true)} tone="brand" className="gap-1.5">
            So'rov joylash
          </Button>
        </div>

        {/* Search bar */}
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <div className="relative sm:col-span-1">
            <MagnifyingGlass weight="regular" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="So'rov bo'yicha qidiring..."
              className="h-12 pl-12 text-base"
            />
          </div>
          <div>
            <Label className="sr-only">Soha</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-12 w-full">
                <SelectValue placeholder="Soha bo'yicha" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="all">Barcha sohalar</SelectItem>
                {allCats.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="sr-only">Mijoz turi</Label>
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="h-12 w-full">
                <SelectValue placeholder="Mijoz turi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha mijozlar</SelectItem>
                <SelectItem value="individual">Jismoniy shaxslar</SelectItem>
                <SelectItem value="business">Bizneslar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Result count */}
        <p className="mb-4 text-sm text-muted-foreground">
          Topildi: <strong className="text-foreground">{filtered.length}</strong> so'rov
        </p>

        {/* List */}
        {filtered.length === 0 ? (
          <Card className="border-border p-12 text-center">
            <Briefcase weight="regular" className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
            <h3 className="text-base font-bold text-foreground">So'rov topilmadi</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Filtrlarni o'zgartirib qayta urinib ko'ring.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearch("");
                setCategoryFilter("all");
                setClientFilter("all");
              }}
            >
              Filtrlarni tozalash
            </Button>
          </Card>
        ) : (
          <Stack gap="md">
            {filtered.map((req) => (
              <RequestCard
                key={req.id}
                request={toCardData(req, getCategoryLabel)}
                onRespond={handleRespond}
              />
            ))}
          </Stack>
        )}
      </Container>
    </Section>
  );
}
