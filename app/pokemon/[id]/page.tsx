import { Suspense } from "react";
import Image from "next/image";
import type { Metadata } from "next";

import { fetchPokemonDetail } from "@/api/request";
import { Breadcrumb } from "@/components/breadcrumb";
import { StatBar } from "@/components/stat-bar";
import { TypeBadge } from "@/components/type-badge";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return Array.from({ length: 151 }, (_, i) => ({ id: String(i + 1) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const pokemon = await fetchPokemonDetail({ id });
  const imageUrl = pokemon.officialArtwork ?? pokemon.sprite ?? "";

  return {
    title: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
    description: `${pokemon.name} — Type: ${pokemon.types.join(", ")}. Height: ${pokemon.height / 10}m, Weight: ${pokemon.weight / 10}kg.`,
    openGraph: {
      images: imageUrl ? [{ url: imageUrl, width: 475, height: 475 }] : [],
    },
  };
}

async function PokemonStats({ id }: { id: string }) {
  const pokemon = await fetchPokemonDetail({ id });
  return (
    <div className="space-y-1.5">
      {pokemon.stats.map((stat) => (
        <StatBar
          key={stat.name}
          name={stat.name}
          value={stat.base_stat}
        />
      ))}
    </div>
  );
}

async function PokemonAbilities({ id }: { id: string }) {
  const pokemon = await fetchPokemonDetail({ id });
  return (
    <div className="flex flex-wrap gap-2">
      {pokemon.abilities.map((ability) => (
        <span
          key={ability.name}
          className={`rounded-full border px-3 py-1 font-mono text-xs capitalize ${
            ability.is_hidden
              ? "border-green-300/30 text-green-300/50"
              : "border-green-300 text-green-300"
          }`}
        >
          {ability.name}
          {ability.is_hidden && (
            <span className="ml-1 text-green-300/40">(hidden)</span>
          )}
        </span>
      ))}
    </div>
  );
}

export default async function PokemonDetailPage({ params }: PageProps) {
  const { id } = await params;
  const pokemon = await fetchPokemonDetail({ id });

  const paddedId = String(pokemon.id).padStart(3, "0");
  const imageSrc = pokemon.officialArtwork ?? pokemon.sprite ?? "/pokemon-fallback.svg";
  const displayName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-2xl">
        <Breadcrumb
          items={[
            { label: "POKÉDEX", href: "/pokemon" },
            { label: displayName.toUpperCase() },
          ]}
        />

        <div className="rounded-3xl border-4 border-slate-900 bg-red-700 p-6 shadow-2xl shadow-black/50">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h1 className="font-black uppercase tracking-widest text-white text-2xl">
              {displayName}
            </h1>
            <span className="font-mono font-bold text-green-300">
              #{paddedId}
            </span>
          </div>

          {/* Type badges */}
          <div className="mb-4 flex gap-2">
            {pokemon.types.map((type) => (
              <TypeBadge
                key={type}
                type={type}
              />
            ))}
          </div>

          {/* Main screen: official artwork */}
          <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl border-4 border-slate-900 bg-green-900">
            <Image
              src={imageSrc}
              alt={displayName}
              fill
              sizes="(max-width: 768px) 90vw, 672px"
              className="object-contain p-6"
              priority
              unoptimized={imageSrc === "/pokemon-fallback.svg"}
            />
            <div
              aria-hidden="true"
              className="scanlines pointer-events-none absolute inset-0"
            />
          </div>

          {/* Indicator lights */}
          <div
            aria-hidden="true"
            className="mb-4 flex justify-center gap-3"
          >
            <div className="h-3 w-3 rounded-full bg-green-500 shadow-lg shadow-green-500/70" />
            <div className="h-3 w-3 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/70" />
            <div className="h-3 w-3 rounded-full bg-red-600 shadow-lg shadow-red-600/70" />
          </div>

          {/* Info grid */}
          <div className="mb-4 grid grid-cols-2 gap-3 rounded-2xl bg-slate-900 p-4 sm:grid-cols-4">
            {[
              { label: "HEIGHT", value: `${pokemon.height / 10}m` },
              { label: "WEIGHT", value: `${pokemon.weight / 10}kg` },
              { label: "BASE EXP", value: pokemon.base_experience },
              { label: "TYPES", value: pokemon.types.length },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="font-mono text-xs text-green-300/50">{label}</p>
                <p className="font-mono text-sm font-bold text-green-300">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Stats — streamed via Suspense (B-2) */}
          <div className="mb-4 rounded-2xl bg-slate-900 p-4">
            <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-green-300/50">
              BASE STATS
            </h2>
            <Suspense
              fallback={
                <div className="space-y-2 animate-pulse">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-4 rounded bg-slate-800"
                    />
                  ))}
                </div>
              }
            >
              <PokemonStats id={id} />
            </Suspense>
          </div>

          {/* Abilities — streamed via Suspense (B-2) */}
          <div className="rounded-2xl bg-slate-900 p-4">
            <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-green-300/50">
              ABILITIES
            </h2>
            <Suspense
              fallback={
                <div className="flex gap-2 animate-pulse">
                  <div className="h-7 w-20 rounded-full bg-slate-800" />
                  <div className="h-7 w-24 rounded-full bg-slate-800" />
                </div>
              }
            >
              <PokemonAbilities id={id} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
