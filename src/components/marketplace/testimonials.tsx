"use client";

import { Star, Quotes } from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "./category-grid";
import { TESTIMONIALS } from "@/lib/marketplace/data";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <section className="bg-secondary/30 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Mijozlarimiz fikri"
          title="Bizga ishonadiganlar"
          description="Advokatlar, yuristlar, tadbirkorlar va oddiy fuqarolar — minglab foydalanuvchilar Adolat platformasidan foydalanmoqda."
        />

        <div
          ref={ref}
          className={cn(
            "reveal-stagger mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
            inView && "in-view"
          )}
        >
          {TESTIMONIALS.map((t, i) => (
            <Card key={t.id} className="group relative flex flex-col gap-3 p-6 hover:-translate-y-0.5 hover:shadow-beautiful-md">
              <Quotes className="absolute right-4 top-4 size-8 text-accent/20" weight="fill" />
              {i === 0 && (
                <div className="absolute -left-2 -top-2 flex size-7 items-center justify-center rounded-full bg-accent font-serif text-xs font-bold text-accent-foreground shadow-beautiful-sm">
                  &ldquo;
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={cn(
                        "size-3.5",
                        idx < t.rating ? "text-warning" : "text-border"
                      )}
                      weight={idx < t.rating ? "fill" : "regular"}
                    />
                  ))}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  #{String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <p className="flex-1 text-sm leading-relaxed text-foreground">
                &ldquo;{t.quoteUz}&rdquo;
              </p>

              <div className="border-t border-border pt-3">
                <div className="font-serif text-sm font-bold text-foreground">{t.authorName}</div>
                <div className="text-[11px] text-muted-foreground">{t.authorRoleUz}</div>
                <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">{t.organization}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
