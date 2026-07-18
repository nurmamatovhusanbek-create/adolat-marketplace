"use client";

import { useState } from "react";
import { Scale, Search, Menu, FileText, Users, Briefcase, Plus, HelpCircle, LogIn, LogOut, LayoutDashboard, Shield, ArrowLeft } from "lucide-react";
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
  { label: "Qoidalar", view: "how-it-works", icon: HelpCircle },
];

// Views where the main nav should be hidden (admin/advocate dashboards)
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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-xl">
      {/* Top thin accent strip — editorial newspaper masthead touch */}
      <div className="h-0.5 w-full bg-accent" aria-hidden />

      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => handleNav("home")}
          className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-90"
          aria-label="Adolat bosh sahifa"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">
            <Scale className="h-5 w-5" />
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="font-serif text-lg font-bold tracking-tight text-foreground">Adolat</span>
            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Huquqiy marketplace
            </span>
          </div>
        </button>

        {/* Desktop nav — editorial section-divider style (hidden in admin/advocate views) */}
        {!hideNav && (
        <nav className="ml-2 hidden items-center gap-0 md:flex">
          {NAV_ITEMS.map((item, i) => (
            <div key={item.view} className="flex items-center">
              {i > 0 && <span className="text-border" aria-hidden>·</span>}
              <button
                onClick={() => handleNav(item.view)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  currentView === item.view
                    ? "text-foreground underline-accent"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </button>
            </div>
          ))}
        </nav>
        )}

        {/* Quick search — LobeHub style minimal (hidden in admin/advocate views) */}
        {!hideNav && (
        <form onSubmit={handleQuickSearch} className="ml-auto hidden flex-1 items-center lg:flex max-w-xs">
          <div className="relative w-full group">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent" />
            <Input
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Qidiring..."
              className="h-9 border-border/60 bg-secondary/30 pl-9 pr-3 text-sm transition-colors focus-visible:border-accent focus-visible:bg-background"
            />
          </div>
        </form>
        )}

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          {!hideNav && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNav("for-advocates")}
            className="hidden sm:inline-flex gap-1.5"
          >
            <Users className="h-3.5 w-3.5" />
            Advokat uchun
          </Button>
          <Button
            size="sm"
            onClick={() => setPostRequestOpen(true)}
            className="gap-1.5 bg-foreground text-background hover:bg-foreground/90"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">So'rov joylash</span>
            <span className="sm:hidden">So'rov</span>
          </Button>
          )}

          {/* Back to site button for admin/advocate views */}
          {hideNav && (
          <Button variant="outline" size="sm" onClick={() => handleNav("home")} className="gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            Bosh sahifa
          </Button>
          )}

          {/* User menu / sign in */}
          {userLoading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-secondary" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={user.avatarUrl ?? undefined} />
                    <AvatarFallback className="bg-foreground/10 text-xs font-bold text-foreground">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="flex flex-col gap-1 pb-3">
                  <span className="text-sm font-bold">{user.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "mt-1 w-fit gap-1 text-[10px]",
                      user.role === "ADMIN" && "border-accent/40 bg-accent/10 text-accent",
                      user.role === "ADVOCATE" && "border-trust-verified/40 bg-trust-verified/10 text-trust-verified",
                      user.role === "CLIENT" && "border-border text-muted-foreground"
                    )}
                  >
                    {user.role === "ADMIN" && <Shield className="h-2.5 w-2.5" />}
                    {user.role}
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDashboardOpen(true)} className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Mening kabinetim
                  {user.counts.unreadMessages > 0 && (
                    <Badge className="ml-auto bg-accent text-accent-foreground text-[10px]">
                      {user.counts.unreadMessages}
                    </Badge>
                  )}
                </DropdownMenuItem>
                {user.role === "ADVOCATE" && (
                  <DropdownMenuItem onClick={() => handleNav("advocate-dashboard")} className="gap-2">
                    <Briefcase className="h-4 w-4" />
                    Advokat kabineti
                  </DropdownMenuItem>
                )}
                {user.role === "ADMIN" && (
                  <DropdownMenuItem onClick={() => handleNav("admin-panel")} className="gap-2">
                    <Shield className="h-4 w-4" />
                    Admin panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => handleNav("home")} className="gap-2">
                  <Users className="h-4 w-4" />
                  Profil sozlamalari
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-[11px] text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Draflar:</span>
                    <span className="font-semibold text-foreground">{user.counts.drafts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Faol so'rovlar:</span>
                    <span className="font-semibold text-foreground">{user.counts.activeRequests}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="gap-2 text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" />
                  Tizimdan chiqish
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAuthOpen(true, "signin")}
              className="gap-1.5"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Kirish</span>
            </Button>
          )}

          {/* Mobile sheet */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menyu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0">
              <SheetHeader className="border-b p-4">
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background">
                    <Scale className="h-4 w-4" />
                  </div>
                  <span className="font-serif text-base font-bold">Adolat</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 p-3">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.view}
                    onClick={() => handleNav(item.view)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors",
                      currentView === item.view
                        ? "bg-secondary text-foreground"
                        : "text-foreground hover:bg-secondary/60"
                    )}
                  >
                    <item.icon className="h-4 w-4 text-accent" />
                    {item.label}
                  </button>
                ))}
                <div className="my-2 h-px bg-border" />
                <button
                  onClick={() => handleNav("for-advocates")}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-foreground hover:bg-secondary/60"
                >
                  <Users className="h-4 w-4 text-accent" />
                  Advokat sifatida ro'yxatdan o'tish
                </button>
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        setDashboardOpen(true);
                      }}
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-foreground hover:bg-secondary/60"
                    >
                      <LayoutDashboard className="h-4 w-4 text-accent" />
                      Mening kabinetim
                    </button>
                    {user.role === "ADVOCATE" && (
                      <button
                        onClick={() => handleNav("advocate-dashboard")}
                        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-foreground hover:bg-secondary/60"
                      >
                        <Briefcase className="h-4 w-4 text-accent" />
                        Advokat kabineti
                      </button>
                    )}
                    {user.role === "ADMIN" && (
                      <button
                        onClick={() => handleNav("admin-panel")}
                        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-foreground hover:bg-secondary/60"
                      >
                        <Shield className="h-4 w-4 text-accent" />
                        Admin panel
                      </button>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-destructive hover:bg-destructive/5"
                    >
                      <LogOut className="h-4 w-4" />
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
                    className="gap-1.5"
                  >
                    <LogIn className="h-4 w-4" />
                    Kirish / Ro'yxatdan o'tish
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setMobileOpen(false);
                    setPostRequestOpen(true);
                  }}
                  className="mt-2 bg-foreground text-background hover:bg-foreground/90"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
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
