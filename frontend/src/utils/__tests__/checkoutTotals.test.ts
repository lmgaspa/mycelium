import { describe, expect, it } from "vitest";
import { calculateCheckoutTotals } from "../checkoutTotals";

describe("calculateCheckoutTotals", () => {
  it("uses item prices, shipping and discount for both payment methods", () => {
    expect(calculateCheckoutTotals([
      { price: 12.5, quantity: 2 },
      { price: 7, quantity: 1 },
    ], 22, 5)).toEqual({
      subtotal: 32,
      shipping: 22,
      discount: 5,
      totalBeforeDiscount: 54,
      total: 49,
    });
  });

  it("keeps shipping in the total when product prices are not yet defined", () => {
    expect(calculateCheckoutTotals([{ price: 0, quantity: 2 }], 22, 0).total).toBe(22);
  });
});
