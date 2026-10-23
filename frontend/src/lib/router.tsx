"use client";

import NextLink from "next/link";
import { useParams as useNextParams, usePathname, useRouter, useSearchParams as useNextSearchParams } from "next/navigation";
import type { ComponentProps } from "react";

export function Link({ to, ...props }: Omit<ComponentProps<typeof NextLink>, "href"> & { to: string }) {
  return <NextLink href={to} {...props} />;
}

export function useNavigate() {
  const router = useRouter();
  return (to: string, _options?: { state?: unknown }) => router.push(to);
}

export function useParams<T extends Record<string, string | undefined>>() {
  return useNextParams() as T;
}

export function useSearchParams() {
  return [useNextSearchParams()] as const;
}

export function useLocation() {
  const pathname = usePathname();
  const searchParams = useNextSearchParams();
  const query = searchParams.toString();
  return { pathname, search: query ? `?${query}` : "" };
}
