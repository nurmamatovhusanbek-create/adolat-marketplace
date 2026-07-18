import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Badge — Editorial Premium design
 *
 * Design principles:
 * - rounded-full pill shape
 * - Optional dot indicator (statusDot prop)
 * - 6 tones (neutral, brand, success, warning, danger, info)
 * - 3 variants (solid, soft, outline)
 * - 3 sizes (sm, md, lg)
 */
const badgeVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5 rounded-full",
    "font-medium whitespace-nowrap shrink-0",
    "transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2",
    "[&>svg]:size-3 [&>svg]:pointer-events-none",
  ].join(" "),
  {
    variants: {
      variant: {
        // Solid: filled background, contrasting text
        solid: "",
        // Soft: low-opacity background, saturated text
        soft: "",
        // Outline: border only, no background
        outline: "border bg-transparent",
      },
      tone: {
        neutral: "",
        brand: "",
        success: "",
        warning: "",
        danger: "",
        info: "",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    compoundVariants: [
      // Solid tones
      { variant: "solid", tone: "neutral", className: "bg-foreground text-background" },
      { variant: "solid", tone: "brand", className: "bg-accent text-accent-foreground" },
      { variant: "solid", tone: "success", className: "bg-success text-white" },
      { variant: "solid", tone: "warning", className: "bg-warning text-white" },
      { variant: "solid", tone: "danger", className: "bg-destructive text-white" },
      { variant: "solid", tone: "info", className: "bg-info text-white" },
      // Soft tones (low-opacity bg + saturated text)
      { variant: "soft", tone: "neutral", className: "bg-secondary text-secondary-foreground" },
      { variant: "soft", tone: "brand", className: "bg-accent/12 text-accent dark:text-accent" },
      { variant: "soft", tone: "success", className: "bg-success/12 text-success" },
      { variant: "soft", tone: "warning", className: "bg-warning/15 text-warning dark:text-warning" },
      { variant: "soft", tone: "danger", className: "bg-destructive/12 text-destructive" },
      { variant: "soft", tone: "info", className: "bg-info/12 text-info" },
      // Outline tones
      { variant: "outline", tone: "neutral", className: "border-border text-foreground" },
      { variant: "outline", tone: "brand", className: "border-accent/30 text-accent" },
      { variant: "outline", tone: "success", className: "border-success/30 text-success" },
      { variant: "outline", tone: "warning", className: "border-warning/30 text-warning dark:text-warning" },
      { variant: "outline", tone: "danger", className: "border-destructive/30 text-destructive" },
      { variant: "outline", tone: "info", className: "border-info/30 text-info" },
    ],
    defaultVariants: {
      variant: "soft",
      tone: "neutral",
      size: "md",
    },
  }
)

function Badge({
  className,
  variant,
  tone,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, tone, size }), className)}
      {...props}
    >
      {children}
    </Comp>
  )
}

export { Badge, badgeVariants }
