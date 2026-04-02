export type PokemonListPayload = {
  params: {
    page: number;
    limit: number;
    typeFilter?: string;
  };
};

export type PokemonDetailPayload = {
  id: string | number;
};
