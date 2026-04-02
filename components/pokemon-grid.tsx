"use client";

import type { PokemonListItem } from "@/types/pokemon";
import { useQuery } from "@tanstack/react-query";

import { useMemo } from "react";
import { allPokemonNamesQueryOptions } from "@/api";
import { EmptyState } from "@/components/empty-state";
import { PokemonCard } from "@/components/pokemon-card";
import { useFilter } from "@/hooks/use-filter";

type PokemonGridProps = {
  items: PokemonListItem[];
};

export function PokemonGrid({ items }: PokemonGridProps) {
  const { search, type } = useFilter();

  // Load all names once for client-side search
  const { data: allNames } = useQuery(allPokemonNamesQueryOptions());

  const filteredItems = useMemo(() => {
    if (!search)
      return items;

    // Filter server-fetched page items by search query
    const query = search.toLowerCase();

    // If we have the full name list, also check if any match exists at all
    if (allNames) {
      const matchingNames = new Set(
        allNames
          .filter(n => n.name.includes(query))
          .map(n => n.name),
      );
      return items.filter(p => matchingNames.has(p.name));
    }

    return items.filter(p => p.name.includes(query));
  }, [items, search, allNames]);

  if (filteredItems.length === 0) {
    return (
      <EmptyState
        query={search || undefined}
        type={type || undefined}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredItems.map((pokemon, index) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          priority={index < 4}
        />
      ))}
    </div>
  );
}
