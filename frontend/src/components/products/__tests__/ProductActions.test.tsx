import { expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import ProductActions from "../ProductActions";
import { CartContext } from "@/context/CartContext";
import { products } from "@/data/products";
import pt from "../../../../messages/pt.json";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

it("adds multiple package sizes and updates the volume as quantities change", () => {
  const fetch = vi.spyOn(globalThis, "fetch");
  const addToCart = vi.fn();
  const updateQuantity = vi.fn();
  const pricedProduct = { ...products[0], pricesBySizeMl: { ...products[0].pricesBySizeMl, 100: 12.5, 500: 27 } };

  render(
    <NextIntlClientProvider locale="pt" messages={pt}>
      <CartContext.Provider value={{ cartItems: [], totalPrice: 0, addToCart, removeFromCart: vi.fn(), clearCart: vi.fn(), updateQuantity }}>
        <ProductActions product={pricedProduct} />
      </CartContext.Provider>
    </NextIntlClientProvider>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Adicionar ao carrinho" }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Aumentar 100 ml" }));
  fireEvent.click(screen.getByRole("button", { name: "Aumentar 500 ml" }));
  fireEvent.click(screen.getByRole("button", { name: "Aumentar 500 ml" }));
  expect(screen.getByText("Volume total: 1.100 ml")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Diminuir 500 ml" }));
  expect(screen.getByText("Volume total: 600 ml")).toBeInTheDocument();
  expect(screen.getByText("Preço total: R$ 39,50")).toBeInTheDocument();
  fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Adicionar ao carrinho" }));
  expect(addToCart).toHaveBeenCalledWith(expect.objectContaining({ id: "mycelium:raiz:100", price: 12.5, quantity: 1, kind: "mycelium" }));
  expect(addToCart).toHaveBeenCalledWith(expect.objectContaining({ id: "mycelium:raiz:500", price: 27, quantity: 1, kind: "mycelium" }));
  expect(screen.getByText("1 unidade de 500 ml")).toBeInTheDocument();
  expect(fetch).not.toHaveBeenCalled();
  expect(screen.getByText("Produto adicionado")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Revisar volumes" }));
  expect(screen.getByText("Volume total: 600 ml")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Diminuir 500 ml" }));
  fireEvent.click(screen.getByRole("button", { name: "Aumentar 100 ml" }));
  fireEvent.click(screen.getByRole("button", { name: "Atualizar carrinho" }));
  expect(updateQuantity).toHaveBeenCalledWith("mycelium:raiz:500", -1);
  expect(addToCart).toHaveBeenLastCalledWith(expect.objectContaining({ id: "mycelium:raiz:100", quantity: 1 }));
  expect(screen.getByText("2 unidades de 100 ml")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Finalizar pedido" }));
  expect(push).toHaveBeenCalledWith("/cart");
  fetch.mockRestore();
});

it("adds the selected size directly from the product page and shows persistent feedback", () => {
  const addToCart = vi.fn();
  const cart = { cartItems: [{ id: "mycelium:raiz:500", title: "Raiz · 500 ml", imageUrl: products[0].image, price: 0, quantity: 2, kind: "mycelium" as const }], totalPrice: 0, addToCart, removeFromCart: vi.fn(), clearCart: vi.fn(), updateQuantity: vi.fn() };
  const { rerender } = render(
    <NextIntlClientProvider locale="pt" messages={pt}>
      <CartContext.Provider value={cart}>
        <ProductActions product={products[0]} selectedSizeMl={500} />
      </CartContext.Provider>
    </NextIntlClientProvider>,
  );

  expect(screen.getByText("No carrinho: 2")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Aumentar 500 ml" }));
  fireEvent.click(screen.getByRole("button", { name: "Adicionar ao carrinho" }));
  expect(addToCart).toHaveBeenCalledWith(expect.objectContaining({ id: "mycelium:raiz:500", quantity: 2 }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("Adicionado ao carrinho: Raiz · 500 ml (quantidade: 2)");
  expect(screen.getByRole("link", { name: "Ver carrinho" })).toHaveAttribute("href", "/cart");

  rerender(
    <NextIntlClientProvider locale="pt" messages={pt}>
      <CartContext.Provider value={cart}>
        <ProductActions product={products[0]} selectedSizeMl={1000} />
      </CartContext.Provider>
    </NextIntlClientProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Adicionar ao carrinho" }));
  expect(addToCart).toHaveBeenLastCalledWith(expect.objectContaining({ id: "mycelium:raiz:1000", quantity: 1 }));
});
