"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "@/lib/router";
import CartTable from "@/components/cart/CartTable";
import CouponInput from "@/components/cart/CouponInput";
import CartSummary from "@/components/cart/CartSummary";
import { getStockByIds } from "@/api/stock";
import { useCoupon } from "@/hooks/useCoupon";
import { CartContext } from "@/context/CartContext";
import type { CartItem } from "@/context/CartTypes";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/i18n/useCopy";
import { useLocale } from "next-intl";

const CartPage = () => {
  const t = useCopy("Cart");
  const locale = useLocale();
  const cartContext = useContext(CartContext);
  const [stockById, setStockById] = useState<Record<string, number>>({});
  const navigate = useNavigate();
  const { 
    applyCoupon, 
    getDiscountAmount, 
    isValid: couponValid, 
    inputValue, 
    setInputValue,
    isValidating
  } = useCoupon();

  if (!cartContext) {
    throw new Error("CartPage must be used within a CartProvider");
  }

  const { cartItems, updateQuantity: updateQuantityContext, removeFromCart, totalPrice } = cartContext;
  const subtotal = totalPrice;
  const hasMyceliumProducts = cartItems.some((item) => item.kind === "mycelium");
  const myceliumVolumeMl = cartItems.reduce((total, item) => {
    if (item.kind !== "mycelium") return total;
    const sizeMl = Number(item.id.split(":").at(-1));
    return total + (Number.isFinite(sizeMl) && sizeMl > 0 ? sizeMl * item.quantity : 0);
  }, 0);

  const initializedRef = useRef(false);

  // Carrega estoque e valida carrinho ao montar
  useEffect(() => {
    if (initializedRef.current || cartItems.length === 0) return;
    initializedRef.current = true;

    (async () => {
      const ids = cartItems.filter((i) => i.kind !== "mycelium").map((i) => i.id);
      const stockMap = await getStockByIds(ids);
      const stockDict = Object.fromEntries(
        ids.map((id) => [id, Math.max(0, stockMap[id]?.stock ?? 0)])
      );
      setStockById(stockDict);

      // Valida e ajusta quantidades baseado no estoque
      const fixed = cartItems
        .map((i) => {
          if (i.kind === "mycelium") return i;
          const s = stockDict[i.id] ?? 0;
          const qty = Math.min(i.quantity, Math.max(0, s));
          return { ...i, quantity: qty };
        })
        .filter((i) => i.quantity > 0);

      // Se houve ajustes, atualiza o contexto
      if (
        fixed.length !== cartItems.length ||
        fixed.some((f, idx) => f.quantity !== cartItems[idx]?.quantity)
      ) {
        // Ajusta quantidades no contexto
        fixed.forEach((item) => {
          const current = cartItems.find((c) => c.id === item.id);
          if (current && current.quantity !== item.quantity) {
            const delta = item.quantity - current.quantity;
            updateQuantityContext(item.id, delta);
          }
        });
        // Remove itens que ficaram sem estoque
        cartItems.forEach((item) => {
          if (!fixed.find((f) => f.id === item.id)) {
            removeFromCart(item.id);
          }
        });
        alert(t.stockAdjusted);
      }
    })();
  }, [cartItems, updateQuantityContext, removeFromCart, t.stockAdjusted]);

  const updateQuantity = (itemId: string, amount: number) => {
    const max = cartItems.find((item) => item.id === itemId)?.kind === "mycelium" ? Infinity : stockById[itemId] ?? Infinity;
    const currentItem = cartItems.find((i) => i.id === itemId);
    if (!currentItem) return;

    const next = currentItem.quantity + amount;
    if (amount > 0 && next > max) {
      alert(t.stockExceeded);
      return;
    }
    if (next <= 0) {
      removeFromCart(itemId);
      return;
    }
    updateQuantityContext(itemId, amount);
  };

  const removeItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleApplyCoupon = async (): Promise<{ success: boolean; discountAmount?: number }> => {
    // Converter cartItems para o formato esperado pelo backend
    const cartItemsForValidation = cartItems.map(item => ({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl
    }));
    
    const result = await applyCoupon(inputValue, subtotal, cartItemsForValidation);
    if (result.success && result.discountAmount !== undefined) {
      // Usar o valor retornado pela API, mas limitado a R$ 15
      const maxDiscount = 15.00;
      const actualDiscount = Math.min(result.discountAmount, maxDiscount);
      alert(t.couponApplied.replace("{amount}", new Intl.NumberFormat(locale, { style: "currency", currency: "BRL" }).format(actualDiscount)));
    }
    return result;
  };

  const handleCheckout = () => {
    alert(t.finalizing);
    navigate("/checkout");
  };

  return (
    <div className={cartItems.length === 0 ? "mx-auto mt-4 mb-5 w-[min(760px,calc(100%_-_32px))] rounded-[22px] border border-[#e8ddf3] bg-white px-5 py-5 shadow-[0_10px_28px_rgba(43,15,72,.06)] sm:mt-6 sm:mb-8 sm:px-7 sm:py-6" : "mx-auto mt-4 mb-5 w-[calc(100%_-_32px)] max-w-[1336px] rounded-[22px] border border-[#e8ddf3] bg-white px-4 py-5 shadow-[0_10px_28px_rgba(43,15,72,.06)] sm:mt-6 sm:mb-8 sm:w-[calc(100%_-_48px)] sm:px-6 sm:py-8 lg:w-[calc(100%_-_64px)] lg:px-8"}>
      <h1 className={cartItems.length === 0 ? "mb-4 text-[clamp(26px,5vw,36px)] font-bold leading-tight text-brand-ink sm:mb-5" : "mb-5 text-[clamp(26px,5vw,36px)] font-bold leading-tight text-brand-ink sm:mb-8"}>{t.title}</h1>
      {cartItems.length === 0 ? (
        <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-[#e5d9f1] bg-[#f8f4fc] px-5 py-6 text-center shadow-sm">
          <span className="mb-3 grid size-12 place-items-center rounded-xl bg-[#e9ddf6] text-brand-plum"><ShoppingBag aria-hidden="true" className="size-6" /></span>
          <p className="mb-4 max-w-md text-sm leading-relaxed text-brand-muted">{t.empty}</p>
          <Button asChild className="min-h-11 cursor-pointer rounded-full bg-brand-plum px-6 font-bold text-white hover:bg-brand-purple">
            <Link href="/products">{t.explore}<ArrowRight aria-hidden="true" /></Link>
          </Button>
        </div>
      ) : (
        <>
          <CartTable items={cartItems} onQuantityChange={updateQuantity} onRemoveItem={removeItem} />
          {hasMyceliumProducts && <p className="mb-4 rounded-xl bg-[#f1e9f9] px-4 py-3 font-bold text-brand-plum sm:mb-6" aria-live="polite">{t.totalVolume}: {new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(myceliumVolumeMl)} ml</p>}

          <div className="mb-3 flex flex-col gap-4 sm:mb-8 lg:flex-row">
            {!hasMyceliumProducts && <div className="w-full lg:w-1/2">
              <CouponInput 
                value={inputValue} 
                onChange={setInputValue} 
                onApply={handleApplyCoupon}
                isValidating={isValidating}
                isValid={couponValid}
                discount={getDiscountAmount(subtotal)}
              />
              {couponValid && (
                <div className="text-green-600 text-sm mt-2">
                  ✓ {t.couponApplied.replace("{amount}", new Intl.NumberFormat(locale, { style: "currency", currency: "BRL" }).format(getDiscountAmount(subtotal)))}
                </div>
              )}
            </div>}
            <div className="w-full lg:ml-auto lg:w-1/2">
              {hasMyceliumProducts ? <Button type="button" onClick={handleCheckout} className="min-h-11 w-full cursor-pointer rounded-full bg-brand-plum px-6 font-bold text-white hover:bg-[#57258e]">{t.finishOrder}</Button> : <CartSummary subtotal={subtotal} discount={getDiscountAmount(subtotal)} onCheckout={handleCheckout} />}
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="min-h-11 w-full cursor-pointer rounded-full border border-[#cdb7e7] bg-[#e9def6] px-6 py-2 font-bold text-brand-plum shadow-sm transition-colors hover:border-brand-purple hover:bg-[#d8c4ef] sm:w-auto"
          >
            {t.continueShopping}
          </button>
        </>
      )}
      {cartItems.length > 0 && !hasMyceliumProducts && <div className="text-right text-xl font-bold mt-4">
        {t.total}: {new Intl.NumberFormat(locale, { style: "currency", currency: "BRL" }).format(subtotal - getDiscountAmount(subtotal))}
      </div>}
    </div>
  );
};

export default CartPage;
