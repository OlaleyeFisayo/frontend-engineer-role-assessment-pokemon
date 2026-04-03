import type { Metadata } from "next";
import { Suspense } from "react";

import { GridErrorBoundary } from "@/components/grid-error-boundary";
import { GridSkeleton } from "@/components/grid-skeleton";
import { PokemonGridSection } from "@/components/pokemon-grid-section";
import { TypeFilterSection } from "@/components/type-filter-section";
import { FilterProvider } from "@/providers/filter-context";

export const metadata: Metadata = {
  title: "Pokédex",
  description: "Browse and search all Pokémon",
};

type PageProps = {
  searchParams: Promise<{ page?: string; type?: string; q?: string }>;
};

export default async function PokemonListingPage({ searchParams }: PageProps) {
  const { page: pageParam, type: typeParam, q } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? "1"));
  const typeFilter = typeParam || undefined;
  const searchQuery = q || undefined;

  return (
    <FilterProvider>
      <main className="min-h-screen bg-slate-950 px-4 py-8 md:px-8">
        {/* Header — always renders, never throws */}
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
          </div>

          {/* Controls — degrade gracefully if types fetch fails */}
          <div className="mb-6 rounded-2xl border-2 border-slate-800 bg-slate-900 p-4">
            <Suspense fallback={<div className="h-10 animate-pulse rounded-xl bg-slate-800" />}>
              <TypeFilterSection />
            </Suspense>
          </div>
        </div>

        {/* Grid — isolated Suspense + error boundary keeps header intact */}
        <div className="mx-auto max-w-7xl">
          <GridErrorBoundary>
            <Suspense fallback={<GridSkeleton />}>
              <PokemonGridSection
                page={page}
                typeFilter={typeFilter}
                searchQuery={searchQuery}
              />
            </Suspense>
          </GridErrorBoundary>
        </div>
      </main>
    </FilterProvider>
  );
}
