"use client";

import {
  ArrowRight,
  Briefcase,
  CheckCircle,
  FileText,
  Medal,
  ShieldCheck,
  Sparkle,
  Star,
  TrendUp,
  UserPlus,
  Users,
  Wallet,
} from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { PLATFORM_STATS } from "@/lib/marketplace/data";
import { toast } from "sonner";
import { useState } from "react";

const BENEFITS = [
  {
    icon: TrendUp,
    title: "Doimiy mijozlar bazasi",
    description:
      "Oyiga o'rtacha 30+ yangi mijozga kiring. Mijozlar profilingizga keladi — siz izlashi shart emas.",
  },
  {
    icon: Wallet,
    title: "Moslashuvchan komissiya",
    description:
      "Birinchi 3 mijoz uchun 0% komissiya. Keyin esa faqat 8% — bozordagi eng past ko'rsatkich.",
  },
  {
    icon: ShieldCheck,
    title: "Tasdiqlangan status",
    description:
      "Tasdiqlangan advokatlar qidiruv natijalarida ustuvor ko'rsatiladi va 3x ko'proq mijoz oladi.",
  },
  {
    icon: Star,
    title: "Reyting tizimi",
    description:
      "Yuqori reytingli advokatlar 'TOP-10' statusini oladi va platformada alohida ko'rsatiladi.",
  },
];

const STEPS = [
  {
    num: 1,
    title: "Ro'yxatdan o'ting",
    description: "Bepul profilingizni yarating. Litsenziya va diplomlarni yuklang.",
    icon: UserPlus,
  },
  {
    num: 2,
    title: "Tasdiqlash",
    description: "Bizning jamoamiz 24 soat ichida profilingizni tasdiqlaydi.",
    icon: ShieldCheck,
  },
  {
    num: 3,
    title: "So'rovlarga javob bering",
    description: "Qiziqarli so'rovlarga javob bering yoki mijozlar bilan to'g'ridan-to'g'ri bog'laning.",
    icon: Briefcase,
  },
  {
    num: 4,
    title: "Daromad oling",
    description: "Xizmat ko'rsating va to'lovni platforma orqali xavfsiz oling.",
    icon: Wallet,
  },
];

export function ForAdvocatesPage() {
  const { setView } = useMarketplaceStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Arizangiz qabul qilindi!", {
      description: "Biz 24 soat ichida siz bilan bog'lanamiz.",
    });
    setName("");
    setEmail("");
    setPhone("");
    setSpecialty("");
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-radial">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Badge className="mb-4 inline-flex items-center gap-1.5 bg-accent/15 text-accent-foreground">
                <Sparkle weight="fill" className="h-3.5 w-3.5" />
                Advokatlar uchun
              </Badge>
              <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Mijozlar bazangizni 3 barobar oshiring
              </h1>
              <p className="mt-4 max-w-xl text-balance text-sm text-muted-foreground sm:text-base">
                O'zbekistonning #1 huquqiy marketplace'iga qo'shiling. 1284+ tasdiqlangan
                advokatlar allaqachon oyiga o'rtacha 30+ yangi mijoz olmoqda. Birinchi
                3 mijoz uchun 0% komissiya.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" })}>
                  Bepul ro'yxatdan o'tish
                  <ArrowRight weight="bold" className="ml-1.5 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => setView("home")}>
                  Bosh sahifaga qaytish
                </Button>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4">
                <StatBox value={PLATFORM_STATS.advocatesCount.toLocaleString("ru-RU") + "+"} label="Advokatlar" />
                <StatBox value={PLATFORM_STATS.requestsResolved.toLocaleString("ru-RU") + "+"} label="Yechilgan so'rov" />
                <StatBox value={PLATFORM_STATS.satisfactionRate + "%"} label="Mamnunlik" />
              </div>
            </div>

            {/* Mini dashboard preview */}
            <div className="relative">
              <Card className="border-border p-5 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <TrendUp weight="regular" className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Mening dashboardim</div>
                      <div className="text-xs text-muted-foreground">Oxirgi 30 kun</div>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">+18%</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <MiniStat icon={Users} value="32" label="Yangi mijozlar" color="text-emerald-600" />
                  <MiniStat icon={Briefcase} value="14" label="Yopilgan ishlar" color="text-primary" />
                  <MiniStat icon={Star} value="4.9" label="Reyting" color="text-accent" />
                  <MiniStat icon={Wallet} value="9.4 mln" label="Daromad" color="text-emerald-600" />
                </div>

                <div className="mt-4 rounded-lg bg-secondary/50 p-3">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Oxirgi so'rovlar
                  </div>
                  <div className="space-y-2">
                    {[
                      { title: "AJ ro'yxatdan o'tkazish", budget: "3-5 mln", urgent: true },
                      { title: "Ajrashish bo'yicha yordam", budget: "1.5-2.5 mln", urgent: false },
                      { title: "Mehnat nizosi", budget: "0.8-1.5 mln", urgent: false },
                    ].map((r, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-md bg-card p-2 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          {r.urgent && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-700">
                              !
                            </span>
                          )}
                          <span className="font-medium text-foreground">{r.title}</span>
                        </div>
                        <span className="font-semibold text-emerald-700">{r.budget}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <div className="absolute -bottom-4 -right-4 hidden rounded-2xl border border-border bg-card p-4 shadow-lg sm:block">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Medal weight="regular" className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Bu oyda</div>
                    <div className="text-sm font-bold text-foreground">+47% o'sish</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Afzalliklar</p>
          <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Nima uchun advokatlar bizni tanlashadi
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <Card key={b.title} className="border-border p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-foreground">{b.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{b.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="bg-secondary/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Jarayon</p>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              4 oddiy qadam
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <Card key={s.num} className="relative border-border p-5">
                <div className="absolute -top-3 left-5 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {s.num}
                </div>
                <div className="mb-3 mt-1 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent-foreground">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{s.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Signup form */}
      <section id="signup" className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="border-border p-6 sm:p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <UserPlus weight="regular" className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Bepul ro'yxatdan o'tish</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Bir necha daqiqada ariza qoldiring. Biz 24 soat ichida bog'lanamiz.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="adv-name" className="text-sm font-semibold">
                F.I.O *
              </Label>
              <Input
                id="adv-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Familiya Ism Sharif"
                required
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="adv-phone" className="text-sm font-semibold">
                  Telefon *
                </Label>
                <Input
                  id="adv-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="adv-email" className="text-sm font-semibold">
                  Email
                </Label>
                <Input
                  id="adv-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="advokat@example.com"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="adv-spec" className="text-sm font-semibold">
                Asosiy mutaxassislik *
              </Label>
              <Input
                id="adv-spec"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Masalan: Oilaviy huquq"
                required
                className="mt-1.5"
              />
            </div>

            <div className="rounded-lg bg-secondary/50 p-3 text-xs text-muted-foreground">
              <CheckCircle weight="regular" className="mr-1 inline h-3.5 w-3.5 text-emerald-600" />
              Keyingi bosqichda litsenziya raqami, diplomlar va ish tajribangiz haqida
              ma'lumot so'raymiz.
            </div>

            <Button type="submit" size="lg" className="w-full gap-1.5">
              <UserPlus weight="regular" className="h-4 w-4" />
              Ro'yxatdan o'tish
            </Button>

            <p className="text-center text-[11px] text-muted-foreground">
              Ro'yxatdan o'tish orqali siz{" "}
              <a href="#" className="text-primary hover:underline">
                Foydalanish shartlari
              </a>{" "}
              va{" "}
              <a href="#" className="text-primary hover:underline">
                Maxfiylik siyosatiga
              </a>{" "}
              rozilik bildirasiz.
            </p>
          </form>
        </Card>
      </section>
    </div>
  );
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <div className="text-lg font-bold text-foreground sm:text-2xl">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: typeof Users;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <Icon className={`mb-1.5 h-4 w-4 ${color}`} />
      <div className="text-lg font-bold text-foreground">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
