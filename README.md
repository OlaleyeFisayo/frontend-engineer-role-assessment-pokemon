# Pokémon Explorer

A Pokédex web app built for the Checkit Frontend Engineer take-home assessment. Browse, search, and filter all Pokémon with a classic Pokédex hardware aesthetic.

**Live:** https://pokedex.festusolaleyef.workers.dev/pokemon

**Stack:** Next.js 16 (App Router) · TypeScript strict · Tailwind CSS v4 · React Context · Cloudflare Workers via OpenNext

---

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # 16 unit tests
npm run lint       # ESLint
npm run build      # Production build
```

**Requirements:** Node.js 20+, npm 10+

---

## Features

| Feature            | Implementation                                                         |
| ------------------ | ---------------------------------------------------------------------- |
| Browse all Pokémon | Paginated grid (24/page), server-rendered with ISR                     |
| Search by name     | 1000ms debounced input, server-side match across all entries            |
| Filter by type     | `?type=` URL param, server re-fetches PokéAPI type endpoint            |
| Detail page        | Official artwork, base stats, abilities, height, weight                |
| Shareable URLs     | All filters and pagination live in the URL (`?q=`, `?type=`, `?page=`) |
| Loading states     | Skeleton loaders matching the Pokédex aesthetic                        |
| Error states       | Isolated error boundary — header stays intact on network failure       |

---

## Architecture

### Data fetching — native `fetch` with Next.js cache

All data fetching uses native `fetch` inside Server Components with Next.js cache options. No client-side data fetching library is used.

- `force-cache` for static data (all Pokémon names, type list) — fetched once, cached indefinitely
- `next: { revalidate: 3600 }` on detail pages — ISR, served from edge, refreshed hourly
- `next: { revalidate: 86400 }` on listing pages — refreshed daily

All `fetch` calls are isolated in `api/request.ts`. No component calls `fetch` directly.

### State management — React Context

`FilterContext` holds `search`, `type`, and `page` — the three values that drive what data is shown. It is the only global state in the app.

- State is derived from and synced back to URL params so URLs are always shareable
- `useMemo` on the context value object prevents unnecessary re-renders in consumers
- `useCallback` on setters gives them stable identity as `useMemo` dependencies
- `useFilter()` hook uses the React 19 `use()` API to consume the context

### URL-driven state

All filters live in the URL (`?q=pikachu&type=fire&page=2`). This gives shareable URLs, free browser back/forward navigation, SSR compatibility, and zero hydration mismatch — with no extra state synchronisation needed.

### Search

PokéAPI has no search endpoint. When `?q=` is present, the server fetches all Pokémon names (cached with `force-cache`), filters by the query, paginates the matches, then batch-fetches the matching Pokémon details. Results are correct across the full Pokédex, not just the current page.

### Error resilience

The listing page uses a React class `ErrorBoundary` around the grid section. If the data fetch fails, the header, search bar, and type filter stay intact — only the grid shows a retry UI. The detail page has its own `error.tsx` with `router.back()` so users are never trapped.

### `type` over `interface`

Enforced by ESLint (`ts/consistent-type-definitions: ["error", "type"]`). Consistent, avoids declaration merging surprises, and composable with intersection types.

---

## Performance

| Technique                        | Where                            | Effect                                               |
| -------------------------------- | -------------------------------- | ---------------------------------------------------- |
| `next/image` with explicit sizes | `PokemonCard`, detail hero       | Prevents CLS; space reserved before image loads      |
| `priority` on first 4 cards      | `PokemonCard` (index < 4)        | Improves LCP — above-the-fold images not lazy-loaded |
| ISR (`revalidate`)               | Detail: 1h, Listing: 1d          | Pages served from CDN edge, no cold-start per user   |
| `force-cache` for static data    | Names list, type list            | Fetched once at build, served from cache forever     |
| `next/font`                      | Root layout                      | Eliminates FOUT, reduces CLS                         |
| Suspense streaming               | Stats + Abilities on detail page | Page shell renders immediately, sections stream in   |
| `dynamic(..., { ssr: false })`   | `SearchBar`, `TypeFilter`        | Client-only components excluded from server bundle   |

### Lighthouse scores

Tested on the live Cloudflare Workers deployment (`/pokemon`).

| Category        | Mobile | Desktop |
| --------------- | ------ | ------- |
| Performance     | 99     | 98      |
| Accessibility   | 96     | 96      |
| Best Practices  | 100    | 100     |
| SEO             | 100    | 100     |

Full reports: [Mobile](public/mobile%20score.pdf) · [Desktop](public/desktop%20score.pdf)

---

## Testing

Two components tested with Vitest + React Testing Library:

**`PokemonCard`** — highest-impact component (rendered 24× per page, drives LCP and CLS). Tests cover: image fallback chain (official artwork → sprite → SVG fallback), `priority` prop on first 4 cards, type badge rendering, stat bar values.

**`SearchBar`** — non-trivial async interaction: debounced input → context write → URL update. Tests cover: debounce timing with fake timers, no premature context writes during typing, URL sync on external change, cleanup on unmount.

```bash
npm test                 # run all tests
npm run test:coverage    # with v8 coverage report
```

---

## Bonus Tasks

### B-2: Suspense Streaming

`PokemonStats` and `PokemonAbilities` on the detail page are each wrapped in `<Suspense>`. The page shell (header, image, info grid) renders and streams to the browser immediately. Stats and abilities follow as their fetches resolve, with skeleton fallbacks in the meantime.

### B-3: Accessibility

- All images have descriptive `alt` text
- Pagination `<nav>` has `aria-label`, active page has `aria-current="page"`
- Search input has `aria-label` and `type="search"`
- Decorative scan-line overlays are `aria-hidden="true"`
- Error pages have a focus-visible retry button

---

## Project Structure

```
app/
  pokemon/page.tsx           # Listing page (SSR + ISR)
  pokemon/[id]/page.tsx      # Detail page (SSG first 151 + ISR)
  pokemon/error.tsx          # Listing error boundary
  pokemon/[id]/error.tsx     # Detail error boundary (router.back)

api/
  request.ts                 # Only file that calls fetch
  types.ts                   # Raw PokéAPI shapes + payload types

components/
  pokemon-card/              # Grid card (with co-located tests)
  search-bar/                # Debounced search input (with co-located tests)
  pokemon-grid-section.tsx   # Fetches + renders the paginated grid
  pokemon-stats.tsx          # Streamed stats section (Server Component)
  pokemon-abilities.tsx      # Streamed abilities section (Server Component)
  type-filter-section.tsx    # Fetches types + renders controls
  grid-error-boundary.tsx    # React class ErrorBoundary for the grid

providers/
  filter-context-value.ts    # FilterContext + FilterState type
  filter-context.tsx         # FilterProvider (URL ↔ context sync)

hooks/
  use-filter.ts              # useFilter() using React 19 use()
  use-debounce.ts            # Generic debounce hook

types/
  pokemon.ts                 # PokemonListItem, PokemonListResponse
  api.ts                     # PaginatedResponse<T>, NamedAPIResource
```

---

## Trade-offs

**24 parallel fetches per listing page** — PokéAPI's list endpoint returns only names and URLs, so getting sprite/type/stat data requires one fetch per Pokémon. Mitigated by ISR — these fetches happen once on the server at build/revalidation time, never per user request.

**No infinite scroll** — Pagination was chosen because infinite scroll breaks URL shareability (a stated requirement), is harder to make accessible, and has worse CLS with dynamic content insertion.

**Server-side search** — When `?q=` is set, the server fetches all Pokémon names to match against. With `force-cache` this is a single cached response. The trade-off vs. a proper search endpoint is negligible at the current scale (~1,300 entries, ~60 KB payload).
