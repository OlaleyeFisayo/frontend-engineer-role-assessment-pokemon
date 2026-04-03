import { fetchPokemonList } from "@/api/request";
import { Pagination } from "@/components/pagination";
import { PokemonGrid } from "@/components/pokemon-grid";

const ITEMS_PER_PAGE = 24;

type PokemonGridSectionProps = {
  page: number;
  typeFilter?: string;
  searchQuery?: string;
};

export async function PokemonGridSection({ page, typeFilter, searchQuery }: PokemonGridSectionProps) {
  const { items, total } = await fetchPokemonList({
    params: { page, limit: ITEMS_PER_PAGE, typeFilter, searchQuery },
  });

  return (
    <>
      <PokemonGrid items={items} />
      <Pagination
        total={total}
        perPage={ITEMS_PER_PAGE}
      />
    </>
  );
}
