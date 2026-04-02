"use client";

import { cn } from "@/lib/utils/cn";
import { getTypeColor } from "@/lib/utils/type-colors";
import { useFilter } from "@/providers/filter-context";

type TypeFilterProps = {
  types: string[];
};

export function TypeFilter({ types }: TypeFilterProps) {
  const { type: activeType, setType } = useFilter();

  const handleSelect = (selected: string) => {
    setType(activeType === selected ? "" : selected);
  };

  return (
    <div
      role="group"
      aria-label="Filter by type"
      className="flex flex-wrap gap-2"
    >
      {types.map((t) => {
        const isActive = activeType === t;
        const { bg, text } = getTypeColor(t);
        return (
          <button
            key={t}
            onClick={() => handleSelect(t)}
            aria-pressed={isActive}
            className={cn(
              "rounded-full border-2 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider transition-all",
              isActive
                ? cn(bg, text, "border-transparent")
                : "border-green-300/40 bg-transparent text-green-300/60 hover:border-green-300 hover:text-green-300",
            )}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}
