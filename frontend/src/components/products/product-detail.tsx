"use client";

import { useCopy } from "@/i18n/useCopy";
import { useProductName } from "@/i18n/useProductName";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import WideStorePageSection from "@/components/common/WideStorePageSection";
import ProductActions from "@/components/products/ProductActions";
import ProductVolumeSelector, { getDefaultProductSize } from "@/components/products/ProductVolumeSelector";
import ProductPresentation from "@/components/products/ProductPresentation";
import type { Product } from "@/data/products";

export default function ProductDetail({ product }: { product: Product }) {
  const t = useCopy("ProductDetail");
  const productName = useProductName(product.slug, product.name);
  const [selectedImage, setSelectedImage] = useState<"catalog" | "product">(product.catalogImage ? "catalog" : "product");
  const [selectedSizeMl, setSelectedSizeMl] = useState(() => getDefaultProductSize(product));
  const hasDistinctCatalogImage = Boolean(product.catalogImage && product.catalogImage !== product.image);
  const galleryImages: ("catalog" | "product")[] = hasDistinctCatalogImage ? ["catalog", "product"] : [product.catalogImage ? "catalog" : "product"];
  const showCatalog = Boolean(product.catalogImage) && selectedImage === "catalog";

  return (
    <WideStorePageSection className="bg-store-surface text-brand-ink">
      <Button asChild variant="outline" className="mb-8 min-h-11 rounded-full border-brand-plum/30 bg-transparent px-5 font-bold text-brand-plum hover:bg-brand-plum/5 focus-visible:ring-brand-purple"><Link href="/products"><ArrowLeft aria-hidden="true" />{t.back}</Link></Button>
      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-[clamp(24px,4vw,56px)]">
        <div className="min-w-0">
          <div className="flex min-w-0 items-start gap-3 max-[420px]:gap-2">
            <div className="flex shrink-0 flex-col gap-3" aria-label={t.gallery}>
              {galleryImages.map((kind) => (
                <button
                  key={kind}
                  type="button"
                  aria-label={`${kind === "catalog" ? t.catalogImage : t.productImage}: ${productName}`}
                  aria-pressed={selectedImage === kind}
                  onClick={() => setSelectedImage(kind)}
                  className={`relative size-[72px] cursor-pointer overflow-hidden rounded-[12px] border-2 bg-transparent p-0 transition-colors focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-brand-purple max-[420px]:size-[56px] ${selectedImage === kind ? "border-brand-purple" : "border-store-border hover:border-store-border-hover"}`}
                >
                  <Image src={kind === "catalog" ? product.catalogImage! : product.image} alt="" fill loading={selectedImage === kind ? "eager" : "lazy"} sizes="72px" className={kind === "product" ? "object-contain mix-blend-multiply" : "object-contain"} />
                </button>
              ))}
            </div>
            <div className="relative aspect-[3/2] min-w-0 flex-1 overflow-hidden rounded-[26px] border border-store-border bg-transparent">
              <Image src={showCatalog ? product.catalogImage! : product.image} alt={t.imageAlt.replace("{name}", productName)} fill loading="eager" sizes="(max-width: 760px) 100vw, 50vw" className={showCatalog ? "object-contain" : "object-contain mix-blend-multiply"} />
            </div>
          </div>
          <div className="mt-6"><ProductVolumeSelector product={product} mode="selection" selectedSizeMl={selectedSizeMl} onSelect={setSelectedSizeMl} /></div>
          <ProductActions product={product} selectedSizeMl={selectedSizeMl} className="mt-3" />
        </div>
        <ProductPresentation product={product} productName={productName} />
      </div>
    </WideStorePageSection>
  );
}
