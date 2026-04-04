import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";

import { fetchPokemonDetail } from "@/api/request";
import { BackButton } from "@/components/back-button";
import { Breadcrumb } from "@/components/breadcrumb";
import { PokemonAbilities } from "@/components/pokemon-abilities";
import { PokemonStats } from "@/components/pokemon-stats";
import { TypeBadge } from "@/components/type-badge";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const raw = await fetchPokemonDetail({ id });
  const imageUrl
    = raw.sprites.other["official-artwork"].front_default
      ?? raw.sprites.front_default
      ?? "";
  const types = raw.types.map(t => t.type.name);

  return {
    title: raw.name.charAt(0).toUpperCase() + raw.name.slice(1),
    description: `${raw.name} — Type: ${types.join(", ")}. Height: ${raw.height / 10}m, Weight: ${raw.weight / 10}kg.`,
    openGraph: {
      images: imageUrl ? [{ url: imageUrl, width: 475, height: 475 }] : [],
    },
  };
}

export default async function PokemonDetailPage({ params }: PageProps) {
  const { id } = await params;
  const raw = await fetchPokemonDetail({ id });

  const paddedId = String(raw.id).padStart(3, "0");
  const imageSrc
    = raw.sprites.other["official-artwork"].front_default
      ?? raw.sprites.front_default
      ?? "/pokemon-fallback.svg";
  const displayName = raw.name.charAt(0).toUpperCase() + raw.name.slice(1);
  const types = raw.types.map(t => t.type.name);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-2xl">
        <BackButton />
        <Breadcrumb
          items={[
            { label: "POKÉDEX", href: "/pokemon" },
            { label: displayName.toUpperCase() },
          ]}
        />

        <div className="rounded-3xl border-4 border-slate-900 bg-red-700 p-6 shadow-2xl shadow-black/50">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-black uppercase tracking-widest text-white">
              {displayName}
            </h1>
            <span className="font-mono font-bold text-green-300">
              #
              {paddedId}
            </span>
          </div>

          {/* Type badges */}
          <div className="mb-4 flex gap-2">
            {types.map(type => (
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
              { label: "HEIGHT", value: `${raw.height / 10}m` },
              { label: "WEIGHT", value: `${raw.weight / 10}kg` },
              { label: "BASE EXP", value: raw.base_experience },
              { label: "TYPES", value: types.length },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="font-mono text-xs text-green-300/50">{label}</p>
                <p className="font-mono text-sm font-bold text-green-300">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Stats — streamed via Suspense */}
          <div className="mb-4 rounded-2xl bg-slate-900 p-4">
            <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-green-300/50">
              BASE STATS
            </h2>
            <Suspense
              fallback={(
                <div className="animate-pulse space-y-2">
                  {/* eslint-disable react/no-array-index-key */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-4 rounded bg-slate-800"
                    />
                  ))}
                </div>
              )}
            >
              <PokemonStats id={id} />
            </Suspense>
          </div>

          {/* Abilities — streamed via Suspense */}
          <div className="rounded-2xl bg-slate-900 p-4">
            <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-green-300/50">
              ABILITIES
            </h2>
            <Suspense
              fallback={(
                <div className="flex animate-pulse gap-2">
                  <div className="h-7 w-20 rounded-full bg-slate-800" />
                  <div className="h-7 w-24 rounded-full bg-slate-800" />
                </div>
              )}
            >
              <PokemonAbilities id={id} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
