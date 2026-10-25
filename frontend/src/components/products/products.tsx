"use client";

import { useCopy } from "@/i18n/useCopy";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageBanner from "@/components/common/PageBanner";
import ProductActions from "@/components/products/ProductActions";
import { products } from "@/data/products";
import StorePageSection from "@/components/common/StorePageSection";

export default function Products() {
  const t = useCopy("Products");
  const names = useCopy("ProductNames");

  return (
    <div className="bg-[#faf8fc] text-brand-ink">
      <PageBanner eyebrow={t.eyebrow} title={t.title} description={t.intro} />

      <StorePageSection aria-label={t.eyebrow} contentClassName="grid grid-cols-3 gap-[clamp(18px,2.5vw,30px)] max-[900px]:grid-cols-2 max-[640px]:grid-cols-1">
          {products.map((product) => (
            <article className="flex flex-col overflow-hidden rounded-[22px] border border-[#e8e1ef] bg-white text-brand-ink shadow-[0_10px_28px_rgba(43,15,72,.06)] transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-[#b797dd] hover:shadow-[0_19px_42px_rgba(43,15,72,.14)] focus-within:border-[#b797dd] focus-within:shadow-[0_19px_42px_rgba(43,15,72,.14)] motion-reduce:transition-none" key={product.slug}>
              <Link href={`/products/${product.slug}`} className="relative mx-4 mt-4 block aspect-[4/4.8] overflow-hidden rounded-[14px] bg-white focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-brand-purple max-[640px]:aspect-[4/4.4]">
                <Image src={product.image} alt={t.imageAlt.replace("{name}", names[product.slug as keyof typeof names] ?? product.name)} fill sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw" className="object-contain" />
              </Link>
              <div className="flex flex-1 flex-col px-6 pt-[18px] pb-[23px]">
                <span className="self-start rounded-full bg-[#eee6f7] px-[10px] py-[6px] text-[11px] font-extrabold uppercase tracking-[.04em] text-[#64369c]">{t.phase[product.phase]}</span>
                <h2 className="mt-[13px] mb-[18px] text-[clamp(21px,2vw,27px)] leading-[1.18] tracking-[-.025em] [font-weight:850]"><Link href={`/products/${product.slug}`} className="text-inherit no-underline hover:text-brand-purple focus-visible:rounded-sm focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-brand-purple">{names[product.slug as keyof typeof names] ?? product.name}</Link></h2>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-[10px] border-t border-[#eee8f2] pt-[15px] text-[13px] font-bold text-brand-muted">
                  <span>{product.formula ? `${product.formula} · ` : ""}{product.volume}</span>
                  <Link href={`/products/${product.slug}`} className="inline-flex items-center gap-1 font-extrabold text-[#5b298e] no-underline hover:underline [&_svg]:size-[17px]">{t.details} <ArrowUpRight aria-hidden="true" /></Link>
                </div>
                <ProductActions product={product} compact className="mt-4 border-t border-[#eee8f2] pt-4" />
              </div>
            </article>
          ))}
      </StorePageSection>
    </div>
  );
}
