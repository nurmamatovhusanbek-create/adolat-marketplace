"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Typography — UI Revolution Plan §2.2 Phase 1 Core Primitive
 *
 * Heading + Text components with proper semantic HTML + consistent styling.
 * Replaces scattered h1-h6 + p patterns with no clear rules.
 *
 * Design principles:
 * - Heading: h1-h6 with size prop (independent of semantic level)
 * - Text: p/span with size + tone props
 * - Tone system: primary, secondary, tertiary, inverse, brand, success, warning, danger, info
 * - font="display" → IBM Plex Sans (via .font-display utility in globals.css)
 *   Note: h1-h6 already inherit IBM Plex Sans from the @layer base rule, so
 *   font="display" is only needed when a non-heading element should look like one.
 */

const headingSizes = {
  "1": "text-base font-semibold",
  "2": "text-lg font-semibold",
  "3": "text-xl font-semibold",
  "4": "text-2xl font-bold tracking-tight",
  "5": "text-3xl font-bold tracking-tight",
  "6": "text-4xl font-bold tracking-tight",
  "7": "text-5xl font-extrabold tracking-tight",
  "8": "text-6xl font-extrabold tracking-tight",
} as const;

const textTones = {
  primary: "text-foreground",
  secondary: "text-muted-foreground",
  tertiary: "text-muted-foreground/70",
  inverse: "text-background",
  brand: "text-primary",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
  info: "text-accent-2",
} as const;

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof cva> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: keyof typeof headingSizes;
  tone?: keyof typeof textTones;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  font?: "display" | "accent" | "inherit";
  balance?: boolean;
}

export function Heading({
  level = 2,
  size = "4",
  tone = "primary",
  as,
  font = "inherit",
  balance = true,
  className,
  children,
  ...props
}: HeadingProps) {
  const Comp = (as ?? `h${level}`) as React.ElementType;
  // IBM Plex Sans for display moments. "accent" is kept as a legacy alias
  // that now also resolves to the display font (Playfair was removed).
  const fontClass = font === "display" || font === "accent" ? "font-display" : "";

  return (
    <Comp
      className={cn(
        headingSizes[size],
        textTones[tone],
        fontClass,
        balance && "text-balance",
        "leading-tight",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

const textSizes = {
  xs: "text-xs leading-4",
  sm: "text-sm leading-5",
  base: "text-base leading-6",
  lg: "text-lg leading-7",
  xl: "text-xl leading-7",
  "2xl": "text-2xl leading-8",
} as const;

const textWeights = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
} as const;

export interface TextProps
  extends React.HTMLAttributes<HTMLElement> {
  size?: keyof typeof textSizes;
  weight?: keyof typeof textWeights;
  tone?: keyof typeof textTones;
  as?: "p" | "span" | "div" | "label" | "small" | "strong" | "em";
  balance?: boolean;
  pretty?: boolean;
  maxW?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function Text({
  size = "base",
  weight = "normal",
  tone = "primary",
  as = "p",
  balance = false,
  pretty = false,
  maxW,
  className,
  children,
  ...props
}: TextProps) {
  const Comp = as as React.ElementType;
  const maxWClass = maxW
    ? { xs: "max-w-xs", sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-xl" }[maxW]
    : "";

  return (
    <Comp
      className={cn(
        textSizes[size],
        textWeights[weight],
        textTones[tone],
        balance && "text-balance",
        pretty && "text-pretty",
        maxWClass,
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

/**
 * Label — form label with optional required asterisk
 */
export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ required, className, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "flex items-center gap-1.5 text-sm font-medium leading-none tracking-tight select-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-destructive">*</span>}
    </label>
  );
}
