"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Layout Primitives — UI Revolution Plan §2.2 Phase 1
 *
 * Container, Section, Grid, Stack — consistent layout system.
 * Replaces scattered max-w-7xl + random py-20 patterns.
 *
 * Design principles:
 * - Container: 5 size variants (sm/md/lg/xl/full) with consistent horizontal padding
 * - Section: 4 spacing variants (sm/md/lg/xl) + 3 background variants (default/alt/dark)
 * - Grid: responsive cols prop (base + md + lg breakpoints)
 * - Stack: flex column with gap, or row with wrap
 */

// ============================================================================
// Container
// ============================================================================

const containerSizes = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
} as const;

export interface ContainerProps extends React.ComponentProps<"div"> {
  size?: keyof typeof containerSizes;
}

export function Container({
  size = "xl",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        containerSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// Section
// ============================================================================

const sectionSpacings = {
  sm: "py-8 sm:py-10 lg:py-12",
  md: "py-12 sm:py-16 lg:py-20",
  lg: "py-16 sm:py-20 lg:py-24",
  xl: "py-20 sm:py-24 lg:py-32",
} as const;

const sectionVariants = {
  default: "bg-background",
  alt: "bg-secondary/40",
  dark: "bg-sidebar text-sidebar-foreground",
  gradient: "bg-gradient-to-b from-background to-secondary/30",
} as const;

export interface SectionProps extends React.ComponentProps<"section"> {
  spacing?: keyof typeof sectionSpacings;
  variant?: keyof typeof sectionVariants;
}

export function Section({
  spacing = "lg",
  variant = "default",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(sectionSpacings[spacing], sectionVariants[variant], className)}
      {...props}
    >
      {children}
    </section>
  );
}

// ============================================================================
// Grid
// ============================================================================

export interface GridProps extends React.ComponentProps<"div"> {
  cols?: {
    base?: 1 | 2 | 3 | 4 | 6 | 12;
    sm?: 1 | 2 | 3 | 4 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 6 | 12;
    xl?: 1 | 2 | 3 | 4 | 6 | 12;
  };
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
}

const gridCols = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  6: "grid-cols-6",
  12: "grid-cols-12",
} as const;

const gridGaps = {
  none: "gap-0",
  xs: "gap-2",
  sm: "gap-4",
  md: "gap-5",
  lg: "gap-6",
  xl: "gap-8",
} as const;

export function Grid({
  cols = { base: 1, md: 2, lg: 3 },
  gap = "md",
  className,
  children,
  ...props
}: GridProps) {
  const colsClass = cn(
    cols.base && gridCols[cols.base],
    cols.sm && `sm:${gridCols[cols.sm]}`,
    cols.md && `md:${gridCols[cols.md]}`,
    cols.lg && `lg:${gridCols[cols.lg]}`,
    cols.xl && `xl:${gridCols[cols.xl]}`
  );

  return (
    <div
      className={cn("grid", colsClass, gridGaps[gap], className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// Stack
// ============================================================================

export interface StackProps extends React.ComponentProps<"div"> {
  direction?: "row" | "column";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
}

const stackGaps = {
  none: "gap-0",
  xs: "gap-1.5",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
} as const;

const stackAligns = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
} as const;

const stackJustifies = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
} as const;

export function Stack({
  direction = "column",
  gap = "md",
  align,
  justify,
  wrap = false,
  className,
  children,
  ...props
}: StackProps) {
  return (
    <div
      className={cn(
        "flex",
        direction === "row" ? "flex-row" : "flex-col",
        stackGaps[gap],
        align && stackAligns[align],
        justify && stackJustifies[justify],
        wrap && "flex-wrap",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
