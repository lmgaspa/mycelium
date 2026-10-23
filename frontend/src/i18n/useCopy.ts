"use client";

import { useMessages } from "next-intl";
import type pt from "../../messages/pt.json";

type Messages = typeof pt;

export function useCopy<K extends keyof Messages>(namespace: K): Messages[K] {
  return useMessages()[namespace] as Messages[K];
}
