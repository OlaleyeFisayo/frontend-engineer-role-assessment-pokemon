"use client";

import type { FilterState } from "@/providers/filter-context-value";

import { use } from "react";
import { FilterContext } from "@/providers/filter-context-value";

export function useFilter(): FilterState {
  const context = use(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
}
