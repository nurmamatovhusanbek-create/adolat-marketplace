#!/bin/bash
# Package all design-overhaul changes into a clean zip.
# Preserves directory structure relative to project root so the user can
# extract directly over their local marketplace folder on Windows.

set -euo pipefail

PROJECT_ROOT="/home/z/my-project"
STAGING="/tmp/adolat-overhaul-pkg"
OUT_ZIP="/home/z/my-project/download/adolat-overhaul-v1.zip"

# Clean any previous staging/output
rm -rf "$STAGING" "$OUT_ZIP"
mkdir -p "$STAGING"

# ============================================================================
# CHANGED FILES — copy each preserving relative path
# ============================================================================
CHANGED_FILES=(
  # Build fixes
  "next.config.ts"

  # globals.css (massive overhaul — motion tokens, shimmer, rise, etc.)
  "src/app/globals.css"

  # Base UI components (polish phase)
  "src/components/ui/button.tsx"
  "src/components/ui/card.tsx"
  "src/components/ui/badge.tsx"
  "src/components/ui/input.tsx"
  "src/components/ui/dialog.tsx"
  "src/components/ui/skeleton.tsx"

  # Marketplace components
  "src/components/marketplace/header.tsx"
  "src/components/marketplace/hero.tsx"
  "src/components/marketplace/category-grid.tsx"
  "src/components/marketplace/featured-advocates.tsx"
  "src/components/marketplace/popular-documents.tsx"
  "src/components/marketplace/how-it-works.tsx"
  "src/components/marketplace/recent-requests.tsx"
  "src/components/marketplace/testimonials.tsx"
  "src/components/marketplace/post-request-modal.tsx"
  "src/components/marketplace/footer.tsx"
  "src/components/marketplace/document-listing.tsx"
  "src/components/marketplace/requests-page.tsx"
  "src/components/marketplace/advocate-listing.tsx"

  # Chat panel polish (typing indicator, message bubbles)
  "src/components/chat/chat-panel.tsx"

  # Admin panel polish (stat cards hover, table row hover)
  "src/components/admin/admin-panel.tsx"

  # New file — scroll-reveal hook
  "src/hooks/use-in-view.ts"
)

for f in "${CHANGED_FILES[@]}"; do
  src="$PROJECT_ROOT/$f"
  dst="$STAGING/$f"
  if [[ -f "$src" ]]; then
    mkdir -p "$(dirname "$dst")"
    cp "$src" "$dst"
    echo "  + $f"
  else
    echo "  ! MISSING: $f" >&2
  fi
done

# ============================================================================
# REMOVED FILE — mark for deletion via a marker file
# (User must manually delete tailwind.config.ts on their side.
#  Tailwind v4 ignores it but it's confusing dead code.)
# ============================================================================
cat > "$STAGING/REMOVE-THIS-FILE.txt" << 'EOF'
tailwind.config.ts
EOF

# ============================================================================
# README — installation instructions
# ============================================================================
cat > "$STAGING/README-INSTALL.md" << 'EOF'
# Adolat Marketplace — Design Overhaul v1

## What's in this zip

All files needed to apply the design overhaul on top of v1.3.0 (or any
recent version). The zip preserves directory structure relative to your
project root.

## Apply on Windows (PowerShell)

1. Extract this zip somewhere temporary, e.g. `C:\Users\nurma\Desktop\overhaul`
2. Open PowerShell and copy files over your local marketplace:

   ```powershell
   $src  = "C:\Users\nurma\Desktop\overhaul"
   $dest = "C:\Users\nurma\Desktop\marketplace"

   # Copy all files (overwrites existing)
   Copy-Item -Path "$src\*" -Destination $dest -Recurse -Force

   # Delete the dead Tailwind v3 config (Tailwind v4 ignores it but it's clutter)
   Remove-Item -Path "$dest\tailwind.config.ts" -ErrorAction SilentlyContinue
   ```

3. Run dev server:

   ```powershell
   cd $dest
   bun run dev
   ```

4. Open http://localhost:3000 and verify:
   - No more `eslint` warning in console
   - No more `header.tsx:148` JSX parse error
   - Hero rises in on page load (eyebrow → headline → paragraph → search → CTAs)
   - Cards lift subtly on hover with soft shadow
   - Skeletons shimmer (not generic pulse) while data loads
   - Modal/dialog open with smooth brand easing
   - Chat panel message bubbles slide in
   - Post-request modal step indicator animates

## Apply on macOS / Linux (bash)

```bash
src="/path/to/overhaul"
dest="/path/to/marketplace"

cp -r "$src"/* "$dest"/
rm -f "$dest/tailwind.config.ts"

cd "$dest" && bun run dev
```

## What changed (high-level)

### Build fixes
- `next.config.ts`: removed unsupported `eslint` config block (Next.js 16 dropped it)
- `src/components/marketplace/header.tsx`: wrapped two sibling `<Button>` elements
  in a Fragment inside `{!hideNav && (...)}` (was invalid JSX)
- Removed dead `tailwind.config.ts` (Tailwind v3 syntax, ignored by v4)

### Design system (src/app/globals.css)
- Motion tokens: `--ease-standard`, `--ease-emphasized`, `--ease-enter`,
  `--ease-exit`; `--dur-instant/fast/base/slow` (Material 3 standard)
- Beautiful shadow family: `--shadow-beautiful-sm/md/lg` (light + dark variants)
- Hero rise choreography: `.rise` + `.rise-1..5` classes (staggered entrance)
- Scroll-reveal utilities: `.reveal-on-scroll` + `.reveal-stagger` (9 nth-child delays)
- Skeleton shimmer: `.skeleton-shimmer` (gradient sweep, dark-mode aware)
- Skeleton pulse: `.skeleton-pulse` (lighter alternative)
- Dialog/dropdown/popover/tooltip brand easing overrides via `[data-state]` selectors
- `:user-invalid` form styling (fires on blur/submit, not first keystroke)
- Typing indicator dots + stat-pop keyframes
- Capped `.verified-pulse` at 3 iterations + pause-on-hover (WCAG 2.2.2 Level A)
- Strengthened `prefers-reduced-motion` block (strips transform animations,
  keeps content visible)

### New hook (src/hooks/use-in-view.ts)
- `useInView<T>()` — IntersectionObserver-based scroll-reveal hook
- Fires once (does not replay)
- Respects `prefers-reduced-motion` (returns true immediately)
- Usage: `const [ref, inView] = useInView<HTMLDivElement>();`

### Base UI component polish
- `Button`: `active:scale-[0.98]` tactile press, brand easing,
  `disabled:active:scale-100`
- `Card`: brand easing on `transform/box-shadow/border-color`
- `Badge`: new `verified`/`urgent`/`premium` trust-signal variants
  (sage/terracotta/gold at low-opacity backgrounds)
- `Input`: brand easing, `aria-[invalid=true]` error chrome
- `Dialog`: parchment-tinted overlay (`bg-foreground/40 backdrop-blur-sm`),
  `shadow-beautiful-md` on content, brand easing on close button
- `Skeleton`: now supports `variant="shimmer"` (default) and `variant="pulse"`

### Marketplace component polish
- `Hero`: `.rise rise-1..5` choreography on eyebrow → h1 → paragraph →
  search form → CTA → trust badges → stat card
- `CategoryGrid`: scroll-reveal stagger, `shadow-beautiful-md` hover
- `FeaturedAdvocates`: shimmer skeletons matching loaded card shape
  (avatar + title + badges + stats + footer), reveal-stagger on grid
- `PopularDocuments`: same skeleton treatment, refined hover lift
- `RecentRequests`: same skeleton treatment
- `HowItWorks`: refined card hover, brand easing on step transitions
- `Testimonials`: subtle lift on hover
- `PostRequestModal`: animated step indicator with `ring-2 ring-accent/40`
  on active step, brand colors, connecting lines (Law of Uniform Connectedness);
  success state uses rise entrance; TypeCard gets `active:scale-[0.99]`
- `Footer`: brand easing on social icons
- `DocumentListing`/`RequestsPage`/`AdvocateListing`: refined hover lift,
  replaced `transition-all` with specific property transitions

### Chat panel (src/components/chat/chat-panel.tsx)
- Message bubbles: `rounded-2xl` with one flattened corner (br-md for mine,
  bl-md for theirs), `shadow-beautiful-sm`, slide-in entrance via
  `animate-[riseIn_0.3s_cubic-bezier(0.2,0,0,1)_forwards]`
- Typing indicator: three `.typing-dot` spans that bounce in sequence
  (shown when `state.otherTyping` is true)
- Empty state gets `.rise rise-1` entrance
- Input + send button get `aria-label`s

### Admin panel (src/components/admin/admin-panel.tsx)
- `StatCard`: hover lift + `shadow-beautiful-sm`
- `BarRow`: `transition-[width] duration-500` for animated bar fill on data load
- All table rows (documents/users/audit): `transition-colors duration-150`
  with brand easing on hover

## File manifest (24 files)

```
next.config.ts                                            (modified)
src/app/globals.css                                       (modified — major)
src/components/ui/button.tsx                              (modified)
src/components/ui/card.tsx                                (modified)
src/components/ui/badge.tsx                               (modified)
src/components/ui/input.tsx                               (modified)
src/components/ui/dialog.tsx                              (modified)
src/components/ui/skeleton.tsx                            (modified)
src/components/marketplace/header.tsx                     (modified — build fix)
src/components/marketplace/hero.tsx                       (modified)
src/components/marketplace/category-grid.tsx              (modified)
src/components/marketplace/featured-advocates.tsx         (modified)
src/components/marketplace/popular-documents.tsx          (modified)
src/components/marketplace/how-it-works.tsx               (modified)
src/components/marketplace/recent-requests.tsx            (modified)
src/components/marketplace/testimonials.tsx               (modified)
src/components/marketplace/post-request-modal.tsx         (modified)
src/components/marketplace/footer.tsx                     (modified)
src/components/marketplace/document-listing.tsx           (modified)
src/components/marketplace/requests-page.tsx              (modified)
src/components/marketplace/advocate-listing.tsx           (modified)
src/components/chat/chat-panel.tsx                        (modified)
src/components/admin/admin-panel.tsx                      (modified)
src/hooks/use-in-view.ts                                  (NEW)
tailwind.config.ts                                        (DELETE on your side)
```

## Build status

`npm run build` / `bun run build` passes clean — no errors, no warnings.

## After applying

Once you've copied the files and restarted the dev server, walk through:
1. Home page — hero should rise in, cards should lift on hover
2. Advocates listing — shimmer skeletons while data loads
3. Documents listing — same
4. Click "So'rov joylash" — modal opens with brand easing, step indicator animates
5. Sign in — modal opens with parchment overlay + blur
6. If you're an admin — admin panel stat cards lift on hover, bars animate

If anything looks off, the worklog at `worklog.md` (in the sandbox) has the
full chronological record of every change.
EOF

# ============================================================================
# Create the zip
# ============================================================================
cd "$STAGING"
zip -r -q "$OUT_ZIP" .
ls -lh "$OUT_ZIP"
echo ""
echo "=== Contents ==="
unzip -l "$OUT_ZIP" | head -50
