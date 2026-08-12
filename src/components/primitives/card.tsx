"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Card — UI Revolution Plan §2.2 Phase 1 Core Primitive
 *
 * Base card with 4 elevation variants + compound slot pattern.
 * Replaces the 8+ scattered card implementations.
 *
 * Design principles:
 * - 4 variants: flat, elevated, overlay, interactive
 * - rounded-lg (16px) by default — modern, friendly
 * - border-subtle hairline by default — barely visible
 * - Interactive variant lifts on hover with elevation-2
 * - Composable: use CardHeader, CardBody, CardFooter for structure
 */

const cardVariants = cva(
  [
    "rounded-lg border border-border bg-card text-card-foreground",
    "transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
  ].join(" "),
  {
    variants: {
      variant: {
        // Flat: no shadow, just border — for dense layouts
        flat: "shadow-none",
        // Elevated: subtle shadow — default for most cards
        elevated: "shadow-sm",
        // Overlay: higher shadow — for modals, popovers
        overlay: "shadow-md",
        // Interactive: lifts on hover — for clickable cards
        interactive:
          "shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-primary/30 cursor-pointer",
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "elevated",
      padding: "md",
    },
  }
);

export interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card"
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  )
);
Card.displayName = "Card";

/**
 * CardHeader — top section with optional border-bottom divider
 */
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { divider?: boolean }
>(({ className, divider = true, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-header"
    className={cn(
      "flex flex-col gap-1.5 p-6 pb-4",
      divider && "border-b border-border",
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/**
 * CardTitle — heading inside CardHeader
 */
export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<"h3">
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    data-slot="card-title"
    className={cn(
      "font-semibold text-lg leading-tight tracking-tight text-foreground",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/**
 * CardDescription — subtitle inside CardHeader
 */
export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="card-description"
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/**
 * CardBody — main content area
 */
export const CardBody = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-body"
    className={cn("p-6", className)}
    {...props}
  />
));
CardBody.displayName = "CardBody";

/**
 * CardFooter — bottom section with optional border-top divider
 */
export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { divider?: boolean }
>(({ className, divider = true, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-footer"
    className={cn(
      "flex items-center gap-2 p-6 pt-4",
      divider && "border-t border-border",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

/**
 * CardAction — top-right action area (e.g. "View all" button)
 */
export const CardAction = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-action"
    className={cn("ml-auto self-start", className)}
    {...props}
  />
));
CardAction.displayName = "CardAction";

export { cardVariants };
