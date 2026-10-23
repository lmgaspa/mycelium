import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../styles.css";
import "../legacy-pages/HomePage.css";

export const metadata: Metadata = {
  title: "Mycelium",
  description: "Soluções para acompanhar o seu cultivo.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
