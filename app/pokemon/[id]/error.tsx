"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PokemonDetailError({ reset }: ErrorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRetry() {
    startTransition(() => {
      reset();
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-3xl border-4 border-slate-900 bg-red-700 p-8 text-center">
        <div className="mb-6 rounded-2xl border-4 border-slate-900 bg-green-900 p-6">
          <div className="mb-2 font-mono text-4xl text-green-300">404</div>
          <p className="font-mono text-sm text-green-300">
            POKÉMON NOT FOUND IN DATABASE
          </p>
        </div>

        <h1 className="mb-2 font-black uppercase tracking-wider text-white">
          Data Unavailable
        </h1>
        <p className="mb-6 font-mono text-sm text-white/70">
          This Pokémon could not be found. It may not exist or the connection
          failed.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleRetry}
            disabled={isPending}
            className="w-full rounded-lg border-2 border-green-300 bg-slate-900 py-2 font-mono text-sm font-bold text-green-300 transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "RETRYING..." : "RETRY >>"}
          </button>
          <button
            onClick={() => router.back()}
            className="w-full rounded-lg border-2 border-white/30 bg-slate-900/50 py-2 font-mono text-sm font-bold text-white/70 transition-colors hover:bg-slate-900"
          >
            &lt;&lt; GO BACK
          </button>
        </div>
      </div>
    </main>
  );
}
