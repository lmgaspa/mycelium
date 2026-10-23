"use client";

import { useEffect, useState, type ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { readLocale } from "@/app/auth/locale";
import { localeTags, type Locale } from "@/i18n/config";
import pt from "../../messages/pt.json";
import en from "../../messages/en.json";
import es from "../../messages/es.json";

const dictionaries = { pt, en, es };

export default function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("pt");

  useEffect(() => {
    const current = readLocale();
    setLocale(current);
    document.documentElement.lang = localeTags[current];
    const onLocaleChange = (event: Event) => setLocale((event as CustomEvent<Locale>).detail);
    window.addEventListener("myc-locale-change", onLocaleChange);
    return () => window.removeEventListener("myc-locale-change", onLocaleChange);
  }, []);

  return <NextIntlClientProvider locale={locale} messages={dictionaries[locale]}>{children}</NextIntlClientProvider>;
}
