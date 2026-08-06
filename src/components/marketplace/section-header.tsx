"use client";

/**
 * SectionHeader — shared section header for marketplace sections.
 * Extracted from category-grid.tsx (Phase 0 of UI Revolution) so the
 * orphaned category-grid.tsx can be deleted.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div className="max-w-2xl">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-px w-8 bg-accent" />
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
        </div>
        <h2 className="text-balance font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
