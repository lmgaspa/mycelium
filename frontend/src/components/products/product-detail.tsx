"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, type Locale } from "@/app/auth/locale";
import type { Product } from "@/data/products";
import styles from "./products.module.css";

const copy: Record<Locale, {
  back: string;
  family: string;
  phase: Record<Product["phase"], string>;
  formula: string;
  volume: string;
  labelInfo: string;
  imageAlt: (name: string) => string;
}> = {
  pt: { back: "Todos os produtos", family: "Linha Mycelium", phase: { root: "Raiz", growth: "Crescimento", flowering: "Floração", finishing: "Finalização", adjustment: "Correção de pH" }, formula: "Fórmula no rótulo", volume: "Conteúdo da embalagem", labelInfo: "Informações conforme a embalagem ilustrada.", imageAlt: (name) => `Embalagem Mycelium ${name}` },
  en: { back: "All products", family: "Mycelium line", phase: { root: "Root", growth: "Growth", flowering: "Flowering", finishing: "Finishing", adjustment: "pH adjustment" }, formula: "Formula on label", volume: "Package size", labelInfo: "Information shown on the pictured package.", imageAlt: (name) => `Mycelium ${name} bottle` },
  es: { back: "Todos los productos", family: "Línea Mycelium", phase: { root: "Raíz", growth: "Crecimiento", flowering: "Floración", finishing: "Finalización", adjustment: "Ajuste de pH" }, formula: "Fórmula en la etiqueta", volume: "Contenido del envase", labelInfo: "Información según el envase ilustrado.", imageAlt: (name) => `Envase Mycelium ${name}` },
};

export default function ProductDetail({ product }: { product: Product }) {
  const t = copy[useLocale()];

  return (
    <div className={styles.detailPage}>
      <div className={styles.shell}>
        <Button asChild variant="ghost" className={styles.backButton}>
          <Link href="/products"><ArrowLeft aria-hidden="true" />{t.back}</Link>
        </Button>
        <div className={styles.detailGrid}>
          <div className={styles.detailImageWrap}>
            <Image src={product.image} alt={t.imageAlt(product.name)} fill priority sizes="(max-width: 760px) 100vw, 50vw" className={styles.image} />
          </div>
          <div className={styles.detailCopy}>
            <span className={styles.eyebrow}>{t.family}</span>
            <h1>{product.name}</h1>
            <span className={styles.detailPhase}>{t.phase[product.phase]}</span>
            <dl className={styles.specs}>
              {product.formula ? <div><dt>{t.formula}</dt><dd>{product.formula}</dd></div> : null}
              <div><dt>{t.volume}</dt><dd>{product.volume}</dd></div>
            </dl>
            <p>{t.labelInfo}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
