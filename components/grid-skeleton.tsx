import { CardSkeleton } from "./card-skeleton";

export function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 24 }).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
