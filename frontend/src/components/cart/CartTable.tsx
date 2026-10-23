import React from 'react';
import type { CartItem } from '../../context/CartTypes';
import ButtonCountCart from './ButtonCountCart';
import { formatPrice } from '../../utils/formatPrice';
import { useCopy } from '@/i18n/useCopy';

interface CartTableProps {
  items: CartItem[];
  onQuantityChange: (itemId: string, amount: number) => void;
  onRemoveItem: (itemId: string) => void;
}

const CartTable: React.FC<CartTableProps> = ({
  items,
  onQuantityChange,
  onRemoveItem,
}) => {
  const t = useCopy('Cart');
  const names = useCopy('ProductNames');
  const itemTitle = (item: CartItem) => {
    if (item.kind !== 'mycelium') return item.title;
    const [, slug, size] = item.id.split(':');
    const name = names[slug as keyof typeof names];
    const sizeMl = Number(size);
    if (!name || !Number.isFinite(sizeMl) || sizeMl <= 0) return item.title;
    return `${name} · ${sizeMl >= 1000 ? `${sizeMl / 1000} L` : `${sizeMl} ml`}`;
  };
  return (
    <>
      {/* TABLE - Desktop only */}
      <div className="hidden sm:block overflow-x-auto mb-8">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#eee6f7] font-bold text-brand-plum">
              <th className="p-4">Produto</th>
              <th className="p-4">Preço</th>
              <th className="p-4">Quantidade</th>
              <th className="p-4">Subtotal</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-300">
                <td className="p-4 flex items-center gap-4">
                  <img
                    src={item.imageUrl}
                    alt={`Imagem do produto ${itemTitle(item)}`}
                    className="w-16 h-20 rounded-md shadow-md"
                  />
                  <span className="text-text-primary">{itemTitle(item)}</span>
                </td>
                <td className="p-4 text-text-primary">
                  {item.kind === 'mycelium' ? t.priceOnRequest : formatPrice(item.price)}
                </td>
                <td className="p-4">
                  <ButtonCountCart
                    quantity={item.quantity}
                    onDecrease={() => onQuantityChange(item.id, -1)}
                    onIncrease={() => onQuantityChange(item.id, 1)}
                    allowZero={true}
                  />
                </td>
                <td className="p-4 text-text-primary">
                  {item.kind === 'mycelium' ? t.priceOnRequest : formatPrice(item.price * item.quantity)}
                </td>
                <td className="p-4">
                  <button
                    type="button"
                    className="text-error hover:text-red-400 transition"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CARD - Mobile only */}
      <div className="sm:hidden flex flex-col gap-4 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded shadow-md p-4 flex flex-col gap-3"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.imageUrl}
                alt={`Imagem do produto ${itemTitle(item)}`}
                className="w-20 h-auto rounded-md shadow"
              />
              <div>
                <p className="font-medium text-sm">{itemTitle(item)}</p>
                <p className="text-primary font-semibold mt-1">
                  {item.kind === 'mycelium' ? t.priceOnRequest : formatPrice(item.price)}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Quantidade:</span>
              <ButtonCountCart
                quantity={item.quantity}
                onDecrease={() => onQuantityChange(item.id, -1)}
                onIncrease={() => onQuantityChange(item.id, 1)}
                allowZero={true}
              />
            </div>

            <div className="text-sm text-right">
              Subtotal:{' '}
              <span className="font-bold">
                {item.kind === 'mycelium' ? t.priceOnRequest : formatPrice(item.price * item.quantity)}
              </span>
            </div>

            <button
              type="button"
              className="text-error mt-2 underline text-sm self-end"
              onClick={() => onRemoveItem(item.id)}
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default CartTable;
