// src/components/OrderSummary.tsx
import { formatMyceliumPrice } from "@/utils/formatPrice";

type OrderSummaryProps = {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  useMyceliumPrices?: boolean;
};

export function OrderSummary({
  subtotal,
  shipping,
  discount,
  total,
  useMyceliumPrices = false,
}: OrderSummaryProps) {
  const money = (amount: number) => useMyceliumPrices ? formatMyceliumPrice(amount) : `R$ ${amount.toFixed(2).replace(".", ",")}`;
  return (
    <div className="bg-gray-50 p-4 mb-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Resumo do Pedido</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{money(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Frete:</span>
          <span>{money(shipping)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Desconto:</span>
            <span>-{money(discount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total:</span>
          <span>{money(total)}</span>
        </div>
      </div>
    </div>
  );
}
