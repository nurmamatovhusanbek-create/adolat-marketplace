"use client";

import {
  Users,
  ShieldAlert,
  Scale,
  Building2,
  Receipt,
  Briefcase,
  Home,
  Lightbulb,
  FileText,
  Globe,
  FileSignature,
  Stamp,
  Gavel,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Users,
  ShieldAlert,
  Scale,
  Building2,
  Receipt,
  Briefcase,
  Home,
  Lightbulb,
  FileText,
  Globe,
  FileSignature,
  Stamp,
  Gavel,
  UserCheck,
};

export function DynamicIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? FileText;
  return <Icon className={className} />;
}
