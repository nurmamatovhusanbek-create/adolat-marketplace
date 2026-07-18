"use client";

import {
  MagnifyingGlass,
  FileText,
  DownloadSimple,
  Users,
  ChatCircle,
  ShieldCheck,
  CheckCircle,
} from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMarketplaceStore } from "@/lib/marketplace/store";

export function HowItWorks() {
  const { setView, setPostRequestOpen } = useMarketplaceStore();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      {/* Header */}
      <div className="text-center">
        <div className="mb-3 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-accent" />
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Qanday ishlaydi
          </p>
          <span className="h-px w-8 bg-accent" />
        </div>
        <h2 className="mx-auto max-w-3xl text-balance font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Uchta oddiy qadamda huquqiy yordam oling
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
          Hujjat namunasi oling yoki advokat bilan bog'laning — ikkala yo'l ham bir necha daqiqada.
        </p>
      </div>

      {/* Two parallel flows */}
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {/* Documents flow */}
        <Card className="group relative overflow-hidden p-8 hover:-translate-y-1 hover:shadow-beautiful-lg hover:border-success/30">
          <div className="absolute right-6 top-6 font-serif text-8xl font-bold text-success/10">
            01
          </div>

          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-success/10 text-success">
                <FileText className="size-6" weight="duotone" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold tracking-tight text-foreground">Hujjat olish</h3>
                <p className="text-xs text-muted-foreground">Advokatsiz, o'zingiz tayyorlang</p>
              </div>
            </div>
            <Badge variant="outline" tone="neutral" size="sm">3 qadam</Badge>
          </div>

          <ol className="space-y-5">
            <Step
              num={1}
              title="Hujjatni tanlang"
              description="700+ namunalar ichidan o'zingizga kerakli hujjatni toping. Kategoriya va kalit so'z bo'yicha qidirish mumkin."
              icon={<MagnifyingGlass className="size-3.5" weight="regular" />}
              onClick={() => setView("documents")}
            />
            <Step
              num={2}
              title="Maydonlarni to'ldiring"
              description="Onlayn konstruktorda kerakli maydonlarni to'ldiring. Har bir maydon uchun maslahatlar va huquqiy asoslar ko'rsatilgan."
              icon={<FileText className="size-3.5" weight="regular" />}
            />
            <Step
              num={3}
              title="Yuklab oling"
              description="PDF yoki DOCX formatida yuklab oling. Onlayn variantni ham saqlab qo'yishingiz va keyin tahrir qilishingiz mumkin."
              icon={<DownloadSimple className="size-3.5" weight="regular" />}
            />
          </ol>

          <Button
            variant="outline"
            tone="success"
            className="mt-6 w-full"
            onClick={() => setView("documents")}
          >
            Hujjatlarga o'tish
          </Button>
        </Card>

        {/* Advocates flow */}
        <Card className="group relative overflow-hidden p-8 hover:-translate-y-1 hover:shadow-beautiful-lg hover:border-accent/30">
          <div className="absolute right-6 top-6 font-serif text-8xl font-bold text-accent/10">
            02
          </div>

          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Users className="size-6" weight="duotone" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold tracking-tight text-foreground">Advokat yollash</h3>
                <p className="text-xs text-muted-foreground">Murakkab masalalar uchun mutaxassis</p>
              </div>
            </div>
            <Badge variant="outline" tone="neutral" size="sm">3 qadam</Badge>
          </div>

          <ol className="space-y-5">
            <Step
              num={1}
              title="Advokat toping"
              description="1284+ tasdiqlangan advokatlar ichidan tajriba, reyting va narx bo'yicha tanlang. Sohaga ko'ra filtrlang."
              icon={<MagnifyingGlass className="size-3.5" weight="regular" />}
              onClick={() => setView("advocates")}
            />
            <Step
              num={2}
              title="Bog'laning yoki so'rov joylang"
              description="To'g'ridan-to'g'ri advokatga xabar yuboring yoki so'rovingizni joylab bir nechta advokatlardan taklif oling."
              icon={<ChatCircle className="size-3.5" weight="regular" />}
              onClick={() => setPostRequestOpen(true)}
            />
            <Step
              num={3}
              title="Shartnoma tuzing"
              description="Tanlangan advokat bilan xizmat ko'rsatish shartnomasini tuzing. To'lov platforma orqali xavfsiz amalga oshiriladi."
              icon={<ShieldCheck className="size-3.5" weight="regular" />}
            />
          </ol>

          <Button
            variant="outline"
            tone="brand"
            className="mt-6 w-full"
            onClick={() => setView("advocates")}
          >
            Advokatlarga o'tish
          </Button>
        </Card>
      </div>

      {/* Trust strip */}
      <div className="mt-12 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6 shadow-beautiful-sm sm:grid-cols-4">
        <Trust icon={<CheckCircle className="size-5 text-accent" weight="duotone" />} text="Litsenziyalangan advokatlar" />
        <Trust icon={<ShieldCheck className="size-5 text-success" weight="duotone" />} text="Xavfsiz to'lov tizimi" />
        <Trust icon={<FileText className="size-5 text-success" weight="duotone" />} text="Qonunchilikka muvofiq hujjatlar" />
        <Trust icon={<Users className="size-5 text-warning" weight="duotone" />} text="14 viloyatni qamrab olgan" />
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
          <div className="flex size-9 items-center justify-center rounded-full border-2 border-foreground bg-background font-serif text-sm font-bold text-foreground transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)] group-hover:border-accent group-hover:text-accent">
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
