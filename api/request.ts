import type { NamedAPIResource, PaginatedResponse } from "@/types/api";
import type { PokemonDetail, PokemonListItem, PokemonListResponse } from "@/types/pokemon";

import type {
  PokemonDetailPayload,
  PokemonListPayload,
  RawPokemon,
  RawTypeDetail,
} from "./types";

const POKEAPI_BASE = "https://pokeapi.co/api/v2";

function extractIdFromUrl(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
}

function normalizePokemon(raw: RawPokemon): PokemonListItem {
  return {
    id: raw.id,
    name: raw.name,
    sprite: raw.sprites.front_default,
    officialArtwork: raw.sprites.other["official-artwork"].front_default,
    types: raw.types.map((t) => t.type.name),
    stats: raw.stats.map((s) => ({
      name: s.stat.name,
      base_stat: s.base_stat,
    })),
  };
}

export async function fetchPokemonDetail(
  payload: PokemonDetailPayload,
): Promise<PokemonDetail> {
  const res = await fetch(`${POKEAPI_BASE}/pokemon/${payload.id}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Failed to fetch pokemon ${payload.id}`);
  const raw = (await res.json()) as RawPokemon;
  return {
    ...normalizePokemon(raw),
    height: raw.height,
    weight: raw.weight,
    base_experience: raw.base_experience,
    abilities: raw.abilities.map((a) => ({
      name: a.ability.name,
      is_hidden: a.is_hidden,
    })),
  };
}

export async function fetchPokemonList(
  payload: PokemonListPayload,
): Promise<PokemonListResponse> {
  const { page, limit, typeFilter } = payload.params;

  if (typeFilter) {
    const res = await fetch(`${POKEAPI_BASE}/type/${typeFilter}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error(`Failed to fetch type ${typeFilter}`);
    const typeData = (await res.json()) as RawTypeDetail;
    const allIds = typeData.pokemon.map((p) =>
      extractIdFromUrl(p.pokemon.url),
    );
    const total = allIds.length;
    const offset = (page - 1) * limit;
    const pageIds = allIds.slice(offset, offset + limit);

    const items = await Promise.all(
      pageIds.map((id) =>
        fetchPokemonDetail({ id }).then((d): PokemonListItem => ({
          id: d.id,
          name: d.name,
          sprite: d.sprite,
          officialArtwork: d.officialArtwork,
          types: d.types,
          stats: d.stats,
        })),
      ),
    );

    return { items, total };
  }

  const offset = (page - 1) * limit;
  const listRes = await fetch(
    `${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`,
    { next: { revalidate: 86400 } },
  );
  if (!listRes.ok) throw new Error("Failed to fetch pokemon list");
  const listData = (await listRes.json()) as PaginatedResponse<NamedAPIResource>;

  const items = await Promise.all(
    listData.results.map((p) => {
      const id = extractIdFromUrl(p.url);
      return fetchPokemonDetail({ id });
    }),
  );

  return { items, total: listData.count };
}

export async function fetchAllPokemonNames(): Promise<NamedAPIResource[]> {
  const res = await fetch(`${POKEAPI_BASE}/pokemon?limit=1350&offset=0`, {
    cache: "force-cache",
  });
  if (!res.ok) throw new Error("Failed to fetch all pokemon names");
  const data = (await res.json()) as PaginatedResponse<NamedAPIResource>;
  return data.results;
}

export async function fetchPokemonTypes(): Promise<string[]> {
  const res = await fetch(`${POKEAPI_BASE}/type`, {
    cache: "force-cache",
  });
  if (!res.ok) throw new Error("Failed to fetch pokemon types");
  const data = (await res.json()) as PaginatedResponse<NamedAPIResource>;
  return data.results
    .map((t) => t.name)
    .filter((name) => name !== "unknown" && name !== "stellar");
}
