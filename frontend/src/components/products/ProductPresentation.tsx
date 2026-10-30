"use client";

import Image from "next/image";
import { useCopy } from "@/i18n/useCopy";
import type { Product } from "@/data/products";

export default function ProductPresentation({ product, productName }: { product: Product; productName: string }) {
  const t = useCopy("ProductDetail");
  const category = product.category ? t.category[product.category] : t.dataPending;
  const productLine = product.productLine
    ? t.productLines[product.productLine as keyof typeof t.productLines] ?? t.dataPending
    : t.dataPending;
  const description = product.description
    ? t.descriptions[product.description as keyof typeof t.descriptions] ?? t.dataPending
    : t.phaseDescriptions[product.phase];
  const phase = product.usagePhase || t.phase[product.phase];
  const rows = [
    { label: t.commercialName, value: productName },
    { label: t.categoryLabel, value: category },
    { label: t.productLine, value: productLine },
    ...(product.formula ? [{ label: t.formula, value: product.formula }] : []),
    { label: t.volume, value: product.volume },
    { label: t.targetCrops, value: product.targetCrops?.length ? product.targetCrops.join(", ") : t.dataPending },
    { label: t.environments, value: product.environments?.length ? product.environments.join(", ") : t.dataPending },
    { label: t.usagePhase, value: phase },
    { label: t.applicationMethod, value: product.applicationMethod || t.dataPending },
  ];
  const highlights = [
    { image: "/images/product-highlights/1.webp", title: t.usagePhase, value: product.slug === "flores-magicas" ? t.highlights.maturation : phase },
    { image: "/images/product-highlights/2.webp", title: t.highlightBenefit, value: t.dataPending },
    { image: "/images/product-highlights/3.webp", title: t.highlightValidation, value: t.dataPending },
  ];

  return (
    <section aria-labelledby="product-presentation-title" className="min-w-0 text-brand-ink">
      <div className="min-w-0 text-center md:text-left">
        <p className="mb-2 text-xs font-black uppercase tracking-[.14em] text-brand-plum">{productLine}</p>
        <h1 id="product-presentation-title" className="mt-0 mb-3 text-[clamp(32px,4vw,52px)] font-black leading-[1.08] tracking-[-.035em] text-brand-plum">{productName}</h1>
        <p className="mb-3 text-lg font-bold text-brand-ink">{category} · {phase}</p>
        <p className="m-0 max-w-[680px] leading-relaxed text-brand-muted">{description}</p>
      </div>

      <ul className="mt-6 m-0 hidden gap-4 rounded-2xl bg-brand-plum/5 p-5 lg:grid lg:grid-cols-3">
        {highlights.map(({ image, title, value }) => (
          <li key={image} className="flex min-w-0 flex-col items-center gap-3 text-center lg:flex-row lg:text-left">
            <Image src={image} alt="" width={48} height={48} aria-hidden="true" className="size-12 shrink-0 object-contain" />
            <span className="min-w-0 text-sm leading-snug"><strong className="block text-brand-ink">{title}</strong><span className="text-brand-muted">{value}</span></span>
          </li>
        ))}
      </ul>

      <div className="mt-8 overflow-hidden rounded-xl border border-brand-plum/15">
        <h2 className="m-0 bg-brand-plum px-5 py-3 text-base font-extrabold uppercase tracking-wide text-white">{t.identificationTitle}</h2>
        <dl className="m-0 divide-y divide-brand-plum/10">
          {rows.map(({ label, value }) => (
            <div key={label} className="grid grid-cols-[minmax(130px,.45fr)_minmax(0,1fr)] max-[480px]:grid-cols-1">
              <dt className="bg-brand-plum/5 px-5 py-3 font-semibold text-brand-ink">{label}</dt>
              <dd className="m-0 min-w-0 px-5 py-3 break-words text-brand-ink max-[480px]:pt-2">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
