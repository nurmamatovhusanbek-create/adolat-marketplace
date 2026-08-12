"use client";

import * as React from "react";
import {
  ArrowRight,
  Briefcase,
  FileText,
  MagnifyingGlass,
  Users,
} from "@phosphor-icons/react/dist/ssr";
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
          <div className="inline-flex rounded-md border border-border bg-card p-1 shadow-sm">
            {modes.map((m) => {
              const { label, icon: Icon } = MODE_LABELS[m];
              const active = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={cn(
                    "flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
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
            inputSize="lg"
            className="h-12 border-border bg-card shadow-sm focus-visible:border-primary"
          />
        </InputGroup>
        <Button type="submit" size="lg" tone="brand" className="h-12 px-6">
          Qidirish
          <ArrowRight className="size-4" weight="bold" />
        </Button>
      </div>
    </form>
  );
}
