export type Product = {
  slug: string;
  name: string;
  image: string;
  phase: "root" | "growth" | "flowering" | "finishing" | "adjustment";
  formula?: string;
  volume: string;
};

export const products: Product[] = [
  { slug: "raiz", name: "Raiz", image: "/images/products/raiz.webp", phase: "root", formula: "1-1-0.5", volume: "1 L" },
  { slug: "crescimento-parte-a", name: "Crescimento Parte A", image: "/images/products/crescimentoa.webp", phase: "growth", formula: "1-0-1", volume: "1 L" },
  { slug: "crescimento-parte-b", name: "Crescimento Parte B", image: "/images/products/crescimentob.webp", phase: "growth", formula: "1-3.5-1", volume: "1 L" },
  { slug: "floracao-parte-a", name: "Floração Parte A", image: "/images/products/floracaopartea.webp", phase: "flowering", formula: "1-0-0.5", volume: "500 ml" },
  { slug: "floracao-parte-b", name: "Floração Parte B", image: "/images/products/floracaoparteb.webp", phase: "flowering", formula: "0-1-0.5", volume: "1 L" },
  { slug: "flores-magicas", name: "Flores Mágicas", image: "/images/products/flormagica.webp", phase: "flowering", formula: "0-15-15", volume: "500 ml" },
  { slug: "finalizador", name: "Finalizador", image: "/images/products/finalizador.webp", phase: "finishing", formula: "1-5-3", volume: "1 L" },
  { slug: "ph-down", name: "pH Down", image: "/images/products/phdown.webp", phase: "adjustment", volume: "1 L" },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
