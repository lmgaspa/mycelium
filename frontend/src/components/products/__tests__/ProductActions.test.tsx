import { afterEach, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import ProductActions from "../ProductActions";
import pt from "../../../../messages/pt.json";

function renderActions(onAdd?: (quantity: number) => void) {
  return render(
    <NextIntlClientProvider locale="pt" messages={pt}>
      <ProductActions productSlug="raiz" onAdd={onAdd} />
    </NextIntlClientProvider>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

it("hides quantity controls and shows contact when stock is zero", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ stock: 0 }) }));
  renderActions();

  expect(await screen.findByText(/Esse produto está esgotado!/)).toBeInTheDocument();
  expect(screen.queryByRole("group", { name: "Quantidade" })).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Contato" })).toHaveAttribute("href", "/support");
});

it("stops increasing at the stock limit", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ estoque: 2 }) }));
  renderActions();

  const increase = await screen.findByRole("button", { name: "Aumentar quantidade" });
  fireEvent.click(increase);
  expect(screen.getByText("2")).toBeInTheDocument();
  expect(increase).toBeDisabled();
  expect(screen.getByRole("button", { name: "Adicionar ao carrinho" })).toBeDisabled();
});

it("treats a request without a response after three seconds as unavailable", async () => {
  vi.useFakeTimers();
  vi.stubGlobal("fetch", vi.fn((_url, options: RequestInit) => new Promise((_resolve, reject) => {
    options.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
  })));
  renderActions();

  await act(async () => {
    await vi.advanceTimersByTimeAsync(3000);
  });

  expect(screen.getByText(/Esse produto está esgotado!/)).toBeInTheDocument();
  expect(screen.queryByRole("group", { name: "Quantidade" })).not.toBeInTheDocument();
});
