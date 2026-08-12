"use client";

import {
  Briefcase,
  BuildingOffice,
  FileText,
  Gavel,
  Globe,
  House,
  Lightbulb,
  Receipt,
  Scales,
  ShieldWarning,
  Stamp,
  UserCheck,
  Users,
} from "@phosphor-icons/react/dist/ssr";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { IconProps } from "@phosphor-icons/react/dist/lib/types";

type IconType = ForwardRefExoticComponent<
  IconProps & RefAttributes<SVGSVGElement>
>;

const ICONS: Record<string, IconType> = {
  Users,
  ShieldWarning,
  Scales,
  BuildingOffice,
  Receipt,
  Briefcase,
  House,
  Lightbulb,
  FileText,
  Globe,
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
  return <Icon className={className} weight="duotone" />;
}
