import { cn } from "@/lib/utils/cn";
import { getTypeColor } from "@/lib/utils/type-colors";

type TypeBadgeProps = {
  type: string;
  className?: string;
};

export function TypeBadge({ type, className }: TypeBadgeProps) {
  const { bg, text } = getTypeColor(type);
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wider",
        bg,
        text,
        className,
      )}
    >
      {type}
    </span>
  );
}
