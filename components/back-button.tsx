"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="mb-4 font-mono text-xs text-green-300/70 transition-colors hover:text-green-300"
    >
      &lt;&lt; BACK
    </button>
  );
}
