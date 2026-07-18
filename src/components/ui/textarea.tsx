import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Textarea — Editorial Premium design
 * rounded-xl, brand easing, focus ring, error state
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-xl border border-input bg-card",
        "px-3.5 py-2.5 text-base shadow-xs outline-none",
        "transition-[color,box-shadow,border-color,background-color] duration-150 ease-[cubic-bezier(0.2,0,0,1)]",
        "placeholder:text-muted-foreground/60",
        "focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px]",
        "aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
