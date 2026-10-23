import type { Metadata } from "next";
import Collection from "@/components/collection/collection";

export const metadata: Metadata = {
  title: "Coleção | Mycelium",
  description: "Conheça as linhas da coleção Mycelium.",
};

export default function CollectionPage() {
  return <Collection />;
}
