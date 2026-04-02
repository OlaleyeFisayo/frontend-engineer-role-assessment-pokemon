import { createContext } from "react";

export type FilterState = {
  search: string;
  type: string;
  page: number;
  setSearch: (value: string) => void;
  setType: (value: string) => void;
  setPage: (value: number) => void;
};

export const FilterContext = createContext<FilterState | null>(null);
