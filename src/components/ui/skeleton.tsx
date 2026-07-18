import { cn } from "@/lib/utils"

/**
 * Skeleton — loading placeholder per state-coverage.md + animation-discipline.md
 *
 * Two variants:
 * - `shimmer` (default): gradient sweep, "live feel", use for cards/images/hero placeholders
 * - `pulse`: simple opacity pulse, minimal GPU, use for text-line placeholders & dense lists
 *
 * Critical rule (state-coverage.md): skeleton shimmer must stop when content lands —
 * never run indefinitely. The parent component should stop rendering the Skeleton
 * once real content is ready (the animation disappears with the element).
 *
 * Always size the Skeleton to match the loaded content (don't use generic sizes):
 *   <Skeleton className="h-12 w-12 rounded-full" />     // matches avatar
 *   <Skeleton className="h-4 w-[200px]" />              // matches text line
 *   <Skeleton className="h-[120px] w-full rounded-xl" /> // matches card image
 */
function Skeleton({
  className,
  variant = "shimmer",
  ...props
}: React.ComponentProps<"div"> & {
  /** "shimmer" = gradient sweep (default, more GPU). "pulse" = opacity pulse (lighter). */
  variant?: "shimmer" | "pulse";
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        // Base: rounded, takes shape from className
        "rounded-md",
        // Variant
        variant === "shimmer" ? "skeleton-shimmer" : "bg-secondary skeleton-pulse",
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
