"use client";

import { useEffect, useState } from "react";
import { localeTags, type Locale } from "@/i18n/config";

export { localeTags };
export type { Locale };

export function readLocale(): Locale {
  if (typeof document === "undefined") return "pt";
  const value = document.cookie.match(/(?:^|; )myc_locale=(pt|en|es)(?:;|$)/)?.[1];
  if (value === "pt" || value === "en" || value === "es") return value;
  const browser = navigator.language.slice(0, 2);
  return browser === "en" || browser === "es" ? browser : "pt";
}

export function saveLocale(locale: Locale) {
  document.cookie = `myc_locale=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  document.documentElement.lang = localeTags[locale];
  window.dispatchEvent(new CustomEvent("myc-locale-change", { detail: locale }));
}

export function useLocale(): Locale {
  const [locale, setLocale] = useState<Locale>("pt");
  useEffect(() => {
    setLocale(readLocale());
    const listener = (event: Event) => setLocale((event as CustomEvent<Locale>).detail);
    window.addEventListener("myc-locale-change", listener);
    return () => window.removeEventListener("myc-locale-change", listener);
  }, []);
  return locale;
}

