# Pokémon Explorer

A production-quality Pokédex web app built as a take-home assessment. Browse, search, and filter all 1,350 Pokémon with a classic Pokédex hardware aesthetic.

**Stack:** Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS v4 · TanStack Query v5 · React Context · Cloudflare Workers via OpenNext

---

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # 16 unit tests
npm run lint       # ESLint with @antfu/eslint-config
npm run build      # Production build (157 pages)
```

**Requirements:** Node.js 20+, npm 10+

---

## Features

| Feature | Implementation |
|---|---|
| Browse all 1,350 Pokémon | Paginated grid (24/page), SSR via `fetchPokemonList` |
| Search by name | 300ms debounced client-side filter over all names |
| Filter by type | URL param `?type=` — server re-fetches type endpoint |
| Detail page | Official artwork, stats, abilities, height, weight |
| Loading states | Skeleton loaders with Pokédex aesthetic + `animate-pulse` |
| Error states | Friendly error boundary with reset button |

---

## Architecture Decisions

### URL-driven state (no client state store)
Filter, search, and page are all URL query params (`?q=`, `?type=`, `?page=`). This gives free SSR compatibility, shareable URLs (requirement F-3), browser history navigation, and zero hydration mismatch. A `FilterContext` wraps the listing page to share parsed values across `SearchBar`, `TypeFilter`, and `PokemonGrid` without prop drilling.

### Client-side search over all names
PokéAPI has no server-side search endpoint. Instead, all 1,350 Pokémon names (~60 KB) are fetched once into TanStack Query cache with `staleTime: Infinity` and filtered client-side with a 300ms debounce. This is faster than hitting the API on every keystroke and avoids pagination complexity for search results.

### Type filter via server-side fetch
When `?type=` is set, the listing page calls `GET /type/{name}` which returns all Pokémon of that type. This avoids loading all 1,350 Pokémon into the browser just to filter them.

### Fetch-only API layer (`api/request.ts`)
All `fetch` calls are isolated in a single file. `api/index.ts` wraps them in `queryOptions()` for TanStack Query. This separation means fetch logic is testable without React hooks, and query options are reusable across server and client components.

`fetchPokemonDetail` returns `Promise<RawPokemon>` — the raw PokéAPI shape — so consumers access nested fields directly (`raw.sprites.other["official-artwork"].front_default`). No intermediate mapping is done; the type system documents what fields exist.

### TanStack Query for client data
- **Default `staleTime: 10 min`** — avoids re-fetching on every navigation
- **`staleTime: Infinity`** for Pokémon names and types — these never change
- **`queryOptions()` pattern** — not wrapper hooks, so options can be passed to both `useQuery` and server-side `prefetchQuery` without duplication

### Justified memoization only
- `useMemo` on FilterContext value object — prevents all consumers re-rendering on every parent render
- `useCallback` on `setSearch`/`setType`/`setPage` — these are dependencies of the context value `useMemo`, so they must have stable identity
- No speculative memoization on leaf components (cards, badges, bars) — they receive stable props and have no expensive derived computation

### `type` over `interface` everywhere
Enforced by ESLint rule `ts/consistent-type-definitions: ["error", "type"]`. Consistent, composable, and avoids declaration merging surprises.

---

## Performance Optimizations

| Technique | Where | Effect |
|---|---|---|
| `next/image` with explicit dimensions | `PokemonCard`, detail hero | Prevents CLS; browser reserves correct space before image loads |
| `priority` on first 4 cards | `PokemonCard` (index < 4) | Improves LCP — hero images above the fold are not lazy-loaded |
| ISR with `revalidate` | Detail pages: 1h, List/API route: 1d | Static pages served from CDN edge, no cold-start latency |
| `force-cache` for static data | `fetchAllPokemonNames`, `fetchPokemonTypes` | Fetched once at build time, served from cache forever |
| `next/font` (Inter) | Root layout | Eliminates FOUT (flash of unstyled text), reduces CLS |
| Suspense streaming | Stats + Abilities sections on detail page | Page shell renders immediately; heavy sections stream in (B-2) |
| `dynamic(..., { ssr: false })` | `SearchBar`, `TypeFilter` | Client-only components split from server bundle |

---

## Testing

Two components tested to 100% coverage:

**`PokemonCard`** — chosen because it is the highest-impact component (rendered 24× per page, controls LCP and CLS) with the most branching logic: image fallback chain (officialArtwork → sprite → SVG), `priority` prop conditionally set, type badge rendering, stat bar values.

**`SearchBar`** — chosen because it encapsulates a non-trivial async interaction: debounced input → context write → URL update. The debounce timing, cleanup on unmount, and integration with FilterContext all needed explicit verification.

```bash
npm test                    # run tests
npm run test:coverage       # with v8 coverage report
```

---

## Bonus Tasks

### B-2: Suspense Streaming
The detail page wraps `<PokemonStats>` and `<PokemonAbilities>` in `<Suspense>` boundaries. The page shell (header, image, info grid) renders immediately while stats and abilities stream in. Skeleton fallbacks match the Pokédex card aesthetic.

### B-3: Accessibility
- All images have descriptive `alt` text
- Pagination uses `aria-label` on nav, `aria-current="page"` on active page button
- Type badges have sufficient color contrast (white text on colored backgrounds)
- Search input has `aria-label="Search Pokémon"` and `role="searchbox"` via `type="search"`
- Screen-only scan-line overlay divs are `aria-hidden="true"`
- Error pages include a focus-visible reset button

---

## Project Structure

```
app/
  pokemon/page.tsx          # Listing page (SSR + ISR)
  pokemon/[id]/page.tsx     # Detail page (SSG first 151 + ISR)
  api/pokemon-names/        # Internal route: all names for search

api/
  request.ts                # Only file that calls fetch
  index.ts                  # queryOptions + POKEMON_QUERY_KEY
  types.ts                  # Raw PokéAPI shapes + payload types

components/
  pokemon-card/             # Grid card (with co-located test)
  search-bar/               # Debounced search (with co-located test)
  listing-controls.tsx      # Client wrapper for dynamic imports

providers/
  filter-context-value.ts   # FilterContext + FilterState (non-client)
  filter-context.tsx        # FilterProvider component

hooks/
  use-filter.ts             # useFilter() with React 19 use()
  use-debounce.ts           # Generic debounce hook

types/
  pokemon.ts                # PokemonListItem, PokemonListResponse
  api.ts                    # PaginatedResponse<T>, NamedAPIResource
```

---

## Trade-offs

**Batch fetching on listing page** — Each page load fires 24 parallel `fetch` calls to get sprite/type/stat data (PokéAPI's list endpoint only returns names and URLs). This is mitigated by ISR (`revalidate: 86400`) so the 24 fetches only happen on the server during build/revalidation, never per-user-request.

**No infinite scroll** — Pagination was chosen over infinite scroll because infinite scroll loses URL shareability (the assessment explicitly requires shareable URLs), is harder to make accessible, and has worse CLS characteristics with dynamic content insertion.

**Search over client-side names only** — The 1,350-name fetch adds ~60 KB to first load. Given `staleTime: Infinity` and `force-cache`, this happens once per session and is acceptable. If the Pokédex grew to 10,000+ entries, a server-side search endpoint would be needed.
