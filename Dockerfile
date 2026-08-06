# Adolat Marketplace — Production Dockerfile
# Multi-stage build for minimal image size

# === Stage 1: Install dependencies ===
FROM oven/bun:1.1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# === Stage 2: Build ===
FROM oven/bun:1.1 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma client
RUN bun run db:generate
# Build Next.js
RUN bun run build

# === Stage 3: Production ===
FROM oven/bun:1.1-slim AS runner
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Security: run as non-root
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy only production files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
# Copy .bin symlinks so `bunx prisma` works without downloading
COPY --from=builder /app/node_modules/.bin ./node_modules/.bin

# Copy the court-claims JSON file + scripts + registry
# (registry.ts reads JSON via fs.readFileSync at runtime, so the file must exist on disk)
COPY --from=builder /app/src/lib/documents/templates/court-claims-v4.json ./src/lib/documents/templates/court-claims-v4.json
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/package.json ./package.json

# Create storage directory for chat file uploads
RUN mkdir -p storage/uploads && chown -R nextjs:nodejs storage /app

# Environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

USER nextjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Use startup script — runs prisma db push + seed + server
CMD ["bun", "scripts/startup.js"]
