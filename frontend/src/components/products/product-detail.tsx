"use client";

import { useCopy } from "@/i18n/useCopy";
import { useProductName } from "@/i18n/useProductName";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageBanner from "@/components/common/PageBanner";
import StorePageSection from "@/components/common/StorePageSection";
import ProductActions from "@/components/products/ProductActions";
import type { Product } from "@/data/products";

export default function ProductDetail({ product }: { product: Product }) {
  const t = useCopy("ProductDetail");
  const productName = useProductName(product.slug, product.name);
  const [selectedImage, setSelectedImage] = useState<"catalog" | "product">("catalog");
  const showCatalog = Boolean(product.catalogImage) && selectedImage === "catalog";

  return (
    <>
    <PageBanner eyebrow={t.family} title={productName} description={t.labelInfo} tone="plum" action={<Button asChild variant="outline" className="min-h-11 rounded-full border-white/65 bg-transparent px-5 font-bold text-white hover:bg-white hover:text-brand-plum focus-visible:ring-brand-leaf"><Link href="/products"><ArrowLeft aria-hidden="true" />{t.back}</Link></Button>} />
    <StorePageSection className="bg-[#faf8fc] text-brand-ink">
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
            <h2 className="sr-only">{productName}</h2>
            <span className="mb-8 inline-block self-start rounded-full bg-[#eee6f7] px-[10px] py-[6px] text-[11px] font-extrabold uppercase tracking-[.04em] text-[#64369c]">{t.phase[product.phase]}</span>
            <dl className="m-0 grid gap-0 border-t border-[#e8e1ef]">
              {product.formula ? <div className="flex justify-between gap-[18px] border-b border-[#e8e1ef] py-[17px]"><dt className="text-brand-muted">{t.formula}</dt><dd className="m-0 text-right font-extrabold">{product.formula}</dd></div> : null}
              <div className="flex justify-between gap-[18px] border-b border-[#e8e1ef] py-[17px]"><dt className="text-brand-muted">{t.volume}</dt><dd className="m-0 text-right font-extrabold">{product.volume}</dd></div>
            </dl>
            <ProductActions product={product} className="mt-8 border-t border-[#e8e1ef] pt-6" />
          </div>
        </div>
    </StorePageSection>
    </>
  );
}
