import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 font-mono text-xs text-green-300/70"
    >
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => (
          <li
            key={item.label}
            className="flex items-center gap-1"
          >
            {index > 0 && <span aria-hidden="true">&gt;</span>}
            {item.href
              ? (
                  <Link
                    href={item.href}
                    className="hover:text-green-300 transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              : (
                  <span
                    aria-current="page"
                    className="text-green-300"
                  >
                    {item.label}
                  </span>
                )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
