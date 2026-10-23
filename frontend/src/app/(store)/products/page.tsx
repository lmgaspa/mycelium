import type { Metadata } from "next";
import Products from "@/components/products/products";

export const metadata: Metadata = {
  title: "Produtos | Mycelium",
  description: "Conheça os produtos da linha Mycelium.",
};

export default function ProductsPage() {
  return <Products />;
}
