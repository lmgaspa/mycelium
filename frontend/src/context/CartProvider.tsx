import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { CartContextType, CartItem } from "./CartTypes";
import { CartContext } from "./CartContext";
import { cookieStorage } from "../utils/cookieUtils";
import { getProduct, getProductPrice } from "@/data/products";

const currentProductPrice = (item: CartItem): CartItem => {
  if (item.kind !== "mycelium") return item;
  const [, slug, rawSizeMl] = item.id.split(":");
  const product = getProduct(slug);
  const sizeMl = Number(rawSizeMl);
  if (!product || !product.sizesMl.includes(sizeMl)) return item;
  return { ...item, price: getProductPrice(product, sizeMl) };
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    cookieStorage.get<CartItem[]>("cart", []).map(currentProductPrice)
  );

  useEffect(() => {
    cookieStorage.set("cart", cartItems);
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, price: item.price, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) => {
      const updated = prev
        .map((item) => {
          if (item.id !== id) return item;
          const next = item.quantity + delta;
          if (next <= 0) return null;
          return { ...item, quantity: next };
        })
        .filter((item): item is CartItem => item !== null);
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const value: CartContextType = {
    cartItems,
    totalPrice,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
};
