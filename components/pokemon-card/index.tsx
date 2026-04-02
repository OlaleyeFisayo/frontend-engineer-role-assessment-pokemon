import Image from "next/image";
import Link from "next/link";

import { StatBar } from "@/components/stat-bar";
import { TypeBadge } from "@/components/type-badge";
import type { PokemonListItem } from "@/types/pokemon";

type PokemonCardProps = {
  pokemon: PokemonListItem;
  priority?: boolean;
};

export function PokemonCard({ pokemon, priority = false }: PokemonCardProps) {
  const { id, name, officialArtwork, sprite, types, stats } = pokemon;
  const imageSrc
    = officialArtwork
      ?? sprite
      ?? "/pokemon-fallback.svg";

  const paddedId = String(id).padStart(3, "0");
  const hp = stats.find((s) => s.name === "hp");
  const speed = stats.find((s) => s.name === "speed");

  return (
    <Link
      href={`/pokemon/${id}`}
      aria-label={`View details for ${name}`}
      className="block rounded-3xl border-4 border-slate-900 bg-red-700 p-4 shadow-2xl shadow-black/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-red-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
    >
      {/* Bezel: type badges + Pokédex number + name */}
      <div className="mb-3 rounded-2xl bg-slate-900 p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {types.map((type) => (
              <TypeBadge
                key={type}
                type={type}
              />
            ))}
          </div>
          <span className="font-mono text-xs font-bold text-green-300">
            #{paddedId}
          </span>
        </div>
        <h2 className="font-black uppercase tracking-wider text-white">
          {name}
        </h2>
      </div>

      {/* Screen: official artwork with scan-line overlay */}
      <div className="relative mb-3 aspect-square overflow-hidden rounded-2xl border-4 border-slate-900 bg-green-900">
        <Image
          src={imageSrc}
          alt={name}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, (max-width: 1280px) 30vw, 25vw"
          className="object-contain p-2"
          priority={priority}
          unoptimized={imageSrc === "/pokemon-fallback.svg"}
        />
        {/* Scan-line overlay */}
        <div
          aria-hidden="true"
          className="scanlines pointer-events-none absolute inset-0"
        />
      </div>

      {/* Indicator lights */}
      <div
        aria-hidden="true"
        className="mb-3 flex justify-center gap-3"
      >
        <div className="h-3 w-3 rounded-full bg-green-500 shadow-lg shadow-green-500/70" />
        <div className="h-3 w-3 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/70" />
        <div className="h-3 w-3 rounded-full bg-red-600 shadow-lg shadow-red-600/70" />
      </div>

      {/* Stats panel */}
      <div className="mb-3 rounded-xl bg-slate-900 p-3">
        {hp && (
          <StatBar
            name={hp.name}
            value={hp.base_stat}
            className="mb-1"
          />
        )}
        {speed && (
          <StatBar
            name={speed.name}
            value={speed.base_stat}
          />
        )}
      </div>

      {/* SCAN button */}
      <div className="w-full rounded-lg border-2 border-green-300 bg-slate-900 py-1.5 text-center font-mono text-sm font-bold text-green-300">
        SCAN &gt;&gt;
      </div>
    </Link>
  );
}
