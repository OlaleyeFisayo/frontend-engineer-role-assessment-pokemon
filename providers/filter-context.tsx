"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

type FilterState = {
  search: string;
  type: string;
  page: number;
  setSearch: (value: string) => void;
  setType: (value: string) => void;
  setPage: (value: number) => void;
};

const FilterContext = createContext<FilterState | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("q") ?? "";
  const type = searchParams.get("type") ?? "";
  const page = Number(searchParams.get("page") ?? "1");

  const buildUrl = useCallback(
    (updates: Partial<{ q: string; type: string; page: number }>) => {
      const params = new URLSearchParams(searchParams.toString());
      if ("q" in updates) {
        if (updates.q) params.set("q", updates.q);
        else params.delete("q");
      }
      if ("type" in updates) {
        if (updates.type) params.set("type", updates.type);
        else params.delete("type");
      }
      if ("page" in updates) {
        if (updates.page && updates.page > 1)
          params.set("page", String(updates.page));
        else params.delete("page");
      }
      const qs = params.toString();
      return qs ? `/pokemon?${qs}` : "/pokemon";
    },
    [searchParams],
  );

  const setSearch = useCallback(
    (value: string) => {
      router.replace(buildUrl({ q: value, page: 1 }));
    },
    [router, buildUrl],
  );

  const setType = useCallback(
    (value: string) => {
      router.replace(buildUrl({ type: value, page: 1 }));
    },
    [router, buildUrl],
  );

  const setPage = useCallback(
    (value: number) => {
      router.replace(buildUrl({ page: value }));
    },
    [router, buildUrl],
  );

  const contextValue = useMemo(
    () => ({ search, type, page, setSearch, setType, setPage }),
    [search, type, page, setSearch, setType, setPage],
  );

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter(): FilterState {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
}
