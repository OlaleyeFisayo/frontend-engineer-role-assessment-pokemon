import type { NamedAPIResource, PaginatedResponse } from "@/types/api";
import type { PokemonListItem, PokemonListResponse } from "@/types/pokemon";

import type {
  PokemonDetailPayload,
  PokemonListPayload,
  RawPokemon,
  RawTypeDetail,
} from "./types";

const POKEAPI_BASE = "https://pokeapi.co/api/v2";

function extractIdFromUrl(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return Number(parts.at(-1));
}

// Projects the raw API shape into the flat PokemonListItem used by the grid
function toListItem(raw: RawPokemon): PokemonListItem {
  return {
    id: raw.id,
    name: raw.name,
    sprite: raw.sprites.front_default,
    officialArtwork: raw.sprites.other["official-artwork"].front_default,
    types: raw.types.map(t => t.type.name),
    stats: raw.stats.map(s => ({ name: s.stat.name, base_stat: s.base_stat })),
  };
}

// Returns the full raw PokéAPI shape — consumers access nested fields directly
export async function fetchPokemonDetail(
  payload: PokemonDetailPayload,
): Promise<RawPokemon> {
  const res = await fetch(`${POKEAPI_BASE}/pokemon/${payload.id}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok)
    throw new Error(`Failed to fetch pokemon ${payload.id}`);
  return (await res.json()) as RawPokemon;
}

export async function fetchPokemonList(
  payload: PokemonListPayload,
): Promise<PokemonListResponse> {
  const { page, limit, typeFilter, searchQuery } = payload.params;

  // Search mode: filter all 1,350 names, paginate matches, batch-fetch details
  if (searchQuery) {
    const allRes = await fetch(`${POKEAPI_BASE}/pokemon?limit=1350&offset=0`, {
      cache: "force-cache",
    });
    if (!allRes.ok)
      throw new Error("Failed to fetch all pokemon names for search");
    const allData = (await allRes.json()) as PaginatedResponse<NamedAPIResource>;
    const query = searchQuery.toLowerCase();
    const matched = allData.results.filter(p => p.name.includes(query));
    const pageMatches = matched.slice((page - 1) * limit, page * limit);

    const items = await Promise.all(
      pageMatches.map(async (p) => {
        const id = extractIdFromUrl(p.url);
        const r = await fetch(`${POKEAPI_BASE}/pokemon/${id}`, {
          next: { revalidate: 86400 },
        });
        if (!r.ok)
          throw new Error(`Failed to fetch pokemon ${id}`);
        return toListItem((await r.json()) as RawPokemon);
      }),
    );

    return { items, total: matched.length };
  }

  if (typeFilter) {
    const res = await fetch(`${POKEAPI_BASE}/type/${typeFilter}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok)
      throw new Error(`Failed to fetch type ${typeFilter}`);

    const typeData = (await res.json()) as RawTypeDetail;
    const allIds = typeData.pokemon.map(p => extractIdFromUrl(p.pokemon.url));
    const pageIds = allIds.slice((page - 1) * limit, page * limit);

    const items = await Promise.all(
      pageIds.map(async (id) => {
        const r = await fetch(`${POKEAPI_BASE}/pokemon/${id}`, {
          next: { revalidate: 86400 },
        });
        if (!r.ok)
          throw new Error(`Failed to fetch pokemon ${id}`);
        return toListItem((await r.json()) as RawPokemon);
      }),
    );

    return { items, total: allIds.length };
  }

  const offset = (page - 1) * limit;
  const listRes = await fetch(
    `${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`,
    { next: { revalidate: 86400 } },
  );
  if (!listRes.ok)
    throw new Error("Failed to fetch pokemon list");

  const listData = (await listRes.json()) as PaginatedResponse<NamedAPIResource>;

  const items = await Promise.all(
    listData.results.map(async (p) => {
      const id = extractIdFromUrl(p.url);
      const r = await fetch(`${POKEAPI_BASE}/pokemon/${id}`, {
        next: { revalidate: 86400 },
      });
      if (!r.ok)
        throw new Error(`Failed to fetch pokemon ${id}`);
      return toListItem((await r.json()) as RawPokemon);
    }),
  );

  return { items, total: listData.count };
}

export async function fetchAllPokemonNames(): Promise<NamedAPIResource[]> {
  const res = await fetch(`${POKEAPI_BASE}/pokemon?limit=1350&offset=0`, {
    cache: "force-cache",
  });
  if (!res.ok)
    throw new Error("Failed to fetch all pokemon names");
  const data = (await res.json()) as PaginatedResponse<NamedAPIResource>;
  return data.results;
}

export async function fetchPokemonTypes(): Promise<string[]> {
  const res = await fetch(`${POKEAPI_BASE}/type`, { cache: "force-cache" });
  if (!res.ok)
    throw new Error("Failed to fetch pokemon types");
  const data = (await res.json()) as PaginatedResponse<NamedAPIResource>;
  return data.results
    .map(t => t.name)
    .filter(name => name !== "unknown" && name !== "stellar");
}
