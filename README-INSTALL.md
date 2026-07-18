# Adolat Marketplace — Complete Redesign v2 (Editorial Premium)

## What's new in v2

This is a COMPLETE REDESIGN, not polish. Key changes:

### Icon family replaced
- **Removed**: lucide-react (all marketplace/auth/chat/admin/editor/dashboard components)
- **Added**: @phosphor-icons/react (6 weights: Thin/Light/Regular/Bold/Fill/Duotone)
- Install the new dep: `bun install` or `npm install`

### Modals — proper desktop sizing (was mobile-crammed)
- Dialog component now has 5 sizes: sm (max-w-md), md (max-w-lg), lg (max-w-2xl), xl (max-w-4xl), 2xl (max-w-6xl)
- PostRequestModal: 2-column layout on desktop (form + live summary sidebar), max-w-6xl
- AdvocateDetailModal: max-w-6xl with scrollable body
- DocumentDetailModal: max-w-6xl with scrollable body
- AuthModal: max-w-md (sm size)
- Chat panel: 480px on tablet, 560px on desktop (was 100vw)

### Admin panel — sidebar layout (was tabs)
- Dark sidebar (240px) on left with nav items + user footer
- Top bar with section title + admin badge
- Mobile: drawer with overlay
- Stat cards with hover lift
- Data tables with brand-easing row hover
- Animated BarRow width transitions

### Design system (globals.css) — Editorial Premium
- Refined color palette: deeper ember accent, ink blue secondary
- Dark sidebar tokens for admin
- New type scale: display 80px → body 16px
- New radii: 8/12/16/20/24px (was 4/6/8/12)
- New shadow scale: xs/sm/md/lg/xl/2xl (layered, premium)
- All motion tokens preserved (M3 easings, durations)
- All microanimations preserved (rise, shimmer, reveal, typing dots, etc.)
- All accessibility preserved (WCAG 2.2.2, prefers-reduced-motion)

### Base UI components — completely redesigned
- **Button**: 4 variants × 5 sizes × 6 tones, built-in loading state with Phosphor Spinner, active:scale-[0.98] tactile press
- **Card**: rounded-2xl, border-0 default, soft shadow, brand easing on hover
- **Badge**: 3 variants (solid/soft/outline) × 6 tones × 3 sizes, rounded-full pill
- **Input**: rounded-xl, h-11 default, prefix/suffix support via InputWrapper
- **Dialog**: 5 sizes, parchment overlay with blur, sticky header/body/footer structure
- **Tabs**: pill-style indicator with brand easing
- **Skeleton**: shimmer (default) + pulse variants

### Marketplace components
- Header: 2-row layout with ⌘K command palette hint in search
- Hero: 7/5 asymmetric grid, larger type scale, rise choreography
- CategoryGrid: scroll-reveal stagger, beautiful-md hover shadow
- FeaturedAdvocates: shimmer skeletons matching card shape, reveal-stagger
- PopularDocuments: same treatment
- HowItWorks: Phosphor duotone icons, new card design
- RecentRequests: Phosphor icons, new card design
- Testimonials: Phosphor Quotes icon, reveal-stagger
- AdvocateCTA: dark hero card with shadow-beautiful-xl
- Footer: Phosphor brand logos (Telegram/Instagram/Facebook/YouTube)
- PostRequestModal: animated step indicator with ring-2 ring-accent/40 on active step, 2-column desktop layout
- All listings: new card design with hover lift + shadow-beautiful-md

## Apply on Windows (PowerShell)

```powershell
$src  = "C:\Users\nurma\Desktop\redesign-v2"
$dest = "C:\Users\nurma\Desktop\marketplace"

# Extract zip to $src first, then:
Copy-Item -Path "$src\*" -Destination $dest -Recurse -Force
Remove-Item -Path "$dest\tailwind.config.ts" -ErrorAction SilentlyContinue

# Install new dependency
cd $dest
bun install
# OR: npm install
```

## Apply on macOS / Linux (bash)

```bash
src="/path/to/redesign-v2"
dest="/path/to/marketplace"

cp -r "$src"/* "$dest"/
rm -f "$dest/tailwind.config.ts"

cd "$dest"
bun install
# OR: npm install
```

## Run dev

```bash
bun run dev
# OR: npm run dev
```

## Commit + push

```bash
cd /c/Users/nurma/Desktop/marketplace
git add -A
git commit -m "redesign(v2): complete overhaul — Phosphor icons, proper desktop modals, admin sidebar layout

- Replaced lucide-react with @phosphor-icons/react across all components
- Dialog: 5 size variants (sm/md/lg/xl/2xl) with sticky header/body/footer
- PostRequestModal: 2-column desktop layout (form + live summary)
- AdvocateDetailModal/DocumentDetailModal: max-w-6xl with scrollable body
- AuthModal: sm size (max-w-md)
- Chat panel: 480-560px on desktop (was 100vw)
- Admin panel: dark sidebar layout (was tabs)
- New design system: deeper ember accent, ink blue secondary, layered shadows
- New radii: 8/12/16/20/24px
- New type scale: display 80px → body 16px
- Button: 4 variants × 5 sizes × 6 tones + built-in loading state
- Card: rounded-2xl, border-0 default, soft shadow
- Badge: 3 variants × 6 tones × 3 sizes, pill shape
- Input: rounded-xl, h-11, prefix/suffix support
- All skeletons: shimmer (matching content shape)
- All motion preserved (M3 easings, rise choreography, scroll reveal)
- All accessibility preserved (WCAG 2.2.2, prefers-reduced-motion)

Build: npm run build passes clean — no errors, no warnings."

git push origin master
```

## File manifest (32 files)

```
package.json                                              (modified — added phosphor dep)
bun.lock                                                   (modified)
src/app/globals.css                                        (modified — complete redesign)
src/components/ui/button.tsx                               (modified — complete redesign)
src/components/ui/card.tsx                                 (modified — complete redesign)
src/components/ui/badge.tsx                                (modified — complete redesign)
src/components/ui/input.tsx                                (modified — complete redesign)
src/components/ui/dialog.tsx                               (modified — complete redesign)
src/components/ui/skeleton.tsx                             (modified)
src/components/ui/tabs.tsx                                 (modified — complete redesign)
src/components/ui/label.tsx                                (modified)
src/components/ui/textarea.tsx                             (modified)
src/components/marketplace/header.tsx                      (modified — new layout)
src/components/marketplace/hero.tsx                        (modified — new composition)
src/components/marketplace/category-grid.tsx               (modified)
src/components/marketplace/featured-advocates.tsx          (modified)
src/components/marketplace/popular-documents.tsx           (modified)
src/components/marketplace/how-it-works.tsx                (modified)
src/components/marketplace/recent-requests.tsx             (modified)
src/components/marketplace/testimonials.tsx                (modified)
src/components/marketplace/advocate-cta.tsx                (modified)
src/components/marketplace/footer.tsx                      (modified)
src/components/marketplace/post-request-modal.tsx          (modified — 2-col desktop)
src/components/marketplace/advocate-detail-modal.tsx       (modified — max-w-6xl)
src/components/marketplace/document-detail-modal.tsx       (modified — max-w-6xl)
src/components/marketplace/advocate-listing.tsx            (modified)
src/components/marketplace/document-listing.tsx            (modified)
src/components/marketplace/requests-page.tsx               (modified)
src/components/marketplace/how-it-works-page.tsx           (modified — Phosphor)
src/components/marketplace/for-advocates-page.tsx          (modified — Phosphor)
src/components/marketplace/dynamic-icon.tsx                (modified — Phosphor)
src/components/auth/auth-modal.tsx                         (modified — sm size)
src/components/chat/chat-panel.tsx                         (modified — desktop width)
src/components/admin/admin-panel.tsx                       (modified — sidebar layout)
src/components/advocate/advocate-dashboard.tsx             (modified — Phosphor)
src/components/editor/document-editor.tsx                  (modified — Phosphor)
src/components/dashboard/dashboard.tsx                     (modified — Phosphor)
src/hooks/use-in-view.ts                                   (NEW)
tailwind.config.ts                                         (DELETE)
```

## Build status

`npm run build` / `bun run build` passes clean — no errors, no warnings.

## What to verify after applying

1. Home — hero rises in with new larger type scale (display 80px)
2. Advocates listing — shimmer skeletons while loading, cards lift on hover with beautiful-md shadow
3. Click any advocate → modal opens at max-w-6xl with scrollable body (NOT 98vw anymore)
4. Click "So'rov joylash" → modal opens with 2-column desktop layout (form + summary sidebar)
5. Sign in → modal at max-w-md (sm size)
6. Click "Bog'lanish" on any advocate → chat panel slides in at 480-560px wide (NOT 100vw)
7. Admin panel (if admin) → dark sidebar on left with nav items, top bar with section title
8. All icons should be Phosphor (different look from lucide — more design-forward, supports duotone weight)
