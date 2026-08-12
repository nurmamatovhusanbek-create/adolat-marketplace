// In-memory rate limiter with sliding-window counters.
// Interface is Redis-compatible so we can swap implementations later.

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  // Max requests per window
  limit: number;
  // Window duration in ms
  windowMs: number;
  // Optional block duration after limit exceeded
  blockMs?: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterMs?: number;
}

class InMemoryRateLimiter {
  private buckets = new Map<string, RateLimitBucket>();
  private blockedUntil = new Map<string, number>();
  // Periodic cleanup to prevent memory leak
  private lastCleanup = Date.now();

  /**
   * Check rate limit for a key (usually IP + route).
   * Returns allowed=true if request can proceed.
   */
  check(key: string, config: RateLimitConfig): RateLimitResult {
    this.maybeCleanup();

    const now = Date.now();

    // Check if currently blocked
    const blockedUntil = this.blockedUntil.get(key);
    if (blockedUntil && blockedUntil > now) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: blockedUntil,
        retryAfterMs: blockedUntil - now,
      };
    }

    const bucket = this.buckets.get(key);
    if (!bucket || bucket.resetAt < now) {
      // First request in window
      this.buckets.set(key, {
        count: 1,
        resetAt: now + config.windowMs,
      });
      return {
        allowed: true,
        remaining: config.limit - 1,
        resetAt: now + config.windowMs,
      };
    }

    if (bucket.count >= config.limit) {
      // Exceeded — block if configured
      if (config.blockMs) {
        this.blockedUntil.set(key, now + config.blockMs);
      }
      return {
        allowed: false,
        remaining: 0,
        resetAt: bucket.resetAt,
        retryAfterMs: bucket.resetAt - now,
      };
    }

    bucket.count += 1;
    return {
      allowed: true,
      remaining: config.limit - bucket.count,
      resetAt: bucket.resetAt,
    };
  }

  /** Force-reset a key (e.g., on successful login) */
  reset(key: string) {
    this.buckets.delete(key);
    this.blockedUntil.delete(key);
  }

  private maybeCleanup() {
    const now = Date.now();
    if (now - this.lastCleanup < 5 * 60 * 1000) return; // every 5 min
    this.lastCleanup = now;

    for (const [key, bucket] of this.buckets) {
      if (bucket.resetAt < now) this.buckets.delete(key);
    }
    for (const [key, until] of this.blockedUntil) {
      if (until < now) this.blockedUntil.delete(key);
    }
  }
}

// Singleton
const globalForRateLimit = globalThis as unknown as { __rateLimiter?: InMemoryRateLimiter };
export const rateLimiter =
  globalForRateLimit.__rateLimiter ?? new InMemoryRateLimiter();
if (process.env.NODE_ENV !== "production") globalForRateLimit.__rateLimiter = rateLimiter;

// ============================================================================
// Pre-configured limits per route family
// ============================================================================

export const RATE_LIMITS = {
  // Auth: 5 attempts per 15 min, then block 30 min
  AUTH: { limit: 5, windowMs: 15 * 60 * 1000, blockMs: 30 * 60 * 1000 },
  // Signup: 3 per hour
  SIGNUP: { limit: 3, windowMs: 60 * 60 * 1000, blockMs: 60 * 60 * 1000 },
  // Search: 30 per 10 sec
  SEARCH: { limit: 30, windowMs: 10 * 1000 },
  // Document download: 10 per hour (per user)
  DOWNLOAD: { limit: 10, windowMs: 60 * 60 * 1000 },
  // Draft save: 60 per 10 min (autosave)
  DRAFT_SAVE: { limit: 60, windowMs: 10 * 60 * 1000 },
  // Post request: 5 per hour
  REQUEST_POST: { limit: 5, windowMs: 60 * 60 * 1000 },
  // Request response: 20 per hour
  REQUEST_RESPONSE: { limit: 20, windowMs: 60 * 60 * 1000 },
  // Messages: 30 per minute (anti-spam)
  MESSAGE: { limit: 30, windowMs: 60 * 1000 },
  // General API: 100 per minute
  API: { limit: 100, windowMs: 60 * 1000 },
  // Public site: 200 per minute
  PUBLIC: { limit: 200, windowMs: 60 * 1000 },
} as const;

/**
 * Convenience helper: check rate limit and return a NextResponse-friendly result.
 * Returns null if allowed, otherwise returns a Response object.
 */
export function enforceRateLimit(
  key: string,
  config: RateLimitConfig
): { allowed: true; remaining: number } | { allowed: false; retryAfterMs: number } {
  const result = rateLimiter.check(key, config);
  if (result.allowed) {
    return { allowed: true, remaining: result.remaining };
  }
  return {
    allowed: false,
    retryAfterMs: result.retryAfterMs ?? result.resetAt - Date.now(),
  };
}

/**
 * Get client IP from a Next.js Request, considering X-Forwarded-For.
 * Falls back to "unknown" if no IP can be determined.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    // First IP in chain is the client
    return forwarded.split(",")[0].trim().slice(0, 50);
  }
  const real = req.headers.get("x-real-ip");
  if (real) return real.slice(0, 50);
  return "unknown";
}

/**
 * Get client IP from a NextRequest (used in API routes).
 * Same logic as getClientIp but typed for NextRequest.
 */
export function getIpFromRequest(req: { headers: { get: (name: string) => string | null } }): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim().slice(0, 50);
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}
