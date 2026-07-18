# Changelog

All notable changes to **Adolat — Huquqiy marketplace** will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.6.0] — 2026-07-17

### Added — Editorial Trust design overhaul

Comprehensive design overhaul based on research from 6 cloned repos:
- `ui-ux-pro-max-skill` — 161 reasoning rules + 84 UI styles + 192 color palettes
- `bergside/awesome-design-skills` — 68 design system skill files
- `lobehub/lobehub` — LobeHub's full DESIGN.md spec
- `microsoft/vscode` — design system reference (sparse clone)
- `mattpocock/skills` — engineering skill patterns
- `affaan-m/ECC` — agent harness OS (architectural inspiration)

**Synthesized "Editorial Trust" design system** combining the best of:
- **Claude skill** (warm ivory parchment, near-black ink, single earthy clay accent)
- **Editorial skill** (serif display typography, 8pt grid, hard-edged contrast)
- **Enterprise skill** (dark mode tokens, glass-like panels)
- **LobeHub DESIGN.md** (4px spacing scale, semantic color tokens, calm content-first aesthetic)
- **Trust & Authority pattern** from ui-ux-pro-max (certification badges, security indicators)
- **Classic Elegant typography** from ui-ux-pro-max (Playfair Display + Inter pairing)

### Design system tokens
- New `globals.css` with editorial color palette:
  - Warm ivory parchment background (`oklch(0.985 0.008 75)`)
  - Near-black ink foreground (`oklch(0.18 0.015 60)`)
  - Earthy clay accent (`oklch(0.62 0.13 45)`) — used sparingly
  - Trust signal tokens: `--trust-verified` (sage green), `--trust-urgent` (terracotta red), `--trust-premium` (warm gold)
- 4px spacing scale (LobeHub convention): XXS=4, XS=8, SM=12, base=16, MD=20, LG=24, XL=32
- Radius scale: 4 / 6 / 8 / 12 (LobeHub convention) — never mix rounded and sharp corners
- Hard shadows (Claude/Editorial style — no soft shadows): `shadow-hard`, `shadow-hard-sm`, `shadow-hard-clay`
- `prefers-reduced-motion` support (LobeHub rule)
- Custom utilities: `bg-grid-pattern`, `bg-hero-radial`, `underline-accent`, `editorial-divider`, `drop-cap`, `verified-pulse`

### Typography
- Added **Playfair Display** (serif display) for all h1/h2/h3 headings — "Editorial Classic" inspired
- **Inter** for body text (already had via Geist Sans — switched to Inter for Cyrillic support)
- **JetBrains Mono** for monospace UI labels (rank numbers, timestamps, technical metadata)
- Font feature settings enabled: ss01, ss02, cv01, cv11 (Inter stylistic alternates)

### Header — editorial newspaper masthead
- Thin clay accent strip at top
- Logo: serif "Adolat" with mono "HUQUQIY MARKETPLACE" subtitle in uppercase tracking
- Section dividers using `·` between nav items (editorial style)
- Active nav item uses `underline-accent` (clay underline)
- Search input: minimal, focus-visible turns border to clay
- User menu with role-colored badge (clay for ADMIN, sage for ADVOCATE, neutral for CLIENT)

### Hero — editorial magazine cover
- Editorial eyebrow: today's date in mono + horizontal rule + "#1 marketplace" badge
- Serif H1 with italic clay "bir joyda" + hand-drawn SVG underline
- Dual search with editorial toggle (Advokat / Hujjat) instead of segmented control
- Hard-shadow on search input + clay hard-shadow on submit button (translates on hover)
- "Mashhur:" tags with first one pre-highlighted in clay
- Trust badges row (BadgeCheck / ShieldCheck / Star) — Trust & Authority pattern
- Right stat card with "JONLI STATISTIKA" mono label, online indicator pulse
- 4-stat grid with serif numbers + tiny online dots
- Mini advocate avatar stack with overflow "+47"
- Editorial caption "Ma'lumotlar har 5 daqiqada yangilanadi"

### Category grid — editorial card hover
- Hard shadow on hover (translates -1px y)
- Left clay accent bar appears on hover
- Mono font for count badge ("248 hujjat")
- "Ko'rish" link with arrow appears in clay on hover

### Featured advocates — TOP-10 with trust signals
- Online indicator strip (top-right corner, sage green with pulse)
- Verified badge (clay BadgeCheck) overlapping avatar
- 3-column stat grid with vertical dividers (Yil / Ishlar / Muvaffaqiyat %)
- "TOP-10" badge in warm gold with star icon
- Response time strip colored by speed (sage <1h / gold <3h / muted >3h)
- Mono uppercase labels for "KONSULTATSIYA"

### Popular documents — ranked editorial cards
- Top 3 cards get circular rank badges (1/2/3) in serif font
- Mono font for meta row (pages, fill time, downloads, rating)
- Format chips in mono uppercase
- Free badge in sage green with sparkles icon
- New badge in clay
- "Huquqiy asos" footer with ShieldCheck icon (Trust & Authority pattern)

### Testimonials — editorial pull-quote cards
- Large Quote icon in clay/15% as background decoration
- First card gets clay quote-mark badge in top-left
- Mono uppercase "#01" rank number per card
- Star rating in warm gold
- Author name in serif, organization in mono clay uppercase

### How it works — editorial 2-column flow
- Centered header with clay rules on both sides of eyebrow
- Two cards with giant serif "01" / "02" numbers as background decoration
- Numbered steps with circular badges that turn clay on hover
- Trust strip at bottom with 4 trust signals

### Recent requests — editorial job board
- Mono "№01" rank number per card (top-right)
- Urgent badge in terracotta red with flame icon
- Budget box with sage green border + mono "BYUDJET:" label
- All metadata in mono uppercase with small icons

### Advocate CTA — inverted editorial banner
- Foreground (near-black) background with clay + premium gold blur accents
- Grid pattern overlay at 10% opacity
- Clay underline eyebrow "ADVOKATLAR UCHUN"
- Serif H2 with italic clay "daromadingizni"
- 4-card stat grid with alternating accent/non-accent cards

### Footer — newspaper footer
- Clay accent strip on top
- Brand: serif "Adolat" + mono "HUQUQIY MARKETPLACE"
- Section headers in mono uppercase tracking
- Bottom bar with "© 2026" + dot separator + uppercase mono links

### Changed
- Version `0.5.0` → `0.6.0`.
- Replaced Geist Sans with **Inter** (better Cyrillic support, same Latin coverage).
- Replaced Geist Mono with **JetBrains Mono** (more readable for UI labels).
- All `bg-primary`/`text-primary-foreground` → `bg-foreground`/`text-background` (monochrome LobeHub default).
- All `text-primary` accents → `text-accent` (clay).
- All soft shadows (`shadow-md`, `shadow-lg`) → hard shadows (`shadow-hard`, `shadow-hard-sm`).
- All indigo/blue/violet color classes (none were present, but rule enforced) → clay/sage/gold trust tokens.

### Verified
- ✅ Homepage renders with editorial warm ivory background (RGB 253,249,245 measured)
- ✅ All API endpoints still respond 200
- ✅ Sign-in flow works (signed in as client@demo.uz, avatar shows "DE")
- ✅ Document editor opens, loads prior draft, all fields rendered
- ✅ Advocate listing shows all 8 advocates with new card design
- ✅ Document listing shows all 6 documents with rank badges
- ✅ Mobile responsive (390px viewport): shows "Menyu" button, "So'rov" shortened, "DE" avatar
- ✅ No console errors, no hydration warnings
- ✅ Lint passes clean on all updated files

### Notes
- No payment features added (per user direction — free changes only for now).
- All design changes are visual; backend logic untouched.
- 5 verification screenshots saved to `/home/z/my-project/download/`:
  - `v060-home-hero.png` — hero section
  - `v060-home-full.png` — full homepage
  - `v060-advocate-listing.png` — advocate catalog
  - `v060-doc-listing.png` — document catalog
  - `v060-mobile-home.png` — mobile viewport

---

## [0.5.0] — 2026-07-17

### Added — Real document editor + auth UI + dashboard

- **Full-screen document editor** (`/components/editor/document-editor.tsx`):
  - Renders dynamic form from server-side template schema (sections + fields).
  - Supports all field types: text, textarea, number, date, select, checkbox.
  - **1.5-second debounced autosave** to `/api/drafts` (silent, non-blocking).
  - **Live preview pane** showing the rendered document with field values
    highlighted (filled = green, empty = dashed gray).
  - **Progress bar** at top (filled / total fields × 100%).
  - **Field-level validation** with inline error messages in red.
  - **Resume editing**: when editor opens, fetches latest draft for that
    document from the user's account and pre-fills the form.
  - **PDF + DOCX download** buttons in header AND at bottom of form.
  - **Reset** button to clear all fields.
  - **Login wall**: unauthenticated users can fill the form but download
    requires sign-in (with toast prompt + auth modal auto-open).
- **Auth modal** (`/components/auth/auth-modal.tsx`):
  - Tabbed Sign-in / Sign-up form.
  - Role selector (CLIENT / ADVOCATE) on sign-up.
  - Validates email, phone, password (min 8 chars, letter + digit).
  - Shows demo accounts hint.
  - On success, modal closes and global user state refreshes.
- **Header rewrite** with auth state:
  - Shows user avatar with initials when logged in.
  - Dropdown menu: Dashboard, Profile, Counts (drafts/requests/messages),
    Sign out.
  - Shows "Kirish" button when logged out.
  - Mobile sheet menu includes auth-aware items.
- **User dashboard** (`/components/dashboard/dashboard.tsx`):
  - Stat cards (drafts, active requests, unread messages).
  - **My Drafts** tab: list of saved drafts with title, status, version,
    download count, updated time. Resume / Delete actions.
  - **My Requests** tab: list of user's legal requests with status, budget,
    responses count.
- **Session provider** (`/lib/auth/user-provider.tsx`):
  - Wraps NextAuth `SessionProvider` + custom `AppUserProvider`.
  - Fetches `/api/me` on session change.
  - Exposes `useAppUser()` hook returning `{ user, loading, refresh }`.
- **Layout** updated to include `AuthProvider` + `AppUserProvider`.

### Fixed
- `proxy.ts` export name (`middleware` → `proxy`) — Next.js 16 convention.
- Removed webpack config from `next.config.ts` (Turbopack incompatible);
  added `turbopack: {}` to silence migration warning.
- `safeString` / `safeLongText` validators now return plain `ZodString`
  (no `.transform()`) so callers can chain `.min()`. Sanitization moved
  to `sanitize()` helper for use at storage time.
- `getIpFromRequest` moved to `rate-limit.ts` (was duplicated in `session.ts`).
- NextAuth `authorize` callback now defensively handles `req.headers` shape
  (was throwing `req.headers.get is not a function` on 401).
- `saveDraftSchema.draftId` now accepts `null` (was rejecting because
  zod `optional()` doesn't allow `null`).
- Replaced `pdfkit` (broken in Next.js 16 standalone — looks for fonts in
  nonexistent `/ROOT/node_modules/...`) with **pdf-lib** (pure JS, embeds
  DejaVu Sans TTF for full Cyrillic support, no external file deps).
- DOCX generation verified working (9.5KB valid Word 2007+ file).
- PDF generation verified working (3.4KB valid PDF v1.7 file).

### Verified end-to-end
- ✅ Sign in with `client@demo.uz / Demo1234` works.
- ✅ Document editor opens with all sections + fields rendered.
- ✅ Autosave triggers 1.5s after each field change.
- ✅ Resume-editing loads prior draft on editor open.
- ✅ PDF download produces valid PDF file with substituted values.
- ✅ DOCX download produces valid Word document.
- ✅ Drafts persist in DB with version counter (5 versions after edits).
- ✅ Audit log records every download with IP, format, draftId.
- ✅ Database shows draft `status=COMPLETED` and `downloadCount` incremented.

### Changed
- Version `0.4.0` → `0.5.0`.
- Added `pdf-lib` dependency. `pdfkit` retained (no longer used) for now.

---

## [0.4.0] — 2026-07-17

### Added — Real backend infrastructure
- **Authentication (NextAuth v4)** with bcrypt(12) password hashing,
  account lockout (5 fails → 30 min block), session rotation, role-based
  access (CLIENT / ADVOCATE / ADMIN), audit-logged sign-in.
- **Credentials provider** with timing-safe password verification (always
  runs bcrypt compare even on unknown emails to prevent enumeration).
- **Rate limiting** (sliding-window in-memory, Redis-ready): 5 auth
  attempts/15 min, 3 signups/hour, 30 searches/10 sec, 10 downloads/hour,
  60 draft saves/10 min, 30 messages/min.
- **Audit logging** for every sensitive action (login, signup, draft CRUD,
  download, request post, authz denial, rate-limit hit).
- **Input validation** via zod schemas for every public endpoint:
  - Email/phone/password regex validation.
  - Field length caps (500 chars default, 5000 for long text).
  - Control-character stripping.
  - Field-ID allowlists for draft values (anti-template-injection).
- **Security headers** in `next.config.ts`: strict CSP, X-Frame-Options DENY,
  X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy,
  HSTS, COOP/CORP, frame-ancestors none.
- **Proxy middleware** (`src/proxy.ts`, Next.js 16 convention): per-route
  rate limits, bot/scanner blocking, UA enforcement.
- **Document template engine** (`src/lib/documents/template.ts`):
  - Structured template schema (sections + fields) stored as JSON.
  - Body schema (paragraphs + field placeholders) stored as JSON.
  - Validation that strips unknown field IDs (allowlist).
  - Type-specific validation (text, textarea, number, date, select, checkbox).
  - Server-side rendering of body with placeholder substitution.
- **Server-side DOCX generation** (`docx` library) with proper heading
  hierarchy, bullet lists, justified paragraphs, 2cm margins, page watermark.
- **Server-side PDF generation** (`pdfkit` + DejaVu fonts for Cyrillic)
  with A4 size, page numbers, footer watermark.
- **Database seeded with real data**:
  - 1 admin, 1 demo client, 8 verified advocates (all with full profiles,
    education, expertise, languages, fees, ratings, reviews count).
  - 6 legal documents WITH real templates:
    - Mehnat shartnomasi (16 fields, full body schema)
    - Oldi-sotdi shartnomasi (12 fields)
    - Ijara shartnomasi (7 fields)
    - Elektron raqamli imzo arizasi (4 fields)
    - Ajrashish da'vo arizasi (10 fields)
    - Ishdan bo'shatish shikoyati (10 fields)
  - 4 legal requests from the demo client.
- **REST API** (all under `/api`):
  - `POST /api/auth/signup` — register (CLIENT or ADVOCATE role).
  - `GET/POST /api/auth/[...nextauth]` — NextAuth handler.
  - `GET /api/advocates` — search/filter/paginate advocates.
  - `GET /api/documents` — search/filter/paginate documents.
  - `GET /api/requests` — list open requests.
  - `POST /api/requests` — create a legal request (auth required).
  - `GET /api/drafts` — list current user's drafts.
  - `POST /api/drafts` — autosave a draft (creates or updates).
  - `GET /api/drafts/[id]` — fetch a specific draft's values.
  - `DELETE /api/drafts/[id]` — soft-delete a draft.
  - `POST /api/documents/[slug]/generate` — generate PDF/DOCX from
    submitted values, auto-saves the draft, audits the download.
  - `GET /api/documents/[slug]/generate` — re-download the last draft as PDF.
  - `GET /api/categories` — category counts.
  - `GET /api/me` — current user info + counts (drafts, requests, messages).
- **IDOR protection**: every draft / request / message query is scoped to
  the authenticated user. Attempting to access another user's resource
  returns 403 and is audit-logged as `authz_denied`.

### Security posture
- All sensitive endpoints require authentication.
- All inputs validated via zod before reaching Prisma.
- Prisma parameterized queries only (no raw SQL).
- bcrypt cost factor 12.
- HttpOnly + SameSite=Lax cookies.
- Per-IP and per-user rate limits on every state-changing endpoint.
- Audit trail for every login/logout/signup/download/draft/request.

### Demo accounts (password: `Demo1234`)
- `admin@adolat.uz` — ADMIN
- `client@demo.uz` — CLIENT
- `akmal@adolat.uz`, `malika@adolat.uz`, `bobur@adolat.uz`,
  `dilnoza@adolat.uz`, `sherzod@adolat.uz`, `kamola@adolat.uz`,
  `javlon@adolat.uz`, `nigora@adolat.uz` — ADVOCATE

### Changed
- Project version `0.3.0` → `0.4.0`.
- Renamed `middleware.ts` → `proxy.ts` (Next.js 16 convention).
- Prisma client now logs only warnings/errors (not queries).
- Updated `.env` with `NEXTAUTH_SECRET` and feature flags.

---

## [0.3.0] — 2026-07-17

### Added
- **Comprehensive Prisma schema** with 10 models: `User`, `AdvocateProfile`, `Review`,
  `LegalDocument`, `DocumentTemplate`, `DocumentDraft`, `LegalRequest`,
  `RequestResponse`, `Conversation`, `Message`, `Notification`, `AuditLog`, `Session`.
- Database indexes for query performance.
- Soft-delete and TTL support for drafts (90-day expiry).
- Audit log infrastructure.
- Session tracking with IP and user-agent attribution.

### Security architecture
- Documented threat model covering 11 attack surfaces.
- bcrypt password hashing plan (cost factor 12).
- Per-IP per-route rate limiting plan.
- IDOR mitigation via owner-scoped queries.
- Template injection mitigation via placeholder allowlist.
- PII audit logging.

### Changed
- Project renamed from `nextjs_tailwind_shadcn_ts` to `adolat-marketplace`.
- Version bumped from `0.2.0` → `0.3.0`.

---

## [0.2.0] — 2026-07-17

### Added — Initial marketplace MVP (UI-only)
- Home page with hero (dual search), categories, featured advocates, popular
  documents, how-it-works, recent requests, testimonials, CTA, footer.
- Advocate catalog page with sidebar filters, sort, profile detail modal.
- Document catalog page with category chips, price filter, sort, detail modal.
- Requests board (hh.uz-style vacancy feed).
- Post-request modal (4-step wizard).
- For-advocates landing page.
- How-it-works page with FAQ.
- Custom emerald + amber + cream theme; Uzbek-localized content.
- 8 advocate records, 12 documents, 6 legal requests.

### Notes
- Static demo data only — no persistence, no auth, no real document generation.

---

## [0.7.0] — 2026-07-17

### Added — Real-time messaging with file attachments + history

- **Chat panel** (`/components/chat/chat-panel.tsx`):
  - Full-screen right-side Sheet with message list, input, file attachment
  - **HTTP polling** (3-second interval) for near-real-time message delivery — no WebSocket needed
  - File attachments: upload via `/api/chat/upload` (Next.js API route, max 10 MB)
  - Image previews inline, file download links with icons
  - Read receipts (CheckCheck for read, Check for sent)
  - Timestamps in Uzbek locale
  - Pending attachments preview before sending
  - Loading states for sending + uploading
  - Keyboard: Enter to send, Shift+Enter for newline
  - Empty state with "Suhbatni boshlang" CTA
- **Conversation APIs** (all auth-required, IDOR-protected):
  - `GET /api/conversations` — list user's conversations with last message + unread count
  - `POST /api/conversations/start` — start or get existing conversation with another user
  - `GET /api/conversations/[id]/messages` — paginated message history (50 per page, cursor-based)
  - `POST /api/conversations/send` — send a message with optional attachments
  - `POST /api/conversations/[id]/read` — mark all messages as read
- **File APIs** (auth-required):
  - `POST /api/chat/upload` — multipart upload, validates MIME + size, saves to `storage/uploads/`
  - `GET /api/chat/files/[filename]` — serve uploaded file with correct MIME + nosniff header
  - Allowed: JPEG, PNG, WebP, GIF, PDF, DOC, DOCX, TXT (max 10 MB)
  - Filename: nanoid(16) + safe extension (path-traversal proof)
- **Advocate API** updated to return `userId` field for chat lookup
- **Advocate detail modal** updated: "Bog'lanish" button now opens chat panel directly
  - Defensive null checks on `education`, `expertise`, `languages`, `secondarySpecialties`
  - `consultationFee`/`hourlyFee` handled as both number (API) and object (legacy type)
- **Chat service** (`mini-services/chat-service/`) — socket.io + Prisma + JWT auth
  - Available for future WebSocket upgrade when memory permits
  - Currently NOT running (disabled to save memory on 4 GB machines)
  - Chat panel uses REST polling instead

### Fixed
- **OOM crash** — Next.js 16 Turbopack uses 22 GB virtual memory on 4 GB machines → OOM-killed
  - Fixed by using managed dev.sh script with auto-restart
  - Removed separate chat service process (saved 80 MB)
  - Switched from WebSocket to HTTP polling (no socket.io process needed)
- **Advocate detail modal crash** — `adv.education.map()` threw when `education` was undefined
  - Added null checks: `(adv.education ?? []).map()`
  - Added fallback: "Ta'lim ma'lumotlari ko'rsatilmagan" empty state
- **`consultationFee` type mismatch** — API returns number, type expects `{amount, currency}`
  - Added runtime check: `typeof adv.consultationFee === "number" ? ... : ...`

### Verified end-to-end
- ✅ Login as `client@demo.uz` → HTTP 200
- ✅ File upload via `/api/chat/upload` → HTTP 200, file saved with nanoid filename
- ✅ Start conversation with advocate → HTTP 200, conversation created
- ✅ Send message via `/api/conversations/send` → HTTP 201, message persisted
- ✅ Get message history → 1 message returned
- ✅ Server stays alive after all operations (no OOM)
- ✅ Lint passes clean on all new files

### Changed
- Version `0.6.0` → `0.7.0`
- Chat uses REST polling (3s interval) instead of WebSocket — more reliable on low-memory servers
- File uploads go through Next.js API routes (port 3000) instead of chat service (port 3003)

---

## [0.7.0] — Additional changes (deployment + real documents)

### Added — Real yurxizmat document templates
- **4 new document templates** fetched from yurxizmat.uz with real form structures:
  1. **Vakillik shartnomasi** (Power of Attorney) — 18 fields, 6 sections
  2. **Avtotransport ijara shartnomasi** (Short-term car rental) — 19 fields, 4 sections
  3. **Hakamlik bitimi** (Arbitration agreement) — 11 fields, 4 sections
  4. **Pudrat shartnomasi** (Construction/Work contract) — 18 fields, 4 sections
- Total documents: **10** (was 6)
- All templates include real legal text with placeholder substitution

### Added — Deployment infrastructure
- **Dockerfile** — multi-stage build (deps → build → production), non-root user, health check
- **render.yaml** — Render.com Blueprint with web service + PostgreSQL database
- **GitHub Actions CI/CD** (`.github/workflows/ci-cd.yml`):
  - Lint + type check on every PR
  - Build verification
  - Auto-deploy to Render on push to main
- **DEPLOYMENT.md** — step-by-step Render deployment guide with:
  - Quick deploy instructions
  - Free tier limitations + upgrade path
  - Custom domain setup
  - Environment variables reference
  - Database initialization commands
  - Troubleshooting (OOM, DB connection, file storage)
- **README.md** — project overview, features, tech stack, quick start, project structure
- **.gitignore** — proper exclusions for node_modules, .next, db, storage, research, logs
- **`GET /api/health`** — health check endpoint for Docker/Render (returns status, version, uptime)

### Changed
- Total document count: 6 → 10
- All deployment files ready for production

---

## [0.8.0] — 2026-07-17

### Added — Advocate dashboard + Admin panel

**Advocate Dashboard** (`/components/advocate/advocate-dashboard.tsx`):
- Only accessible to logged-in ADVOCATE role users
- **Pending approval state**: shows "Tasdiqlash kutilmoqda" message if not yet verified
- 4 tabs once approved:
  1. **Overview** — stat cards (responses, accepted, conversations, rating), success metrics, recent matching requests
  2. **Requests** — list of open legal requests matching advocate's specialty, with budget, urgency, views count
  3. **Messages** — list of conversations with clients, unread badges, "Ochish" button opens chat
  4. **Profile** — view profile info + statistics (rating, reviews, cases, success rate)
- Header dropdown + mobile menu shows "Advokat kabineti" link for ADVOCATE role

**Admin Panel** (`/components/admin/admin-panel.tsx`):
- Only accessible to logged-in ADMIN role users
- 5 tabs:
  1. **Overview (Statistika)** — platform-wide stats (users, advocates, documents, requests, messages, recent activity)
  2. **Approvals (Tasdiqlash)** — pending advocate approvals with full profile info + approve/reject buttons
  3. **Users (Foydalanuvchilar)** — paginated table of all users with role, status, activity counts
  4. **Audit (Audit)** — paginated audit log viewer with action, user, IP, timestamp
  5. **Documents (Hujjatlar)** — placeholder for document management (coming soon)
- Header dropdown + mobile menu shows "Admin panel" link for ADMIN role

**Admin API endpoints** (all ADMIN-only, auth-checked):
- `GET /api/admin/stats` — platform metrics (user counts, advocate counts, document counts, recent activity)
- `GET /api/admin/approvals` — list pending advocate approvals with full profile data
- `POST /api/admin/approve` — approve or reject an advocate (sets licenseVerified + user status)
- `GET /api/admin/users` — paginated user list with activity counts
- `GET /api/admin/audit-logs` — paginated audit log viewer

**Advocate API endpoints** (ADVOCATE-only, auth-checked):
- `GET /api/advocate/stats` — dashboard stats (responses, conversations, unread messages, matching requests, rating)
- `GET /api/advocate/requests` — list open legal requests matching advocate's specialty (filter: matching/all/responded)

### Verified end-to-end
- ✅ Admin login → sees platform stats (10 users, 8 advocates, 10 documents, 6 requests, 27 audit logs)
- ✅ Admin creates test advocate (unverified) → appears in pending approvals
- ✅ Admin approves advocate → advocate becomes verified + user status ACTIVE
- ✅ Advocate login (test-adv@adolat.uz) → sees "approved: true" + dashboard with stats
- ✅ Advocate sees 1 matching request in their specialty
- ✅ Lint passes clean on all new files

### Changed
- Version `0.7.0` → `0.8.0`
- ViewType now includes `advocate-dashboard` and `admin-panel`
- Header shows role-based navigation (Advocate Dashboard for ADVOCATEs, Admin Panel for ADMINs)
- Mobile menu includes role-based links
