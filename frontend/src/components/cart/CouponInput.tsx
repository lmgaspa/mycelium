import React from 'react';
import { useCopy } from '@/i18n/useCopy';
import { useLocale } from 'next-intl';

interface CouponInputProps {
  value: string;
  onChange: (value: string) => void;
  onApply: (orderTotal: number) => Promise<{ success: boolean; discountAmount?: number }>;
  isValidating?: boolean;
  isValid?: boolean;
  discount?: number;
}

const CouponInput: React.FC<CouponInputProps> = ({ 
  value, 
  onChange, 
  onApply, 
  isValidating = false,
  isValid = false,
  discount = 0
}) => {
  const t = useCopy('Cart');
  const locale = useLocale();
  const handleApply = async () => {
    // Para o CouponInput, vamos usar um orderTotal padrão
    // O componente pai deve passar o orderTotal correto
    const result = await onApply(0);
    return result.success;
  };

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        type="text"
        placeholder={t.couponCode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-11 w-full min-w-0 flex-1 rounded-xl border border-[#d9cce8] bg-white px-3 py-2 text-brand-ink outline-none placeholder:text-brand-muted focus:border-brand-purple focus:ring-[3px] focus:ring-brand-purple/15 sm:w-auto"
        disabled={isValidating}
      />
      <button 
        type="button"
        onClick={handleApply} 
        disabled={isValidating}
        className="min-h-11 w-full cursor-pointer rounded-full border border-[#cdb7e7] bg-[#e9def6] px-6 py-2 font-bold text-brand-plum transition-colors hover:border-brand-purple hover:bg-[#d8c4ef] hover:text-brand-plum disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {isValidating ? t.validatingCoupon : t.applyCoupon}
      </button>
      {isValid && discount > 0 && (
        <span className="text-green-600 font-medium">
          {t.discount}: {new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' }).format(discount)}
        </span>
      )}
    </div>
  );
};

export default CouponInput;
