import type { Metadata } from "next";
import Products from "@/components/products/products";

export const metadata: Metadata = {
  title: "Corretores de pH | Mycelium",
  description: "Conheça os corretores de pH Up e Down da Mycelium.",
};

export default function PhCorrectorsPage() {
  return <Products line="corretor-ph" />;
}
