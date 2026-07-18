FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV DATABASE_URL="file:./build.db"
ENV NEXTAUTH_SECRET="build-placeholder"
ENV NEXTAUTH_URL="http://localhost:3000"
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

FROM node:20-slim AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/startup.js ./startup.js

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

RUN mkdir -p storage/uploads && chown -R nextjs:nodejs storage /app

RUN apt-get update -qq && apt-get install -y -qq curl > /dev/null 2>&1 && rm -rf /var/lib/apt/lists/*
RUN npm install --global prisma@6

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "startup.js"]
