"use client";

import { Container, Stack } from "@/components/primitives/layout";
import { Text } from "@/components/primitives/typography";
import { Users, FileText, ShieldCheck, MapPin } from "@phosphor-icons/react/dist/ssr";

export function TrustBar({ stats }: { stats: { advocatesCount: number; documentsCount: number; requestsResolved: number; citiesCovered: number } }) {
  return (
    <div className="border-y border-border bg-card/50 backdrop-blur-sm">
      <Container size="xl">
        <div className="grid grid-cols-2 divide-x divide-border py-6 sm:grid-cols-4">
          <TrustItem icon={<Users className="size-5 text-primary" weight="duotone" />} value={`${stats.advocatesCount}+`} label="Advokatlar" />
          <TrustItem icon={<FileText className="size-5 text-accent" weight="duotone" />} value={`${stats.documentsCount}+`} label="Hujjatlar" />
          <TrustItem icon={<ShieldCheck className="size-5 text-success" weight="duotone" />} value={`${stats.requestsResolved}+`} label="Yechilgan" />
          <TrustItem icon={<MapPin className="size-5 text-accent-2" weight="duotone" />} value={`${stats.citiesCovered}`} label="Viloyat" />
        </div>
      </Container>
    </div>
  );
}

function TrustItem({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <Stack direction="row" gap="sm" align="center" justify="center" className="px-4">
      {icon}
      <div>
        <div className="font-serif text-xl font-bold text-foreground">{value}</div>
        <Text size="xs" tone="secondary">{label}</Text>
      </div>
    </Stack>
  );
}
