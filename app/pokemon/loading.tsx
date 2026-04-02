import { GridSkeleton } from "@/components/grid-skeleton";

export default function PokemonListingLoading() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="h-4 w-4 rounded-full bg-slate-800" />
              <div className="h-4 w-4 rounded-full bg-slate-800" />
              <div className="h-4 w-4 rounded-full bg-slate-800" />
            </div>
            <div className="h-8 w-32 rounded bg-slate-800" />
          </div>
          <div className="rounded-2xl border-2 border-slate-800 bg-slate-900 p-4">
            <div className="mb-3 h-10 rounded-xl bg-slate-800" />
            <div className="flex gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-7 w-16 rounded-full bg-slate-800"
                />
              ))}
            </div>
          </div>
        </div>
        <GridSkeleton />
      </div>
    </main>
  );
}
