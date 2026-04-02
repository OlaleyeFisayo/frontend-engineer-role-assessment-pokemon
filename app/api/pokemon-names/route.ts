import { fetchAllPokemonNames } from "@/api/request";

export const revalidate = 86400;

export async function GET() {
  const names = await fetchAllPokemonNames();
  return Response.json(names);
}
