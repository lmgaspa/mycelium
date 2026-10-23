"use client";

import { useCopy } from "@/i18n/useCopy";
import { useProductName } from "@/i18n/useProductName";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductActions from "@/components/products/ProductActions";
import type { Product } from "@/data/products";

export default function ProductDetail({ product }: { product: Product }) {
  const t = useCopy("ProductDetail");
  const productName = useProductName(product.slug, product.name);
  const [selectedImage, setSelectedImage] = useState<"catalog" | "product">("catalog");
  const showCatalog = Boolean(product.catalogImage) && selectedImage === "catalog";

  return (
    <div className="min-h-screen bg-[#faf8fc] pt-[clamp(32px,5vw,64px)] pb-[clamp(75px,8vw,110px)] text-brand-ink">
      <div className="mx-auto w-[min(1180px,calc(100%_-_48px))] max-[640px]:w-[calc(100%_-_32px)]">
        <Button asChild variant="ghost" className="mb-[clamp(20px,4vw,40px)] font-extrabold text-[#5b298e] hover:text-brand-plum">
          <Link href="/products"><ArrowLeft aria-hidden="true" />{t.back}</Link>
        </Button>
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,.9fr)] items-center gap-[clamp(35px,6vw,88px)] max-[640px]:grid-cols-1 max-[640px]:gap-[35px]">
          <div className="flex min-w-0 items-start gap-3 max-[420px]:gap-2">
            {product.catalogImage ? (
              <div className="flex shrink-0 flex-col gap-3" aria-label={t.gallery}>
                {(["catalog", "product"] as const).map((kind) => (
                  <button
                    key={kind}
                    type="button"
                    aria-label={`${kind === "catalog" ? t.catalogImage : t.productImage}: ${productName}`}
                    aria-pressed={selectedImage === kind}
                    onClick={() => setSelectedImage(kind)}
                    className={`relative size-[72px] cursor-pointer overflow-hidden rounded-[12px] border-2 bg-white p-0 transition-colors focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-brand-purple max-[420px]:size-[56px] ${selectedImage === kind ? "border-brand-purple" : "border-[#e8e1ef] hover:border-[#b797dd]"}`}
                  >
                    <Image src={kind === "catalog" ? product.catalogImage! : product.image} alt="" fill sizes="72px" className="object-contain" />
                  </button>
                ))}
              </div>
            ) : null}
            <div className={`relative min-w-0 flex-1 overflow-hidden rounded-[26px] border border-[#e8e1ef] bg-white shadow-[0_22px_52px_rgba(43,15,72,.08)] ${product.catalogImage ? "aspect-[3/2]" : "aspect-[4/5] max-[640px]:aspect-[4/4.4]"}`}>
              <Image src={showCatalog ? product.catalogImage! : product.image} alt={t.imageAlt.replace("{name}", productName)} fill priority sizes="(max-width: 760px) 100vw, 50vw" className="object-contain" />
            </div>
          </div>
          <div className="text-brand-ink">
            <span className="mb-[15px] inline-block text-[12px] font-black uppercase tracking-[.16em] text-brand-purple">{t.family}</span>
            <h1 className="mt-0 mb-[22px] text-[clamp(36px,4vw,60px)] font-black leading-[1.1] tracking-[-.045em]">{productName}</h1>
            <span className="mb-8 inline-block self-start rounded-full bg-[#eee6f7] px-[10px] py-[6px] text-[11px] font-extrabold uppercase tracking-[.04em] text-[#64369c]">{t.phase[product.phase]}</span>
            <dl className="m-0 grid gap-0 border-t border-[#e8e1ef]">
              {product.formula ? <div className="flex justify-between gap-[18px] border-b border-[#e8e1ef] py-[17px]"><dt className="text-brand-muted">{t.formula}</dt><dd className="m-0 text-right font-extrabold">{product.formula}</dd></div> : null}
              <div className="flex justify-between gap-[18px] border-b border-[#e8e1ef] py-[17px]"><dt className="text-brand-muted">{t.volume}</dt><dd className="m-0 text-right font-extrabold">{product.volume}</dd></div>
            </dl>
            <p className="mt-[26px] mb-0 text-[14px] leading-[1.6] text-brand-muted">{t.labelInfo}</p>
            <ProductActions product={product} className="mt-8 border-t border-[#e8e1ef] pt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
