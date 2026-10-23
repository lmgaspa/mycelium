"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ButtonCountCart from "@/components/cart/ButtonCountCart";
import { useCopy } from "@/i18n/useCopy";
import { buildApiUrl } from "@/api/http";

type ProductActionsProps = {
  productSlug: string;
  onAdd?: (quantity: number) => void;
  className?: string;
  compact?: boolean;
};

type StockResponse = { stock?: number; estoque?: number };

export default function ProductActions({ productSlug, onAdd, className, compact = false }: ProductActionsProps) {
  const t = useCopy("ProductActions");
  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 3000);
    setLoading(true);
    setStock(null);

    fetch(buildApiUrl(`/products/${encodeURIComponent(productSlug)}/stock`), { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Stock request failed");
        return response.json() as Promise<StockResponse>;
      })
      .then((data) => {
        if (!active) return;
        const value = data.stock ?? data.estoque;
        const nextStock = typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
        setStock(nextStock);
        setQuantity((current) => Math.max(1, Math.min(current, nextStock)));
      })
      .catch(() => {
        if (active) setStock(0);
      })
      .finally(() => {
        window.clearTimeout(timeout);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [productSlug]);

  if (loading) return <p className={`text-sm text-brand-muted ${className ?? ""}`} role="status">{t.checkingStock}</p>;

  if (!stock) {
    return (
      <div className={className}>
        <p className="mt-0 mb-3 text-sm font-semibold leading-relaxed text-[#a11d2b]" role="status">{t.soldOut}</p>
        <Button asChild variant="outline" className="min-h-9 cursor-pointer rounded-full border-brand-plum/30 bg-white px-4 font-bold text-brand-plum hover:bg-[#f1e9f9] hover:text-brand-plum">
          <Link href="/support">{t.contact}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3">
        <ButtonCountCart
          quantity={quantity}
          onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
          onIncrease={() => setQuantity((current) => Math.min(stock, current + 1))}
          maxQuantity={stock}
        />
        <Button type="button" onClick={() => onAdd?.(quantity)} disabled={!onAdd} className="min-h-10 flex-1 cursor-pointer rounded-full bg-brand-plum px-4 font-bold text-white hover:bg-brand-purple disabled:cursor-not-allowed disabled:bg-[#d8cce5] disabled:text-brand-muted">
          <ShoppingBag aria-hidden="true" />{compact ? t.addShort : t.add}
        </Button>
      </div>
      {!onAdd && <p className="mt-2 mb-0 text-xs leading-snug text-brand-muted">{t.pending}</p>}
    </div>
  );
}
