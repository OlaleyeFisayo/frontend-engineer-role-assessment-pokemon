import { fetchPokemonDetail } from "@/api/request";

type PokemonAbilitiesProps = {
  id: string;
};

export async function PokemonAbilities({ id }: PokemonAbilitiesProps) {
  const raw = await fetchPokemonDetail({ id });
  if (raw.abilities.length === 0)
    return null;
  return (
    <div className="rounded-2xl bg-slate-900 p-4">
      <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-green-300/50">
        ABILITIES
      </h2>
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
    </div>
  );
}
