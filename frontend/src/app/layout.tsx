import type { Metadata } from "next";
import type { ReactNode } from "react";
import LocaleProvider from "@/i18n/LocaleProvider";
import CookieConsent from "@/components/CookieConsent";
import ScrollToTop from "@/components/ScrollToTop";
import "../styles.css";

export const metadata: Metadata = {
  title: "My Celium",
  description: "Soluções para acompanhar o seu cultivo.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="pt-BR" data-scroll-behavior="smooth" className="scroll-smooth"><body><LocaleProvider><ScrollToTop />{children}<CookieConsent /></LocaleProvider></body></html>;
}
