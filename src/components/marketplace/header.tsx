"use client";

import { useState } from "react";
import {
  Scales,
  MagnifyingGlass,
  List,
  FileText,
  Users,
  Briefcase,
  Plus,
  Question,
  SignIn,
  SignOut,
  SquaresFour,
  Shield,
  ArrowLeft,
  CaretDown,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { useAppUser } from "@/lib/auth/user-provider";
import { signOut } from "next-auth/react";
import type { ViewType } from "@/lib/marketplace/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV_ITEMS: { label: string; view: ViewType; icon: typeof Users }[] = [
  { label: "Advokatlar", view: "advocates", icon: Users },
  { label: "Hujjatlar", view: "documents", icon: FileText },
  { label: "So'rovlar", view: "requests", icon: Briefcase },
  { label: "Qoidalar", view: "how-it-works", icon: Question },
];

const HIDE_NAV_VIEWS: ViewType[] = ["admin-panel", "advocate-dashboard"];

export function Header() {
  const { currentView, setView, setPostRequestOpen, setAuthOpen, setDashboardOpen } = useMarketplaceStore();
  const { user, loading: userLoading } = useAppUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState("");

  const hideNav = HIDE_NAV_VIEWS.includes(currentView);

  const handleNav = (view: ViewType) => {
    setView(view);
    setMobileOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    useMarketplaceStore.setState({
      advocateSearch: quickSearch,
      currentView: "advocates",
    });
    setQuickSearch("");
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
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => handleNav("home")}
          className="flex shrink-0 items-center gap-2.5 rounded-lg p-1 transition-colors hover:bg-secondary/60"
          aria-label="Adolat bosh sahifa"
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-foreground text-background">
            <Scales className="size-5" weight="duotone" />
          </div>
          <div className="hidden flex-col leading-none sm:flex">
            <span className="font-serif text-lg font-bold tracking-tight text-foreground">Adolat</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground mt-0.5">
              Huquqiy marketplace
            </span>
          </div>
        </button>

        {/* Desktop nav */}
        {!hideNav && (
          <nav className="ml-2 hidden items-center gap-0.5 md:flex">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNav(item.view)}
                  className={cn(
                    "inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium",
                    "transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)]",
                    "hover:bg-secondary/70",
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" weight={active ? "fill" : "regular"} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}

        {/* Quick search — desktop */}
        {!hideNav && (
          <form onSubmit={handleQuickSearch} className="ml-auto hidden lg:flex max-w-xs flex-1">
            <div className="relative w-full group">
              <MagnifyingGlass
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent"
                weight="regular"
              />
              <Input
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder="Advokat, hujjat, so'rov..."
                size="sm"
                className="pl-10 bg-secondary/40 border-transparent hover:bg-secondary/60 focus-visible:bg-card focus-visible:border-border"
              />
              <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 select-none rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground lg:inline">
                ⌘K
              </kbd>
            </div>
          </form>
        )}

        {/* Actions */}
        <div className={cn("flex items-center gap-2", !hideNav && "lg:ml-2")}>
          {!hideNav && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNav("for-advocates")}
                className="hidden sm:inline-flex"
              >
                <Users className="size-4" weight="regular" />
                Advokat uchun
              </Button>
              <Button
                variant="primary"
                tone="brand"
                size="sm"
                onClick={() => setPostRequestOpen(true)}
              >
                <Plus className="size-4" weight="bold" />
                <span className="hidden sm:inline">So'rov joylash</span>
                <span className="sm:hidden">So'rov</span>
              </Button>
            </>
          )}

          {hideNav && (
            <Button variant="outline" size="sm" onClick={() => handleNav("home")}>
              <ArrowLeft className="size-4" weight="regular" />
              Bosh sahifa
            </Button>
          )}

          {/* User menu */}
          {userLoading ? (
            <div className="size-9 animate-pulse rounded-full bg-secondary" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full p-0.5">
                  <Avatar className="size-9 rounded-full">
                    <AvatarImage src={user.avatarUrl ?? undefined} />
                    <AvatarFallback className="rounded-full bg-secondary text-xs font-bold text-foreground">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                <DropdownMenuLabel className="px-2 py-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold tracking-tight">{user.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                    <Badge
                      variant="soft"
                      tone={user.role === "ADMIN" ? "brand" : user.role === "ADVOCATE" ? "success" : "neutral"}
                      size="sm"
                      className="mt-1 w-fit"
                    >
                      {user.role === "ADMIN" && <Shield className="size-3" weight="fill" />}
                      {user.role}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDashboardOpen(true)} className="rounded-lg gap-2.5 px-2 py-1.5">
                  <SquaresFour className="size-4" weight="regular" />
                  Mening kabinetim
                  {user.counts.unreadMessages > 0 && (
                    <Badge variant="solid" tone="brand" size="sm" className="ml-auto">
                      {user.counts.unreadMessages}
                    </Badge>
                  )}
                </DropdownMenuItem>
                {user.role === "ADVOCATE" && (
                  <DropdownMenuItem onClick={() => handleNav("advocate-dashboard")} className="rounded-lg gap-2.5 px-2 py-1.5">
                    <Briefcase className="size-4" weight="regular" />
                    Advokat kabineti
                  </DropdownMenuItem>
                )}
                {user.role === "ADMIN" && (
                  <DropdownMenuItem onClick={() => handleNav("admin-panel")} className="rounded-lg gap-2.5 px-2 py-1.5">
                    <Shield className="size-4" weight="regular" />
                    Admin panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => handleNav("home")} className="rounded-lg gap-2.5 px-2 py-1.5">
                  <Users className="size-4" weight="regular" />
                  Profil sozlamalari
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Draflar:</span>
                    <span className="font-semibold text-foreground font-mono">{user.counts.drafts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Faol so'rovlar:</span>
                    <span className="font-semibold text-foreground font-mono">{user.counts.activeRequests}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="rounded-lg gap-2.5 px-2 py-1.5 text-destructive focus:text-destructive"
                >
                  <SignOut className="size-4" weight="regular" />
                  Tizimdan chiqish
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAuthOpen(true, "signin")}
            >
              <SignIn className="size-4" weight="regular" />
              <span className="hidden sm:inline">Kirish</span>
            </Button>
          )}

          {/* Mobile sheet */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menyu">
                <List className="size-5" weight="regular" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0">
              <SheetHeader className="border-b border-border p-4">
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
                    <Scales className="size-4" weight="duotone" />
                  </div>
                  <span className="font-serif text-base font-bold">Adolat</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 p-3">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = currentView === item.view;
                  return (
                    <button
                      key={item.view}
                      onClick={() => handleNav(item.view)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium",
                        "transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)]",
                        active
                          ? "bg-secondary text-foreground"
                          : "text-foreground hover:bg-secondary/60"
                      )}
                    >
                      <Icon className="size-4 text-accent" weight={active ? "fill" : "regular"} />
                      {item.label}
                    </button>
                  );
                })}
                <div className="my-2 h-px bg-border" />
                <button
                  onClick={() => handleNav("for-advocates")}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground hover:bg-secondary/60 transition-colors"
                >
                  <Users className="size-4 text-accent" weight="regular" />
                  Advokat sifatida ro'yxatdan o'tish
                </button>
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        setDashboardOpen(true);
                      }}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground hover:bg-secondary/60 transition-colors"
                    >
                      <SquaresFour className="size-4 text-accent" weight="regular" />
                      Mening kabinetim
                    </button>
                    {user.role === "ADVOCATE" && (
                      <button
                        onClick={() => handleNav("advocate-dashboard")}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground hover:bg-secondary/60 transition-colors"
                      >
                        <Briefcase className="size-4 text-accent" weight="regular" />
                        Advokat kabineti
                      </button>
                    )}
                    {user.role === "ADMIN" && (
                      <button
                        onClick={() => handleNav("admin-panel")}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground hover:bg-secondary/60 transition-colors"
                      >
                        <Shield className="size-4 text-accent" weight="regular" />
                        Admin panel
                      </button>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
                    >
                      <SignOut className="size-4" weight="regular" />
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
                    className="mt-2"
                  >
                    <SignIn className="size-4" weight="regular" />
                    Kirish / Ro'yxatdan o'tish
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setMobileOpen(false);
                    setPostRequestOpen(true);
                  }}
                  variant="primary"
                  tone="brand"
                  className="mt-2"
                >
                  <Plus className="size-4" weight="bold" />
                  So'rov joylash
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
