"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

// ============================================================================
// NextAuth session provider (auth state from cookies)
// ============================================================================

export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

// ============================================================================
// Application-level user info (counts, advocate profile, etc.)
// Fetched from /api/me on mount and on NextAuth session changes.
// ============================================================================

interface AppUser {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: "CLIENT" | "ADVOCATE" | "ADMIN";
  status: "PENDING" | "ACTIVE" | "SUSPENDED" | "BANNED";
  avatarUrl?: string | null;
  hasAdvocateProfile?: boolean;
  advocateProfile?: {
    id: string;
    slug: string;
    titleUz: string;
    verified: boolean;
    licenseVerified: boolean;
  } | null;
  counts: {
    drafts: number;
    activeRequests: number;
    unreadMessages: number;
  };
}

interface AppUserContext {
  user: AppUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const AppUserCtx = createContext<AppUserContext>({
  user: null,
  loading: true,
  refresh: async () => {},
});

export function useAppUser() {
  return useContext(AppUserCtx);
}

export function AppUserProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/me", { credentials: "same-origin" });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "authenticated" && session?.user?.id) {
      refresh();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [status, session?.user?.id, refresh]);

  return (
    <AppUserCtx.Provider value={{ user, loading, refresh }}>
      {children}
    </AppUserCtx.Provider>
  );
}
