"use client";

import { useCopy } from "@/i18n/useCopy";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductActions from "@/components/products/ProductActions";
import type { Product } from "@/data/products";

export default function ProductDetail({ product }: { product: Product }) {
  const t = useCopy("ProductDetail");

  return (
    <div className="min-h-screen bg-[#faf8fc] pt-[clamp(32px,5vw,64px)] pb-[clamp(75px,8vw,110px)] text-brand-ink">
      <div className="mx-auto w-[min(1180px,calc(100%_-_48px))] max-[640px]:w-[calc(100%_-_32px)]">
        <Button asChild variant="ghost" className="mb-[clamp(20px,4vw,40px)] font-extrabold text-[#5b298e] hover:text-brand-plum">
          <Link href="/products"><ArrowLeft aria-hidden="true" />{t.back}</Link>
        </Button>
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,.9fr)] items-center gap-[clamp(35px,6vw,88px)] max-[640px]:grid-cols-1 max-[640px]:gap-[35px]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] border border-[#e8e1ef] bg-white shadow-[0_22px_52px_rgba(43,15,72,.08)] max-[640px]:aspect-[4/4.4]">
            <Image src={product.image} alt={t.imageAlt.replace("{name}", product.name)} fill priority sizes="(max-width: 760px) 100vw, 50vw" className="object-contain" />
          </div>
          <div className="text-brand-ink">
            <span className="mb-[15px] inline-block text-[12px] font-black uppercase tracking-[.16em] text-brand-purple">{t.family}</span>
            <h1 className="mt-0 mb-[22px] text-[clamp(36px,4vw,60px)] font-black leading-[1.1] tracking-[-.045em]">{product.name}</h1>
            <span className="mb-8 inline-block self-start rounded-full bg-[#eee6f7] px-[10px] py-[6px] text-[11px] font-extrabold uppercase tracking-[.04em] text-[#64369c]">{t.phase[product.phase]}</span>
            <dl className="m-0 grid gap-0 border-t border-[#e8e1ef]">
              {product.formula ? <div className="flex justify-between gap-[18px] border-b border-[#e8e1ef] py-[17px]"><dt className="text-brand-muted">{t.formula}</dt><dd className="m-0 text-right font-extrabold">{product.formula}</dd></div> : null}
              <div className="flex justify-between gap-[18px] border-b border-[#e8e1ef] py-[17px]"><dt className="text-brand-muted">{t.volume}</dt><dd className="m-0 text-right font-extrabold">{product.volume}</dd></div>
            </dl>
            <p className="mt-[26px] mb-0 text-[14px] leading-[1.6] text-brand-muted">{t.labelInfo}</p>
            <ProductActions productSlug={product.slug} className="mt-8 border-t border-[#e8e1ef] pt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
