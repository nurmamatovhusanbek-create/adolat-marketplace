"use client";

import {
  FileText,
  Users,
  MessageSquare,
  Download,
  Search,
  ShieldCheck,
  Wallet,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMarketplaceStore } from "@/lib/marketplace/store";

const FAQS = [
  {
    q: "Hujjat namunalari to'g'riroq qanday tayyorlangan?",
    a: "Barcha hujjatlar O'zbekiston Respublikasining amaldagi qonunchiligi asosida, tajribali yuristlar tomonidan tayyorlanadi. Har bir hujjat uchun huquqiy asos (qonun moddasi) ko'rsatilgan. Hujjatlar muntazam yangilanib boriladi.",
  },
  {
    q: "Advokatlar tasdiqlanganmi?",
    a: "Ha, platformadagi barcha advokatlar O'zbekiston Adliya vazirligi tomonidan berilgan yuridik xizmat ko'rsatish litsenziyasiga ega. Biz litsenziya raqamlarini tekshiramiz va profil tasdiqlash bosqichida himoya qilamiz.",
  },
  {
    q: "To'lov qanday amalga oshiriladi?",
    a: "To'lovlar platforma orqali xavfsiz o'tkazma tizimi yordamida amalga oshiriladi. Mijoz pulni avansga o'tkazadi, ish yakunlangach advokatga. Bu ikkala tomon uchun ham himoya beradi.",
  },
  {
    q: "Birinchi konsultatsiya bepulmi?",
    a: "Ko'pchilik advokatlar 30 daqiqalik bepul konsultatsiyani taklif qiladi. Bu advokatning profilida alohida ko'rsatiladi. Shuningdek, bepul hujjat namunalarimizdan foydalanishingiz mumkin.",
  },
  {
    q: "So'rov joylash bepulmi?",
    a: "Ha, so'rov joylash butunlay bepul. Mijozlar uchun hech qanday yashirin to'lovlar yo'q. Advokat to'lash uchun komissiya faqat ish yakunlangach undiriladi.",
  },
  {
    q: "Qanday qilib advokat bo'lishim mumkin?",
    a: "Advokat sifatida ro'yxatdan o'tish uchun 'Advokat uchun' bo'limiga o'ting, litsenziya va diplomlarni yuklang. Bizning jamoamiz 24 soat ichida profilingizni tasdiqlaydi.",
  },
];

export function HowItWorksPage() {
  const { setView, setPostRequestOpen } = useMarketplaceStore();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-radial">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <Badge className="mb-4 inline-flex items-center gap-1.5 bg-accent/15 text-accent-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Qoidalar
          </Badge>
          <h1 className="mx-auto max-w-3xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Qanday ishlaydi — barcha savollarga javob
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-sm text-muted-foreground sm:text-base">
            Adolat platformasida siz uchta xizmatdan foydalanishingiz mumkin: hujjat namunalarini
            olish, advokat topish yoki so'rovingizni joylash. Quyida har bir yo'l batafsil
            tushuntirilgan.
          </p>
        </div>
      </section>

      {/* Three pathways */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Path 1: Documents */}
          <Card className="border-border p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Hujjat olish</h2>
                <p className="text-xs text-muted-foreground">3 qadam · Bepul boshlanadi</p>
              </div>
            </div>

            <ol className="space-y-4">
              <PathwayStep
                num={1}
                icon={Search}
                title="Hujjatni toping"
                description="Kategoriyalar bo'ylab ko'ring yoki kalit so'z bilan qidiring. 700+ namunalar."
              />
              <PathwayStep
                num={2}
                icon={FileText}
                title="Maydonlarni to'ldiring"
                description="Onlayn konstruktorda kerakli ma'lumotlarni kiriting. Har bir maydonga maslahat berilgan."
              />
              <PathwayStep
                num={3}
                icon={Download}
                title="Yuklab oling"
                description="PDF yoki DOCX formatida. Onlayn saqlab, keyin tahrir qilishingiz mumkin."
              />
            </ol>

            <Button
              variant="outline"
              onClick={() => setView("documents")}
              className="mt-6 w-full gap-1 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            >
              Hujjatlarga o'tish
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>

          {/* Path 2: Advocates */}
          <Card className="border-border p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Advokat topish</h2>
                <p className="text-xs text-muted-foreground">3 qadam · Bir necha daqiqa</p>
              </div>
            </div>

            <ol className="space-y-4">
              <PathwayStep
                num={1}
                icon={Search}
                title="Advokat tanlang"
                description="Tajriba, reyting, narx va joylashuv bo'yicha filtrlang."
              />
              <PathwayStep
                num={2}
                icon={MessageSquare}
                title="Bog'laning"
                description="Profil orqali xabar yuboring yoki konsultatsiya bron qiling."
              />
              <PathwayStep
                num={3}
                icon={ShieldCheck}
                title="Shartnoma tuzing"
                description="Onlayn shartnoma tuzing. To'lov platforma orqali himoyalangan."
              />
            </ol>

            <Button
              variant="outline"
              onClick={() => setView("advocates")}
              className="mt-6 w-full gap-1 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
            >
              Advokatlarga o'tish
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>

          {/* Path 3: Post request */}
          <Card className="border-border p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">So'rov joylash</h2>
                <p className="text-xs text-muted-foreground">4 qadam · Bepul</p>
              </div>
            </div>

            <ol className="space-y-4">
              <PathwayStep
                num={1}
                icon={Sparkles}
                title="So'rov turini tanlang"
                description="Advokat yoki hujjat kerakligini ko'rsating."
              />
              <PathwayStep
                num={2}
                icon={FileText}
                title="Tafsilotlarni kiriting"
                description="Vaziyatni tushuntiring, soha va viloyatni tanlang."
              />
              <PathwayStep
                num={3}
                icon={Wallet}
                title="Byudjet ko'rsating"
                description="Ixtiyoriy, lekin tezroq javob olishga yordam beradi."
              />
              <PathwayStep
                num={4}
                icon={Clock}
                title="Javoblarni kuting"
                description="1-2 soat ichida advokatlardan takliflar keladi."
              />
            </ol>

            <Button
              onClick={() => setPostRequestOpen(true)}
              className="mt-6 w-full gap-1 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              So'rov joylash
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>
        </div>

        {/* Trust strip */}
        <div className="mt-10 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-4">
          <Trust icon={<CheckCircle2 className="h-5 w-5 text-primary" />} text="Litsenziyalangan advokatlar" />
          <Trust icon={<ShieldCheck className="h-5 w-5 text-primary" />} text="Xavfsiz to'lov tizimi" />
          <Trust icon={<FileText className="h-5 w-5 text-primary" />} text="Qonunchilikka muvofiq" />
          <Trust icon={<Wallet className="h-5 w-5 text-primary" />} text="Shaffof narxlar" />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary/30 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">FAQ</p>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Tez-tez so'raladigan savollar
            </h2>
          </div>

          <div className="mt-8 space-y-3">
            {FAQS.map((faq) => (
              <Card key={faq.q} className="border-border p-5">
                <div className="mb-2 flex items-start gap-2">
                  <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">{faq.q}</h3>
                </div>
                <p className="pl-6 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </Card>
            ))}
          </div>

          {/* Still have questions */}
          <Card className="mt-8 border-border bg-primary p-6 text-center text-primary-foreground">
            <h3 className="text-lg font-bold">Yana savollaringiz bormi?</h3>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Bizning qo'llab-quvvatlash jamoamiz har kuni 9:00 — 21:00 ishlaydi.
            </p>
            <Button
              variant="outline"
              className="mt-4 border-white/30 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
            >
              <MessageSquare className="mr-1.5 h-4 w-4" />
              Biz bilan bog'laning
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
}

function PathwayStep({
  num,
  icon: Icon,
  title,
  description,
}: {
  num: number;
  icon: typeof Search;
  title: string;
  description: string;
}) {
  return (
    <li className="flex gap-3">
      <div className="relative flex shrink-0 flex-col items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background text-xs font-bold text-primary">
          {num}
        </div>
      </div>
      <div className="flex-1 pt-1">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-primary" />
          <span className="text-sm font-bold text-foreground">{title}</span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
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
