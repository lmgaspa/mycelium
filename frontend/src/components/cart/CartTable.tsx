import React from 'react';
import type { CartItem } from '../../context/CartTypes';
import ButtonCountCart from './ButtonCountCart';
import { useCopy } from '@/i18n/useCopy';
import { useLocale } from 'next-intl';
import { formatMyceliumPrice } from '@/utils/formatPrice';

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
  const locale = useLocale();
  const money = (amount: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' }).format(amount);
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
      {/* TABLE - Wide screens only */}
      <div className="mb-8 hidden overflow-x-auto min-[1100px]:block">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#eee6f7] font-bold text-brand-plum">
              <th className="p-4">{t.product}</th>
              <th className="p-4">{t.price}</th>
              <th className="p-4">{t.quantity}</th>
              <th className="p-4">{t.subtotal}</th>
              <th className="p-4">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-300">
                <td className="p-4 flex items-center gap-4">
                  <img
                    src={item.imageUrl}
                    alt={t.productImageAlt.replace("{name}", itemTitle(item))}
                    className="w-16 h-20 rounded-md shadow-md"
                  />
                  <span className="text-text-primary">{itemTitle(item)}</span>
                </td>
                <td className="p-4 text-text-primary">
                  {item.kind === 'mycelium' ? formatMyceliumPrice(item.price) : money(item.price)}
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
                  {item.kind === 'mycelium' ? formatMyceliumPrice(item.price * item.quantity) : money(item.price * item.quantity)}
                </td>
                <td className="p-4">
                  <button
                    type="button"
                    className="text-error hover:text-red-400 transition"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    {t.remove}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards on phones and tablets */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4 min-[1100px]:hidden">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex min-w-0 flex-col gap-2 rounded-xl border border-[#e8ddf3] bg-white p-4 shadow-sm sm:gap-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={item.imageUrl}
                alt={t.productImageAlt.replace("{name}", itemTitle(item))}
                className="h-20 w-16 shrink-0 rounded-md bg-white object-contain shadow-sm"
              />
              <div className="min-w-0">
                <p className="break-words text-sm font-semibold text-brand-ink">{itemTitle(item)}</p>
                <p className="text-primary font-semibold mt-1">
                  {item.kind === 'mycelium' ? formatMyceliumPrice(item.price) : money(item.price)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold">{t.quantity}:</span>
              <ButtonCountCart
                quantity={item.quantity}
                onDecrease={() => onQuantityChange(item.id, -1)}
                onIncrease={() => onQuantityChange(item.id, 1)}
                allowZero={true}
              />
            </div>

            <div className="break-words text-right text-sm">
              {t.subtotal}:{' '}
              <span className="font-bold">
                {item.kind === 'mycelium' ? formatMyceliumPrice(item.price * item.quantity) : money(item.price * item.quantity)}
              </span>
            </div>

            <button
              type="button"
              className="mt-2 self-end cursor-pointer text-sm text-[#9a1b18] underline"
              onClick={() => onRemoveItem(item.id)}
            >
              {t.remove}
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default CartTable;
