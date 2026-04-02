type EmptyStateProps = {
  query?: string;
  type?: string;
};

export function EmptyState({ query, type }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border-4 border-slate-900 bg-slate-900 py-24 text-center">
      <div className="mb-4 text-6xl">🔍</div>
      <h2 className="mb-2 font-mono text-xl font-black uppercase tracking-wider text-green-300">
        No Pokémon Found
      </h2>
      <p className="font-mono text-sm text-green-300/70">
        {query && type
          ? `No "${query}" found with type "${type}"`
          : query
            ? `No Pokémon matching "${query}"`
            : type
              ? `No Pokémon found with type "${type}"`
              : "No Pokémon found"}
      </p>
      <p className="mt-2 font-mono text-xs text-green-300/50">
        Try adjusting your search or filter
      </p>
    </div>
  );
}
