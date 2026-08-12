import { NextRequest, NextResponse } from "next/server";
import { rateLimiter, RATE_LIMITS, getClientIp } from "@/lib/security/rate-limit";

// Routes that need stricter rate limiting
const AUTH_ROUTES = ["/api/auth/signin", "/api/auth/callback/credentials", "/api/auth/signup"];
const API_ROUTES_PREFIX = "/api/";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = getClientIp(req as unknown as Request);

  // Public route — light rate limit
  if (pathname === "/" || pathname.startsWith("/_next") || pathname.startsWith("/static")) {
    const result = rateLimiter.check(`public:${ip}`, RATE_LIMITS.PUBLIC);
    if (!result.allowed) {
      return new NextResponse("Juda ko'p so'rov. Keyinroq urinib ko'ring.", {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((result.retryAfterMs ?? 60000) / 1000)) },
      });
    }
    return NextResponse.next();
  }

  // Auth routes — strict limit
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    const result = rateLimiter.check(`auth:${ip}`, RATE_LIMITS.AUTH);
    if (!result.allowed) {
      return NextResponse.json(
        { error: "Juda ko'p urinish. 30 daqiqadan so'ng qayta urinib ko'ring." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((result.retryAfterMs ?? 60000) / 1000)) },
        }
      );
    }
  }

  // API routes — medium limit
  if (pathname.startsWith(API_ROUTES_PREFIX)) {
    const result = rateLimiter.check(`api:${ip}`, RATE_LIMITS.API);
    if (!result.allowed) {
      return NextResponse.json(
        { error: "So'rovlar chegarasi oshdi" },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((result.retryAfterMs ?? 60000) / 1000)) },
        }
      );
    }
  }

  // Block common automated scanners
  const userAgent = req.headers.get("user-agent") ?? "";
  if (userAgent.length === 0 && !pathname.startsWith("/api/")) {
    // Real browsers always send a UA
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except Next internals that we don't want to intercept
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|logo.svg).*)"],
};
