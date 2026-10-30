import { expect, it, vi } from "vitest";
import { act, useContext } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { waitFor } from "@testing-library/react";
import { CartContext } from "../CartContext";
import { CartProvider } from "../CartProvider";
import { cookieStorage } from "@/utils/cookieUtils";

function CartCount() {
  const cart = useContext(CartContext);
  return <span>{cart?.cartItems.reduce((total, item) => total + item.quantity, 0) ?? 0}</span>;
}

it("hydrates with the same empty cart markup before restoring saved items", async () => {
  const savedItem = { id: "mycelium:raiz:500", title: "Raiz · 500 ml", imageUrl: "/images/products/raiz.webp", price: 0, quantity: 2, kind: "mycelium" as const };
  cookieStorage.set("cart", [savedItem]);
  const recoverableError = vi.fn();
  const element = <CartProvider><CartCount /></CartProvider>;
  const container = document.createElement("div");
  container.innerHTML = renderToString(element);
  document.body.appendChild(container);

  expect(container).toHaveTextContent("0");
  const root = hydrateRoot(container, element, { onRecoverableError: recoverableError });
  try {
    await waitFor(() => expect(container).toHaveTextContent("2"));
    expect(recoverableError).not.toHaveBeenCalled();
    expect(cookieStorage.get("cart", [])).toEqual([savedItem]);
  } finally {
    await act(async () => root.unmount());
    container.remove();
    cookieStorage.remove("cart");
  }
});
