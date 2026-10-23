"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLocale, type Locale } from "@/app/auth/locale";
import { products, type Product } from "@/data/products";
import styles from "./products.module.css";

const copy: Record<Locale, {
  eyebrow: string;
  title: string;
  intro: string;
  phase: Record<Product["phase"], string>;
  details: string;
  imageAlt: (name: string) => string;
}> = {
  pt: {
    eyebrow: "MYCELIUM · PRODUTOS",
    title: "Produtos para cada etapa do cultivo.",
    intro: "Conheça a linha Mycelium. Explore as embalagens e informações que aparecem nos rótulos.",
    phase: { root: "Raiz", growth: "Crescimento", flowering: "Floração", finishing: "Finalização", adjustment: "Correção de pH" },
    details: "Ver detalhes",
    imageAlt: (name) => `Embalagem Mycelium ${name}`,
  },
  en: {
    eyebrow: "MYCELIUM · PRODUCTS",
    title: "Products for every growing stage.",
    intro: "Explore the Mycelium line and the information shown on each product label.",
    phase: { root: "Root", growth: "Growth", flowering: "Flowering", finishing: "Finishing", adjustment: "pH adjustment" },
    details: "View details",
    imageAlt: (name) => `Mycelium ${name} bottle`,
  },
  es: {
    eyebrow: "MYCELIUM · PRODUCTOS",
    title: "Productos para cada etapa del cultivo.",
    intro: "Conoce la línea Mycelium y la información que aparece en las etiquetas.",
    phase: { root: "Raíz", growth: "Crecimiento", flowering: "Floración", finishing: "Finalización", adjustment: "Ajuste de pH" },
    details: "Ver detalles",
    imageAlt: (name) => `Envase Mycelium ${name}`,
  },
};

export default function Products() {
  const t = copy[useLocale()];

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.shell}>
          <span className={styles.eyebrow}>{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p>{t.intro}</p>
        </div>
      </header>

      <section className={styles.catalog} aria-label={t.eyebrow}>
        <div className={`${styles.shell} ${styles.grid}`}>
          {products.map((product) => (
            <Link href={`/products/${product.slug}`} className={styles.card} key={product.slug}>
              <div className={styles.imageWrap}>
                <Image src={product.image} alt={t.imageAlt(product.name)} fill sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw" className={styles.image} />
              </div>
              <div className={styles.cardBody}>
                <span className={styles.phase}>{t.phase[product.phase]}</span>
                <h2>{product.name}</h2>
                <div className={styles.cardBottom}>
                  <span>{product.formula ? `${product.formula} · ` : ""}{product.volume}</span>
                  <span className={styles.cardAction}>{t.details} <ArrowUpRight aria-hidden="true" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
