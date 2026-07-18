"use client";

import { Search, FileText, Download, Users, MessageSquare, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMarketplaceStore } from "@/lib/marketplace/store";

export function HowItWorks() {
  const { setView, setPostRequestOpen } = useMarketplaceStore();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Editorial header */}
      <div className="text-center">
        <div className="mb-3 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-accent" />
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Qanday ishlaydi
          </p>
          <span className="h-px w-8 bg-accent" />
        </div>
        <h2 className="mx-auto max-w-3xl text-balance font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          Uchta oddiy qadamda huquqiy yordam oling
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
          Hujjat namunasi oling yoki advokat bilan bog'laning — ikkala yo'l ham bir necha daqiqada.
        </p>
      </div>

      {/* Two parallel flows */}
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {/* Documents flow */}
        <Card className="group relative overflow-hidden border-border bg-card p-8 transition-all hover:shadow-hard">
          {/* Editorial number */}
          <div className="absolute right-6 top-6 font-serif text-7xl font-bold text-accent/10">
            01
          </div>

          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-trust-verified/10 text-trust-verified">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">Hujjat olish</h3>
                <p className="text-xs text-muted-foreground">Advokatsiz, o'zingiz tayyorlang</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px]">3 qadam</Badge>
          </div>

          <ol className="space-y-5">
            <Step
              num={1}
              title="Hujjatni tanlang"
              description="700+ namunalar ichidan o'zingizga kerakli hujjatni toping. Kategoriya va kalit so'z bo'yicha qidirish mumkin."
              icon={<Search className="h-3.5 w-3.5" />}
              onClick={() => setView("documents")}
            />
            <Step
              num={2}
              title="Maydonlarni to'ldiring"
              description="Onlayn konstruktorda kerakli maydonlarni to'ldiring. Har bir maydon uchun maslahatlar va huquqiy asoslar ko'rsatilgan."
              icon={<FileText className="h-3.5 w-3.5" />}
            />
            <Step
              num={3}
              title="Yuklab oling"
              description="PDF yoki DOCX formatida yuklab oling. Onlayn variantni ham saqlab qo'yishingiz va keyin tahrir qilishingiz mumkin."
              icon={<Download className="h-3.5 w-3.5" />}
            />
          </ol>

          <button
            onClick={() => setView("documents")}
            className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-lg border border-trust-verified/30 bg-trust-verified/5 py-2.5 text-sm font-semibold text-trust-verified transition-all hover:bg-trust-verified/10"
          >
            Hujjatlarga o'tish
          </button>
        </Card>

        {/* Advocates flow */}
        <Card className="group relative overflow-hidden border-border bg-card p-8 transition-all hover:shadow-hard">
          <div className="absolute right-6 top-6 font-serif text-7xl font-bold text-accent/10">
            02
          </div>

          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">Advokat yollash</h3>
                <p className="text-xs text-muted-foreground">Murakkab masalalar uchun mutaxassis</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px]">3 qadam</Badge>
          </div>

          <ol className="space-y-5">
            <Step
              num={1}
              title="Advokat toping"
              description="1284+ tasdiqlangan advokatlar ichidan tajriba, reyting va narx bo'yicha tanlang. Sohaga ko'ra filtrlang."
              icon={<Search className="h-3.5 w-3.5" />}
              onClick={() => setView("advocates")}
            />
            <Step
              num={2}
              title="Bog'laning yoki so'rov joylang"
              description="To'g'ridan-to'g'ri advokatga xabar yuboring yoki so'rovingizni joylab bir nechta advokatlardan taklif oling."
              icon={<MessageSquare className="h-3.5 w-3.5" />}
              onClick={() => setPostRequestOpen(true)}
            />
            <Step
              num={3}
              title="Shartnoma tuzing"
              description="Tanlangan advokat bilan xizmat ko'rsatish shartnomasini tuzing. To'lov platforma orqali xavfsiz amalga oshiriladi."
              icon={<ShieldCheck className="h-3.5 w-3.5" />}
            />
          </ol>

          <button
            onClick={() => setView("advocates")}
            className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-lg border border-accent/30 bg-accent/5 py-2.5 text-sm font-semibold text-accent transition-all hover:bg-accent/10"
          >
            Advokatlarga o'tish
          </button>
        </Card>
      </div>

      {/* Trust strip */}
      <div className="mt-12 grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-6 sm:grid-cols-4">
        <Trust icon={<CheckCircle2 className="h-5 w-5 text-accent" />} text="Litsenziyalangan advokatlar" />
        <Trust icon={<ShieldCheck className="h-5 w-5 text-trust-verified" />} text="Xavfsiz to'lov tizimi" />
        <Trust icon={<FileText className="h-5 w-5 text-trust-verified" />} text="Qonunchilikka muvofiq hujjatlar" />
        <Trust icon={<Users className="h-5 w-5 text-trust-premium" />} text="14 viloyatni qamrab olgan" />
      </div>
    </section>
  );
}

function Step({
  num,
  title,
  description,
  icon,
  onClick,
}: {
  num: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        disabled={!onClick}
        className="group flex w-full items-start gap-3 text-left disabled:cursor-default"
      >
        <div className="relative flex shrink-0 flex-col items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-foreground bg-background font-serif text-sm font-bold text-foreground transition-colors group-hover:border-accent group-hover:text-accent">
            {num}
          </div>
        </div>
        <div className="flex-1 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="font-serif text-sm font-bold text-foreground">{title}</span>
            <span className="text-accent">{icon}</span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </button>
    </li>
  );
}

function Trust({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5">
      {icon}
      <span className="text-xs font-medium text-foreground sm:text-sm">{text}</span>
    </div>
  );
}
