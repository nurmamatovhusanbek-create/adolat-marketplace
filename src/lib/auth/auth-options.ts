import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/security/password";
import { audit } from "@/lib/security/audit";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/security/rate-limit";

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "CLIENT" | "ADVOCATE" | "ADMIN";
      status: "PENDING" | "ACTIVE" | "SUSPENDED" | "BANNED";
      hasAdvocateProfile?: boolean;
    };
  }
  interface User {
    id: string;
    email: string;
    name: string;
    role: "CLIENT" | "ADVOCATE" | "ADMIN";
    status: "PENDING" | "ACTIVE" | "SUSPENDED" | "BANNED";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "CLIENT" | "ADVOCATE" | "ADMIN";
    status: "PENDING" | "ACTIVE" | "SUSPENDED" | "BANNED";
    hasAdvocateProfile?: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  // Use JWT strategy — no need for DB adapter (we manage our own session table)
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 1 * 60 * 60, // refresh JWT every 1h
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET || "adolat-fallback-secret-change-in-production",
    maxAge: 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: `adolat-session`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: `adolat-callback`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `adolat-csrf`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    CredentialsProvider({
      name: "Email & Parol",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Parol", type: "password" },
      },
      async authorize(credentials, req) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password ?? "";
        if (!email || !password) return null;

        // In NextAuth v4, `req` is a NextRequest-like object with .headers
        // but it's typed loosely. Be defensive about the shape.
        const headers = (req as { headers?: Record<string, string> | Headers })?.headers;
        const getHeader = (name: string): string | null => {
          if (!headers) return null;
          if (typeof (headers as Headers).get === "function") {
            return (headers as Headers).get(name);
          }
          if (typeof headers === "object") {
            const lower = name.toLowerCase();
            const found = Object.entries(headers).find(([k]) => k.toLowerCase() === lower);
            return found ? found[1] : null;
          }
          return null;
        };

        // Get client IP
        const forwarded = getHeader("x-forwarded-for");
        const ip = forwarded
          ? forwarded.split(",")[0].trim().slice(0, 50)
          : (getHeader("x-real-ip") ?? "unknown");
        const userAgent = getHeader("user-agent") ?? undefined;

        // Per-email rate limit (prevents credential stuffing on a single account)
        const limit = enforceRateLimit(`login:${ip}:${email}`, RATE_LIMITS.AUTH);
        if (!limit.allowed) return null;

        // Per-IP rate limit
        const ipLimit = enforceRateLimit(`login-ip:${ip}`, RATE_LIMITS.AUTH);
        if (!ipLimit.allowed) return null;

        const user = await db.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            passwordHash: true,
            role: true,
            status: true,
            failedLoginAttempts: true,
            lockedUntil: true,
            advocateProfile: { select: { id: true } },
          },
        });

        // Always run the hash compare even if user not found —
        // this prevents timing attacks that enumerate valid emails.
        const dummyHash = "$2b$12$abcdefghijklmnopqrstuv";
        const hashToCompare = user?.passwordHash ?? dummyHash;
        const passwordOk = await verifyPassword(password, hashToCompare);

        if (!user || !passwordOk) {
          // Record failed attempt if user exists
          if (user) {
            const newAttempts = user.failedLoginAttempts + 1;
            const lockFor = newAttempts >= 5 ? 30 * 60 * 1000 : null; // 30 min lockout
            await db.user.update({
              where: { id: user.id },
              data: {
                failedLoginAttempts: newAttempts,
                lockedUntil: lockFor ? new Date(Date.now() + lockFor) : null,
              },
            });
          }
          await audit({
            action: "login_failed",
            userId: user?.id,
            metadata: { email },
            ipAddress: ip,
            userAgent,
            success: false,
          });
          return null;
        }

        // Check account status
        if (user.status === "SUSPENDED" || user.status === "BANNED") {
          await audit({
            userId: user.id,
            action: "login_failed",
            metadata: { reason: "account_locked", status: user.status },
            ipAddress: ip,
            success: false,
          });
          return null;
        }

        // Check lockout
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          await audit({
            userId: user.id,
            action: "login_failed",
            metadata: { reason: "rate_limited", lockedUntil: user.lockedUntil },
            ipAddress: ip,
            success: false,
          });
          return null;
        }

        // Successful login — reset counters
        await db.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
            lastLoginIp: ip,
          },
        });

        await audit({
          userId: user.id,
          action: "login_success",
          ipAddress: ip,
          userAgent,
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          hasAdvocateProfile: !!user.advocateProfile,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
        token.hasAdvocateProfile = (user as { hasAdvocateProfile?: boolean }).hasAdvocateProfile;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.status = token.status;
        session.user.hasAdvocateProfile = token.hasAdvocateProfile;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  events: {
    async signOut({ token }) {
      if (token?.id) {
        await audit({
          userId: token.id,
          action: "logout",
        });
      }
    },
  },
};
