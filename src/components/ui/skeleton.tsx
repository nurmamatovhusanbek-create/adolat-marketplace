import { cn } from "@/lib/utils"

/**
 * Skeleton — loading placeholder
 * - `shimmer` (default): gradient sweep, "live feel", use for cards/images/hero placeholders
 * - `pulse`: simple opacity pulse, minimal GPU, use for text-line placeholders & dense lists
 *
 * Always size the Skeleton to match the loaded content (don't use generic sizes):
 *   <Skeleton className="h-12 w-12 rounded-full" />     // matches avatar
 *   <Skeleton className="h-4 w-[200px]" />              // matches text line
 */
function Skeleton({
  className,
  variant = "shimmer",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "shimmer" | "pulse"
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-lg",
        variant === "shimmer" ? "skeleton-shimmer" : "bg-secondary skeleton-pulse",
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
