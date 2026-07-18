"use client";

import { useEffect, useState } from "react";
import {
  Briefcase, MessageSquare, Star, TrendingUp, Eye, Clock,
  CheckCircle2, AlertCircle, Loader2, ArrowRight, Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { useAppUser } from "@/lib/auth/user-provider";
import { openChatWith } from "@/components/chat/chat-panel";
import { formatPrice } from "@/lib/marketplace/format";
import { SPECIALTIES, REGIONS } from "@/lib/marketplace/data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AdvocateStats {
  approved: boolean;
  message?: string;
  stats?: {
    totalResponses: number;
    acceptedResponses: number;
    conversations: number;
    unreadMessages: number;
    matchingRequests: number;
    rating: number;
    reviewsCount: number;
    casesResolved: number;
    successRate: number;
  };
  profile?: { slug: string };
}

interface AdvocateRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  region: string;
  city: string;
  clientType: string;
  isUrgent: boolean;
  status: string;
  budgetMin: number | null;
  budgetMax: number | null;
  viewsCount: number;
  responsesCount: number;
  createdAt: string;
  postedAgo: string;
  hasResponded: boolean;
}

export function AdvocateDashboard() {
  const { setDashboardOpen } = useMarketplaceStore();
  const { user } = useAppUser();
  const [stats, setStats] = useState<AdvocateStats | null>(null);
  const [requests, setRequests] = useState<AdvocateRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (!user || user.role !== "ADVOCATE") return;
    Promise.all([
      fetch("/api/advocate/stats", { credentials: "same-origin" }).then(r => r.json()),
      fetch("/api/advocate/requests?filter=matching", { credentials: "same-origin" }).then(r => r.json()),
    ]).then(([s, r]) => {
      setStats(s);
      setRequests(r.requests ?? []);
    }).catch(() => {
      toast.error("Ma'lumotlarni yuklab bo'lmadi");
    }).finally(() => setLoading(false));
  }, [user]);

  if (!user || user.role !== "ADVOCATE") return null;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  // Not approved yet
  if (stats && !stats.approved) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Card className="border-amber-200 bg-amber-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <Clock className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="font-serif text-xl font-bold text-amber-900">Tasdiqlash kutilmoqda</h2>
          <p className="mt-2 text-sm text-amber-700">
            {stats.message || "Profilingiz administrator tomonidan ko'rib chiqilmoqda. Odatda bu 24 soat ichida sodir bo'ladi."}
          </p>
          <p className="mt-4 text-xs text-amber-600">
            Tasdiqlangandan so'ng, siz mijozlar bilan ishlashni boshlashingiz mumkin bo'ladi.
          </p>
        </Card>
      </div>
    );
  }

  const s = stats?.stats;
  if (!s) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            <Briefcase className="h-7 w-7 text-accent" />
            Advokat kabineti
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Xush kelibsiz, {user.name}. Bu yerda sizning statistikangiz va so'rovlar.
          </p>
        </div>
        <Button variant="outline" onClick={() => setDashboardOpen(true)} className="gap-1.5">
          <MessageSquare className="h-4 w-4" />
          Mijoz kabineti
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:grid-cols-4">
          <TabsTrigger value="overview" className="gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Umumiy</span>
          </TabsTrigger>
          <TabsTrigger value="requests" className="gap-1.5">
            <Briefcase className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">So'rovlar</span>
            {s.matchingRequests > 0 && (
              <Badge className="bg-accent text-accent-foreground text-[9px]">{s.matchingRequests}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="messages" className="gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Xabarlar</span>
            {s.unreadMessages > 0 && (
              <Badge className="bg-accent text-accent-foreground text-[9px]">{s.unreadMessages}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-1.5">
            <Star className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
        </TabsList>

        {/* === OVERVIEW === */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              icon={<Briefcase className="h-5 w-5 text-accent" />}
              value={String(s.totalResponses)}
              label="Javob berilgan so'rovlar"
            />
            <StatCard
              icon={<CheckCircle2 className="h-5 w-5 text-trust-verified" />}
              value={String(s.acceptedResponses)}
              label="Qabul qilingan"
            />
            <StatCard
              icon={<MessageSquare className="h-5 w-5 text-trust-premium" />}
              value={String(s.conversations)}
              label="Faol suhbatlar"
            />
            <StatCard
              icon={<Star className="h-5 w-5 fill-trust-premium text-trust-premium" />}
              value={s.rating > 0 ? s.rating.toFixed(1) : "—"}
              label={`Reyting (${s.reviewsCount} sharh)`}
            />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Card className="border-border p-5">
              <h3 className="mb-3 flex items-center gap-2 font-serif text-base font-bold">
                <TrendingUp className="h-4 w-4 text-accent" />
                Muvaffaqiyat ko'rsatkichlari
              </h3>
              <div className="space-y-3">
                <Metric label="Yechilgan ishlar" value={String(s.casesResolved)} />
                <Metric label="Muvaffaqiyat darajasi" value={`${s.successRate}%`} />
                <Metric label="Javob berish darajasi" value={s.totalResponses > 0 ? `${Math.round((s.acceptedResponses / s.totalResponses) * 100)}%` : "—"} />
              </div>
            </Card>

            <Card className="border-border p-5">
              <h3 className="mb-3 flex items-center gap-2 font-serif text-base font-bold">
                <Clock className="h-4 w-4 text-accent" />
                So'nggi so'rovlar
              </h3>
              {requests.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Hozircha sohangingizga mos so'rovlar yo'q
                </p>
              ) : (
                <div className="space-y-2">
                  {requests.slice(0, 4).map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setTab("requests")}
                      className="flex w-full items-center justify-between rounded-md border border-border p-2 text-left transition-colors hover:bg-secondary/50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{r.title}</p>
                        <p className="text-[10px] text-muted-foreground">{r.postedAgo}</p>
                      </div>
                      {r.isUrgent && <Badge className="bg-trust-urgent/15 text-trust-urgent text-[9px]">Shoshilinch</Badge>}
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* === REQUESTS === */}
        <TabsContent value="requests" className="mt-6">
          <RequestList requests={requests} advocateId={stats?.profile?.slug ?? ""} />
        </TabsContent>

        {/* === MESSAGES === */}
        <TabsContent value="messages" className="mt-6">
          <MessagesTab unreadCount={s.unreadMessages} />
        </TabsContent>

        {/* === PROFILE === */}
        <TabsContent value="profile" className="mt-6">
          <ProfileTab user={user} stats={s} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <Card className="border-border p-4">
      <div className="mb-2">{icon}</div>
      <div className="font-serif text-2xl font-bold text-foreground">{value}</div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-serif font-bold text-foreground">{value}</span>
    </div>
  );
}

function RequestList({ requests }: { requests: AdvocateRequest[]; advocateId: string }) {
  if (requests.length === 0) {
    return (
      <Card className="border-border p-12 text-center">
        <Briefcase className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
        <h3 className="font-serif text-base font-bold">So'rovlar yo'q</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Sizning sohangizga mos so'rovlar paydo bo'lganda bu yerda ko'rinadi.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((r) => (
        <Card key={r.id} className="border-border p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                <Badge variant="secondary" className="text-[11px]">
                  {SPECIALTIES[r.category as keyof typeof SPECIALTIES]?.uz ?? r.category}
                </Badge>
                {r.isUrgent && (
                  <Badge className="bg-trust-urgent/15 text-trust-urgent hover:bg-trust-urgent/15 text-[11px]">
                    Shoshilinch
                  </Badge>
                )}
                {r.hasResponded && (
                  <Badge className="bg-trust-verified/15 text-trust-verified hover:bg-trust-verified/15 text-[11px] gap-1">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    Javob berildi
                  </Badge>
                )}
              </div>
              <h3 className="font-serif text-base font-bold text-foreground">{r.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <span>{REGIONS[r.region as keyof typeof REGIONS]?.uz ?? r.city}</span>
                <span>·</span>
                <span>{r.postedAgo}</span>
                <span>·</span>
                <span>{r.viewsCount} ko'rish</span>
                <span>·</span>
                <span>{r.responsesCount} javob</span>
                {r.budgetMin && r.budgetMax && (
                  <>
                    <span>·</span>
                    <span className="text-trust-verified">{formatPrice(r.budgetMin)} — {formatPrice(r.budgetMax)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function MessagesTab({ unreadCount }: { unreadCount: number }) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/conversations", { credentials: "same-origin" })
      .then(r => r.json())
      .then(d => setConversations(d.conversations ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  if (conversations.length === 0) {
    return (
      <Card className="border-border p-12 text-center">
        <MessageSquare className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
        <h3 className="font-serif text-base font-bold">Suhbatlar yo'q</h3>
        <p className="mt-1 text-sm text-muted-foreground">Mijozlar siz bilan bog'langanda suhbatlar bu yerda ko'rinadi.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {conversations.map((c) => {
        const other = c.participants.find((p: any) => p.id !== useAppUser);
        return (
          <Card key={c.id} className="border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-serif text-sm font-bold">{other?.name ?? "Noma'lum"}</span>
                  {c.unreadCount > 0 && (
                    <Badge className="bg-accent text-accent-foreground text-[9px]">{c.unreadCount}</Badge>
                  )}
                </div>
                {c.lastMessage && (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{c.lastMessage.content}</p>
                )}
              </div>
              <Button size="sm" variant="outline" className="gap-1"
                onClick={() => other && openChatWith(other.id, other.name)}>
                <MessageSquare className="h-3.5 w-3.5" />
                Ochish
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function ProfileTab({ user, stats }: { user: any; stats: any }) {
  return (
    <Card className="border-border p-6">
      <h3 className="mb-4 font-serif text-lg font-bold">Mening profilim</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Ism</label>
          <p className="font-serif font-bold text-foreground">{user.name}</p>
        </div>
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Email</label>
          <p className="font-serif font-bold text-foreground">{user.email}</p>
        </div>
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Telefon</label>
          <p className="font-serif font-bold text-foreground">{user.phone ?? "—"}</p>
        </div>
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Rol</label>
          <Badge className="bg-trust-verified/15 text-trust-verified">{user.role}</Badge>
        </div>
      </div>
      <div className="mt-6 border-t border-border pt-4">
        <h4 className="mb-3 font-serif text-sm font-bold">Statistika</h4>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Reyting" value={stats.rating > 0 ? stats.rating.toFixed(1) : "—"} />
          <Metric label="Sharhlar" value={String(stats.reviewsCount)} />
          <Metric label="Ishlar" value={String(stats.casesResolved)} />
          <Metric label="Muvaffaqiyat" value={`${stats.successRate}%`} />
        </div>
      </div>
    </Card>
  );
}
