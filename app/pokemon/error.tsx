"use client";

import Link from "next/link";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PokemonListingError({ error, reset }: ErrorProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-3xl border-4 border-slate-900 bg-red-700 p-8 text-center">
        {/* Screen area */}
        <div className="mb-6 rounded-2xl border-4 border-slate-900 bg-green-900 p-6">
          <div className="mb-2 font-mono text-4xl text-green-300">!</div>
          <p className="font-mono text-sm text-green-300">
            SYSTEM ERROR DETECTED
          </p>
          {error.digest && (
            <p className="mt-1 font-mono text-xs text-green-300/50">
              Code: {error.digest}
            </p>
          )}
        </div>

        <h1 className="mb-2 font-black uppercase tracking-wider text-white">
          Failed to load Pokémon
        </h1>
        <p className="mb-6 font-mono text-sm text-white/70">
          Could not connect to the Pokédex database. Check your connection and
          try again.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full rounded-lg border-2 border-green-300 bg-slate-900 py-2 font-mono text-sm font-bold text-green-300 transition-colors hover:bg-slate-800"
          >
            RETRY &gt;&gt;
          </button>
          <Link
            href="/pokemon"
            className="w-full rounded-lg border-2 border-white/30 bg-slate-900/50 py-2 text-center font-mono text-sm font-bold text-white/70 transition-colors hover:bg-slate-900"
          >
            BACK TO POKÉDEX
          </Link>
        </div>
      </div>
    </main>
  );
}
