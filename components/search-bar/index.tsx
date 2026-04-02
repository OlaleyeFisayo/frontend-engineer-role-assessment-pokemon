"use client";

import { useEffect, useState } from "react";

import { useDebounce } from "@/hooks/use-debounce";
import { useFilter } from "@/providers/filter-context";

export function SearchBar() {
  const { search, setSearch } = useFilter();
  const [inputValue, setInputValue] = useState(search);
  const debouncedValue = useDebounce(inputValue, 300);

  // Sync debounced value to URL
  useEffect(() => {
    if (debouncedValue !== search) {
      setSearch(debouncedValue);
    }
  }, [debouncedValue, search, setSearch]);

  // Sync external URL changes back to input (e.g. browser back/forward)
  useEffect(() => {
    setInputValue(search);
  }, [search]);

  return (
    <div className="relative">
      <label
        htmlFor="pokemon-search"
        className="sr-only"
      >
        Search Pokémon
      </label>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-green-300"
      >
        &gt;_
      </span>
      <input
        id="pokemon-search"
        type="search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="SEARCH POKÉMON..."
        aria-label="Search Pokémon"
        className="w-full rounded-xl border-2 border-green-300 bg-slate-900 py-2.5 pl-10 pr-4 font-mono text-sm text-green-300 placeholder-green-300/40 outline-none transition-colors focus:border-green-400 focus:ring-1 focus:ring-green-400"
      />
    </div>
  );
}
