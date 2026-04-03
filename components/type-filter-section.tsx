import { fetchPokemonTypes } from "@/api/request";
import { ListingControls } from "@/components/listing-controls";

export async function TypeFilterSection() {
  const types = await fetchPokemonTypes().catch(() => []);
  return <ListingControls types={types} />;
}
