import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow,background-color] duration-150 ease-[cubic-bezier(0.2,0,0,1)] overflow-hidden",
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
        /* Trust-signal variants (custom to Adolat Editorial Trust system)
           Color discipline rule (color.md): semantic colors stay at 0–5% pixel share.
           These use low-opacity backgrounds + saturated text for accessibility. */
        verified:
          "border-transparent bg-[oklch(0.45_0.08_145_/_0.12)] text-[oklch(0.40_0.10_145)] dark:bg-[oklch(0.45_0.08_145_/_0.18)] dark:text-[oklch(0.65_0.10_145)]",
        urgent:
          "border-transparent bg-[oklch(0.55_0.21_27_/_0.12)] text-[oklch(0.50_0.21_27)] dark:bg-[oklch(0.55_0.21_27_/_0.20)] dark:text-[oklch(0.75_0.19_22)]",
        premium:
          "border-transparent bg-[oklch(0.7_0.12_80_/_0.18)] text-[oklch(0.55_0.12_80)] dark:bg-[oklch(0.7_0.12_80_/_0.22)] dark:text-[oklch(0.78_0.12_80)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
