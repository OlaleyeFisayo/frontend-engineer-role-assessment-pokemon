import type { NamedAPIResource } from "@/types/api";

// ─── Payload types ────────────────────────────────────────────────────────────

export type PokemonListPayload = {
  params: {
    page: number;
    limit: number;
    typeFilter?: string;
    searchQuery?: string;
  };
};

export type PokemonDetailPayload = {
  id: string | number;
};

// ─── Raw PokéAPI response shapes (internal to the API layer) ─────────────────

export type RawPokemonSprites = {
  front_default: string | null;
  other: {
    "official-artwork": {
      front_default: string | null;
    };
  };
};

export type RawStat = {
  base_stat: number;
  stat: NamedAPIResource;
};

export type RawType = {
  type: NamedAPIResource;
};

export type RawAbility = {
  ability: NamedAPIResource;
  is_hidden: boolean;
};

export type RawPokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: RawPokemonSprites;
  types: RawType[];
  stats: RawStat[];
  abilities: RawAbility[];
};

export type RawTypeDetail = {
  pokemon: { pokemon: NamedAPIResource }[];
};
