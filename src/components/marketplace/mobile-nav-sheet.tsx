"use client";

import { useState } from "react";
import {
  Scales,
  List,
  Users,
  FileText,
  Briefcase,
  Question,
  SignIn,
  SignOut,
  SquaresFour,
  Shield,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { useAppUser } from "@/lib/auth/user-provider";
import { signOut } from "next-auth/react";
import type { ViewType } from "@/lib/marketplace/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV_ITEMS: { label: string; view: ViewType; icon: typeof Users }[] = [
  { label: "Bosh sahifa", view: "home", icon: Scales },
  { label: "Advokatlar", view: "advocates", icon: Users },
  { label: "Hujjatlar", view: "documents", icon: FileText },
  { label: "So'rovlar", view: "requests", icon: Briefcase },
  { label: "Qoidalar", view: "how-it-works", icon: Question },
];

export function MobileNavSheet() {
  const { currentView, setView, setPostRequestOpen, setAuthOpen, setDashboardOpen } = useMarketplaceStore();
  const { user, loading: userLoading } = useAppUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (view: ViewType) => {
    setView(view);
    setMobileOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    toast.success("Tizimdan chiqdingiz");
    if (typeof window !== "undefined") window.location.reload();
  };

  return (
    <>
      {/* Mobile floating action button */}
      <div className="fixed bottom-6 right-4 z-40 flex flex-col gap-3 md:hidden">
        {/* Post request FAB */}
        <button
          onClick={() => setPostRequestOpen(true)}
          className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-beautiful-lg transition-all duration-200 active:scale-95"
          aria-label="Yangi so'rov"
        >
          <Sparkle className="size-6" weight="fill" />
        </button>

        {/* Menu trigger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              className="flex size-14 items-center justify-center rounded-2xl border border-border bg-card text-foreground shadow-beautiful-lg transition-all duration-200 active:scale-95"
              aria-label="Menyu"
            >
              <List className="size-6" weight="regular" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-[85vw] sm:max-w-sm p-0">
            <SheetHeader className="border-b border-border p-5">
              <SheetTitle className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-foreground text-background">
                  <Scales className="size-5" weight="duotone" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-lg font-bold">Adolat</span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Huquqiy marketplace
                  </span>
                </div>
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-1 p-4">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => handleNav(item.view)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-150",
                      active
                        ? "bg-secondary text-foreground shadow-sm"
                        : "text-foreground hover:bg-secondary/60"
                    )}
                  >
                    <Icon
                      className={cn("size-5", active ? "text-accent" : "text-muted-foreground")}
                      weight={active ? "fill" : "regular"}
                    />
                    {item.label}
                    {active && (
                      <span className="ml-auto size-1.5 rounded-full bg-accent" />
                    )}
                  </button>
                );
              })}

              <div className="my-3 h-px bg-border" />

              <button
                onClick={() => handleNav("for-advocates")}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-secondary/60 transition-all duration-150"
              >
                <Users className="size-5 text-accent" weight="regular" />
                Advokat sifatida ro'yxatdan o'tish
              </button>

              {user ? (
                <>
                  <div className="mt-3 rounded-xl border border-border bg-secondary/40 p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10 rounded-lg">
                        <AvatarImage src={user.avatarUrl ?? undefined} />
                        <AvatarFallback className="rounded-lg bg-secondary text-xs font-bold text-foreground">
                          {user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{user.name}</span>
                        <Badge
                          variant="soft"
                          tone={user.role === "ADMIN" ? "brand" : user.role === "ADVOCATE" ? "success" : "neutral"}
                          size="sm"
                          className="mt-1 w-fit"
                        >
                          {user.role}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setMobileOpen(false);
                          setDashboardOpen(true);
                        }}
                        className="flex items-center gap-2 rounded-lg bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary/60 transition-colors"
                      >
                        <SquaresFour className="size-4" weight="regular" />
                        Kabinetim
                      </button>
                      {user.role === "ADVOCATE" && (
                        <button
                          onClick={() => handleNav("advocate-dashboard")}
                          className="flex items-center gap-2 rounded-lg bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary/60 transition-colors"
                        >
                          <Briefcase className="size-4" weight="regular" />
                          Advokat
                        </button>
                      )}
                      {user.role === "ADMIN" && (
                        <button
                          onClick={() => handleNav("admin-panel")}
                          className="flex items-center gap-2 rounded-lg bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary/60 transition-colors"
                        >
                          <Shield className="size-4" weight="regular" />
                          Admin
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-destructive hover:bg-destructive/5 transition-all duration-150"
                  >
                    <SignOut className="size-5" weight="regular" />
                    Tizimdan chiqish
                  </button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    setMobileOpen(false);
                    setAuthOpen(true, "signin");
                  }}
                  variant="outline"
                  className="mt-3 h-11 rounded-xl"
                >
                  <SignIn className="size-4 mr-2" weight="regular" />
                  Kirish
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
