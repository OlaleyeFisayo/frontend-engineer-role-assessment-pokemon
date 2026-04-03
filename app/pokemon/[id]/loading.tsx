/* eslint-disable react/no-array-index-key */
export default function PokemonDetailLoading() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-2xl animate-pulse">
        {/* Breadcrumb */}
        <div className="mb-4 h-4 w-48 rounded bg-slate-800" />

        <div className="rounded-3xl border-4 border-slate-900 bg-red-800 p-6">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="h-7 w-40 rounded bg-slate-700" />
            <div className="h-5 w-12 rounded bg-slate-700" />
          </div>

          {/* Type badges */}
          <div className="mb-4 flex gap-2">
            <div className="h-6 w-16 rounded-full bg-slate-700" />
            <div className="h-6 w-16 rounded-full bg-slate-700" />
          </div>

          {/* Screen */}
          <div className="mb-4 aspect-square rounded-2xl border-4 border-slate-900 bg-slate-800" />

          {/* Lights */}
          <div className="mb-4 flex justify-center gap-3">
            <div className="h-3 w-3 rounded-full bg-slate-700" />
            <div className="h-3 w-3 rounded-full bg-slate-700" />
            <div className="h-3 w-3 rounded-full bg-slate-700" />
          </div>

          {/* Info grid */}
          <div className="mb-4 grid grid-cols-2 gap-3 rounded-2xl bg-slate-900 p-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="mb-1 h-3 w-12 rounded bg-slate-700" />
                <div className="h-4 w-16 rounded bg-slate-700" />
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mb-4 rounded-2xl bg-slate-900 p-4">
            <div className="mb-3 h-3 w-20 rounded bg-slate-700" />
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 rounded bg-slate-800"
                />
              ))}
            </div>
          </div>

          {/* Abilities */}
          <div className="rounded-2xl bg-slate-900 p-4">
            <div className="mb-3 h-3 w-20 rounded bg-slate-700" />
            <div className="flex gap-2">
              <div className="h-7 w-20 rounded-full bg-slate-800" />
              <div className="h-7 w-24 rounded-full bg-slate-800" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
