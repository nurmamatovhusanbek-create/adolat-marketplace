"use client";

import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Send,
  Sparkles,
  Building2,
  User,
  Clock,
  Flame,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

const STEPS = ["So'rov turi", "Tafsilotlar", "Byudjet", "Bog'lanish"];

export function PostRequestModal() {
  const { isPostRequestOpen, setPostRequestOpen } = useMarketplaceStore();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
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
    // Reset after a moment
    setTimeout(() => {
      setStep(0);
      setSubmitted(false);
      setSubmitting(false);
    }, 200);
  };

  const canProceed = () => {
    if (step === 0) return requestType && clientType;
    if (step === 1) return title.length > 5 && description.length > 15 && category && region;
    if (step === 2) return true; // budget optional
    if (step === 3) return name.length > 1 && phone.length > 5;
    return false;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Determine category — if advocate request, use a specialty; else a doc category
      const finalCategory = category;
      // Convert requestType to API field
      const payload = {
        title,
        description,
        category: finalCategory,
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
      <DialogContent className="w-[98vw] max-w-[98vw] h-[98vh] max-h-[98vh] overflow-y-auto p-0 scrollbar-thin">
        {submitted ? (
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-foreground">
              So'rovingiz joylandi!
            </DialogTitle>
            <p className="max-w-md text-sm text-muted-foreground">
              <strong className="text-foreground">{title || "So'rovingiz"}</strong> endi
              so'rovlar taxtasida ko'rinadi. Tasdiqlangan advokatlar 1-2 soat ichida
              javob berishni boshlaydi. Sizga xabar kelganda elektron pochta orqali
              xabardor qilamiz.
            </p>
            <div className="grid w-full grid-cols-3 gap-3">
              <Stat label="Kutilayotgan javoblar" value="3-8" />
              <Stat label="O'rtacha vaqt" value="1.5 soat" />
              <Stat label="Bepul" value="0 so'm" />
            </div>
            <Button onClick={handleClose} className="mt-2 w-full sm:w-auto">
              Yopish
            </Button>
          </div>
        ) : (
          <>
            {/* Header with steps */}
            <div className="border-b border-border bg-secondary/40 p-6">
              <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                <Sparkles className="h-5 w-5 text-accent" />
                Huquqiy so'rov joylash
              </DialogTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                So'rovingizni joylang va advokatlar siz bilan bog'lanadi. Butunlay bepul.
              </p>

              {/* Step indicator */}
              <div className="mt-4 flex items-center gap-1.5">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex flex-1 items-center gap-1.5">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                        i < step
                          ? "bg-emerald-600 text-white"
                          : i === step
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary-foreground/10 text-muted-foreground"
                      }`}
                    >
                      {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </div>
                    <span
                      className={`hidden text-xs font-medium sm:inline ${
                        i === step ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {s}
                    </span>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 rounded ${
                          i < step ? "bg-emerald-600" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step body */}
            <div className="p-6">
              {step === 0 && (
                <div className="space-y-5">
                  <div>
                    <Label className="mb-2 text-sm font-semibold">Qanday yordam kerak?</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <TypeCard
                        selected={requestType === "advocate"}
                        onClick={() => setRequestType("advocate")}
                        icon={<User className="h-5 w-5" />}
                        title="Advokat kerak"
                        description="Murakkab huquqiy masala uchun mutaxassis"
                      />
                      <TypeCard
                        selected={requestType === "document"}
                        onClick={() => setRequestType("document")}
                        icon={<Building2 className="h-5 w-5" />}
                        title="Hujjat kerak"
                        description="Tayyor namuna yoki konstruktorda hujjat"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 text-sm font-semibold">Siz kim?</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <TypeCard
                        selected={clientType === "individual"}
                        onClick={() => setClientType("individual")}
                        icon={<User className="h-5 w-5" />}
                        title="Jismoniy shaxs"
                        description="Fuqaro, o'zim uchun"
                      />
                      <TypeCard
                        selected={clientType === "business"}
                        onClick={() => setClientType("business")}
                        icon={<Building2 className="h-5 w-5" />}
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
                      So'rov sarlavhasi *
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Masalan: Oilaviy nizo bo'yicha advokat kerak"
                      className="mt-1.5"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Qisqa va aniq sarlavha yozing — advokatlar shu bo'yicha qaror qiladi.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-semibold">
                      Vaziyat tavsifi *
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Masalani batafsil tushuntiring: nima yuz berdi, qachon, kim ishtirok etdi, qanday natija kutyapsiz..."
                      rows={4}
                      className="mt-1.5 resize-none"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Kamida 15 ta belgi. Shaxsiy ma'lumotlarni kiritmang.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <Label className="text-sm font-semibold">Huquq sohasi *</Label>
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
                      <Label className="text-sm font-semibold">Shahar / Viloyat *</Label>
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

                  <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-amber-700" />
                      <div>
                        <div className="text-sm font-semibold text-amber-800">Shoshilinch so'rov</div>
                        <div className="text-xs text-amber-700">
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
                    <Label className="mb-2 text-sm font-semibold">Tezkor variantlar</Label>
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
                          className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg bg-secondary/50 p-3 text-xs text-muted-foreground">
                    <Clock className="mr-1 inline h-3.5 w-3.5 text-primary" />
                    Tip: ko'pchilik advokatlar 30 daqiqalik bepul konsultatsiyani taklif
                    qiladi. Avval bepul suhbat o'tkazishni so'rashingiz mumkin.
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-semibold">
                      Ismingiz *
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
                        Telefon *
                      </Label>
                      <div className="relative mt-1.5">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+998 90 123 45 67"
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-semibold">
                        Email
                      </Label>
                      <div className="relative mt-1.5">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">
                    <p>
                      <strong className="text-foreground">Maxfiyat kafolati:</strong> Sizning
                      telefon raqamingiz advokatga faqat uning taklifini qabul qilganingizdan
                      keyin ko'rsatiladi.
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                      So'rov xulosasi
                    </p>
                    <div className="space-y-1 text-sm">
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
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-2 border-t border-border bg-secondary/40 p-4">
              <Button
                variant="ghost"
                onClick={() => (step === 0 ? handleClose() : setStep(step - 1))}
                className="gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                {step === 0 ? "Bekor qilish" : "Orqaga"}
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Qadam {step + 1} / {STEPS.length}
                </span>
                {step < STEPS.length - 1 ? (
                  <Button
                    onClick={() => setStep(step + 1)}
                    disabled={!canProceed()}
                    className="gap-1"
                  >
                    Keyingisi
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed() || submitting}
                    className="gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Joylanmoqda...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        So'rovni joylash
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </>
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
      className={`flex flex-col items-start gap-1.5 rounded-xl border-2 p-4 text-left transition-all ${
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          selected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
        }`}
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
    <div className="rounded-lg border border-border bg-card p-3 text-center">
      <div className="text-base font-bold text-foreground">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-muted-foreground">{label}:</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}
