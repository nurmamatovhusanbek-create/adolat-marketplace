"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Briefcase,
  MessageSquare,
  Clock,
  Download,
  Trash2,
  Loader2,
  Inbox,
  FileCheck2,
  Activity,
} from "lucide-react";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { useAppUser } from "@/lib/auth/user-provider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Draft {
  id: string;
  status: string;
  version: number;
  downloadCount: number;
  lastDownloadedAt: string | null;
  createdAt: string;
  updatedAt: string;
  document: {
    id: string;
    slug: string;
    titleUz: string;
    category: string;
    pages: number;
  };
}

interface UserRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  region: string;
  city: string;
  status: string;
  isUrgent: boolean;
  responsesCount: number;
  viewsCount: number;
  budgetMin: number | null;
  budgetMax: number | null;
  createdAt: string;
}

export function Dashboard() {
  const { isDashboardOpen, setDashboardOpen, setEditorDocumentSlug, setEditorDraftId } = useMarketplaceStore();
  const { user, refresh } = useAppUser();
  const [tab, setTab] = useState("drafts");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDrafts = useCallback(async () => {
    try {
      const res = await fetch("/api/drafts", { credentials: "same-origin" });
      if (!res.ok) return;
      const data = await res.json();
      setDrafts(data.drafts);
    } catch {
      // silent
    }
  }, []);

  const loadRequests = useCallback(async () => {
    try {
      // Note: we don't have a "my requests" endpoint yet, so fetch all OPEN and filter
      // For demo we'll fetch all open requests. In production this would be /api/me/requests.
      const res = await fetch("/api/requests?page=1&pageSize=50", { credentials: "same-origin" });
      if (!res.ok) return;
      const data = await res.json();
      // Just show all open requests for now (the user may have posted them)
      setRequests(data.requests);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    if (isDashboardOpen && user) {
      setLoading(true);
      Promise.all([loadDrafts(), loadRequests()]).finally(() => setLoading(false));
    }
  }, [isDashboardOpen, user, loadDrafts, loadRequests]);

  const handleDeleteDraft = async (id: string) => {
    if (!confirm("Bu drafni o'chirishni xohlaysizmi?")) return;
    try {
      const res = await fetch(`/api/drafts/${id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (!res.ok) throw new Error();
      setDrafts((d) => d.filter((x) => x.id !== id));
      toast.success("Draf o'chirildi");
      refresh();
    } catch {
      toast.error("O'chirib bo'lmadi");
    }
  };

  const handleResumeDraft = (draft: Draft) => {
    setEditorDraftId(draft.id);
    setEditorDocumentSlug(draft.document.slug);
    setDashboardOpen(false);
  };

  return (
    <Sheet open={isDashboardOpen} onOpenChange={setDashboardOpen}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-5xl lg:max-w-6xl">
        <SheetHeader className="border-b p-6">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Activity className="h-5 w-5 text-primary" />
            Mening kabinetim
          </SheetTitle>
          {user && (
            <p className="text-sm text-muted-foreground">
              {user.name} · {user.role}
            </p>
          )}
        </SheetHeader>

        <div className="p-6">
          {/* Stat cards */}
          {user && (
            <div className="mb-6 grid grid-cols-3 gap-3">
              <StatCard
                icon={<FileText className="h-4 w-4 text-primary" />}
                value={user.counts.drafts}
                label="Saqlangan draflar"
              />
              <StatCard
                icon={<Briefcase className="h-4 w-4 text-emerald-600" />}
                value={user.counts.activeRequests}
                label="Faol so'rovlar"
              />
              <StatCard
                icon={<MessageSquare className="h-4 w-4 text-amber-600" />}
                value={user.counts.unreadMessages}
                label="O'qilmagan xabarlar"
              />
            </div>
          )}

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="drafts" className="gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Mening draflarim
              </TabsTrigger>
              <TabsTrigger value="requests" className="gap-1.5">
                <Briefcase className="h-3.5 w-3.5" />
                So'rovlarim
              </TabsTrigger>
            </TabsList>

            <TabsContent value="drafts" className="mt-4">
              {loading ? (
                <div className="flex h-32 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : drafts.length === 0 ? (
                <EmptyState
                  icon={<Inbox className="h-10 w-10" />}
                  title="Draflar yo'q"
                  description="Hujjat to'ldirib, draf sifatida saqlang. Bu yerda ko'rinadi."
                />
              ) : (
                <div className="space-y-3">
                  {drafts.map((d) => (
                    <Card key={d.id} className="border-border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <FileCheck2 className="h-4 w-4 shrink-0 text-primary" />
                            <h3 className="truncate text-sm font-bold text-foreground">
                              {d.document.titleUz}
                            </h3>
                            <Badge
                              variant="outline"
                              className={cn(
                                "shrink-0 text-[10px]",
                                d.status === "COMPLETED" && "border-emerald-300 bg-emerald-50 text-emerald-700"
                              )}
                            >
                              {d.status === "COMPLETED" ? "Yakunlangan" : "Draf"}
                            </Badge>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(d.updatedAt).toLocaleString("uz-UZ")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              {d.downloadCount} yuklash
                            </span>
                            <span>v{d.version}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-end gap-2 border-t border-border pt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDraft(d.id)}
                          className="gap-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          O'chirish
                        </Button>
                        <Button size="sm" onClick={() => handleResumeDraft(d)} className="gap-1">
                          <FileText className="h-3.5 w-3.5" />
                          Davom ettirish
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="requests" className="mt-4">
              {loading ? (
                <div className="flex h-32 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : requests.length === 0 ? (
                <EmptyState
                  icon={<Inbox className="h-10 w-10" />}
                  title="So'rovlar yo'q"
                  description="Huquqiy so'rovingizni joylang va advokatlardan javob oling."
                />
              ) : (
                <div className="space-y-3">
                  {requests.map((r) => (
                    <Card key={r.id} className="border-border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                            <Badge variant="secondary" className="text-[10px]">
                              {r.category}
                            </Badge>
                            {r.isUrgent && (
                              <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-[10px]">
                                Shoshilinch
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px]",
                                r.status === "OPEN" && "border-emerald-300 bg-emerald-50 text-emerald-700"
                              )}
                            >
                              {r.status === "OPEN" ? "Ochiq" : r.status}
                            </Badge>
                          </div>
                          <h3 className="text-sm font-bold text-foreground">{r.title}</h3>
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{r.description}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(r.createdAt).toLocaleDateString("uz-UZ")}
                            </span>
                            <span>{r.responsesCount} javob</span>
                            <span>{r.viewsCount} ko'rish</span>
                            {r.budgetMin && r.budgetMax && (
                              <span className="font-medium text-emerald-700">
                                {(r.budgetMin / 1000000).toFixed(1)}-{(r.budgetMax / 1000000).toFixed(1)} mln so'm
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <Card className="border-border p-3">
      <div className="mb-1.5 flex items-center gap-1.5">
        {icon}
      </div>
      <div className="text-xl font-bold text-foreground">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </Card>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <div className="text-muted-foreground/40">{icon}</div>
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      <p className="max-w-xs text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
