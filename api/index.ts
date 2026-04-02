import { queryOptions } from "@tanstack/react-query";

import {
  fetchAllPokemonNames,
  fetchPokemonDetail,
  fetchPokemonList,
  fetchPokemonTypes,
} from "./request";
import type { PokemonDetailPayload, PokemonListPayload } from "./types";

export const POKEMON_QUERY_KEY = {
  list: (page: number, type?: string) =>
    ["pokemon", "list", page, type] as const,
  detail: (id: string | number) => ["pokemon", "detail", id] as const,
  allNames: ["pokemon", "allNames"] as const,
  types: ["pokemon", "types"] as const,
};

export function pokemonListQueryOptions(payload: PokemonListPayload) {
  return queryOptions({
    queryKey: POKEMON_QUERY_KEY.list(
      payload.params.page,
      payload.params.typeFilter,
    ),
    queryFn: () => fetchPokemonList(payload),
  });
}

export function pokemonDetailQueryOptions(payload: PokemonDetailPayload) {
  return queryOptions({
    queryKey: POKEMON_QUERY_KEY.detail(payload.id),
    queryFn: () => fetchPokemonDetail(payload),
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
