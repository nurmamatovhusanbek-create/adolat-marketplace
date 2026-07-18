"use client";

import { useEffect, useState } from "react";
import {
  Pulse,
  Briefcase,
  CaretLeft,
  CaretRight,
  ChatCircle,
  CheckCircle,
  Clock,
  DownloadSimple,
  Eye,
  FileText,
  Shield,
  Spinner,
  Star,
  TrendUp,
  UserCheck,
  Users,
  WarningCircle,
  XCircle,
  Scales,
  List,
  SignOut,
} from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppUser } from "@/lib/auth/user-provider";
import { useMarketplaceStore } from "@/lib/marketplace/store";
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

const ACTION_LABELS: Record<string, { label: string; tone: "neutral" | "brand" | "success" | "warning" | "danger" | "info" }> = {
  login_success: { label: "Tizimga kirish", tone: "success" },
  login_failed: { label: "Kirish xatosi", tone: "danger" },
  signup: { label: "Ro'yxatdan o'tish", tone: "info" },
  doc_download: { label: "Hujjat yuklash", tone: "warning" },
  request_post: { label: "So'rov joylash", tone: "brand" },
  message_send: { label: "Xabar yuborish", tone: "info" },
  draft_create: { label: "Draf yaratish", tone: "info" },
  draft_update: { label: "Draf yangilash", tone: "info" },
  advocate_verify: { label: "Advokat tasdiqlash", tone: "success" },
};

type NavItem = {
  id: string;
  label: string;
  icon: typeof TrendUp;
  badge?: number;
};

export function AdminPanel() {
  const { user } = useAppUser();
  const { setView } = useMarketplaceStore();
  const [section, setSection] = useState("overview");
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const loadData = async (sectionName: string) => {
    if (sectionName === "overview") {
      fetch("/api/admin/stats", { credentials: "same-origin" }).then(r => r.json()).then(setStats).catch(() => {});
    }
    if (sectionName === "approvals") {
      fetch("/api/admin/approvals", { credentials: "same-origin" }).then(r => r.json()).then(d => setApprovals(d.approvals ?? [])).catch(() => {});
    }
    if (sectionName === "users") {
      fetch("/api/admin/users?page=1&pageSize=100", { credentials: "same-origin" }).then(r => r.json()).then(d => setUsers(d.users ?? [])).catch(() => {});
    }
    if (sectionName === "audit") {
      fetch(`/api/admin/audit-logs?page=${auditPage}&pageSize=30`, { credentials: "same-origin" })
        .then(r => r.json()).then(d => { setLogs(d.logs ?? []); setAuditTotal(d.pagination?.total ?? 0); }).catch(() => {});
    }
    if (sectionName === "documents") {
      fetch("/api/admin/documents", { credentials: "same-origin" }).then(r => r.json()).then(d => setAdminDocs(d.documents ?? [])).catch(() => {});
    }
  };

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;
    loadData("overview");
    setLoading(false);
  }, [user]);

  useEffect(() => { loadData(section); }, [section, auditPage]);

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
  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Spinner className="size-8 animate-spin text-accent" weight="regular" />
    </div>
  );

  const filteredUsers = userFilter === "all" ? users : users.filter(u => u.role === userFilter);

  const navItems: NavItem[] = [
    { id: "overview", label: "Statistika", icon: TrendUp },
    { id: "approvals", label: "Tasdiqlash", icon: CheckCircle, badge: stats?.advocates.pending },
    { id: "documents", label: "Hujjatlar", icon: FileText },
    { id: "users", label: "Foydalanuvchilar", icon: Users },
    { id: "audit", label: "Audit log", icon: Pulse },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      {/* Sidebar — fixed dark sidebar on desktop, drawer on mobile */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] lg:static lg:translate-x-0 lg:bg-sidebar",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex items-center gap-2.5 border-b border-sidebar-border p-5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
              <Scales className="size-5" weight="duotone" />
            </div>
            <div>
              <div className="font-serif text-base font-bold tracking-tight">Admin</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/60 mt-0.5">
                Boshqaruv paneli
              </div>
            </div>
          </div>

          {/* Sidebar nav */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin">
            <p className="px-3 pt-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/50">
              Bo'limlar
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSection(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                    "transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)]",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="size-4" weight={active ? "fill" : "regular"} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge ? (
                    <Badge variant="solid" tone="brand" size="sm">{item.badge}</Badge>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="border-t border-sidebar-border p-3">
            <div className="flex items-center gap-3 rounded-lg p-2">
              <div className="flex size-9 items-center justify-center rounded-full bg-sidebar-accent text-sm font-bold text-sidebar-accent-foreground">
                {user.name?.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-medium">{user.name}</div>
                <div className="truncate text-[10px] text-sidebar-foreground/60">{user.email}</div>
              </div>
            </div>
            <button
              onClick={() => setView("home")}
              className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
            >
              <SignOut className="size-4" weight="regular" />
              Saytga qaytish
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Main content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Menyu"
          >
            <List className="size-5" weight="regular" />
          </Button>
          <div className="flex-1">
            <h1 className="font-serif text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {navItems.find(n => n.id === section)?.label}
            </h1>
          </div>
          <Badge variant="soft" tone="brand" size="md" className="hidden sm:inline-flex">
            <Shield className="size-3" weight="fill" />
            Administrator
          </Badge>
        </header>

        {/* Section content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* === OVERVIEW === */}
          {section === "overview" && (
            <div className="space-y-6">
              {stats ? (
                <>
                  {/* Stat cards */}
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard icon={<Users className="size-5 text-accent" weight="duotone" />} value={String(stats.users.total)} label="Jami foydalanuvchilar" sub={`${stats.recent.signups} yangi (7 kun)`} />
                    <StatCard icon={<Briefcase className="size-5 text-success" weight="duotone" />} value={String(stats.advocates.verified)} label="Tasdiqlangan advokatlar" sub={`${stats.advocates.pending} kutilmoqda`} />
                    <StatCard icon={<FileText className="size-5 text-warning" weight="duotone" />} value={String(stats.documents.total)} label="Hujjat shablonlari" sub={`${stats.documents.drafts} draf`} />
                    <StatCard icon={<ChatCircle className="size-5 text-accent" weight="duotone" />} value={String(stats.messaging.messages)} label="Jami xabarlar" sub={`${stats.recent.messages} yangi (7 kun)`} />
                  </div>

                  {/* Charts row */}
                  <div className="grid gap-5 lg:grid-cols-3">
                    <Card className="p-6">
                      <h3 className="mb-4 flex items-center gap-2 font-serif text-base font-bold tracking-tight">
                        <Users className="size-4 text-accent" weight="duotone" />
                        Foydalanuvchilar tarkibi
                      </h3>
                      <div className="space-y-3">
                        <BarRow label="Mijozlar" value={stats.users.clients} total={stats.users.total} color="bg-info" />
                        <BarRow label="Advokatlar" value={stats.users.advocates} total={stats.users.total} color="bg-success" />
                        <BarRow label="Adminlar" value={stats.users.admins} total={stats.users.total} color="bg-accent" />
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h3 className="mb-4 flex items-center gap-2 font-serif text-base font-bold tracking-tight">
                        <Pulse className="size-4 text-accent" weight="duotone" />
                        Faollik (7 kun)
                      </h3>
                      <div className="space-y-3">
                        <BarRow label="Yangi ro'yxatdan o'tishlar" value={stats.recent.signups} total={Math.max(stats.recent.signups, stats.recent.downloads, stats.recent.requests, stats.recent.messages, 1)} color="bg-info" />
                        <BarRow label="Hujjat yuklab olishlar" value={stats.recent.downloads} total={Math.max(stats.recent.signups, stats.recent.downloads, stats.recent.requests, stats.recent.messages, 1)} color="bg-warning" />
                        <BarRow label="Yangi so'rovlar" value={stats.recent.requests} total={Math.max(stats.recent.signups, stats.recent.downloads, stats.recent.requests, stats.recent.messages, 1)} color="bg-accent" />
                        <BarRow label="Yangi xabarlar" value={stats.recent.messages} total={Math.max(stats.recent.signups, stats.recent.downloads, stats.recent.requests, stats.recent.messages, 1)} color="bg-info" />
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h3 className="mb-4 flex items-center gap-2 font-serif text-base font-bold tracking-tight">
                        <Shield className="size-4 text-accent" weight="duotone" />
                        Platforma holati
                      </h3>
                      <div className="space-y-3">
                        <Metric label="Ochiq so'rovlar" value={String(stats.requests.open)} icon={<Briefcase className="size-4" weight="regular" />} />
                        <Metric label="Faol suhbatlar" value={String(stats.messaging.conversations)} icon={<ChatCircle className="size-4" weight="regular" />} />
                        <Metric label="Audit log yozuvlari" value={String(stats.audit.totalLogs)} icon={<Pulse className="size-4" weight="regular" />} />
                        <Metric label="Tasdiqlash kutilmoqda" value={String(stats.advocates.pending)} icon={<Clock className="size-4" weight="regular" />} highlight={stats.advocates.pending > 0} />
                      </div>
                    </Card>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {[1,2,3,4].map(i => (
                    <Card key={i} className="p-5">
                      <Skeleton className="size-9 rounded-lg" />
                      <Skeleton className="mt-3 h-7 w-20" />
                      <Skeleton className="mt-1 h-3 w-24" />
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* === APPROVALS === */}
          {section === "approvals" && (
            <div className="space-y-4">
              {approvals.length === 0 ? (
                <Card className="p-12 text-center">
                  <CheckCircle className="mx-auto mb-3 size-10 text-success" weight="duotone" />
                  <h3 className="font-serif text-base font-bold tracking-tight">Tasdiqlash kutilayotgan advokatlar yo'q</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Hozircha barcha so'rovlar ko'rib chiqilgan.</p>
                </Card>
              ) : (
                approvals.map(a => (
                  <Card key={a.id} className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <h3 className="font-serif text-lg font-bold tracking-tight">{a.name}</h3>
                          <Badge variant="soft" tone="neutral" size="sm">{a.specialty}</Badge>
                          <Badge variant="soft" tone="warning" size="sm">
                            <Clock className="size-3" weight="fill" />
                            Kutilmoqda
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{a.titleUz}</p>
                        <p className="mt-2 text-xs text-muted-foreground">{a.bioUz}</p>
                        <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                          <Info label="Litsenziya" value={a.licenseNumber} mono />
                          <Info label="Tajriba" value={`${a.experienceYears} yil`} />
                          <Info label="Viloyat" value={a.region} />
                          <Info label="Telefon" value={a.phone} />
                        </div>
                        {a.expertise?.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {a.expertise.slice(0, 5).map((e, i) => (
                              <Badge key={i} variant="outline" tone="neutral" size="sm">{e}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-col gap-2 sm:w-40">
                        <Button
                          tone="success"
                          onClick={() => handleApprove(a.id, "approve")}
                          loading={processing === a.id}
                        >
                          {!processing && <CheckCircle className="size-4" weight="fill" />}
                          Tasdiqlash
                        </Button>
                        <Button
                          variant="outline"
                          tone="danger"
                          onClick={() => handleApprove(a.id, "reject")}
                          disabled={processing === a.id}
                        >
                          <XCircle className="size-4" weight="regular" />
                          Rad etish
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* === DOCUMENTS === */}
          {section === "documents" && (
            <Card className="overflow-hidden">
              <div className="max-h-[calc(100vh-12rem)] overflow-y-auto scrollbar-thin">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 border-b border-border bg-muted/80 backdrop-blur">
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
                      <tr key={d.id} className="border-b border-border/30 transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)] hover:bg-secondary/30">
                        <td className="px-4 py-3">
                          <div className="font-serif font-bold text-foreground">{d.titleUz}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">{d.slug}</div>
                        </td>
                        <td className="hidden px-4 py-3 sm:table-cell">
                          <Badge variant="soft" tone="neutral" size="sm">{d.category}</Badge>
                        </td>
                        <td className="hidden px-4 py-3 sm:table-cell font-mono text-xs">{d.fieldsCount}</td>
                        <td className="hidden px-4 py-3 lg:table-cell font-mono text-xs">{d.downloads}</td>
                        <td className="hidden px-4 py-3 lg:table-cell">
                          <div className="flex gap-1">
                            {d.isFree && <Badge variant="soft" tone="success" size="sm">Bepul</Badge>}
                            {d.isNew && <Badge variant="soft" tone="brand" size="sm">Yangi</Badge>}
                            {d.hasTemplate && <Badge variant="outline" tone="neutral" size="sm">Shablon</Badge>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* === USERS === */}
          {section === "users" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {["all", "CLIENT", "ADVOCATE", "ADMIN"].map(r => (
                  <button
                    key={r}
                    onClick={() => setUserFilter(r)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)]",
                      userFilter === r
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                    )}
                  >
                    {r === "all" ? "Barchasi" : r === "CLIENT" ? "Mijozlar" : r === "ADVOCATE" ? "Advokatlar" : "Adminlar"}
                    {r === "all" ? ` (${users.length})` : ` (${users.filter(u => u.role === r).length})`}
                  </button>
                ))}
              </div>
              <Card className="overflow-hidden">
                <div className="max-h-[calc(100vh-16rem)] overflow-y-auto scrollbar-thin">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 border-b border-border bg-muted/80 backdrop-blur">
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
                            <Badge
                              variant="soft"
                              tone={u.role === "ADMIN" ? "brand" : u.role === "ADVOCATE" ? "success" : "neutral"}
                              size="sm"
                            >
                              {u.role}
                            </Badge>
                          </td>
                          <td className="hidden px-4 py-3 sm:table-cell">
                            <Badge
                              variant="outline"
                              tone={u.status === "ACTIVE" ? "success" : u.status === "PENDING" ? "warning" : "danger"}
                              size="sm"
                            >
                              {u.status}
                            </Badge>
                          </td>
                          <td className="hidden px-4 py-3 sm:table-cell">
                            <div className="flex gap-2 font-mono text-[10px] text-muted-foreground">
                              <span>{u.draftsCount} draf</span><span>{u.requestsCount} so'rov</span><span>{u.messagesCount} xabar</span>
                            </div>
                          </td>
                          <td className="hidden px-4 py-3 lg:table-cell text-[10px] text-muted-foreground font-mono">
                            {new Date(u.createdAt).toLocaleDateString("uz-UZ")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* === AUDIT === */}
          {section === "audit" && (
            <div className="space-y-4">
              <Card className="overflow-hidden">
                <div className="max-h-[calc(100vh-12rem)] overflow-y-auto scrollbar-thin">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 border-b border-border bg-muted/80 backdrop-blur">
                      <tr className="text-left">
                        <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Vaqt</th>
                        <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Harakat</th>
                        <th className="hidden px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:table-cell">Foydalanuvchi</th>
                        <th className="hidden px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground lg:table-cell">IP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map(l => {
                        const actionInfo = ACTION_LABELS[l.action] || { label: l.action, tone: "neutral" as const };
                        return (
                          <tr key={l.id} className="border-b border-border/30 transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)] hover:bg-secondary/20">
                            <td className="px-4 py-2 font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                              {new Date(l.createdAt).toLocaleString("uz-UZ", { dateStyle: "short", timeStyle: "short" })}
                            </td>
                            <td className="px-4 py-2">
                              <Badge variant="soft" tone={actionInfo.tone} size="sm">
                                {actionInfo.label}
                              </Badge>
                            </td>
                            <td className="hidden px-4 py-2 sm:table-cell">
                              {l.user ? (
                                <div>
                                  <span className="text-xs font-medium">{l.user.name}</span>
                                  <span className="ml-1 text-[10px] text-muted-foreground">({l.user.role})</span>
                                </div>
                              ) : (
                                <span className="text-[10px] text-muted-foreground">—</span>
                              )}
                            </td>
                            <td className="hidden px-4 py-2 lg:table-cell font-mono text-[10px] text-muted-foreground">
                              {l.ipAddress ?? "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
              {auditTotal > 30 && (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Sahifa {auditPage} / {Math.ceil(auditTotal / 30)} · Jami {auditTotal} yozuv
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" disabled={auditPage <= 1} onClick={() => setAuditPage(p => p - 1)}>
                      <CaretLeft className="size-4" weight="regular" />
                      Oldingi
                    </Button>
                    <Button size="sm" variant="outline" disabled={auditPage >= Math.ceil(auditTotal / 30)} onClick={() => setAuditPage(p => p + 1)}>
                      Keyingi
                      <CaretRight className="size-4" weight="regular" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, sub }: { icon: React.ReactNode; value: string; label: string; sub?: string }) {
  return (
    <Card className="p-5 hover:-translate-y-0.5 hover:shadow-beautiful-md">
      <div className="mb-3">{icon}</div>
      <div className="font-serif text-2xl font-bold tracking-tight text-foreground">{value}</div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-0.5">{label}</div>
      {sub && <div className="mt-1.5 text-[11px] text-accent">{sub}</div>}
    </Card>
  );
}

function BarRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold text-foreground font-mono">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full transition-[width] duration-500 ease-[cubic-bezier(0.2,0,0,1)]", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Metric({ label, value, icon, highlight }: { label: string; value: string; icon: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2.5 last:border-b-0 last:pb-0">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className={cn(highlight && "text-accent")}>{icon}</span>
        {label}
      </span>
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
