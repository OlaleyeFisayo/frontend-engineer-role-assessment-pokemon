export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-3xl border-4 border-slate-900 bg-red-800 p-4">
      {/* Bezel: name + type badges */}
      <div className="mb-3 rounded-2xl bg-slate-800 p-3">
        <div className="mb-2 flex gap-2">
          <div className="h-5 w-14 rounded-full bg-slate-700" />
          <div className="h-5 w-14 rounded-full bg-slate-700" />
        </div>
        <div className="h-5 w-3/4 rounded bg-slate-700" />
      </div>

      {/* Screen area */}
      <div className="mb-3 aspect-square rounded-2xl border-4 border-slate-900 bg-slate-800" />

      {/* Indicator lights */}
      <div className="mb-3 flex justify-center gap-3">
        <div className="h-3 w-3 rounded-full bg-slate-700" />
        <div className="h-3 w-3 rounded-full bg-slate-700" />
        <div className="h-3 w-3 rounded-full bg-slate-700" />
      </div>

      {/* Stats panel */}
      <div className="mb-3 rounded-xl bg-slate-800 p-3">
        <div className="mb-2 h-3 w-full rounded bg-slate-700" />
        <div className="h-3 w-full rounded bg-slate-700" />
      </div>

      {/* Button */}
      <div className="h-8 w-full rounded-lg bg-slate-800" />
    </div>
  );
}
