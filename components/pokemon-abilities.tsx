import { fetchPokemonDetail } from "@/api/request";

type PokemonAbilitiesProps = {
  id: string;
};

export async function PokemonAbilities({ id }: PokemonAbilitiesProps) {
  const raw = await fetchPokemonDetail({ id });
  return (
    <div className="flex flex-wrap gap-2">
      {raw.abilities.map(a => (
        <span
          key={a.ability.name}
          className={`rounded-full border px-3 py-1 font-mono text-xs capitalize ${
            a.is_hidden
              ? "border-green-300/30 text-green-300/50"
              : "border-green-300 text-green-300"
          }`}
        >
          {a.ability.name}
          {a.is_hidden && (
            <span className="ml-1 text-green-300/40">(hidden)</span>
          )}
        </span>
      ))}
    </div>
  );
}
