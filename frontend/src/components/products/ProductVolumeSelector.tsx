"use client";

import { Minus, Plus } from "lucide-react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { getProductPrice, type Product } from "@/data/products";
import { useCopy } from "@/i18n/useCopy";
import { formatMyceliumPrice } from "@/utils/formatPrice";

export const formatProductSize = (sizeMl: number) => sizeMl >= 1000 ? `${sizeMl / 1000} L` : `${sizeMl} ml`;

export function getDefaultProductSize(product: Product): number {
  const match = product.volume.match(/(\d+(?:[.,]\d+)?)\s*(ml|l)\b/i);
  const sizeMl = match ? Number(match[1].replace(",", ".")) * (match[2].toLowerCase() === "l" ? 1000 : 1) : 0;
  return product.sizesMl.includes(sizeMl) ? sizeMl : product.sizesMl[0];
}

export function getVolumeTotals(product: Product, quantities: Record<number, number>) {
  return product.sizesMl.reduce((totals, sizeMl) => {
    const quantity = quantities[sizeMl] ?? 0;
    return {
      volumeMl: totals.volumeMl + sizeMl * quantity,
      price: totals.price + getProductPrice(product, sizeMl) * quantity,
    };
  }, { volumeMl: 0, price: 0 });
}

type Props =
  | { product: Product; mode: "selection"; selectedSizeMl: number; onSelect: (sizeMl: number) => void }
  | { product: Product; mode: "quantities"; quantities: Record<number, number>; onChangeQuantity: (sizeMl: number, delta: number) => void };

export default function ProductVolumeSelector(props: Props) {
  const t = useCopy("ProductActions");
  const locale = useLocale();
  const { product } = props;

  if (props.mode === "selection") {
    const price = getProductPrice(product, props.selectedSizeMl);
    const pricePerMl = props.selectedSizeMl ? price / props.selectedSizeMl : 0;

    return (
      <section className="rounded-[22px] bg-store-surface p-5 text-brand-plum shadow-sm sm:p-6" aria-label={t.selectVolume}>
        <p className="m-0 text-sm font-bold">{t.illustratedPrice.replace("{size}", formatProductSize(props.selectedSizeMl))}</p>
        <p className="my-1 text-[clamp(32px,5vw,44px)] font-black leading-none" aria-live="polite">{formatMyceliumPrice(price)}</p>
        <p className="m-0 text-sm text-brand-muted">R$ {new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(pricePerMl)} {t.perMl}</p>
        <p className="mb-1 mt-4 text-sm font-bold">{t.selectVolume}</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6" role="group" aria-label={t.selectVolume}>
          {product.sizesMl.map((sizeMl) => <button key={sizeMl} type="button" onClick={() => props.onSelect(sizeMl)} aria-pressed={props.selectedSizeMl === sizeMl} className="min-h-12 cursor-pointer rounded-lg border border-brand-lilac-border bg-white px-1 py-1 text-center text-sm font-bold text-brand-plum transition-colors hover:border-brand-purple focus-visible:outline-[3px] focus-visible:outline-brand-purple aria-pressed:border-brand-purple aria-pressed:bg-brand-lilac-soft">
            <span className="block">{formatProductSize(sizeMl)}</span><span className="block text-xs font-normal text-brand-muted">{formatMyceliumPrice(getProductPrice(product, sizeMl))}</span>
          </button>)}
        </div>
      </section>
    );
  }

  const totals = getVolumeTotals(product, props.quantities);
  const formatMl = (amount: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(amount);

  return (
    <>
      <div className="grid max-h-[50svh] gap-2 overflow-y-auto py-2" aria-label={t.chooseSize}>
        {product.sizesMl.map((sizeMl) => (
          <div key={sizeMl} className="flex min-h-14 items-center justify-between gap-2 rounded-xl border border-brand-lilac-border bg-store-surface px-3 py-2 transition-colors duration-150 hover:border-brand-plum hover:bg-brand-lilac-hover sm:px-4">
            <button type="button" onClick={() => props.onChangeQuantity(sizeMl, 1)} aria-label={`${t.quantityFor} ${formatProductSize(sizeMl)}`} className="-ml-2 min-h-10 cursor-pointer rounded-lg px-2 text-left text-sm font-bold text-brand-plum hover:bg-brand-lilac-soft focus-visible:outline-[3px] focus-visible:outline-brand-purple">{formatProductSize(sizeMl)} <span className="block text-xs font-medium text-brand-muted">{formatMyceliumPrice(getProductPrice(product, sizeMl))}</span></button>
            <div className="flex items-center gap-2" role="group" aria-label={`${t.quantityFor} ${formatProductSize(sizeMl)}`}>
              <Button type="button" variant="outline" size="icon" disabled={(props.quantities[sizeMl] ?? 0) === 0} onClick={() => props.onChangeQuantity(sizeMl, -1)} aria-label={`${t.decrease} ${formatProductSize(sizeMl)}`} className="size-9 cursor-pointer rounded-full border-brand-lilac-control text-brand-plum hover:border-brand-plum hover:bg-brand-lilac-soft hover:text-brand-plum disabled:cursor-not-allowed"><Minus aria-hidden="true" /></Button>
              <span className="min-w-7 text-center font-bold tabular-nums" aria-live="polite">{props.quantities[sizeMl] ?? 0}</span>
              <Button type="button" variant="outline" size="icon" onClick={() => props.onChangeQuantity(sizeMl, 1)} aria-label={`${t.increase} ${formatProductSize(sizeMl)}`} className="size-9 cursor-pointer rounded-full border-brand-lilac-control text-brand-plum hover:border-brand-plum hover:bg-brand-lilac-soft hover:text-brand-plum"><Plus aria-hidden="true" /></Button>
            </div>
          </div>
        ))}
      </div>
      <p className="m-0 rounded-xl bg-brand-lilac-soft px-4 py-3 text-sm font-bold text-brand-plum" aria-live="polite">{t.totalVolume}: {formatMl(totals.volumeMl)} ml</p>
      <p className="m-0 text-sm font-bold text-brand-plum" aria-live="polite">{t.totalPrice}: {formatMyceliumPrice(totals.price)}</p>
    </>
  );
}
