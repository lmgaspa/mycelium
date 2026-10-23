"use client";

import { useCopy } from "./useCopy";

export function useProductName(slug: string, fallback = slug): string {
  const names = useCopy("ProductNames");
  return names[slug as keyof typeof names] ?? fallback;
}
