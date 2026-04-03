import { fetchPokemonDetail } from "@/api/request";
import { StatBar } from "@/components/stat-bar";

type PokemonStatsProps = {
  id: string;
};

export async function PokemonStats({ id }: PokemonStatsProps) {
  const raw = await fetchPokemonDetail({ id });
  return (
    <div className="space-y-1.5">
      {raw.stats.map(s => (
        <StatBar
          key={s.stat.name}
          name={s.stat.name}
          value={s.base_stat}
        />
      ))}
    </div>
  );
}
