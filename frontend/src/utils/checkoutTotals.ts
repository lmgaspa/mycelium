type PricedItem = { price: number; quantity: number };

export function calculateCheckoutTotals(items: readonly PricedItem[], shipping: number, discount: number) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalBeforeDiscount = subtotal + shipping;
  return { subtotal, shipping, discount, totalBeforeDiscount, total: totalBeforeDiscount - discount };
}
