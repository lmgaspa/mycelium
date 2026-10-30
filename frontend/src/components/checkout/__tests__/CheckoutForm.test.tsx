import { expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import CheckoutForm from "../CheckoutForm";
import pt from "../../../../messages/pt.json";

const navigate = vi.fn();
vi.mock("@/lib/router", () => ({ useNavigate: () => navigate }));

const completeForm = {
  firstName: "Ana", lastName: "Silva", cpf: "123.456.789-00", country: "Brasil",
  cep: "12345-678", address: "Rua A", number: "10", complement: "",
  district: "Centro", city: "São Paulo", state: "SP", phone: "(11)91234-5678",
  email: "ana@example.com", note: "", delivery: "", payment: "pix",
};

it("enables Pix payment only when required checkout fields are complete", () => {
  const props = {
    cartItems: [{ id: "book", title: "Book", imageUrl: "/book.jpg", price: 10, quantity: 1 }],
    total: 10, shipping: 0, discount: 0, coupon: "", setCoupon: vi.fn(),
    handleApplyCoupon: vi.fn(async () => ({ success: false })), couponValid: false,
    handleChange: vi.fn(), updateQuantity: vi.fn(), removeItem: vi.fn(), onNavigateBack: vi.fn(),
  };
  const { rerender } = render(
    <NextIntlClientProvider locale="pt" messages={pt}>
      <CheckoutForm {...props} form={{ ...completeForm, firstName: "" }} />
    </NextIntlClientProvider>,
  );

  expect(screen.getByRole("button", { name: "Finalizar pagamento por Pix" })).toBeDisabled();

  rerender(
    <NextIntlClientProvider locale="pt" messages={pt}>
      <CheckoutForm {...props} form={completeForm} />
    </NextIntlClientProvider>,
  );

  expect(screen.getByRole("button", { name: "Finalizar pagamento por Pix" })).toBeEnabled();
});

it("saves the displayed shipping before navigating to Pix", async () => {
  const { cookieStorage } = await import("@/utils/cookieUtils");
  const setCookie = vi.spyOn(cookieStorage, "set");
  navigate.mockClear();
  render(
    <NextIntlClientProvider locale="pt" messages={pt}>
      <CheckoutForm
        cartItems={[{ id: "solo", title: "Solo", imageUrl: "/solo.webp", price: 0, quantity: 1 }]}
        total={22} shipping={22} discount={0} coupon="" setCoupon={vi.fn()}
        handleApplyCoupon={vi.fn(async () => ({ success: false }))} couponValid={false}
        form={completeForm} handleChange={vi.fn()} updateQuantity={vi.fn()}
        removeItem={vi.fn()} onNavigateBack={vi.fn()}
      />
    </NextIntlClientProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Finalizar pagamento por Pix" }));
  expect(setCookie).toHaveBeenCalledWith("checkoutForm", expect.objectContaining({ shipping: 22 }));
  expect(navigate).toHaveBeenCalledWith("/payment/pix");
  setCookie.mockRestore();
});
