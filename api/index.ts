import type { PokemonDetailPayload, PokemonListPayload } from "./types";

import { queryOptions } from "@tanstack/react-query";

import {
  fetchAllPokemonNames,
  fetchPokemonDetail,
  fetchPokemonList,
  fetchPokemonTypes,
} from "./request";

export const POKEMON_QUERY_KEY = {
  list: (page: number, limit: number, type?: string, search?: string) =>
    ["pokemon", "list", page, limit, type, search] as const,
  detail: (id: string | number) => ["pokemon", "detail", id] as const,
  allNames: ["pokemon", "allNames"] as const,
  types: ["pokemon", "types"] as const,
};

export function pokemonListQueryOptions(payload: PokemonListPayload) {
  const { page, limit, typeFilter, searchQuery } = payload.params;
  return queryOptions({
    queryKey: POKEMON_QUERY_KEY.list(page, limit, typeFilter, searchQuery),
    queryFn: () => fetchPokemonList({ params: { page, limit, typeFilter, searchQuery } }),
  });
}

export function pokemonDetailQueryOptions(payload: PokemonDetailPayload) {
  return queryOptions({
    queryKey: POKEMON_QUERY_KEY.detail(payload.id),
    queryFn: () => fetchPokemonDetail({ id: payload.id }),
  });
}

export function allPokemonNamesQueryOptions() {
  return queryOptions({
    queryKey: POKEMON_QUERY_KEY.allNames,
    queryFn: () => fetchAllPokemonNames(),
    staleTime: Infinity,
  });
}

export function pokemonTypesQueryOptions() {
  return queryOptions({
    queryKey: POKEMON_QUERY_KEY.types,
    queryFn: () => fetchPokemonTypes(),
    staleTime: Infinity,
  });
}
