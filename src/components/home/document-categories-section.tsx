"use client";

import { Container, Section, Grid, Stack } from "@/components/primitives/layout";
import { Heading, Text } from "@/components/primitives/typography";
import { CategoryCard, type CategoryCardData } from "@/components/cards/category-card";
import { useInView } from "@/hooks/use-in-view";
import { DOCUMENT_CATEGORIES } from "@/lib/marketplace/data";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import type { DocumentCategory } from "@/lib/marketplace/types";
import { cn } from "@/lib/utils";

export function DocumentCategoriesSection({ limit = 6 }: { limit?: number }) {
  const { setView, setDocumentCategory } = useMarketplaceStore();
  const [ref, inView] = useInView<HTMLDivElement>();

  const categories: CategoryCardData[] = DOCUMENT_CATEGORIES.slice(0, limit).map((c) => ({
    id: c.id,
    nameUz: c.nameUz,
    descriptionUz: c.descriptionUz,
    icon: c.icon,
    count: c.count,
    subcategories: c.subcategories,
    color: c.color,
  }));

  const handleSelect = (cat: CategoryCardData) => {
    setDocumentCategory(cat.id as DocumentCategory);
    setView("documents");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Section spacing="lg" variant="default">
      <Container size="xl">
        <Stack gap="md" align="start" className="mb-10">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">Hujjat katalogi</p>
          </div>
          <Heading level={2} size="6" font="display">Hujjat namunalari bo'yicha kategoriyalar</Heading>
          <Text size="lg" tone="secondary" maxW="xl">Yuridik shaxslar, ko'chmas mulk, sud ishlari va boshqa 700+ tayyor hujjat namunalari.</Text>
        </Stack>

        <div ref={ref} className={cn("reveal-stagger", inView && "in-view")}>
          <Grid cols={{ base: 1, sm: 2, lg: 3 }} gap="md">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} onSelect={handleSelect} />
            ))}
          </Grid>
        </div>
      </Container>
    </Section>
  );
}
