"use client";

import * as React from "react";
import { MagnifyingGlass, Users, FileText, Briefcase, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Input, InputGroup } from "@/components/primitives/input";
import { Button } from "@/components/primitives/button";
import { cn } from "@/lib/utils";

export type SearchType = "advocates" | "documents" | "requests";

export interface UnifiedSearchProps {
  modes?: SearchType[];
  defaultMode?: SearchType;
  placeholder?: string;
  onSearch?: (query: string, mode: SearchType) => void;
  className?: string;
}

const MODE_LABELS: Record<SearchType, { label: string; icon: typeof Users }> = {
  advocates: { label: "Advokat", icon: Users },
  documents: { label: "Hujjat", icon: FileText },
  requests: { label: "So'rov", icon: Briefcase },
};

export function UnifiedSearch({
  modes = ["advocates", "documents"],
  defaultMode = "advocates",
  placeholder = "Qidiring...",
  onSearch,
  className,
}: UnifiedSearchProps) {
  const [mode, setMode] = React.useState<SearchType>(defaultMode);
  const [query, setQuery] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query, mode);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      {modes.length > 1 && (
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Qidiruv turi:</span>
          <div className="inline-flex rounded-xl border border-border bg-card p-1 shadow-elevation-1">
            {modes.map((m) => {
              const { label, icon: Icon } = MODE_LABELS[m];
              const active = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    active
                      ? "bg-primary text-primary-foreground shadow-elevation-2 scale-105"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <Icon className="size-4" weight={active ? "fill" : "regular"} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <InputGroup prefix={<MagnifyingGlass />} className="flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            size="lg"
            className="h-14 border-2 bg-card/80 backdrop-blur-sm shadow-elevation-2 focus-visible:shadow-elevation-3 focus-visible:border-primary"
          />
        </InputGroup>
        <Button type="submit" size="lg" tone="brand" className="h-14 px-8 shadow-elevation-2 hover:shadow-elevation-3 hover:scale-105">
          Qidirish
          <ArrowRight className="size-4" weight="bold" />
        </Button>
      </div>
    </form>
  );
}
