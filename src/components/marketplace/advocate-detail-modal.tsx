"use client";

import {
  Star,
  BadgeCheck,
  MapPin,
  Clock,
  Briefcase,
  Zap,
  Globe,
  GraduationCap,
  Award,
  MessageSquare,
  Calendar,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { ADVOCATES, SPECIALTIES, REGIONS } from "@/lib/marketplace/data";
import { formatPrice } from "@/lib/marketplace/format";
import { toast } from "sonner";
import { useAppUser } from "@/lib/auth/user-provider";
import { openChatWith } from "@/components/chat/chat-panel";

export function AdvocateDetailModal() {
  const { activeAdvocate, setActiveAdvocate, setPostRequestOpen, setAuthOpen } = useMarketplaceStore();
  const { user } = useAppUser();

  const adv = activeAdvocate;
  const isOpen = adv !== null;

  const handleClose = () => setActiveAdvocate(null);

  // Find the advocate's user record — the API now returns `userId` for direct chat lookup
  const handleContact = () => {
    console.log("[advocate-modal] handleContact called", { adv: !!adv, user: !!user, userId: user?.id });
    if (!adv) return;
    if (!user) {
      toast.info("Avval tizimga kiring", {
        description: "Advokat bilan bog'lanish uchun hisobingiz bo'lishi shart.",
      });
      setAuthOpen(true, "signin");
      return;
    }
    // API returns userId; fallback to adv.id for legacy data
    const advocateUserId = (adv as { userId?: string }).userId ?? adv.id;
    console.log("[advocate-modal] opening chat with:", advocateUserId);
    openChatWith(advocateUserId, adv.name);
    handleClose();
  };

  const handlePostRequest = () => {
    console.log("[advocate-modal] handlePostRequest called");
    handleClose();
    setPostRequestOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto p-0 scrollbar-thin">
        {adv && (
          <>
            {/* Header banner */}
            <div className="relative bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
              <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-20" aria-hidden />
              <div className="relative flex items-start gap-4">
                <div className="relative shrink-0">
                  <img
                    src={adv.photo}
                    alt={adv.name}
                    className="h-20 w-20 rounded-2xl border-2 border-white/30 object-cover"
                  />
                  {adv.online && (
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-emerald-500 text-[10px] font-bold text-white">
                      ●
                    </span>
                  )}
                </div>
                <div className="flex-1 pr-6">
                  <div className="flex items-center gap-2">
                    <DialogTitle className="text-xl font-bold text-primary-foreground">
                      {adv.name}
                    </DialogTitle>
                    {adv.verified && (
                      <BadgeCheck className="h-5 w-5 text-accent" aria-label="Tasdiqlangan" />
                    )}
                    {adv.topRated && (
                      <Badge className="bg-accent text-accent-foreground text-xs">TOP-10</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-primary-foreground/80">{adv.titleUz}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-primary-foreground/90">
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                      <strong>{adv.rating}</strong> ({adv.reviewsCount} sharh)
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {REGIONS[adv.region].uz}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {adv.responseTimeHours} soat javob
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" />
                      {adv.experienceYears} yil tajriba
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3">
                <StatBox value={`${adv.experienceYears}`} label="Yil tajriba" />
                <StatBox value={`${adv.casesResolved}`} label="Yechilgan ishlar" />
                <StatBox value={`${adv.successRate}%`} label="Muvaffaqiyat" />
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button
                  onClick={handleContact}
                  className="flex-1 gap-1.5"
                  size="lg"
                >
                  <MessageSquare className="h-4 w-4" />
                  To'g'ridan-to'g'ri bog'lanish
                </Button>
                <Button
                  onClick={handlePostRequest}
                  variant="outline"
                  className="flex-1 gap-1.5"
                  size="lg"
                >
                  <Calendar className="h-4 w-4" />
                  Konsultatsiya bron qilish
                </Button>
              </div>

              {/* Bio */}
              <DialogHeader className="mt-6 text-left">
                <DialogTitle className="flex items-center gap-2 text-base">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Biografiya
                </DialogTitle>
              </DialogHeader>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">{adv.bioUz}</p>

              {/* Expertise */}
              <DialogHeader className="mt-6 text-left">
                <DialogTitle className="flex items-center gap-2 text-base">
                  <Award className="h-4 w-4 text-primary" />
                  Mutaxassislik sohalari
                </DialogTitle>
              </DialogHeader>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge className="gap-1">
                  {SPECIALTIES[adv.specialty].uz}
                </Badge>
                {(adv.secondarySpecialties ?? []).map((s) => (
                  <Badge key={s} variant="outline" className="gap-1">
                    {SPECIALTIES[s].uz}
                  </Badge>
                ))}
              </div>

              {/* Specific expertise */}
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(adv.expertise ?? []).map((e) => (
                  <div key={e} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span className="text-foreground/90">{e}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              {/* Education */}
              <DialogHeader className="text-left">
                <DialogTitle className="flex items-center gap-2 text-base">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Ta'lim
                </DialogTitle>
              </DialogHeader>
              <div className="mt-2 space-y-2">
                {(adv.education ?? []).map((ed, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-border bg-secondary/40 p-3"
                  >
                    <div className="text-sm font-semibold text-foreground">{ed.degree}</div>
                    <div className="text-xs text-muted-foreground">
                      {ed.institution} · {ed.year}
                    </div>
                  </div>
                ))}
                {(!adv.education || adv.education.length === 0) && (
                  <div className="rounded-lg border border-dashed border-border bg-secondary/20 p-3 text-xs text-muted-foreground">
                    Ta'lim ma'lumotlari ko'rsatilmagan
                  </div>
                )}
              </div>

              {/* Languages & License */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-3">
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Globe className="h-3.5 w-3.5" />
                    Tillar
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(adv.languages ?? []).map((l) => (
                      <Badge key={l} variant="secondary" className="text-xs uppercase">
                        {l}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-card p-3">
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Litsenziya
                  </div>
                  <div className="text-sm font-mono font-semibold text-foreground">
                    {adv.licenseNumber}
                  </div>
                  <div className="mt-0.5 text-xs text-emerald-600">
                    ✓ O'zR Adliya vazirligi tomonidan tasdiqlangan
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Pricing */}
              <DialogHeader className="text-left">
                <DialogTitle className="flex items-center gap-2 text-base">
                  <Zap className="h-4 w-4 text-accent" />
                  Narxlar
                </DialogTitle>
              </DialogHeader>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Konsultatsiya
                  </div>
                  <div className="mt-1 text-2xl font-bold text-foreground">
                    {formatPrice(
                      typeof adv.consultationFee === "number"
                        ? adv.consultationFee
                        : adv.consultationFee?.amount ?? 0,
                      typeof adv.consultationFee === "number"
                        ? "UZS"
                        : adv.consultationFee?.currency ?? "UZS"
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">1 soat uchun</div>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Soatlik ish haqi
                  </div>
                  <div className="mt-1 text-2xl font-bold text-foreground">
                    {formatPrice(
                      typeof adv.hourlyFee === "number"
                        ? adv.hourlyFee
                        : adv.hourlyFee?.amount ?? 0,
                      typeof adv.hourlyFee === "number"
                        ? "UZS"
                        : adv.hourlyFee?.currency ?? "UZS"
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">Murakkab ishlar uchun</div>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 text-center">
      <div className="text-xl font-bold text-foreground">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
