"use client";

import * as React from "react";
import { Star, Quotes } from "@phosphor-icons/react/dist/ssr";
import { Card, CardBody, CardFooter } from "@/components/primitives/card";
import { Heading, Text } from "@/components/primitives/typography";
import { cn } from "@/lib/utils";

export interface TestimonialCardData {
  id: string;
  quoteUz: string;
  authorName: string;
  authorRoleUz: string;
  organization: string;
  rating: number;
}

export interface TestimonialCardProps {
  testimonial: TestimonialCardData;
  featured?: boolean;
  className?: string;
}

export function TestimonialCard({ testimonial: t, featured, className }: TestimonialCardProps) {
  return (
    <Card variant="elevated" padding="md" className={cn("group relative flex flex-col", className)}>
      <Quotes className="absolute right-4 top-4 size-8 text-primary/20" weight="fill" />
      {featured && (
        <div className="absolute -left-2 -top-2 flex size-7 items-center justify-center rounded-full bg-primary font-display text-xs font-bold text-primary-foreground shadow-md">
          &ldquo;
        </div>
      )}

      <CardBody padding="none" className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className={cn("size-3.5", idx < t.rating ? "text-warning" : "text-border")}
                weight={idx < t.rating ? "fill" : "regular"}
              />
            ))}
          </div>
        </div>

        <Text size="sm" className="mt-3 flex-1 leading-relaxed">&ldquo;{t.quoteUz}&rdquo;</Text>
      </CardBody>

      <CardFooter divider={false} className="mt-auto border-t border-border pt-3" padding="none">
        <div>
          <Heading level={4} size="2">{t.authorName}</Heading>
          <Text size="xs" tone="secondary">{t.authorRoleUz}</Text>
          <Text size="xs" tone="brand" className="mt-0.5 font-mono uppercase tracking-wider">{t.organization}</Text>
        </div>
      </CardFooter>
    </Card>
  );
}
