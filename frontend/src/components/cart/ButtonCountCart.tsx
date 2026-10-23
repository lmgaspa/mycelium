"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/i18n/useCopy";

type ButtonCountCartProps = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  allowZero?: boolean;
  maxQuantity?: number;
};

export default function ButtonCountCart({ quantity, onDecrease, onIncrease, allowZero = false, maxQuantity }: ButtonCountCartProps) {
  const t = useCopy("Quantity");
  const buttonClass = "size-9 cursor-pointer rounded-full border-[#d9c6e7] bg-white text-brand-plum hover:bg-[#f1e9f9] hover:text-brand-plum disabled:cursor-not-allowed";

  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label={t.quantity}>
      <Button type="button" variant="outline" size="icon" className={buttonClass} onClick={onDecrease} disabled={quantity <= (allowZero ? 0 : 1)} aria-label={t.decrease}>
        <Minus aria-hidden="true" />
      </Button>
      <span className="min-w-7 text-center text-base font-bold tabular-nums text-brand-ink" aria-live="polite">{quantity}</span>
      <Button type="button" variant="outline" size="icon" className={buttonClass} onClick={onIncrease} disabled={maxQuantity !== undefined && quantity >= maxQuantity} aria-label={t.increase}>
        <Plus aria-hidden="true" />
      </Button>
    </div>
  );
}
