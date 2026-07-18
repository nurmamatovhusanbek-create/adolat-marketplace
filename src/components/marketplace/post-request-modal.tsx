"use client";

import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  PaperPlaneTilt,
  Sparkle,
  BuildingOffice,
  User,
  Clock,
  Fire,
  Envelope,
  Phone,
  CaretRight,
  Check,
} from "@phosphor-icons/react/dist/ssr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { SPECIALTIES, REGIONS, DOCUMENT_CATEGORIES } from "@/lib/marketplace/data";
import type { Specialty, Region, DocumentCategory } from "@/lib/marketplace/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STEPS = ["So'rov turi", "Tafsilotlar", "Byudjet", "Bog'lanish"];

export function PostRequestModal() {
  const { isPostRequestOpen, setPostRequestOpen } = useMarketplaceStore();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [requestType, setRequestType] = useState<"advocate" | "document">("advocate");
  const [clientType, setClientType] = useState<"individual" | "business">("individual");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleClose = () => {
    setPostRequestOpen(false);
    setTimeout(() => {
      setStep(0);
      setSubmitted(false);
      setSubmitting(false);
    }, 200);
  };

  const canProceed = () => {
    if (step === 0) return requestType && clientType;
    if (step === 1) return title.length > 5 && description.length > 15 && category && region;
    if (step === 2) return true;
    if (step === 3) return name.length > 1 && phone.length > 5;
    return false;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        title,
        description,
        category,
        region,
        city: region === "tashkent-city" ? "Toshkent" : "Toshkent viloyati",
        clientType: clientType as "individual" | "business",
        isUrgent,
        requestType: requestType as "advocate" | "document",
        budgetMin: budgetMin ? parseInt(budgetMin) : undefined,
        budgetMax: budgetMax ? parseInt(budgetMax) : undefined,
        contactName: name,
        contactPhone: phone,
        contactEmail: email || undefined,
        csrfToken: "client-side",
      };

      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "So'rov joylanmadi");
      }

      setSubmitted(true);
      toast.success("So'rovingiz muvaffaqiyatli joylandi!", {
        description: "Advokatlar 1-2 soat ichida javob berishni boshlaydi.",
      });
    } catch (err) {
      toast.error("So'rov joylanmadi", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isPostRequestOpen} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent size="2xl" className="p-0">
        {submitted ? (
          /* Success state */
          <div className="rise rise-1 flex flex-col items-center gap-4 p-10 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="size-9 text-success" weight="duotone" />
            </div>
            <DialogTitle className="text-2xl font-bold text-foreground">
              So'rovingiz joylandi!
            </DialogTitle>
            <DialogDescription className="max-w-md text-sm">
              <strong className="text-foreground">{title || "So'rovingiz"}</strong> endi
              so'rovlar taxtasida ko'rinadi. Tasdiqlangan advokatlar 1-2 soat ichida
              javob berishni boshlaydi.
            </DialogDescription>
            <div className="grid w-full max-w-md grid-cols-3 gap-3">
              <Stat label="Kutilayotgan javoblar" value="3-8" />
              <Stat label="O'rtacha vaqt" value="1.5 soat" />
              <Stat label="Bepul" value="0 so'm" />
            </div>
            <Button onClick={handleClose} size="lg" className="mt-2">
              Yopish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col max-h-[calc(100vh-2rem)]">
            {/* Header */}
            <DialogHeader className="p-6 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <DialogTitle className="flex items-center gap-2.5">
                    <Sparkle className="size-5 text-accent" weight="duotone" />
                    Huquqiy so'rov joylash
                  </DialogTitle>
                  <DialogDescription className="mt-1.5">
                    So'rovingizni joylang va advokatlar siz bilan bog'lanadi. Butunlay bepul.
                  </DialogDescription>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                  Qadam {step + 1} / {STEPS.length}
                </div>
              </div>

              {/* Step indicator */}
              <div className="mt-5 flex items-center gap-1.5">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex flex-1 items-center gap-1.5">
                    <div
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full text-xs font-bold transition-colors duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                        i < step
                          ? "bg-success text-white"
                          : i === step
                            ? "bg-foreground text-background ring-2 ring-accent/40 ring-offset-2 ring-offset-background"
                            : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {i < step ? <Check className="size-4" weight="bold" /> : i + 1}
                    </div>
                    <span
                      className={cn(
                        "hidden text-xs font-medium transition-colors duration-200 ease-[cubic-bezier(0.2,0,0,1)] sm:inline",
                        i === step ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {s}
                    </span>
                    {i < STEPS.length - 1 && (
                      <div
                        className={cn(
                          "h-0.5 flex-1 rounded-full transition-colors duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
                          i < step ? "bg-success" : "bg-border"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            </DialogHeader>

            {/* Body — 2-column layout on desktop */}
            <DialogBody className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
              {/* Left: form */}
              <div className="space-y-5">
                {step === 0 && (
                  <div className="space-y-5">
                    <div>
                      <Label className="mb-2.5 text-sm font-semibold">Qanday yordam kerak?</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <TypeCard
                          selected={requestType === "advocate"}
                          onClick={() => setRequestType("advocate")}
                          icon={<User className="size-5" weight="duotone" />}
                          title="Advokat kerak"
                          description="Murakkab huquqiy masala uchun mutaxassis"
                        />
                        <TypeCard
                          selected={requestType === "document"}
                          onClick={() => setRequestType("document")}
                          icon={<BuildingOffice className="size-5" weight="duotone" />}
                          title="Hujjat kerak"
                          description="Tayyor namuna yoki konstruktorda hujjat"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="mb-2.5 text-sm font-semibold">Siz kim?</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <TypeCard
                          selected={clientType === "individual"}
                          onClick={() => setClientType("individual")}
                          icon={<User className="size-5" weight="duotone" />}
                          title="Jismoniy shaxs"
                          description="Fuqaro, o'zim uchun"
                        />
                        <TypeCard
                          selected={clientType === "business"}
                          onClick={() => setClientType("business")}
                          icon={<BuildingOffice className="size-5" weight="duotone" />}
                          title="Biznes"
                          description="Kompaniya uchun"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-sm font-semibold">
                        So'rov sarlavhasi
                      </Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Masalan: Oilaviy nizo bo'yicha advokat kerak"
                        className="mt-1.5"
                      />
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        Qisqa va aniq sarlavha yozing — advokatlar shu bo'yicha qaror qiladi.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-sm font-semibold">
                        Vaziyat tavsifi
                      </Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Masalani batafsil tushuntiring: nima yuz berdi, qachon, kim ishtirok etdi, qanday natija kutyapsiz..."
                        rows={4}
                        className="mt-1.5 resize-none"
                      />
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        Kamida 15 ta belgi. Shaxsiy ma'lumotlarni kiritmang.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <Label className="text-sm font-semibold">Huquq sohasi</Label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="Tanlang" />
                          </SelectTrigger>
                          <SelectContent className="max-h-72">
                            {requestType === "advocate"
                              ? Object.entries(SPECIALTIES).map(([k, v]) => (
                                  <SelectItem key={k} value={k}>
                                    {v.uz}
                                  </SelectItem>
                                ))
                              : DOCUMENT_CATEGORIES.map((c) => (
                                  <SelectItem key={c.id} value={c.id}>
                                    {c.nameUz}
                                  </SelectItem>
                                ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Shahar / Viloyat</Label>
                        <Select value={region} onValueChange={setRegion}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="Tanlang" />
                          </SelectTrigger>
                          <SelectContent className="max-h-72">
                            {Object.entries(REGIONS).map(([k, v]) => (
                              <SelectItem key={k} value={k}>
                                {v.uz}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-warning/30 bg-warning/5 p-4">
                      <div className="flex items-center gap-3">
                        <Fire className="size-5 text-warning" weight="duotone" />
                        <div>
                          <div className="text-sm font-semibold text-foreground">Shoshilinch so'rov</div>
                          <div className="text-xs text-muted-foreground">
                            Advokatlarga ustuvor ko'rsatiladi (+50% ko'rish)
                          </div>
                        </div>
                      </div>
                      <Switch checked={isUrgent} onCheckedChange={setIsUrgent} />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <div>
                      <Label className="text-sm font-semibold">Byudjet oralig'i (so'm)</Label>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Ixtiyoriy. Aniq byudjet advokatlarga tezroq javob berishga yordam beradi.
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="min" className="text-xs text-muted-foreground">
                            Minimal
                          </Label>
                          <Input
                            id="min"
                            type="number"
                            value={budgetMin}
                            onChange={(e) => setBudgetMin(e.target.value)}
                            placeholder="500000"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="max" className="text-xs text-muted-foreground">
                            Maksimal
                          </Label>
                          <Input
                            id="max"
                            type="number"
                            value={budgetMax}
                            onChange={(e) => setBudgetMax(e.target.value)}
                            placeholder="2000000"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2.5 text-sm font-semibold">Tezkor variantlar</Label>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {[
                          { label: "Bepul konsultatsiya", min: "0", max: "0" },
                          { label: "500k — 1 mln", min: "500000", max: "1000000" },
                          { label: "1 — 3 mln", min: "1000000", max: "3000000" },
                          { label: "3 — 5 mln", min: "3000000", max: "5000000" },
                          { label: "5+ mln", min: "5000000", max: "10000000" },
                          { label: "Kelishilgan", min: "", max: "" },
                        ].map((b) => (
                          <button
                            key={b.label}
                            onClick={() => {
                              setBudgetMin(b.min);
                              setBudgetMax(b.max);
                            }}
                            className={cn(
                              "rounded-lg border bg-card px-3 py-2 text-xs font-medium transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)] active:scale-[0.98]",
                              (budgetMin === b.min && budgetMax === b.max)
                                ? "border-accent bg-accent/10 text-accent"
                                : "border-border text-muted-foreground hover:border-accent/40 hover:text-accent"
                            )}
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl bg-secondary/60 p-4 text-xs text-muted-foreground">
                      <Clock className="mr-1 inline size-3.5 text-accent" weight="duotone" />
                      Tip: ko'pchilik advokatlar 30 daqiqalik bepul konsultatsiyani taklif
                      qiladi. Avval bepul suhbat o'tkazishni so'rashingiz mumkin.
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-semibold">
                        Ismingiz
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="F.I.O"
                        className="mt-1.5"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="phone" className="text-sm font-semibold">
                          Telefon
                        </Label>
                        <div className="relative mt-1.5">
                          <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" weight="regular" />
                          <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+998 90 123 45 67"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-semibold">
                          Email
                        </Label>
                        <div className="relative mt-1.5">
                          <Envelope className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" weight="regular" />
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-secondary/40 p-4 text-xs text-muted-foreground">
                      <p>
                        <strong className="text-foreground">Maxfiyat kafolati:</strong> Sizning
                        telefon raqamingiz advokatga faqat uning taklifini qabul qilganingizdan
                        keyin ko'rsatiladi.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: live summary sidebar (desktop only) */}
              <aside className="hidden lg:block">
                <div className="sticky top-0 rounded-xl border border-border/60 bg-secondary/40 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                      So'rov xulosasi
                    </span>
                  </div>
                  <div className="space-y-2.5 text-sm">
                    <SummaryRow label="Tur" value={requestType === "advocate" ? "Advokat kerak" : "Hujjat kerak"} />
                    <SummaryRow label="Sarlavha" value={title || "—"} />
                    <SummaryRow
                      label="Soha"
                      value={
                        SPECIALTIES[category as Specialty]?.uz ??
                        DOCUMENT_CATEGORIES.find((c) => c.id === (category as DocumentCategory))?.nameUz ??
                        "—"
                      }
                    />
                    <SummaryRow label="Viloyat" value={REGIONS[region as Region]?.uz ?? "—"} />
                    <SummaryRow
                      label="Byudjet"
                      value={
                        budgetMin && budgetMax
                          ? `${Number(budgetMin).toLocaleString("ru-RU")} — ${Number(budgetMax).toLocaleString("ru-RU")} so'm`
                          : "Ko'rsatilmagan"
                      }
                    />
                    <SummaryRow label="Shoshilinch" value={isUrgent ? "Ha" : "Yo'q"} />
                  </div>

                  <div className="mt-5 border-t border-border pt-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="size-3.5 text-success" weight="duotone" />
                      Bepul so'rov
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="size-3.5 text-accent" weight="duotone" />
                      1-2 soat ichida javob
                    </div>
                  </div>
                </div>
              </aside>
            </DialogBody>

            {/* Footer */}
            <DialogFooter className="p-6 pt-4">
              <Button
                variant="ghost"
                onClick={() => (step === 0 ? handleClose() : setStep(step - 1))}
              >
                <ArrowLeft className="size-4" weight="regular" />
                {step === 0 ? "Bekor qilish" : "Orqaga"}
              </Button>
              <div className="flex-1" />
              {step < STEPS.length - 1 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                >
                  Keyingisi
                  <ArrowRight className="size-4" weight="bold" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed() || submitting}
                  loading={submitting}
                  tone="brand"
                >
                  {!submitting && <PaperPlaneTilt className="size-4" weight="fill" />}
                  So'rovni joylash
                </Button>
              )}
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function TypeCard({
  selected,
  onClick,
  icon,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)] active:scale-[0.99]",
        selected
          ? "border-accent bg-accent/5 shadow-beautiful-sm"
          : "border-border bg-card hover:border-accent/40"
      )}
    >
      <div
        className={cn(
          "flex size-9 items-center justify-center rounded-lg transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)]",
          selected ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
        )}
      >
        {icon}
      </div>
      <div className="text-sm font-bold text-foreground">{title}</div>
      <div className="text-xs text-muted-foreground">{description}</div>
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <div className="font-serif text-base font-bold text-foreground">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-right font-medium text-foreground text-xs max-w-[180px] truncate">{value}</span>
    </div>
  );
}
