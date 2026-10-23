export type Product = {
  slug: string;
  name: string;
  image: string;
  catalogImage?: string;
  phase: "root" | "growth" | "flowering" | "finishing" | "adjustment";
  formula?: string;
  volume: string;
  sizesMl: number[];
};

export const products: Product[] = [
  { slug: "raiz", name: "Raiz", image: "/images/products/raiz.webp", catalogImage: "/images/collecao/raizcolecao.webp", phase: "root", formula: "1-1-0.5", volume: "1 L", sizesMl: [100, 250, 500, 1000, 5000, 10000] },
  { slug: "crescimento-parte-a", name: "Crescimento Parte A", image: "/images/products/crescimentoa.webp", catalogImage: "/images/collecao/crescimentocolecaoa.webp", phase: "growth", formula: "1-0-1", volume: "1 L", sizesMl: [100, 250, 500, 1000, 5000, 10000] },
  { slug: "crescimento-parte-b", name: "Crescimento Parte B", image: "/images/products/crescimentob.webp", catalogImage: "/images/collecao/crescimentobcolecao.webp", phase: "growth", formula: "1-3.5-1", volume: "1 L", sizesMl: [100, 250, 500, 1000, 5000, 10000] },
  { slug: "floracao-parte-a", name: "Floração Parte A", image: "/images/products/floracaopartea.webp", catalogImage: "/images/collecao/floracaocolecaoa.webp", phase: "flowering", formula: "1-0-0.5", volume: "500 ml", sizesMl: [100, 250, 500, 1000, 5000, 10000] },
  { slug: "floracao-parte-b", name: "Floração Parte B", image: "/images/products/floracaoparteb.webp", catalogImage: "/images/collecao/floracaocolecaob.webp", phase: "flowering", formula: "0-1-0.5", volume: "1 L", sizesMl: [100, 250, 500, 1000, 5000, 10000] },
  { slug: "flores-magicas", name: "Flores Mágicas", image: "/images/products/flormagica.webp", catalogImage: "/images/collecao/floresmagicascolecao.webp", phase: "flowering", formula: "0-15-15", volume: "500 ml", sizesMl: [100, 250, 500, 1000] },
  { slug: "finalizador", name: "Finalizador", image: "/images/products/finalizador.webp", catalogImage: "/images/collecao/finalizadorcolecao.webp", phase: "finishing", formula: "1-5-3", volume: "1 L", sizesMl: [100, 250, 500, 1000, 5000, 10000] },
  { slug: "ph-down", name: "Corretor de pH Down", image: "/images/products/phdown.webp", phase: "adjustment", volume: "1 L", sizesMl: [1000] },
  { slug: "ph-up", name: "Corretor de pH Up", image: "/images/products/corretorph.webp", phase: "adjustment", volume: "1 L", sizesMl: [1000] },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
