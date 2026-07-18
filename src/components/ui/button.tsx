import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Spinner } from "@phosphor-icons/react/dist/ssr"

import { cn } from "@/lib/utils"

/**
 * Button — Editorial Premium design
 *
 * Design principles:
 * - 4 variants (primary, secondary, outline, ghost) + tone system for semantic colors
 * - 4 sizes (sm, md, lg, xl) + icon-only variants
 * - Built-in loading state with Phosphor Spinner
 * - Brand easing on all transitions, tactile active:scale
 * - Focus ring visible by shape (offset), not just color
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl",
    "font-medium tracking-tight",
    "transition-[background-color,color,border-color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.2,0,0,1)]",
    "active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "aria-invalid:ring-destructive/30 aria-invalid:border-destructive",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary: solid ink — main CTAs
        primary:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md",
        // Secondary: subtle parchment — supporting actions
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        // Outline: bordered — alternative actions
        outline:
          "border border-border bg-transparent hover:bg-secondary/60 hover:border-foreground/20",
        // Ghost: text-only — tertiary actions
        ghost:
          "bg-transparent hover:bg-secondary/60 text-foreground",
        // Destructive: red — dangerous actions
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-destructive/90",
        // Link: text-only with underline
        link:
          "bg-transparent text-accent underline-offset-4 hover:underline rounded-none p-0 h-auto",
      },
      size: {
        sm: "h-8 px-3 text-xs gap-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base [&_svg:not([class*='size-'])]:size-5",
        xl: "h-14 px-8 text-lg [&_svg:not([class*='size-'])]:size-5",
        // Icon-only variants
        icon: "size-10 p-0",
        "icon-sm": "size-8 p-0",
        "icon-lg": "size-12 p-0",
      },
      // Tone: contextual color overrides for primary/outline/ghost variants
      tone: {
        default: "",
        brand: "",
        success: "",
        warning: "",
        danger: "",
      },
    },
    compoundVariants: [
      // Brand tone
      { variant: "primary", tone: "brand", className: "bg-accent text-accent-foreground hover:bg-accent/90" },
      { variant: "outline", tone: "brand", className: "border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/50" },
      { variant: "ghost", tone: "brand", className: "text-accent hover:bg-accent/10" },
      // Success tone
      { variant: "primary", tone: "success", className: "bg-success text-white hover:bg-success/90" },
      { variant: "outline", tone: "success", className: "border-success/30 text-success hover:bg-success/10 hover:border-success/50" },
      { variant: "ghost", tone: "success", className: "text-success hover:bg-success/10" },
      // Warning tone
      { variant: "primary", tone: "warning", className: "bg-warning text-white hover:bg-warning/90" },
      { variant: "outline", tone: "warning", className: "border-warning/30 text-warning hover:bg-warning/10 hover:border-warning/50" },
      { variant: "ghost", tone: "warning", className: "text-warning hover:bg-warning/10" },
      // Danger tone
      { variant: "primary", tone: "danger", className: "bg-destructive text-white hover:bg-destructive/90" },
      { variant: "outline", tone: "danger", className: "border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50" },
      { variant: "ghost", tone: "danger", className: "text-destructive hover:bg-destructive/10" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      tone: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  tone,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    /** Shows a spinner and disables the button */
    loading?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, tone, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Spinner
          className="size-4 animate-spin"
          aria-hidden="true"
          weight="bold"
        />
      )}
      {children}
    </Comp>
  )
}

export { Button, buttonVariants }
