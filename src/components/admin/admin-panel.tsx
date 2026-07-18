"use client";

import { useEffect, useState } from "react";
import {
  Shield, Users, Briefcase, FileText, MessageSquare, Activity,
  CheckCircle2, XCircle, Loader2, Star, Clock, AlertCircle,
  TrendingUp, FileCheck2, Eye,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppUser } from "@/lib/auth/user-provider";
import { SPECIALTIES, REGIONS } from "@/lib/marketplace/data";
import { formatPrice } from "@/lib/marketplace/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AdminStats {
  users: { total: number; advocates: number; clients: number; admins: number };
  advocates: { pending: number; verified: number };
  documents: { total: number; drafts: number };
  requests: { total: number; open: number };
  messaging: { conversations: number; messages: number };
  audit: { totalLogs: number };
  recent: { signups: number; downloads: number; requests: number; messages: number };
}

interface Approval {
  id: string;
  name: string;
  email: string;
  phone: string;
  titleUz: string;
  specialty: string;
  region: string;
  city: string;
  licenseNumber: string;
  experienceYears: number;
  bioUz: string;
  expertise: string[];
  languages: string[];
  createdAt: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  createdAt: string;
  lastLoginAt: string | null;
  draftsCount: number;
  requestsCount: number;
  messagesCount: number;
  advocateProfile: { id: string; slug: string; licenseVerified: boolean; verified: boolean } | null;
}

interface AuditLog {
  id: string;
  action: string;
  resourceType: string | null;
  resourceId: string | null;
  metadata: Record<string, unknown>;
  ipAddress: string | null;
  success: boolean;
  createdAt: string;
  user: { name: string; email: string; role: string } | null;
}

export function AdminPanel() {
  const { user } = useAppUser();
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [auditPage, setAuditPage] = useState(1);
  const [auditTotal, setAuditTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const loadData = (tabName: string) => {
    if (tabName === "overview" && !stats) {
      fetch("/api/admin/stats", { credentials: "same-origin" })
        .then(r => r.json()).then(setStats).catch(() => {});
    }
    if (tabName === "approvals" && approvals.length === 0) {
      fetch("/api/admin/approvals", { credentials: "same-origin" })
        .then(r => r.json()).then(d => setApprovals(d.approvals ?? [])).catch(() => {});
    }
    if (tabName === "users" && users.length === 0) {
      fetch("/api/admin/users?page=1&pageSize=50", { credentials: "same-origin" })
        .then(r => r.json()).then(d => setUsers(d.users ?? [])).catch(() => {});
    }
    if (tabName === "audit") {
      fetch(`/api/admin/audit-logs?page=${auditPage}&pageSize=30`, { credentials: "same-origin" })
        .then(r => r.json()).then(d => { setLogs(d.logs ?? []); setAuditTotal(d.pagination?.total ?? 0); }).catch(() => {});
    }
  };

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;
    loadData("overview");
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadData(tab);
  }, [tab]);

  const handleApprove = async (advocateId: string, action: "approve" | "reject") => {
    setProcessing(advocateId);
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ advocateId, action }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      toast.success(action === "approve" ? "Advokat tasdiqlandi" : "Advokat rad etildi", {
        description: data.advocateName,
      });
      setApprovals(prev => prev.filter(a => a.id !== advocateId));
      // Refresh stats
      fetch("/api/admin/stats", { credentials: "same-origin" })
        .then(r => r.json()).then(setStats).catch(() => {});
    } catch {
      toast.error("Amalga oshmadi");
    } finally {
      setProcessing(null);
    }
  };

  if (!user || user.role !== "ADMIN") return null;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="flex items-center gap-2 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          <Shield className="h-7 w-7 text-accent" />
          Admin panel
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platformani boshqaring: advokatlarni tasdiqlang, foydalanuvchilarni ko'ring, audit loglarni tekshiring.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
          <TabsTrigger value="overview" className="gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Statistika</span>
          </TabsTrigger>
          <TabsTrigger value="approvals" className="gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tasdiqlash</span>
            {stats && stats.advocates.pending > 0 && (
              <Badge className="bg-accent text-accent-foreground text-[9px]">{stats.advocates.pending}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Foydalanuvchilar</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-1.5">
            <Activity className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Audit</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Hujjatlar</span>
          </TabsTrigger>
        </TabsList>

        {/* === OVERVIEW === */}
        <TabsContent value="overview" className="mt-6">
          {stats ? (
            <>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard icon={<Users className="h-5 w-5 text-accent" />} value={String(stats.users.total)} label="Jami foydalanuvchilar" sub={`${stats.recent.signups} yangi (7 kun)`} />
                <StatCard icon={<Briefcase className="h-5 w-5 text-trust-verified" />} value={String(stats.advocates.verified)} label="Tasdiqlangan advokatlar" sub={`${stats.advocates.pending} kutilmoqda`} />
                <StatCard icon={<FileText className="h-5 w-5 text-trust-premium" />} value={String(stats.documents.total)} label="Hujjat shablonlari" sub={`${stats.documents.drafts} draf`} />
                <StatCard icon={<MessageSquare className="h-5 w-5 text-accent" />} value={String(stats.messaging.messages)} label="Jami xabarlar" sub={`${stats.recent.messages} yangi (7 kun)`} />
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <Card className="border-border p-5">
                  <h3 className="mb-3 flex items-center gap-2 font-serif text-base font-bold">
                    <Activity className="h-4 w-4 text-accent" />
                    So'nggi faollik (7 kun)
                  </h3>
                  <div className="space-y-3">
                    <Metric label="Yangi ro'yxatdan o'tishlar" value={String(stats.recent.signups)} />
                    <Metric label="Hujjat yuklab olishlar" value={String(stats.recent.downloads)} />
                    <Metric label="Yangi huquqiy so'rovlar" value={String(stats.recent.requests)} />
                    <Metric label="Yangi xabarlar" value={String(stats.recent.messages)} />
                  </div>
                </Card>

                <Card className="border-border p-5">
                  <h3 className="mb-3 flex items-center gap-2 font-serif text-base font-bold">
                    <Shield className="h-4 w-4 text-accent" />
                    Foydalanuvchilar tarkibi
                  </h3>
                  <div className="space-y-3">
                    <Metric label="Mijozlar" value={String(stats.users.clients)} />
                    <Metric label="Advokatlar" value={String(stats.users.advocates)} />
                    <Metric label="Administratorlar" value={String(stats.users.admins)} />
                    <Metric label="Ochiq so'rovlar" value={String(stats.requests.open)} />
                  </div>
                </Card>
              </div>
            </>
          ) : (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
          )}
        </TabsContent>

        {/* === APPROVALS === */}
        <TabsContent value="approvals" className="mt-6">
          {approvals.length === 0 ? (
            <Card className="border-border p-12 text-center">
              <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-trust-verified" />
              <h3 className="font-serif text-base font-bold">Tasdiqlash kutilayotgan advokatlar yo'q</h3>
              <p className="mt-1 text-sm text-muted-foreground">Barcha yangi ro'yxatdan o'tgan advokatlar tasdiqlangan.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {approvals.map((a) => (
                <Card key={a.id} className="border-border p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="font-serif text-base font-bold text-foreground">{a.name}</h3>
                        <Badge variant="secondary" className="text-[11px]">
                          {SPECIALTIES[a.specialty as keyof typeof SPECIALTIES]?.uz ?? a.specialty}
                        </Badge>
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[11px] gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          Kutilmoqda
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{a.titleUz}</p>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{a.bioUz}</p>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                        <Info label="Litsenziya" value={a.licenseNumber} mono />
                        <Info label="Tajriba" value={`${a.experienceYears} yil`} />
                        <Info label="Viloyat" value={REGIONS[a.region as keyof typeof REGIONS]?.uz ?? a.region} />
                        <Info label="Telefon" value={a.phone} />
                      </div>

                      {a.expertise.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {a.expertise.slice(0, 5).map((e, i) => (
                            <Badge key={i} variant="outline" className="text-[10px]">{e}</Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex shrink-0 flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(a.id, "approve")}
                        disabled={processing === a.id}
                        className="gap-1.5 bg-trust-verified text-white hover:bg-trust-verified/90"
                      >
                        {processing === a.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                        Tasdiqlash
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(a.id, "reject")}
                        disabled={processing === a.id}
                        className="gap-1.5 text-trust-urgent hover:bg-trust-urgent/5"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Rad etish
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* === USERS === */}
        <TabsContent value="users" className="mt-6">
          <Card className="border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/50">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Foydalanuvchi</th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Rol</th>
                    <th className="hidden px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:table-cell">Holat</th>
                    <th className="hidden px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:table-cell">Faollik</th>
                    <th className="hidden px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground lg:table-cell">Ro'yxat</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className="px-4 py-3">
                        <div className="font-serif font-bold text-foreground">{u.name}</div>
                        <div className="text-[10px] text-muted-foreground">{u.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={cn(
                          "text-[10px]",
                          u.role === "ADMIN" && "bg-accent/15 text-accent",
                          u.role === "ADVOCATE" && "bg-trust-verified/15 text-trust-verified",
                          u.role === "CLIENT" && "bg-secondary text-muted-foreground",
                        )}>{u.role}</Badge>
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <Badge variant="outline" className={cn(
                          "text-[10px]",
                          u.status === "ACTIVE" && "border-trust-verified/30 text-trust-verified",
                          u.status === "PENDING" && "border-amber-300 text-amber-700",
                          u.status === "SUSPENDED" && "border-trust-urgent/30 text-trust-urgent",
                        )}>{u.status}</Badge>
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <div className="flex gap-2 font-mono text-[10px] text-muted-foreground">
                          <span>{u.draftsCount} draf</span>
                          <span>{u.requestsCount} so'rov</span>
                          <span>{u.messagesCount} xabar</span>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 lg:table-cell text-[10px] text-muted-foreground">
                        {new Date(u.createdAt).toLocaleDateString("uz-UZ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* === AUDIT LOGS === */}
        <TabsContent value="audit" className="mt-6">
          <Card className="border-border overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead className="sticky top-0 border-b border-border bg-secondary/80 backdrop-blur">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Vaqt</th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Harakat</th>
                    <th className="hidden px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:table-cell">Foydalanuvchi</th>
                    <th className="hidden px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground lg:table-cell">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((l) => (
                    <tr key={l.id} className="border-b border-border/30 hover:bg-secondary/20">
                      <td className="px-4 py-2 font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                        {new Date(l.createdAt).toLocaleString("uz-UZ", { dateStyle: "short", timeStyle: "short" })}
                      </td>
                      <td className="px-4 py-2">
                        <Badge variant={l.success ? "default" : "destructive"} className="text-[9px] font-mono">
                          {l.action}
                        </Badge>
                      </td>
                      <td className="hidden px-4 py-2 sm:table-cell">
                        {l.user ? (
                          <div>
                            <span className="text-xs font-medium">{l.user.name}</span>
                            <span className="ml-1 text-[10px] text-muted-foreground">({l.user.role})</span>
                          </div>
                        ) : <span className="text-[10px] text-muted-foreground">—</span>}
                      </td>
                      <td className="hidden px-4 py-2 lg:table-cell font-mono text-[10px] text-muted-foreground">
                        {l.ipAddress ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          {/* Pagination */}
          {auditTotal > 30 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Sahifa {auditPage} / {Math.ceil(auditTotal / 30)} · Jami {auditTotal} yozuv
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={auditPage <= 1}
                  onClick={() => { const p = auditPage - 1; setAuditPage(p); fetch(`/api/admin/audit-logs?page=${p}&pageSize=30`, { credentials: "same-origin" }).then(r => r.json()).then(d => { setLogs(d.logs ?? []); setAuditTotal(d.pagination?.total ?? 0); }); }}>
                  Oldingi
                </Button>
                <Button size="sm" variant="outline" disabled={auditPage >= Math.ceil(auditTotal / 30)}
                  onClick={() => { const p = auditPage + 1; setAuditPage(p); fetch(`/api/admin/audit-logs?page=${p}&pageSize=30`, { credentials: "same-origin" }).then(r => r.json()).then(d => { setLogs(d.logs ?? []); setAuditTotal(d.pagination?.total ?? 0); }); }}>
                  Keyingi
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="documents" className="mt-6">
          <Card className="border-border p-6 text-center">
            <FileCheck2 className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
            <h3 className="font-serif text-base font-bold">Hujjat boshqaruvi</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Hujjat shablonlarini qo'shish, tahrirlash va o'chirish funksiyasi keyingi versiyada qo'shiladi.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Hozirda {stats?.documents.total ?? 0} ta hujjat shabloni mavjud.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ icon, value, label, sub }: { icon: React.ReactNode; value: string; label: string; sub?: string }) {
  return (
    <Card className="border-border p-4">
      <div className="mb-2">{icon}</div>
      <div className="font-serif text-2xl font-bold text-foreground">{value}</div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
      {sub && <div className="mt-1 text-[10px] text-accent">{sub}</div>}
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

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("text-xs font-medium text-foreground", mono && "font-mono")}>{value}</div>
    </div>
  );
}
