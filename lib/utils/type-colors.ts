export type TypeColorConfig = {
  bg: string;
  text: string;
};

export const TYPE_COLORS: Record<string, TypeColorConfig> = {
  normal: { bg: "bg-gray-500", text: "text-white" },
  fire: { bg: "bg-orange-600", text: "text-white" },
  water: { bg: "bg-blue-600", text: "text-white" },
  grass: { bg: "bg-green-600", text: "text-white" },
  electric: { bg: "bg-yellow-500", text: "text-slate-900" },
  ice: { bg: "bg-cyan-400", text: "text-slate-900" },
  fighting: { bg: "bg-red-900", text: "text-white" },
  poison: { bg: "bg-purple-700", text: "text-white" },
  ground: { bg: "bg-amber-700", text: "text-white" },
  flying: { bg: "bg-indigo-400", text: "text-white" },
  psychic: { bg: "bg-pink-600", text: "text-white" },
  bug: { bg: "bg-lime-600", text: "text-white" },
  rock: { bg: "bg-slate-600", text: "text-white" },
  ghost: { bg: "bg-purple-900", text: "text-white" },
  dragon: { bg: "bg-indigo-700", text: "text-white" },
  dark: { bg: "bg-slate-800", text: "text-white" },
  steel: { bg: "bg-slate-400", text: "text-slate-900" },
  fairy: { bg: "bg-pink-400", text: "text-slate-900" },
};

export function getTypeColor(typeName: string): TypeColorConfig {
  return TYPE_COLORS[typeName] ?? { bg: "bg-gray-500", text: "text-white" };
}
