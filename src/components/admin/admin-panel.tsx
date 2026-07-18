"use client";

import { useEffect, useState } from "react";
import {
  Shield, Users, Briefcase, FileText, MessageSquare, Activity,
  CheckCircle2, XCircle, Loader2, Star, Clock, AlertCircle,
  TrendingUp, FileCheck2, Eye, ChevronLeft, ChevronRight,
  UserCheck, Download, Gavel, Scale,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppUser } from "@/lib/auth/user-provider";
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
  id: string; name: string; email: string; phone: string; titleUz: string;
  specialty: string; region: string; city: string; licenseNumber: string;
  experienceYears: number; bioUz: string; expertise: string[]; languages: string[];
  createdAt: string;
}

interface AdminUser {
  id: string; name: string; email: string; phone: string | null;
  role: string; status: string; createdAt: string; lastLoginAt: string | null;
  draftsCount: number; requestsCount: number; messagesCount: number;
  advocateProfile: { id: string; slug: string; licenseVerified: boolean; verified: boolean } | null;
}

interface AuditLog {
  id: string; action: string; resourceType: string | null; resourceId: string | null;
  metadata: Record<string, unknown>; ipAddress: string | null; success: boolean;
  createdAt: string; user: { name: string; email: string; role: string } | null;
}

interface AdminDoc {
  id: string; slug: string; titleUz: string; category: string; subcategory: string;
  pages: number; downloads: number; rating: number; isFree: boolean; isPopular: boolean;
  isNew: boolean; hasTemplate: boolean; fieldsCount: number; createdAt: string;
}

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  login_success: { label: "Tizimga kirish", color: "text-emerald-600" },
  login_failed: { label: "Kirish xatosi", color: "text-red-600" },
  signup: { label: "Ro'yxatdan o'tish", color: "text-blue-600" },
  doc_download: { label: "Hujjat yuklash", color: "text-amber-600" },
  request_post: { label: "So'rov joylash", color: "text-purple-600" },
  message_send: { label: "Xabar yuborish", color: "text-sky-600" },
  draft_create: { label: "Draf yaratish", color: "text-indigo-600" },
  draft_update: { label: "Draf yangilash", color: "text-indigo-600" },
  advocate_verify: { label: "Advokat tasdiqlash", color: "text-emerald-600" },
};

export function AdminPanel() {
  const { user } = useAppUser();
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [adminDocs, setAdminDocs] = useState<AdminDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [auditPage, setAuditPage] = useState(1);
  const [auditTotal, setAuditTotal] = useState(0);
  const [userFilter, setUserFilter] = useState("all");

  const loadData = async (tabName: string) => {
    if (tabName === "overview") {
      fetch("/api/admin/stats", { credentials: "same-origin" }).then(r => r.json()).then(setStats).catch(() => {});
    }
    if (tabName === "approvals") {
      fetch("/api/admin/approvals", { credentials: "same-origin" }).then(r => r.json()).then(d => setApprovals(d.approvals ?? [])).catch(() => {});
    }
    if (tabName === "users") {
      fetch("/api/admin/users?page=1&pageSize=100", { credentials: "same-origin" }).then(r => r.json()).then(d => setUsers(d.users ?? [])).catch(() => {});
    }
    if (tabName === "audit") {
      fetch(`/api/admin/audit-logs?page=${auditPage}&pageSize=30`, { credentials: "same-origin" })
        .then(r => r.json()).then(d => { setLogs(d.logs ?? []); setAuditTotal(d.pagination?.total ?? 0); }).catch(() => {});
    }
    if (tabName === "documents") {
      fetch("/api/admin/documents", { credentials: "same-origin" }).then(r => r.json()).then(d => setAdminDocs(d.documents ?? [])).catch(() => {});
    }
  };

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;
    loadData("overview");
    setLoading(false);
  }, [user]);

  useEffect(() => { loadData(tab); }, [tab, auditPage]);

  const handleApprove = async (advocateId: string, action: "approve" | "reject") => {
    setProcessing(advocateId);
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin",
        body: JSON.stringify({ advocateId, action }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      toast.success(action === "approve" ? "Advokat tasdiqlandi" : "Advokat rad etildi", { description: data.advocateName });
      setApprovals(prev => prev.filter(a => a.id !== advocateId));
      fetch("/api/admin/stats", { credentials: "same-origin" }).then(r => r.json()).then(setStats).catch(() => {});
    } catch { toast.error("Amalga oshmadi"); }
    finally { setProcessing(null); }
  };

  if (!user || user.role !== "ADMIN") return null;
  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;

  const filteredUsers = userFilter === "all" ? users : users.filter(u => u.role === userFilter);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          <Shield className="h-7 w-7 text-accent" /> Admin panel
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Platformani boshqaring: advokatlar, hujjatlar, foydalanuvchilar va statistika.</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
          <TabsTrigger value="overview" className="gap-1.5"><TrendingUp className="h-3.5 w-3.5" /><span className="hidden sm:inline">Statistika</span></TabsTrigger>
          <TabsTrigger value="approvals" className="gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /><span className="hidden sm:inline">Tasdiqlash</span>{stats && stats.advocates.pending > 0 && <Badge className="bg-accent text-accent-foreground text-[9px]">{stats.advocates.pending}</Badge>}</TabsTrigger>
          <TabsTrigger value="documents" className="gap-1.5"><FileText className="h-3.5 w-3.5" /><span className="hidden sm:inline">Hujjatlar</span></TabsTrigger>
          <TabsTrigger value="users" className="gap-1.5"><Users className="h-3.5 w-3.5" /><span className="hidden sm:inline">Foydalanuvchilar</span></TabsTrigger>
          <TabsTrigger value="audit" className="gap-1.5"><Activity className="h-3.5 w-3.5" /><span className="hidden sm:inline">Audit</span></TabsTrigger>
        </TabsList>

        {/* === OVERVIEW === */}
        <TabsContent value="overview" className="mt-6">
          {stats ? (
            <>
              {/* Main stats grid */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard icon={<Users className="h-5 w-5 text-accent" />} value={String(stats.users.total)} label="Jami foydalanuvchilar" sub={`${stats.recent.signups} yangi (7 kun)`} />
                <StatCard icon={<Briefcase className="h-5 w-5 text-trust-verified" />} value={String(stats.advocates.verified)} label="Tasdiqlangan advokatlar" sub={`${stats.advocates.pending} kutilmoqda`} />
                <StatCard icon={<FileText className="h-5 w-5 text-trust-premium" />} value={String(stats.documents.total)} label="Hujjat shablonlari" sub={`${stats.documents.drafts} draf`} />
                <StatCard icon={<MessageSquare className="h-5 w-5 text-accent" />} value={String(stats.messaging.messages)} label="Jami xabarlar" sub={`${stats.recent.messages} yangi (7 kun)`} />
              </div>

              {/* Charts row */}
              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {/* User breakdown */}
                <Card className="border-border p-5">
                  <h3 className="mb-4 flex items-center gap-2 font-serif text-base font-bold"><Users className="h-4 w-4 text-accent" />Foydalanuvchilar tarkibi</h3>
                  <div className="space-y-3">
                    <BarRow label="Mijozlar" value={stats.users.clients} total={stats.users.total} color="bg-sky-500" />
                    <BarRow label="Advokatlar" value={stats.users.advocates} total={stats.users.total} color="bg-emerald-500" />
                    <BarRow label="Adminlar" value={stats.users.admins} total={stats.users.total} color="bg-accent" />
                  </div>
                </Card>

                {/* Activity chart */}
                <Card className="border-border p-5">
                  <h3 className="mb-4 flex items-center gap-2 font-serif text-base font-bold"><Activity className="h-4 w-4 text-accent" />Faollik (7 kun)</h3>
                  <div className="space-y-3">
                    <BarRow label="Yangi ro'yxatdan o'tishlar" value={stats.recent.signups} total={Math.max(stats.recent.signups, stats.recent.downloads, stats.recent.requests, stats.recent.messages, 1)} color="bg-blue-500" />
                    <BarRow label="Hujjat yuklab olishlar" value={stats.recent.downloads} total={Math.max(stats.recent.signups, stats.recent.downloads, stats.recent.requests, stats.recent.messages, 1)} color="bg-amber-500" />
                    <BarRow label="Yangi so'rovlar" value={stats.recent.requests} total={Math.max(stats.recent.signups, stats.recent.downloads, stats.recent.requests, stats.recent.messages, 1)} color="bg-purple-500" />
                    <BarRow label="Yangi xabarlar" value={stats.recent.messages} total={Math.max(stats.recent.signups, stats.recent.downloads, stats.recent.requests, stats.recent.messages, 1)} color="bg-sky-500" />
                  </div>
                </Card>

                {/* Platform health */}
                <Card className="border-border p-5">
                  <h3 className="mb-4 flex items-center gap-2 font-serif text-base font-bold"><Shield className="h-4 w-4 text-accent" />Platforma holati</h3>
                  <div className="space-y-3">
                    <Metric label="Ochiq so'rovlar" value={String(stats.requests.open)} icon={<Briefcase className="h-4 w-4" />} />
                    <Metric label="Faol suhbatlar" value={String(stats.messaging.conversations)} icon={<MessageSquare className="h-4 w-4" />} />
                    <Metric label="Audit log yozuvlari" value={String(stats.audit.totalLogs)} icon={<Activity className="h-4 w-4" />} />
                    <Metric label="Tasdiqlash kutilmoqda" value={String(stats.advocates.pending)} icon={<Clock className="h-4 w-4" />} highlight={stats.advocates.pending > 0} />
                  </div>
                </Card>
              </div>
            </>
          ) : <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>}
        </TabsContent>

        {/* === APPROVALS === */}
        <TabsContent value="approvals" className="mt-6">
          {approvals.length === 0 ? (
            <Card className="border-border p-12 text-center">
              <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-trust-verified" />
              <h3 className="font-serif text-base font-bold">Tasdiqlash kutilayotgan advokatlar yo'q</h3>
            </Card>
          ) : (
            <div className="space-y-4">
              {approvals.map(a => (
                <Card key={a.id} className="border-border p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="font-serif text-base font-bold">{a.name}</h3>
                        <Badge variant="secondary" className="text-[11px]">{a.specialty}</Badge>
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[11px] gap-1"><Clock className="h-2.5 w-2.5" />Kutilmoqda</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{a.titleUz}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{a.bioUz}</p>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                        <Info label="Litsenziya" value={a.licenseNumber} mono />
                        <Info label="Tajriba" value={`${a.experienceYears} yil`} />
                        <Info label="Viloyat" value={a.region} />
                        <Info label="Telefon" value={a.phone} />
                      </div>
                      {a.expertise?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {a.expertise.slice(0, 5).map((e, i) => <Badge key={i} variant="outline" className="text-[10px]">{e}</Badge>)}
                        </div>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col gap-2">
                      <Button size="sm" onClick={() => handleApprove(a.id, "approve")} disabled={processing === a.id} className="gap-1.5 bg-trust-verified text-white hover:bg-trust-verified/90">
                        {processing === a.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}Tasdiqlash
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleApprove(a.id, "reject")} disabled={processing === a.id} className="gap-1.5 text-red-600 hover:bg-red-50">
                        <XCircle className="h-3.5 w-3.5" />Rad etish
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* === DOCUMENTS === */}
        <TabsContent value="documents" className="mt-6">
          <Card className="border-border overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead className="sticky top-0 border-b border-border bg-secondary/80 backdrop-blur">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Hujjat</th>
                    <th className="hidden px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:table-cell">Kategoriya</th>
                    <th className="hidden px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:table-cell">Maydonlar</th>
                    <th className="hidden px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground lg:table-cell">Yuklashlar</th>
                    <th className="hidden px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground lg:table-cell">Holat</th>
                  </tr>
                </thead>
                <tbody>
                  {adminDocs.map(d => (
                    <tr key={d.id} className="border-b border-border/30 transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)] hover:bg-secondary/20">
                      <td className="px-4 py-3">
                        <div className="font-serif font-bold text-foreground">{d.titleUz}</div>
                        <div className="text-[10px] text-muted-foreground">{d.slug}</div>
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <Badge variant="secondary" className="text-[10px]">{d.category}</Badge>
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell font-mono text-xs">{d.fieldsCount}</td>
                      <td className="hidden px-4 py-3 lg:table-cell font-mono text-xs">{d.downloads}</td>
                      <td className="hidden px-4 py-3 lg:table-cell">
                        <div className="flex gap-1">
                          {d.isFree && <Badge className="bg-emerald-100 text-emerald-700 text-[9px]">Bepul</Badge>}
                          {d.isNew && <Badge className="bg-accent/15 text-accent text-[9px]">Yangi</Badge>}
                          {d.hasTemplate && <Badge variant="outline" className="text-[9px]">Shablon</Badge>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* === USERS === */}
        <TabsContent value="users" className="mt-6">
          {/* Filter buttons */}
          <div className="mb-4 flex gap-2">
            {["all", "CLIENT", "ADVOCATE", "ADMIN"].map(r => (
              <button key={r} onClick={() => setUserFilter(r)}
                className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  userFilter === r ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40")}>
                {r === "all" ? "Barchasi" : r === "CLIENT" ? "Mijozlar" : r === "ADVOCATE" ? "Advokatlar" : "Adminlar"}
                {r === "all" ? ` (${users.length})` : ` (${users.filter(u => u.role === r).length})`}
              </button>
            ))}
          </div>
          <Card className="border-border overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead className="sticky top-0 border-b border-border bg-secondary/80 backdrop-blur">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Foydalanuvchi</th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Rol</th>
                    <th className="hidden px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:table-cell">Holat</th>
                    <th className="hidden px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:table-cell">Faollik</th>
                    <th className="hidden px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground lg:table-cell">Ro'yxat</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="border-b border-border/50 transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)] hover:bg-secondary/30">
                      <td className="px-4 py-3">
                        <div className="font-serif font-bold text-foreground">{u.name}</div>
                        <div className="text-[10px] text-muted-foreground">{u.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={cn("text-[10px]",
                          u.role === "ADMIN" && "bg-accent/15 text-accent",
                          u.role === "ADVOCATE" && "bg-trust-verified/15 text-trust-verified",
                          u.role === "CLIENT" && "bg-secondary text-muted-foreground")}>{u.role}</Badge>
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <Badge variant="outline" className={cn("text-[10px]",
                          u.status === "ACTIVE" && "border-trust-verified/30 text-trust-verified",
                          u.status === "PENDING" && "border-amber-300 text-amber-700",
                          u.status === "SUSPENDED" && "border-red-300 text-red-700")}>{u.status}</Badge>
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <div className="flex gap-2 font-mono text-[10px] text-muted-foreground">
                          <span>{u.draftsCount} draf</span><span>{u.requestsCount} so'rov</span><span>{u.messagesCount} xabar</span>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 lg:table-cell text-[10px] text-muted-foreground">{new Date(u.createdAt).toLocaleDateString("uz-UZ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* === AUDIT === */}
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
                  {logs.map(l => {
                    const actionInfo = ACTION_LABELS[l.action] || { label: l.action, color: "text-muted-foreground" };
                    return (
                      <tr key={l.id} className="border-b border-border/30 transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)] hover:bg-secondary/20">
                        <td className="px-4 py-2 font-mono text-[10px] text-muted-foreground whitespace-nowrap">{new Date(l.createdAt).toLocaleString("uz-UZ", { dateStyle: "short", timeStyle: "short" })}</td>
                        <td className="px-4 py-2"><span className={cn("text-xs font-medium", actionInfo.color)}>{actionInfo.label}</span></td>
                        <td className="hidden px-4 py-2 sm:table-cell">{l.user ? <div><span className="text-xs font-medium">{l.user.name}</span><span className="ml-1 text-[10px] text-muted-foreground">({l.user.role})</span></div> : <span className="text-[10px] text-muted-foreground">—</span>}</td>
                        <td className="hidden px-4 py-2 lg:table-cell font-mono text-[10px] text-muted-foreground">{l.ipAddress ?? "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
          {auditTotal > 30 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Sahifa {auditPage} / {Math.ceil(auditTotal / 30)} · Jami {auditTotal} yozuv</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={auditPage <= 1} onClick={() => setAuditPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /> Oldingi</Button>
                <Button size="sm" variant="outline" disabled={auditPage >= Math.ceil(auditTotal / 30)} onClick={() => setAuditPage(p => p + 1)}>Keyingi <ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ icon, value, label, sub }: { icon: React.ReactNode; value: string; label: string; sub?: string }) {
  return (
    <Card className="border-border p-4 hover:-translate-y-0.5 hover:shadow-beautiful-sm hover:border-border/0">
      <div className="mb-2">{icon}</div>
      <div className="font-serif text-2xl font-bold text-foreground">{value}</div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
      {sub && <div className="mt-1 text-[10px] text-accent">{sub}</div>}
    </Card>
  );
}

function BarRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold text-foreground">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        {/* Animate width on mount/change via transition-[width]. Per animation-discipline.md:
           animate transform/opacity for GPU compositing — width animation is acceptable here
           because it's user-triggered (data load) not scrubbed. */}
        <div className={cn("h-full rounded-full transition-[width] duration-500 ease-[cubic-bezier(0.2,0,0,1)]", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Metric({ label, value, icon, highlight }: { label: string; value: string; icon: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">{icon}{label}</span>
      <span className={cn("font-serif font-bold", highlight ? "text-accent" : "text-foreground")}>{value}</span>
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
