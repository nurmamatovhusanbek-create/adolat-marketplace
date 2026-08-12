import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Badge — extended with `tone` and `size` variants so it composes with the
 * Registry token system (paper/ink/registry/seal/stamp-green) and so card
 * components can request a consistent small badge without hand-rolled styles.
 *
 * tone overrides the variant's color:
 *  - neutral  → muted surface (default look)
 *  - brand    → registry-blue
 *  - success  → stamp-green
 *  - warning  → amber
 *  - danger   → seal-red
 * size:
 *  - sm → tighter padding, 11px text (used in dense card meta rows)
 *  - md → default
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
      tone: {
        neutral: "",
        brand: "border-transparent bg-primary/10 text-primary",
        success: "border-transparent bg-stamp-tint text-success",
        warning: "border-transparent bg-warning/10 text-warning",
        danger: "border-transparent bg-seal-tint text-destructive",
        info: "border-transparent bg-info/10 text-info",
      },
      size: {
        sm: "px-1.5 py-0 text-[10px] [&>svg]:size-2.5",
        md: "px-2 py-0.5 text-xs",
        lg: "px-2.5 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
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
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, tone, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
