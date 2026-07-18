"use client";

import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "./category-grid";
import { TESTIMONIALS } from "@/lib/marketplace/data";

export function Testimonials() {
  return (
    <section className="bg-secondary/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Mijozlarimiz fikri"
          title="Bizga ishonadiganlar"
          description="Advokatlar, yuristlar, tadbirkorlar va oddiy fuqarolar — minglab foydalanuvchilar Adolat platformasidan foydalanmoqda."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t, i) => (
            <Card key={t.id} className="group relative flex flex-col gap-3 border-border bg-card p-5 transition-all hover:shadow-hard-sm">
              {/* Editorial quote mark */}
              <Quote className="absolute right-4 top-4 h-8 w-8 text-accent/15" />
              {i === 0 && (
                <div className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent font-serif text-[10px] font-bold text-accent-foreground">
                  &ldquo;
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < t.rating
                          ? "h-3.5 w-3.5 fill-trust-premium text-trust-premium"
                          : "h-3.5 w-3.5 text-border"
                      }
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
