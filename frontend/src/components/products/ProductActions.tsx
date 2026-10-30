"use client";

import { useContext, useState } from "react";
import { Check, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCopy } from "@/i18n/useCopy";
import { useProductName } from "@/i18n/useProductName";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CartContext } from "@/context/CartContext";
import { getProductPrice, type Product } from "@/data/products";
import { formatMyceliumPrice } from "@/utils/formatPrice";
import ProductVolumeSelector, { formatProductSize, getVolumeTotals } from "@/components/products/ProductVolumeSelector";

type ProductActionsProps = {
  product: Product;
  className?: string;
  compact?: boolean;
  selectedSizeMl?: number;
};

export default function ProductActions({ product, className, compact = false, selectedSizeMl }: ProductActionsProps) {
  const t = useCopy("ProductActions");
  const productName = useProductName(product.slug, product.name);
  const locale = useLocale();
  const [step, setStep] = useState<"size" | "added" | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [addedQuantities, setAddedQuantities] = useState<Record<number, number>>({});
  const [reviewingAdded, setReviewingAdded] = useState(false);
  const [detailQuantities, setDetailQuantities] = useState<Record<number, number>>({});
  const [lastAddition, setLastAddition] = useState<{ sizeMl: number; quantity: number } | null>(null);
  const cart = useContext(CartContext);
  const router = useRouter();

  const formatMl = (amount: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(amount);
  const { volumeMl: totalMl } = getVolumeTotals(product, quantities);
  const { volumeMl: addedTotalMl, price: addedTotalPrice } = getVolumeTotals(product, addedQuantities);
  const changeQuantity = (sizeMl: number, delta: number) => {
    setQuantities((current) => ({ ...current, [sizeMl]: Math.max(0, (current[sizeMl] ?? 0) + delta) }));
  };

  const addProduct = () => {
    if (!cart || totalMl === 0) return;
    for (const sizeMl of product.sizesMl) {
      const quantity = quantities[sizeMl] ?? 0;
      const previousQuantity = reviewingAdded ? (addedQuantities[sizeMl] ?? 0) : 0;
      const difference = quantity - previousQuantity;
      if (difference > 0) cart.addToCart({ id: `mycelium:${product.slug}:${sizeMl}`, title: `${productName} · ${formatProductSize(sizeMl)}`, imageUrl: product.image, price: getProductPrice(product, sizeMl), quantity: difference, kind: "mycelium" });
      if (difference < 0) cart.updateQuantity(`mycelium:${product.slug}:${sizeMl}`, difference);
    }
    setAddedQuantities({ ...quantities });
    setReviewingAdded(false);
    setStep("added");
  };

  const closeDialog = () => { setReviewingAdded(false); setStep(null); };
  const reviewVolumes = () => { setQuantities({ ...addedQuantities }); setReviewingAdded(true); setStep("size"); };

  if (selectedSizeMl !== undefined) {
    const quantity = detailQuantities[selectedSizeMl] ?? 1;
    const size = formatProductSize(selectedSizeMl);
    const cartQuantity = cart?.cartItems.find((item) => item.id === `mycelium:${product.slug}:${selectedSizeMl}`)?.quantity ?? 0;
    const changeDetailQuantity = (delta: number) => setDetailQuantities((current) => ({
      ...current,
      [selectedSizeMl]: Math.max(1, (current[selectedSizeMl] ?? 1) + delta),
    }));
    const addSelectedSize = () => {
      if (!cart) return;
      cart.addToCart({
        id: `mycelium:${product.slug}:${selectedSizeMl}`,
        title: `${productName} · ${size}`,
        imageUrl: product.image,
        price: getProductPrice(product, selectedSizeMl),
        quantity,
        kind: "mycelium",
      });
      setLastAddition({ sizeMl: selectedSizeMl, quantity });
    };

    return (
      <div className={`${className ?? ""} @container`}>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-brand-lilac-border bg-white px-4 py-3 sm:px-5">
          <div>
            <p className="m-0 text-sm font-bold text-brand-plum">{t.quantityFor} {size}</p>
            {cartQuantity > 0 && <p className="m-0 mt-1 text-xs font-semibold text-brand-muted" aria-live="polite">{t.inCart}: {cartQuantity}</p>}
          </div>
          <div className="flex items-center gap-2" role="group" aria-label={`${t.quantityFor} ${size}`}>
            <Button type="button" variant="outline" size="icon" disabled={quantity <= 1} onClick={() => changeDetailQuantity(-1)} aria-label={`${t.decrease} ${size}`} className="size-10 cursor-pointer rounded-full border-brand-lilac-control text-brand-plum hover:border-brand-plum hover:bg-brand-lilac-soft hover:text-brand-plum disabled:cursor-not-allowed"><Minus aria-hidden="true" /></Button>
            <span className="min-w-8 text-center font-bold tabular-nums text-brand-plum" aria-live="polite">{quantity}</span>
            <Button type="button" variant="outline" size="icon" onClick={() => changeDetailQuantity(1)} aria-label={`${t.increase} ${size}`} className="size-10 cursor-pointer rounded-full border-brand-lilac-control text-brand-plum hover:border-brand-plum hover:bg-brand-lilac-soft hover:text-brand-plum"><Plus aria-hidden="true" /></Button>
          </div>
        </div>
        <Button type="button" onClick={addSelectedSize} disabled={!cart} className="mt-3 min-h-11 w-full cursor-pointer rounded-full bg-brand-plum px-4 font-bold text-white hover:bg-brand-purple disabled:cursor-not-allowed disabled:bg-[#d8cce5] disabled:text-brand-muted"><ShoppingBag aria-hidden="true" />{t.add}</Button>
        {lastAddition && (
          <div role="status" className="mt-3 flex flex-col items-stretch gap-3 rounded-[18px] border border-brand-lilac-border bg-brand-lilac-soft px-4 py-3 text-sm text-brand-plum sm:px-5 @min-[520px]:flex-row @min-[520px]:items-center @min-[520px]:justify-between">
            <span className="flex items-center gap-2 font-bold"><Check aria-hidden="true" className="size-5 shrink-0" />{t.addedInline.replace("{product}", productName).replace("{size}", formatProductSize(lastAddition.sizeMl)).replace("{quantity}", String(lastAddition.quantity))}</span>
            <Button asChild variant="link" className="h-auto w-full justify-center p-0 text-center font-bold text-brand-plum underline underline-offset-4 hover:text-brand-purple @min-[520px]:w-auto"><Link href="/cart">{t.viewCart}</Link></Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={() => { setQuantities(selectedSizeMl === undefined ? {} : { [selectedSizeMl]: 1 }); setReviewingAdded(false); setStep("size"); }} disabled={!cart} className="min-h-10 w-full cursor-pointer rounded-full bg-brand-plum px-4 font-bold text-white hover:bg-brand-purple disabled:cursor-not-allowed disabled:bg-[#d8cce5] disabled:text-brand-muted">
          <ShoppingBag aria-hidden="true" />{compact ? t.addShort : t.add}
        </Button>
      </div>
      <Dialog open={step !== null} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent showCloseButton={false} className="max-h-[calc(100svh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-[22px] border-brand-lilac-border bg-white p-4 text-brand-ink shadow-[0_28px_80px_rgba(24,13,41,.3)] sm:max-w-lg sm:p-6">
          <button type="button" onClick={closeDialog} aria-label={t.close} className="absolute right-4 top-4 grid size-9 cursor-pointer place-items-center rounded-full text-brand-plum hover:bg-brand-lilac-soft"><X aria-hidden="true" className="size-5" /></button>
          {step === "size" ? (
            <>
              <DialogTitle className="pr-10 text-2xl font-black text-brand-plum">{t.chooseSize}</DialogTitle>
              <p className="m-0 text-sm text-brand-muted">{productName} · My Celium</p>
              <ProductVolumeSelector product={product} mode="quantities" quantities={quantities} onChangeQuantity={changeQuantity} />
              <Button type="button" onClick={addProduct} disabled={totalMl === 0} className="min-h-11 w-full cursor-pointer rounded-full bg-brand-plum font-bold text-white hover:bg-brand-purple"><ShoppingBag aria-hidden="true" />{reviewingAdded ? t.updateCart : t.add}</Button>
            </>
          ) : (
            <>
              <DialogTitle className="pr-10 text-2xl font-black text-brand-plum">{t.addedTitle}</DialogTitle>
              <p className="m-0 text-sm text-brand-muted">{t.addedDescription.replace("{product}", productName)}</p>
              <ul className="m-0 grid gap-1 pl-5 text-sm text-brand-ink">{product.sizesMl.filter((sizeMl) => (addedQuantities[sizeMl] ?? 0) > 0).map((sizeMl) => <li key={sizeMl}>{addedQuantities[sizeMl]} {addedQuantities[sizeMl] === 1 ? t.unitOf : t.unitsOf} {formatProductSize(sizeMl)}</li>)}</ul>
              <p className="m-0 rounded-xl bg-brand-lilac-soft px-4 py-3 text-sm font-bold text-brand-plum">{t.totalVolume}: {formatMl(addedTotalMl)} ml</p>
              <p className="m-0 text-sm font-bold text-brand-plum">{t.totalPrice}: {formatMyceliumPrice(addedTotalPrice)}</p>
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
