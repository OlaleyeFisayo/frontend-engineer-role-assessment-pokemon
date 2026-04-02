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

export type PokemonAbility = {
  name: string;
  is_hidden: boolean;
};

export type PokemonDetail = PokemonListItem & {
  height: number;
  weight: number;
  base_experience: number;
  abilities: PokemonAbility[];
};

export type PokemonListResponse = {
  items: PokemonListItem[];
  total: number;
};
