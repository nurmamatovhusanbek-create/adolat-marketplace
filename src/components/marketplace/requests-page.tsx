"use client";

import {
  MapPin,
  Clock,
  Eye,
  MessageSquare,
  ArrowRight,
  Building2,
  User,
  Flame,
  Wallet,
  Briefcase,
  Search,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { LEGAL_REQUESTS, SPECIALTIES, DOCUMENT_CATEGORIES, REGIONS } from "@/lib/marketplace/data";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { formatPrice } from "@/lib/marketplace/format";
import type { DocumentCategory, Specialty } from "@/lib/marketplace/types";
import { useState } from "react";
import { toast } from "sonner";

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            <Briefcase className="h-7 w-7 text-primary" />
            Huquqiy so'rovlar taxtasi
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Mijozlar tomonidan joylangan so'rovlar. Advokat sifatida javob bering va yangi mijozlar bilan tanishing.
          </p>
        </div>
        <Button
          onClick={() => setPostRequestOpen(true)}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          So'rov joylash
        </Button>
      </div>

      {/* Search bar */}
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="relative sm:col-span-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
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
          <Briefcase className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
          <h3 className="text-base font-bold text-foreground">So'rov topilmadi</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Filtrlarni o'zgartirib qayta urinib ko'ring.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => (
            <Card
              key={req.id}
              className="border-border p-5 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary" className="text-[11px]">
                      {getCategoryLabel(req.category)}
                    </Badge>
                    {req.isUrgent && (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-[11px]">
                        <Flame className="mr-0.5 h-3 w-3" />
                        Shoshilinch
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-[11px]">
                      {req.clientType === "business" ? (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" /> Biznes
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" /> Jismoniy shaxs
                        </span>
                      )}
                    </Badge>
                    {req.status === "open" && (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[11px]">
                        Ochiq
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-base font-bold leading-snug text-foreground">
                    {req.titleUz}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                    {req.descriptionUz}
                  </p>

                  {req.budgetUzs && (
                    <div className="mt-2.5 inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-1.5 text-xs">
                      <Wallet className="h-4 w-4 text-emerald-700" />
                      <span className="font-semibold text-emerald-700">Byudjet:</span>
                      <span className="text-emerald-800">
                        {formatPrice(req.budgetUzs.min)} — {formatPrice(req.budgetUzs.max)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2 sm:w-44">
                  <Button size="sm" onClick={handleRespond} className="gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Javob berish
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-1 text-xs text-primary">
                    Tafsilotlar
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {REGIONS[req.region].uz}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {req.postedAgo}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {req.viewsCount} ko'rish
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {req.responsesCount} javob
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
