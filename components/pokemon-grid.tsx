"use client";

import type { PokemonListItem } from "@/types/pokemon";

import { EmptyState } from "@/components/empty-state";
import { PokemonCard } from "@/components/pokemon-card";
import { useFilter } from "@/hooks/use-filter";

type PokemonGridProps = {
  items: PokemonListItem[];
};

export function PokemonGrid({ items }: PokemonGridProps) {
  const { search, type } = useFilter();

  if (items.length === 0) {
    return (
      <EmptyState
        query={search || undefined}
        type={type || undefined}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((pokemon, index) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          priority={index < 4}
        />
      ))}
    </div>
  );
}
