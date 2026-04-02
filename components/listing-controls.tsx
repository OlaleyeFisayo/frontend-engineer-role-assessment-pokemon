"use client";

import dynamic from "next/dynamic";

import { TypeFilter } from "./type-filter";

// SearchBar uses useSearchParams internally — dynamic with ssr:false
// must live in a Client Component, not a Server Component
const SearchBar = dynamic(
  () => import("@/components/search-bar").then((m) => m.SearchBar),
  { ssr: false },
);

type ListingControlsProps = {
  types: string[];
};

export function ListingControls({ types }: ListingControlsProps) {
  return (
    <div className="space-y-3">
      <SearchBar />
      <TypeFilter types={types} />
    </div>
  );
}
