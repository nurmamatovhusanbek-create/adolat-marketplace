"use client";

import { Container, Section, Grid } from "@/components/primitives/layout";
import { Heading, Text } from "@/components/primitives/typography";
import { TestimonialCard } from "@/components/cards/testimonial-card";
import { useInView } from "@/hooks/use-in-view";
import { TESTIMONIALS } from "@/lib/marketplace/data";
import { cn } from "@/lib/utils";

export function TestimonialsSection({ limit = 4 }: { limit?: number }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const testimonials = TESTIMONIALS.slice(0, limit).map((t) => ({
    id: t.id,
    quoteUz: t.quoteUz,
    authorName: t.authorName,
    authorRoleUz: t.authorRoleUz,
    organization: t.organization,
    rating: t.rating,
  }));

  return (
    <Section spacing="lg" variant="alt">
      <Container size="xl">
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">Mijozlarimiz fikri</p>
          </div>
          <Heading level={2} size="6" font="display">Bizga ishonadiganlar</Heading>
          <Text size="lg" tone="secondary" className="mt-3" maxW="xl">Advokatlar, yuristlar, tadbirkorlar va oddiy fuqarolar — minglab foydalanuvchilar Adolat platformasidan foydalanmoqda.</Text>
        </div>

        <div ref={ref} className={cn("reveal-stagger", inView && "in-view")}>
          <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap="md">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.id} testimonial={t} featured={i === 0} />
            ))}
          </Grid>
        </div>
      </Container>
    </Section>
  );
}
