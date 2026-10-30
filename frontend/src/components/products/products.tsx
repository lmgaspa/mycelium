"use client";

import { useCopy } from "@/i18n/useCopy";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageBanner from "@/components/common/PageBanner";
import ProductActions from "@/components/products/ProductActions";
import { products, type Product } from "@/data/products";
import StorePageSection from "@/components/common/StorePageSection";

export default function Products({ line }: { line?: NonNullable<Product["productLine"]> }) {
  const t = useCopy("Products");
  const names = useCopy("ProductNames");
  const productDetail = useCopy("ProductDetail");
  const displayedProducts = line ? products.filter((product) => product.productLine === line) : products;
  const eyebrow = line ? t.lineEyebrow : t.eyebrow;

  return (
    <div className="bg-store-surface text-brand-ink">
      <PageBanner eyebrow={eyebrow} title={line ? productDetail.productLines[line] : t.title} description={line ? t.lineIntro : t.intro} />

      <StorePageSection aria-label={eyebrow} contentClassName="grid grid-cols-3 gap-[clamp(18px,2.5vw,30px)] max-[900px]:grid-cols-2 max-[640px]:grid-cols-1">
          {displayedProducts.map((product) => (
            <article className="isolate flex flex-col overflow-hidden rounded-[22px] border border-store-border bg-store-surface text-brand-ink transition-[transform,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-store-border-hover focus-within:border-store-border-hover motion-reduce:transition-none" key={product.slug}>
              <Link href={`/products/${product.slug}`} className="relative mx-4 mt-4 block aspect-[4/4.8] overflow-hidden rounded-[14px] bg-transparent focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-brand-purple max-[640px]:aspect-[4/4.4]">
                <Image src={product.image} alt={t.imageAlt.replace("{name}", names[product.slug as keyof typeof names] ?? product.name)} fill sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw" className="object-contain mix-blend-multiply" />
              </Link>
              <div className="flex flex-1 flex-col px-6 pt-[18px] pb-[23px]">
                <span className="self-start rounded-full bg-store-badge px-[10px] py-[6px] text-[11px] font-extrabold uppercase tracking-[.04em] text-store-badge-text">{t.phase[product.phase]}</span>
                <h2 className="mt-[13px] mb-[18px] text-[clamp(21px,2vw,27px)] leading-[1.18] tracking-[-.025em] [font-weight:850]"><Link href={`/products/${product.slug}`} className="text-inherit no-underline hover:text-brand-purple focus-visible:rounded-sm focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-brand-purple">{names[product.slug as keyof typeof names] ?? product.name}</Link></h2>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-[10px] border-t border-store-divider pt-[15px] text-[13px] font-bold text-brand-muted">
                  <span>{product.formula ? `${product.formula} · ` : ""}{product.volume}</span>
                  <Link href={`/products/${product.slug}`} className="inline-flex items-center gap-1 font-extrabold text-store-link no-underline hover:underline [&_svg]:size-[17px]">{t.details} <ArrowUpRight aria-hidden="true" /></Link>
                </div>
                <ProductActions product={product} compact className="mt-4 border-t border-store-divider pt-4" />
              </div>
            </article>
          ))}
      </StorePageSection>
    </div>
  );
}
