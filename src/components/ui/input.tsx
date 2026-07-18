import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        // Brand easing on focus + state changes (animation-discipline.md)
        "transition-[color,box-shadow,border-color] duration-150 ease-[cubic-bezier(0.2,0,0,1)]",
        // Focus ring — visible by shape, not just color (accessibility.md)
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        // Error state — pairs with aria-invalid attribute set by React Hook Form on blur/submit.
        // Success state styling lives in globals.css via :user-valid:not(:placeholder-shown)
        "aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/20 dark:aria-[invalid=true]:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
