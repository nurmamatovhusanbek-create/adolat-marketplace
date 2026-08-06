"use client";

import { Container, Section, Grid, Stack } from "@/components/primitives/layout";
import { Heading, Text } from "@/components/primitives/typography";
import { Card, CardBody } from "@/components/primitives/card";
import { Button } from "@/components/primitives/button";
import {
  ChatCircle,
  CheckCircle,
  DownloadSimple,
  FileText,
  MagnifyingGlass,
  ShieldCheck,
  Users,
} from "@phosphor-icons/react/dist/ssr";
import { useMarketplaceStore } from "@/lib/marketplace/store";

export function HowItWorksSection() {
  const { setView, setPostRequestOpen } = useMarketplaceStore();

  return (
    <Section spacing="lg" variant="default">
      <Container size="xl">
        <Stack gap="md" align="center" className="mb-12 text-center">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">Qanday ishlaydi</p>
            <span className="h-px w-8 bg-primary" />
          </div>
          <Heading level={2} size="6" font="accent" className="text-center">Uchta oddiy qadamda huquqiy yordam oling</Heading>
          <Text size="lg" tone="secondary" maxW="md" className="text-center">Hujjat namunasi oling yoki advokat bilan bog'laning — ikkala yo'l ham bir necha daqiqada.</Text>
        </Stack>

        <Grid cols={{ base: 1, lg: 2 }} gap="lg">
          {/* Documents flow */}
          <Card variant="elevated" padding="lg" className="relative overflow-hidden">
            <div className="absolute right-6 top-6 font-serif text-8xl font-bold text-success/10">01</div>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-success/10 text-success">
                <FileText className="size-6" weight="duotone" />
              </div>
              <div>
                <Heading level={3} size="4">Hujjat olish</Heading>
                <Text size="xs" tone="secondary">Advokatsiz, o'zingiz tayyorlang</Text>
              </div>
            </div>
            <ol className="space-y-5">
              <Step num={1} title="Hujjatni tanlang" description="700+ namunalar ichidan o'zingizga kerakli hujjatni toping." icon={<MagnifyingGlass className="size-3.5" weight="regular" />} onClick={() => setView("documents")} />
              <Step num={2} title="Maydonlarni to'ldiring" description="Onlayn konstruktorda kerakli maydonlarni to'ldiring." icon={<FileText className="size-3.5" weight="regular" />} />
              <Step num={3} title="Yuklab oling" description="PDF yoki DOCX formatida yuklab oling." icon={<DownloadSimple className="size-3.5" weight="regular" />} />
            </ol>
            <Button variant="outline" tone="success" className="mt-6 w-full" onClick={() => setView("documents")}>Hujjatlarga o'tish</Button>
          </Card>

          {/* Advocates flow */}
          <Card variant="elevated" padding="lg" className="relative overflow-hidden">
            <div className="absolute right-6 top-6 font-serif text-8xl font-bold text-primary/10">02</div>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="size-6" weight="duotone" />
              </div>
              <div>
                <Heading level={3} size="4">Advokat yollash</Heading>
                <Text size="xs" tone="secondary">Murakkab masalalar uchun mutaxassis</Text>
              </div>
            </div>
            <ol className="space-y-5">
              <Step num={1} title="Advokat toping" description="1284+ tasdiqlangan advokatlar ichidan tanlang." icon={<MagnifyingGlass className="size-3.5" weight="regular" />} onClick={() => setView("advocates")} />
              <Step num={2} title="Bog'laning yoki so'rov joylang" description="To'g'ridan-to'g'ri xabar yuboring yoki so'rov joylang." icon={<ChatCircle className="size-3.5" weight="regular" />} onClick={() => setPostRequestOpen(true)} />
              <Step num={3} title="Shartnoma tuzing" description="Tanlangan advokat bilan shartnoma tuzing." icon={<ShieldCheck className="size-3.5" weight="regular" />} />
            </ol>
            <Button variant="outline" tone="brand" className="mt-6 w-full" onClick={() => setView("advocates")}>Advokatlarga o'tish</Button>
          </Card>
        </Grid>

        {/* Trust strip */}
        <Card variant="flat" padding="md" className="mt-12">
          <Grid cols={{ base: 2, lg: 4 }} gap="md">
            <TrustItem icon={<CheckCircle className="size-5 text-primary" weight="duotone" />} text="Litsenziyalangan advokatlar" />
            <TrustItem icon={<ShieldCheck className="size-5 text-success" weight="duotone" />} text="Xavfsiz to'lov tizimi" />
            <TrustItem icon={<FileText className="size-5 text-success" weight="duotone" />} text="Qonunchilikka muvofiq hujjatlar" />
            <TrustItem icon={<Users className="size-5 text-warning" weight="duotone" />} text="14 viloyatni qamrab olgan" />
          </Grid>
        </Card>
      </Container>
    </Section>
  );
}

function Step({ num, title, description, icon, onClick }: { num: number; title: string; description: string; icon: React.ReactNode; onClick?: () => void }) {
  return (
    <li>
      <button onClick={onClick} disabled={!onClick} className="group flex w-full items-start gap-3 text-left disabled:cursor-default">
        <div className="flex size-9 items-center justify-center rounded-full border-2 border-foreground bg-background font-serif text-sm font-bold text-foreground transition-colors group-hover:border-primary group-hover:text-primary">
          {num}
        </div>
        <div className="flex-1 pt-1">
          <div className="flex items-center gap-1.5">
            <Text size="sm" weight="bold">{title}</Text>
            <span className="text-primary">{icon}</span>
          </div>
          <Text size="xs" tone="secondary" className="mt-1">{description}</Text>
        </div>
      </button>
    </li>
  );
}

function TrustItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <Stack direction="row" gap="sm" align="center">
      {icon}
      <Text size="sm" weight="medium">{text}</Text>
    </Stack>
  );
}
