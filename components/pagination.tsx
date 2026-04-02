"use client";

import { useFilter } from "@/hooks/use-filter";

type PaginationProps = {
  total: number;
  perPage: number;
};

export function Pagination({ total, perPage }: PaginationProps) {
  const { page, setPage } = useFilter();
  const totalPages = Math.ceil(total / perPage);

  if (totalPages <= 1)
    return null;

  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  // Show at most 5 page numbers centred around current page
  const getPageNumbers = (): number[] => {
    const delta = 2;
    const start = Math.max(1, page - delta);
    const end = Math.min(totalPages, page + delta);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-2 font-mono"
    >
      <button
        onClick={() => setPage(page - 1)}
        disabled={isFirst}
        aria-label="Previous page"
        className="rounded-lg border-2 border-green-300 bg-slate-900 px-3 py-1.5 text-sm font-bold text-green-300 transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        &lt;&lt;
      </button>

      {getPageNumbers().map(p => (
        <button
          key={p}
          onClick={() => setPage(p)}
          aria-label={`Page ${p}`}
          aria-current={p === page ? "page" : undefined}
          className={`rounded-lg border-2 px-3 py-1.5 text-sm font-bold transition-colors ${
            p === page
              ? "border-green-300 bg-green-300 text-slate-900"
              : "border-green-300 bg-slate-900 text-green-300 hover:bg-slate-800"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => setPage(page + 1)}
        disabled={isLast}
        aria-label="Next page"
        className="rounded-lg border-2 border-green-300 bg-slate-900 px-3 py-1.5 text-sm font-bold text-green-300 transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        &gt;&gt;
      </button>
    </nav>
  );
}
