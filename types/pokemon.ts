// Flattened shape used on the listing grid — projected from RawPokemon
export type PokemonStat = {
  name: string;
  base_stat: number;
};

export type PokemonListItem = {
  id: number;
  name: string;
  sprite: string | null;
  officialArtwork: string | null;
  types: string[];
  stats: PokemonStat[];
};

export type PokemonListResponse = {
  items: PokemonListItem[];
  total: number;
};
