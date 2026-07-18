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
  Stamp,
  UserCheck,
  Users,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { ComponentProps, RefAttributes } from "react";
import type { IconProps } from "@phosphor-icons/react/dist/lib/types";

type IconType = React.ForwardRefExoticComponent<
  IconProps & RefAttributes<SVGSVGElement>
>;

const ICONS: Record<string, IconType> = {
  Users,
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
