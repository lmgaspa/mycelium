"use client";

import { useContext, useState } from "react";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCopy } from "@/i18n/useCopy";
import { useProductName } from "@/i18n/useProductName";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/CartContext";
import type { Product } from "@/data/products";

type ProductActionsProps = {
  product: Product;
  className?: string;
  compact?: boolean;
};

export default function ProductActions({ product, className, compact = false }: ProductActionsProps) {
  const t = useCopy("ProductActions");
  const productName = useProductName(product.slug, product.name);
  const locale = useLocale();
  const [step, setStep] = useState<"size" | "added" | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [addedQuantities, setAddedQuantities] = useState<Record<number, number>>({});
  const [reviewingAdded, setReviewingAdded] = useState(false);
  const cart = useContext(CartContext);
  const router = useRouter();

  const formatSize = (sizeMl: number) => sizeMl >= 1000 ? `${sizeMl / 1000} L` : `${sizeMl} ml`;
  const formatMl = (amount: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(amount);
  const totalMl = product.sizesMl.reduce((sum, sizeMl) => sum + sizeMl * (quantities[sizeMl] ?? 0), 0);
  const addedTotalMl = product.sizesMl.reduce((sum, sizeMl) => sum + sizeMl * (addedQuantities[sizeMl] ?? 0), 0);
  const changeQuantity = (sizeMl: number, delta: number) => {
    setQuantities((current) => ({ ...current, [sizeMl]: Math.max(0, (current[sizeMl] ?? 0) + delta) }));
  };

  const addProduct = () => {
    if (!cart || totalMl === 0) return;
    for (const sizeMl of product.sizesMl) {
      const quantity = quantities[sizeMl] ?? 0;
      const previousQuantity = reviewingAdded ? (addedQuantities[sizeMl] ?? 0) : 0;
      const difference = quantity - previousQuantity;
      if (difference > 0) cart.addToCart({ id: `mycelium:${product.slug}:${sizeMl}`, title: `${productName} · ${formatSize(sizeMl)}`, imageUrl: product.image, price: 0, quantity: difference, kind: "mycelium" });
      if (difference < 0) cart.updateQuantity(`mycelium:${product.slug}:${sizeMl}`, difference);
    }
    setAddedQuantities({ ...quantities });
    setReviewingAdded(false);
    setStep("added");
  };

  const closeDialog = () => { setReviewingAdded(false); setStep(null); };
  const reviewVolumes = () => { setQuantities({ ...addedQuantities }); setReviewingAdded(true); setStep("size"); };

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={() => { setQuantities({}); setReviewingAdded(false); setStep("size"); }} disabled={!cart} className="min-h-10 w-full cursor-pointer rounded-full bg-brand-plum px-4 font-bold text-white hover:bg-brand-purple disabled:cursor-not-allowed disabled:bg-[#d8cce5] disabled:text-brand-muted">
          <ShoppingBag aria-hidden="true" />{compact ? t.addShort : t.add}
        </Button>
      </div>
      <Dialog open={step !== null} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent showCloseButton={false} className="max-h-[calc(100svh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-[22px] border-[#e8ddf3] bg-white p-4 text-brand-ink shadow-[0_28px_80px_rgba(24,13,41,.3)] sm:max-w-lg sm:p-6">
          <button type="button" onClick={closeDialog} aria-label={t.close} className="absolute right-4 top-4 grid size-9 cursor-pointer place-items-center rounded-full text-brand-plum hover:bg-[#f1e9f9]"><X aria-hidden="true" className="size-5" /></button>
          {step === "size" ? (
            <>
              <DialogTitle className="pr-10 text-2xl font-black text-brand-plum">{t.chooseSize}</DialogTitle>
              <p className="m-0 text-sm text-brand-muted">{productName} · My Celium</p>
              <div className="grid max-h-[50svh] gap-2 overflow-y-auto py-2" aria-label={t.chooseSize}>
                {product.sizesMl.map((sizeMl) => (
                  <div key={sizeMl} className="flex min-h-14 items-center justify-between gap-2 rounded-xl border border-[#e8ddf3] bg-[#faf8fc] px-3 py-2 transition-colors duration-150 hover:border-brand-plum hover:bg-[#f3ebfa] sm:px-4">
                    <button type="button" onClick={() => changeQuantity(sizeMl, 1)} aria-label={`${t.quantityFor} ${formatSize(sizeMl)}`} className="-ml-2 min-h-10 cursor-pointer rounded-lg px-2 text-left text-sm font-bold text-brand-plum hover:bg-[#f1e9f9] hover:text-brand-plum focus-visible:outline-[3px] focus-visible:outline-brand-purple">{formatSize(sizeMl)}</button>
                    <div className="flex items-center gap-2" role="group" aria-label={`${t.quantityFor} ${formatSize(sizeMl)}`}>
                      <Button type="button" variant="outline" size="icon" disabled={(quantities[sizeMl] ?? 0) === 0} onClick={() => changeQuantity(sizeMl, -1)} aria-label={`${t.decrease} ${formatSize(sizeMl)}`} className="size-9 cursor-pointer rounded-full border-[#d9c6e7] text-brand-plum hover:border-brand-plum hover:bg-[#f1e9f9] hover:text-brand-plum disabled:cursor-not-allowed"><Minus aria-hidden="true" /></Button>
                      <span className="min-w-7 text-center font-bold tabular-nums" aria-live="polite">{quantities[sizeMl] ?? 0}</span>
                      <Button type="button" variant="outline" size="icon" onClick={() => changeQuantity(sizeMl, 1)} aria-label={`${t.increase} ${formatSize(sizeMl)}`} className="size-9 cursor-pointer rounded-full border-[#d9c6e7] text-brand-plum hover:border-brand-plum hover:bg-[#f1e9f9] hover:text-brand-plum"><Plus aria-hidden="true" /></Button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="m-0 rounded-xl bg-[#f1e9f9] px-4 py-3 text-sm font-bold text-brand-plum" aria-live="polite">{t.totalVolume}: {formatMl(totalMl)} ml</p>
              <Button type="button" onClick={addProduct} disabled={totalMl === 0} className="min-h-11 w-full cursor-pointer rounded-full bg-brand-plum font-bold text-white hover:bg-brand-purple"><ShoppingBag aria-hidden="true" />{reviewingAdded ? t.updateCart : t.add}</Button>
            </>
          ) : (
            <>
              <DialogTitle className="pr-10 text-2xl font-black text-brand-plum">{t.addedTitle}</DialogTitle>
              <p className="m-0 text-sm text-brand-muted">{t.addedDescription.replace("{product}", productName)}</p>
              <ul className="m-0 grid gap-1 pl-5 text-sm text-brand-ink">{product.sizesMl.filter((sizeMl) => (addedQuantities[sizeMl] ?? 0) > 0).map((sizeMl) => <li key={sizeMl}>{addedQuantities[sizeMl]} {addedQuantities[sizeMl] === 1 ? t.unitOf : t.unitsOf} {formatSize(sizeMl)}</li>)}</ul>
              <p className="m-0 rounded-xl bg-[#f1e9f9] px-4 py-3 text-sm font-bold text-brand-plum">{t.totalVolume}: {formatMl(addedTotalMl)} ml</p>
              <div className="mt-3 grid gap-2">
                <Button type="button" variant="outline" onClick={reviewVolumes} className="min-h-11 cursor-pointer rounded-full border-[#a9c88c] bg-[#eff7e7] font-bold text-[#28513a] transition-colors hover:border-[#5c8a53] hover:bg-[#d6eac5]! hover:text-[#28513a]!">{t.reviewVolumes}</Button>
                <Button type="button" variant="outline" onClick={closeDialog} className="min-h-11 cursor-pointer rounded-full border-brand-plum/30 bg-white font-bold text-brand-plum transition-colors hover:border-brand-plum hover:bg-[#ddc8f3]! hover:text-brand-plum!">{t.keepShopping}</Button>
                <Button type="button" onClick={() => { setStep(null); router.push("/cart"); }} className="min-h-11 cursor-pointer rounded-full bg-brand-plum font-bold text-white hover:bg-brand-purple">{t.goToCart}</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
