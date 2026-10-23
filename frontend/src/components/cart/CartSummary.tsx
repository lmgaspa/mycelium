import React from 'react';
import { useCopy } from '@/i18n/useCopy';
import { useLocale } from 'next-intl';

interface CartSummaryProps {
  subtotal: number;
  discount: number;
  onCheckout: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ subtotal, discount, onCheckout }) => {
  const t = useCopy('Cart');
  const locale = useLocale();
  const money = (value: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' }).format(value);
  const total = subtotal - discount;

  return (
    <div>
      <p className="text-text-primary">{t.subtotal}: {money(subtotal)}</p>
      <p className="text-text-primary">{t.discount}: -{money(discount)}</p>
      <p className="text-text-primary">{t.total}: {money(total)}</p>
      <button type="button" onClick={onCheckout} className="bg-primary text-background px-2 py-4 mt-2 rounded-md shadow-md transition hover:bg-secondary">
        {t.checkout}
      </button>
    </div>
  );
};

export default CartSummary;
