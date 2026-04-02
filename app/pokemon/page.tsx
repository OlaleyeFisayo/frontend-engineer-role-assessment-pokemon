import { Suspense } from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { fetchPokemonList, fetchPokemonTypes } from "@/api/request";
import { GridSkeleton } from "@/components/grid-skeleton";
import { Pagination } from "@/components/pagination";
import { PokemonGrid } from "@/components/pokemon-grid";
import { FilterProvider } from "@/providers/filter-context";

// Dynamic imports for client components that need useSearchParams
const SearchBar = dynamic(
  () => import("@/components/search-bar").then((m) => m.SearchBar),
  { ssr: false },
);
const TypeFilter = dynamic(
  () => import("@/components/type-filter").then((m) => m.TypeFilter),
  { ssr: false },
);

export const metadata: Metadata = {
  title: "Pokédex",
  description: "Browse and search all 1,350 Pokémon",
};

const ITEMS_PER_PAGE = 24;

type PageProps = {
  searchParams: Promise<{ page?: string; type?: string }>;
};

export default async function PokemonListingPage({ searchParams }: PageProps) {
  const { page: pageParam, type: typeParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? "1"));
  const typeFilter = typeParam ?? "";

  const [{ items, total }, types] = await Promise.all([
    fetchPokemonList({
      params: { page, limit: ITEMS_PER_PAGE, typeFilter: typeFilter || undefined },
    }),
    fetchPokemonTypes(),
  ]);

  return (
    <FilterProvider>
      <main className="min-h-screen bg-slate-950 px-4 py-8 md:px-8">
        {/* Header */}
        <div className="mx-auto mb-8 max-w-7xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="h-4 w-4 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
              <div className="h-4 w-4 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50" />
              <div className="h-4 w-4 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
            </div>
            <h1 className="font-mono text-2xl font-black uppercase tracking-widest text-red-500 md:text-3xl">
              POKÉDEX
            </h1>
            <div className="ml-auto font-mono text-xs text-green-300/50">
              {total} ENTRIES
            </div>
          </div>

          {/* Search + Filter controls */}
          <div className="mb-6 space-y-3 rounded-2xl border-2 border-slate-800 bg-slate-900 p-4">
            <SearchBar />
            <TypeFilter types={types} />
          </div>
        </div>

        {/* Grid */}
        <div className="mx-auto max-w-7xl">
          <Suspense fallback={<GridSkeleton />}>
            <PokemonGrid items={items} />
          </Suspense>

          <Pagination
            total={total}
            perPage={ITEMS_PER_PAGE}
          />
        </div>
      </main>
    </FilterProvider>
  );
}
