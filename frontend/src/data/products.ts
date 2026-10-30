export type Product = {
  id: string;
  slug: string;
  name: string;
  image: string;
  catalogImage?: string;
  phase: "root" | "growth" | "flowering" | "finishing" | "adjustment" | "substrate";
  formula?: string;
  volume: string;
  sizesMl: number[];
  pricesBySizeMl: Record<number, number>;
  category?: "fertilizer" | "substrate" | "ph-corrector";
  productLine?: "soloBiomineral" | "solo" | "corretor-ph";
  targetCrops?: string[];
  environments?: string[];
  usagePhase?: string;
  applicationMethod?: string;
  description?: string;
};

export const products: Product[] = [
  { id: "raiz", slug: "raiz", name: "Raiz", image: "/images/products/raiz.webp", catalogImage: "/images/collection/collection-raiz.webp", phase: "root", formula: "1-1-0.5", volume: "1 L", sizesMl: [100, 250, 500, 1000, 5000, 10000], pricesBySizeMl: { 100: 0, 250: 0, 500: 0, 1000: 0, 5000: 0, 10000: 0 }, category: "fertilizer", productLine: "soloBiomineral" },
  { id: "crescimento-parte-a", slug: "crescimento-parte-a", name: "Crescimento Parte A", image: "/images/products/crescimentoa.webp", catalogImage: "/images/collection/collection-crescimento-a.webp", phase: "growth", formula: "1-0-1", volume: "1 L", sizesMl: [100, 250, 500, 1000, 5000, 10000], pricesBySizeMl: { 100: 0, 250: 0, 500: 0, 1000: 0, 5000: 0, 10000: 0 }, category: "fertilizer", productLine: "soloBiomineral" },
  { id: "crescimento-parte-b", slug: "crescimento-parte-b", name: "Crescimento Parte B", image: "/images/products/crescimentob.webp", catalogImage: "/images/collection/collection-crescimento-b.webp", phase: "growth", formula: "1-3.5-1", volume: "1 L", sizesMl: [100, 250, 500, 1000, 5000, 10000], pricesBySizeMl: { 100: 0, 250: 0, 500: 0, 1000: 0, 5000: 0, 10000: 0 }, category: "fertilizer", productLine: "soloBiomineral" },
  { id: "floracao-parte-a", slug: "floracao-parte-a", name: "Floração Parte A", image: "/images/products/floracaopartea.webp", catalogImage: "/images/collection/collection-floracao-a.webp", phase: "flowering", formula: "1-0-0.5", volume: "500 ml", sizesMl: [100, 250, 500, 1000, 5000, 10000], pricesBySizeMl: { 100: 0, 250: 0, 500: 0, 1000: 0, 5000: 0, 10000: 0 }, category: "fertilizer", productLine: "soloBiomineral" },
  { id: "floracao-parte-b", slug: "floracao-parte-b", name: "Floração Parte B", image: "/images/products/floracaoparteb.webp", catalogImage: "/images/collection/collection-floracao-b.webp", phase: "flowering", formula: "0-1-0.5", volume: "1 L", sizesMl: [100, 250, 500, 1000, 5000, 10000], pricesBySizeMl: { 100: 0, 250: 0, 500: 0, 1000: 0, 5000: 0, 10000: 0 }, category: "fertilizer", productLine: "soloBiomineral" },
  { id: "flores-magicas", slug: "flores-magicas", name: "Flores Mágicas", image: "/images/products/flormagica.webp", catalogImage: "/images/collection/collection-flores-magicas.webp", phase: "flowering", formula: "0-15-15", volume: "500 ml", sizesMl: [100, 250, 500, 1000], pricesBySizeMl: { 100: 0, 250: 0, 500: 0, 1000: 0 }, category: "fertilizer", productLine: "soloBiomineral" },
  { id: "finalizador", slug: "finalizador", name: "Finalizador", image: "/images/products/finalizador.webp", catalogImage: "/images/collection/collection-finalizador.webp", phase: "finishing", formula: "1-5-3", volume: "1 L", sizesMl: [100, 250, 500, 1000, 5000, 10000], pricesBySizeMl: { 100: 0, 250: 0, 500: 0, 1000: 0, 5000: 0, 10000: 0 }, category: "fertilizer", productLine: "soloBiomineral" },
  { id: "ph-down", slug: "ph-down", name: "Corretor de pH Down", image: "/images/products/phdown.webp", phase: "adjustment", volume: "1 L", sizesMl: [1000], pricesBySizeMl: { 1000: 0 }, category: "ph-corrector", productLine: "corretor-ph" },
  { id: "ph-up", slug: "ph-up", name: "Corretor de pH Up", image: "/images/products/phup.webp", phase: "adjustment", volume: "1 L", sizesMl: [1000], pricesBySizeMl: { 1000: 0 }, category: "ph-corrector", productLine: "corretor-ph" },
  { id: "solo", slug: "solo", name: "Solo Biomineral", image: "/images/products/solo.webp", catalogImage: "/images/products/solo.webp", phase: "substrate", volume: "10 L / 20 L", sizesMl: [10000, 20000], pricesBySizeMl: { 10000: 0, 20000: 0 }, category: "substrate", productLine: "solo", description: "livingSubstrate" },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductPrice(product: Product, sizeMl: number): number {
  return product.pricesBySizeMl[sizeMl] ?? 0;
}
