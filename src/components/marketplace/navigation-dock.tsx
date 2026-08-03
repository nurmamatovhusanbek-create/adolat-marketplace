"use client";

import { useMarketplaceStore } from "@/lib/marketplace/store";
import { cn } from "@/lib/utils";
import {
  Scales,
  Users,
  FileText,
  Briefcase,
  Question,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const NAV_ITEMS = [
  { label: "Advokatlar", view: "advocates" as const, icon: Users, color: "emerald" },
  { label: "Hujjatlar", view: "documents" as const, icon: FileText, color: "amber" },
  { label: "So'rovlar", view: "requests" as const, icon: Briefcase, color: "violet" },
  { label: "Qoidalar", view: "how-it-works" as const, icon: Question, color: "sky" },
];

export function NavigationDock() {
  const { currentView, setView } = useMarketplaceStore();

  const handleNav = (view: typeof NAV_ITEMS[number]["view"]) => {
    setView(view);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const hideOnViews = ["admin-panel", "advocate-dashboard"];
  if (hideOnViews.includes(currentView)) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <nav className="fixed bottom-6 left-1/2 z-50 hidden -translate-x-1/2 items-center gap-2 rounded-2xl border border-border/80 bg-card/90 px-3 py-2.5 shadow-beautiful-xl backdrop-blur-xl md:flex">
        {/* Home button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => handleNav("home")}
              className={cn(
                "group relative flex size-12 items-center justify-center rounded-xl transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                currentView === "home"
                  ? "bg-foreground text-background shadow-md scale-105"
                  : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
              )}
              aria-label="Bosh sahifa"
            >
              <Scales
                className="size-5 transition-transform duration-200 group-hover:scale-110"
                weight={currentView === "home" ? "fill" : "regular"}
              />
              {currentView === "home" && (
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/75 opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-accent" />
                </span>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="border-border bg-card text-foreground">
            <p className="text-xs font-medium">Bosh sahifa</p>
          </TooltipContent>
        </Tooltip>

        <div className="mx-1 h-6 w-px bg-border" />

        {/* Nav items */}
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = currentView === item.view;
          return (
            <Tooltip key={item.view}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleNav(item.view)}
                  className={cn(
                    "group relative flex size-12 items-center justify-center rounded-xl transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                    active
                      ? "bg-foreground text-background shadow-md scale-105"
                      : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                  )}
                  aria-label={item.label}
                >
                  <Icon
                    className="size-5 transition-transform duration-200 group-hover:scale-110"
                    weight={active ? "fill" : "regular"}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="border-border bg-card text-foreground">
                <p className="text-xs font-medium">{item.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}

        <div className="mx-1 h-6 w-px bg-border" />

        {/* CTA Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => useMarketplaceStore.getState().setPostRequestOpen(true)}
              className="group relative flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-md transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)] hover:bg-accent/90 hover:shadow-lg hover:scale-105"
              aria-label="So'rov joylash"
            >
              <Sparkle
                className="size-5 transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110"
                weight="fill"
              />
              <span className="absolute -top-1 -right-1 flex size-3 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-foreground/50 opacity-75" />
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="border-border bg-card text-foreground">
            <p className="text-xs font-medium">Yangi so'rov</p>
          </TooltipContent>
        </Tooltip>
      </nav>
    </TooltipProvider>
  );
}
