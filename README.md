# Adolat — Huquqiy marketplace

O'zbekistonning yuridik marketplace'i: advokatlarni toping, 700+ huquqiy hujjat namunalarini yuklab oling, huquqiy so'rovingizni joylang yoki advokat bilan real-time chat qiling.

## Features

- **Advokat marketplace** — 8+ tasdiqlangan advokatlar, reyting, sharhlar, filtrlash
- **Hujjat konstruktori** — 10+ real yurxizmat.uz shablonlari, PDF/DOCX yuklab olish
- **Real-time chat** — advokat bilan to'g'ridan-to'g'ri xabar almashish, fayl biriktirish
- **So'rovlar taxtasi** — mijozlar huquqiy so'rov joylaydi, advokatlar javob beradi
- **Auth** — NextAuth + bcrypt, 3 rol (CLIENT/ADVOCATE/ADMIN)
- **Security** — CSP, rate limiting, audit logging, IDOR protection, input validation

## Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL/SQLite
- **Auth**: NextAuth v4, bcrypt (cost 12), JWT sessions
- **Real-time**: HTTP polling (3s interval, no WebSocket needed)
- **Document generation**: pdf-lib (PDF), docx (DOCX)
- **Design**: Editorial Trust — warm ivory parchment + clay accent + Playfair Display serif

## Quick Start

```bash
# Install dependencies
bun install

# Set up database
bun run db:push
bun run scripts/seed.ts
bun run scripts/seed-real-docs.ts

# Start dev server
bun run dev
```

Open http://localhost:3000

## Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| `client@demo.uz` | `Demo1234` | CLIENT |
| `akmal@adolat.uz` | `Demo1234` | ADVOCATE |
| `admin@adolat.uz` | `Demo1234` | ADMIN |

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Render.com deployment instructions.

## Project Structure

```
src/
├── app/
│   ├── api/              # REST API routes
│   │   ├── auth/         # NextAuth + signup + chat-token
│   │   ├── advocates/    # Advocate search/list
│   │   ├── documents/    # Document list + generate PDF/DOCX
│   │   ├── drafts/       # Document draft CRUD + autosave
│   │   ├── requests/     # Legal request list + create
│   │   ├── conversations/# Chat: list, start, send, messages, read
│   │   └── chat/         # File upload + download
│   ├── layout.tsx        # Root layout with providers
│   ├── page.tsx          # SPA shell with view switcher
│   └── globals.css       # Editorial Trust design system
├── components/
│   ├── auth/             # Sign in / sign up modal
│   ├── chat/             # Real-time chat panel with file attachments
│   ├── dashboard/        # User dashboard (drafts, requests)
│   ├── editor/           # Document editor (form constructor + autosave)
│   └── marketplace/      # Home, header, hero, listings, modals
├── lib/
│   ├── auth/             # NextAuth config + session helpers + user provider
│   ├── documents/        # Template engine + PDF/DOCX generators
│   ├── marketplace/      # Types, data, store, formatters
│   └── security/         # Validators, rate limiter, audit log, password hashing
└── prisma/
    └── schema.prisma     # 13 models: User, AdvocateProfile, LegalDocument, etc.
```

## License

MIT — see [LICENSE](./LICENSE)
