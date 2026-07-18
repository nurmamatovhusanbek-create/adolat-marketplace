"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

/**
 * Label — Editorial Premium design
 * Tighter tracking, medium weight, optional required asterisk via [data-required]
 */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-1.5 text-sm font-medium leading-none tracking-tight select-none",
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        // Required asterisk
        "[&[data-required]::after]:content-['*'] [&[data-required]::after]:text-accent [&[data-required]::after]:ml-0.5",
        className
      )}
      {...props}
    />
  )
}

export { Label }
