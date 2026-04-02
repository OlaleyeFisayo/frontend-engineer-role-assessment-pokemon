import type { PokemonDetailPayload, PokemonListPayload } from "./types";

import { queryOptions } from "@tanstack/react-query";

import {
  fetchAllPokemonNames,
  fetchPokemonDetail,
  fetchPokemonList,
  fetchPokemonTypes,
} from "./request";

export const POKEMON_QUERY_KEY = {
  list: (page: number, limit: number, type?: string) =>
    ["pokemon", "list", page, limit, type] as const,
  detail: (id: string | number) => ["pokemon", "detail", id] as const,
  allNames: ["pokemon", "allNames"] as const,
  types: ["pokemon", "types"] as const,
};

export function pokemonListQueryOptions(payload: PokemonListPayload) {
  const { page, limit, typeFilter } = payload.params;
  return queryOptions({
    queryKey: POKEMON_QUERY_KEY.list(page, limit, typeFilter),
    queryFn: () => fetchPokemonList({ params: { page, limit, typeFilter } }),
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
