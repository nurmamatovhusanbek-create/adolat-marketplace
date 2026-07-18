"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, Mail, Lock, User, Phone, Briefcase, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: "signin" | "signup";
  onSuccess?: () => void;
}

export function AuthModal({ open, onOpenChange, defaultMode = "signin", onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0">
        <Tabs value={mode} onValueChange={(v) => setMode(v as "signin" | "signup")}>
          <div className="border-b border-border p-6 pb-0">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Scale className="h-5 w-5" />
                </div>
                Adolat
              </DialogTitle>
              <DialogDescription className="text-xs">
                Huquqiy marketplace'ga kirish yoki ro'yxatdan o'tish
              </DialogDescription>
            </DialogHeader>
            <TabsList className="mt-4 grid w-full grid-cols-2">
              <TabsTrigger value="signin">Kirish</TabsTrigger>
              <TabsTrigger value="signup">Ro'yxatdan o'tish</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="signin" className="mt-0 p-6">
            <SignInForm onSuccess={onSuccess} />
          </TabsContent>
          <TabsContent value="signup" className="mt-0 p-6">
            <SignUpForm onSuccess={onSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Sign-in form
// ============================================================================

function SignInForm({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!res || res.error) {
        setError("Email yoki parol noto'g'ri. Qayta urinib ko'ring.");
        return;
      }
      toast.success("Xush kelibsiz!", {
        description: "Tizimga muvaffaqiyatli kirdingiz.",
      });
      onSuccess?.();
    } catch {
      setError("Tarmoq xatosi. Qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DemoAccountsHint />

      <div>
        <Label htmlFor="signin-email" className="text-xs font-semibold">
          Email
        </Label>
        <div className="relative mt-1.5">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="signin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="pl-9"
            required
            autoComplete="email"
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="signin-password" className="text-xs font-semibold">
          Parol
        </Label>
        <div className="relative mt-1.5">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="signin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="pl-9"
            required
            autoComplete="current-password"
            disabled={loading}
          />
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full gap-1.5">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
        Kirish
      </Button>
    </form>
  );
}

// ============================================================================
// Sign-up form
// ============================================================================

function SignUpForm({ onSuccess }: { onSuccess?: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CLIENT" | "ADVOCATE">("CLIENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, role, csrfToken: "client-side" }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Ro'yxatdan o'tishda xatolik");
        return;
      }

      // Auto sign in
      const signRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!signRes || signRes.error) {
        // Even if auto-sign-in fails, registration succeeded
        toast.success("Ro'yxatdan o'tdingiz!", {
          description: "Endi tizimga kirishingiz mumkin.",
        });
      } else {
        toast.success("Xush kelibsiz!", {
          description: "Hisobingiz muvaffaqiyatli yaratildi.",
        });
      }
      onSuccess?.();
    } catch {
      setError("Tarmoq xatosi. Qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Role selector */}
      <div>
        <Label className="mb-2 text-xs font-semibold">Men kimman?</Label>
        <div className="grid grid-cols-2 gap-2">
          <RoleButton
            selected={role === "CLIENT"}
            onClick={() => setRole("CLIENT")}
            icon={<User className="h-4 w-4" />}
            label="Mijoz"
            description="Hujjat va advokat izlayman"
          />
          <RoleButton
            selected={role === "ADVOCATE"}
            onClick={() => setRole("ADVOCATE")}
            icon={<Briefcase className="h-4 w-4" />}
            label="Advokat"
            description="Mijozlar izlayman"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="signup-name" className="text-xs font-semibold">
          F.I.O
        </Label>
        <Input
          id="signup-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Familiya Ism Otasining ismi"
          className="mt-1.5"
          required
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="signup-email" className="text-xs font-semibold">
            Email
          </Label>
          <div className="relative mt-1.5">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="pl-9"
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="signup-phone" className="text-xs font-semibold">
            Telefon
          </Label>
          <div className="relative mt-1.5">
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="signup-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
              className="pl-9"
              required
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="signup-password" className="text-xs font-semibold">
          Parol (min. 8 belgi, harf + raqam)
        </Label>
        <div className="relative mt-1.5">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="pl-9"
            required
            minLength={8}
            autoComplete="new-password"
            disabled={loading}
          />
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full gap-1.5">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
        Ro'yxatdan o'tish
      </Button>

      {role === "ADVOCATE" && (
        <p className="rounded-md bg-amber-50 p-2.5 text-center text-[11px] text-amber-700">
          Advokat sifatida ro'yxatdan o'tgandan so'ng, profilingiz
          administrator tomonidan tasdiqlanadi (odatda 24 soat ichida).
        </p>
      )}
    </form>
  );
}

function RoleButton({
  selected,
  onClick,
  icon,
  label,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start gap-1 rounded-lg border-2 p-3 text-left transition-all ${
        selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
      }`}
    >
      <div className={`flex h-8 w-8 items-center justify-center rounded-md ${selected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
        {icon}
      </div>
      <div className="text-sm font-bold">{label}</div>
      <div className="text-[10px] text-muted-foreground">{description}</div>
    </button>
  );
}

function DemoAccountsHint() {
  return (
    <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
      <strong className="block">Demo hisoblar (parol: Demo1234):</strong>
      <div className="mt-1 space-y-0.5 font-mono text-[11px]">
        <div>• client@demo.uz — mijoz</div>
        <div>• akmal@adolat.uz — advokat</div>
        <div>• admin@adolat.uz — admin</div>
      </div>
    </div>
  );
}
