import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Input — Editorial Premium design
 *
 * Design principles:
 * - rounded-xl (12px), taller default (h-11) for better touch target
 * - Brand easing on focus + state changes
 * - :user-invalid fires only after blur/submit (WCAG-friendly)
 * - Success state: subtle sage tint when valid & has content
 * - Optional prefix/suffix via parent wrapper
 */
const inputVariants = cva(
  [
    "flex w-full min-w-0 rounded-xl border bg-transparent px-3.5 py-2",
    "text-base shadow-xs outline-none",
    "transition-[color,box-shadow,border-color,background-color] duration-150 ease-[cubic-bezier(0.2,0,0,1)]",
    "placeholder:text-muted-foreground/60",
    "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    "md:text-sm",
    // Focus ring
    "focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px]",
    // Error state
    "aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/20",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 text-sm",
        lg: "h-12 text-base",
      },
      variant: {
        default: "border-input bg-card",
        ghost: "border-transparent bg-secondary/50",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
)

function Input({
  className,
  type,
  size,
  variant,
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size, variant, className }))}
      {...props}
    />
  )
}

/**
 * InputWrapper — for inputs with prefix/suffix icons or buttons.
 * Usage:
 *   <InputWrapper prefix={<MagnifyingGlassIcon />}>
 *     <Input placeholder="Search..." />
 *   </InputWrapper>
 */
function InputWrapper({
  className,
  prefix,
  suffix,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}) {
  return (
    <div
      data-slot="input-wrapper"
      className={cn(
        "relative flex items-center",
        "[&>[data-slot=input]]:w-full [&>[data-slot=input]]:pl-10 [&>[data-slot=input]]:pr-10",
        className
      )}
      {...props}
    >
      {prefix && (
        <div className="pointer-events-none absolute left-3.5 flex items-center justify-center text-muted-foreground [&_svg]:size-4">
          {prefix}
        </div>
      )}
      {children}
      {suffix && (
        <div className="absolute right-3.5 flex items-center justify-center text-muted-foreground [&_svg]:size-4">
          {suffix}
        </div>
      )}
    </div>
  )
}

export { Input, InputWrapper, inputVariants }
