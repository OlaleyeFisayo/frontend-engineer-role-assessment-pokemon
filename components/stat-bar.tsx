import { cn } from "@/lib/utils/cn";

type StatBarProps = {
  name: string;
  value: number;
  maxValue?: number;
  className?: string;
};

const STAT_ABBREVIATIONS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SpA",
  "special-defense": "SpD",
  speed: "SPD",
};

export function StatBar({
  name,
  value,
  maxValue = 255,
  className,
}: StatBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const label = STAT_ABBREVIATIONS[name] ?? name.toUpperCase().slice(0, 3);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="w-8 shrink-0 font-mono text-xs text-green-300">
        {label}
      </span>
      <div className="h-2 flex-1 rounded-full bg-slate-700">
        <div
          className="h-full rounded-full bg-green-400 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-7 text-right font-mono text-xs text-green-300">
        {value}
      </span>
    </div>
  );
}
