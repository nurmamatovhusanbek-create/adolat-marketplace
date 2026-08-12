"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Input — UI Revolution Plan §2.2 Phase 1 Core Primitive
 *
 * Unified input with prefix/suffix support via InputGroup.
 * Replaces scattered input patterns.
 *
 * Design principles:
 * - 3 sizes: sm (h-9), md (h-11), lg (h-14)
 * - rounded-md (4px) — modern, not too round
 * - Focus state: border-primary + ring-primary/40
 * - :user-invalid fires only after blur/submit (WCAG-friendly)
 * - InputGroup wrapper for prefix/suffix icons
 */

export const inputVariants = cva(
  [
    "flex w-full min-w-0 rounded-md border bg-card text-foreground",
    "px-3.5 py-2 text-base shadow-sm outline-none",
    "transition-[color,box-shadow,border-color,background-color] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
    "placeholder:text-muted-foreground/60",
    "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    "md:text-sm",
    // Focus ring — registry blue
    "focus-visible:border-primary focus-visible:ring-primary/30 focus-visible:ring-[3px]",
    // Error state — fires only after blur/submit
    "aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/20",
  ].join(" "),
  {
    variants: {
      inputSize: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 text-sm",
        lg: "h-14 text-base",
      },
      variant: {
        default: "border-border",
        ghost: "border-transparent bg-secondary/50",
      },
    },
    defaultVariants: {
      inputSize: "md",
      variant: "default",
    },
  }
);

// Omit "size" from HTML input props to avoid conflict with cva's size variant
export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, inputSize, variant, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(inputVariants({ inputSize, variant, className }))}
      {...props}
    />
  )
);
Input.displayName = "Input";

/**
 * Textarea — matching Input styling
 */
export interface TextareaProps
  extends Omit<React.ComponentProps<"textarea">, "size">,
    VariantProps<typeof inputVariants> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, inputSize, variant, ...props }, ref) => (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        inputVariants({ inputSize, variant }),
        "field-sizing-content min-h-20 py-2.5",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

/**
 * InputGroup — wrapper for inputs with prefix/suffix icons or buttons
 *
 * Usage:
 *   <InputGroup prefix={<MagnifyingGlass />}>
 *     <Input placeholder="Search..." />
 *   </InputGroup>
 */
// Omit "prefix" from HTML div props to avoid conflict with our custom prefix prop
export interface InputGroupProps extends Omit<React.ComponentProps<"div">, "prefix"> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, prefix, suffix, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="input-group"
      className={cn(
        "relative flex items-center",
        "[&>[data-slot=input]]:w-full [&>[data-slot=input]]:pl-10 [&>[data-slot=input]]:pr-10",
        "[&>[data-slot=textarea]]:w-full [&>[data-slot=textarea]]:pl-10 [&>[data-slot=textarea]]:pr-10",
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
);
InputGroup.displayName = "InputGroup";
