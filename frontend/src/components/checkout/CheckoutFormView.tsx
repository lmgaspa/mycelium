import React from "react";
import type { CartItem } from "../../context/CartTypes";
import { analytics, mapCartItems } from "../../analytics";
import CouponInput from "../cart/CouponInput";
import { useCopy } from "@/i18n/useCopy";
import { useLocale } from "next-intl";

interface CheckoutFormViewProps {
  cartItems: CartItem[];
  total: number; // já com frete somado e desconto aplicado
  shipping: number;
  discount: number;
  coupon: string;
  setCoupon: (coupon: string) => void;
  handleApplyCoupon: () => Promise<{ success: boolean; discountAmount?: number }>;
  couponValid: boolean;
  isValidating?: boolean;
  form: {
    firstName: string;
    lastName: string;
    cpf: string;
    country: string;
    cep: string;
    address: string;
    number: string;
    complement: string;
    district: string;
    city: string;
    state: string;
    phone: string;
    email: string;
    note: string;
    delivery: string;
    payment: string; // "pix" | "card"
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  handleCheckout: () => void;
  canSubmit: boolean;
  onNavigateBack: () => void;
}

const CheckoutFormView: React.FC<CheckoutFormViewProps> = ({
  cartItems,
  total,
  shipping,
  discount,
  coupon,
  setCoupon,
  handleApplyCoupon,
  couponValid,
  isValidating = false,
  form,
  handleChange,
  updateQuantity,
  removeItem,
  handleCheckout,
  canSubmit,
  onNavigateBack,
}) => {
  const t = useCopy("Checkout");
  const cartCopy = useCopy("Cart");
  const productNames = useCopy("ProductNames");
  const locale = useLocale();
  const money = (amount: number) => new Intl.NumberFormat(locale, { style: "currency", currency: "BRL" }).format(amount);
  const itemTitle = (item: CartItem) => {
    if (item.kind !== "mycelium") return item.title;
    const [, slug, size] = item.id.split(":");
    const name = productNames[slug as keyof typeof productNames];
    const sizeMl = Number(size);
    return name && Number.isFinite(sizeMl) && sizeMl > 0 ? `${name} · ${sizeMl >= 1000 ? `${sizeMl / 1000} L` : `${sizeMl} ml`}` : item.title;
  };
  const inputClass = "min-h-11 w-full rounded-xl border border-[#d9cce8] bg-white px-3 py-2 text-brand-ink outline-none transition-colors placeholder:text-brand-muted focus:border-brand-purple focus:ring-[3px] focus:ring-brand-purple/15";
  const onProceed = () => {
    try {
      analytics.beginCheckout({
        items: mapCartItems(cartItems),
        value: Number(total),
        currency: "BRL",
      });
    } catch {
      // no-op
    }
    handleCheckout();
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] bg-[#faf8fc] px-4 pt-6 pb-12 text-brand-ink sm:px-6 lg:px-8">
      {/* grid principal */}
      <div className="grid grid-cols-1 gap-6 min-[1180px]:grid-cols-[minmax(0,1.5fr)_minmax(420px,1fr)] min-[1180px]:gap-8">
        {/* Coluna esquerda: dados do cliente */}
        <div className="min-w-0 space-y-6 rounded-[22px] border border-[#e8ddf3] bg-white p-5 shadow-[0_10px_28px_rgba(43,15,72,.06)] sm:p-7">
          <div className="mb-4">
            <button
              onClick={onNavigateBack}
              type="button"
              className="min-h-11 cursor-pointer rounded-full border border-[#cdb7e7] bg-[#e9def6] px-6 py-2 font-bold text-brand-plum transition-colors hover:border-brand-purple hover:bg-[#d8c4ef]"
            >
              ← {t.continueShopping}
            </button>
          </div>

          <h2 className="text-lg font-extrabold text-brand-plum">{t.billingHeading}</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              id="firstName"
              name="firstName"
              autoComplete="given-name"
              value={form.firstName}
              onChange={handleChange}
              placeholder={t.firstName}
              className={inputClass}
            />
            <input
              id="lastName"
              name="lastName"
              autoComplete="family-name"
              value={form.lastName}
              onChange={handleChange}
              placeholder={t.lastName}
              className={inputClass}
            />

            {/* CPF */}
            <input
              id="cpf"
              name="cpf"
              autoComplete="on"
              inputMode="numeric"
              value={form.cpf}
              onChange={handleChange}
              placeholder="CPF"
              className={`${inputClass} sm:col-span-2`}
            />

            <input value={t.country} disabled className={`${inputClass} bg-[#f6f2fa] sm:col-span-2`} />
            <input
              id="cep"
              name="cep"
              autoComplete="postal-code"
              inputMode="numeric"
              value={form.cep}
              onChange={handleChange}
              placeholder={t.postalCode}
              className={`${inputClass} sm:col-span-2`}
            />
            <input
              id="address"
              name="address"
              autoComplete="address-line1"
              value={form.address}
              onChange={handleChange}
              placeholder={t.address}
              className={`${inputClass} sm:col-span-2`}
            />
            <input
              id="number"
              name="number"
              autoComplete="address-line2"
              value={form.number}
              onChange={handleChange}
              placeholder={t.number}
              className={inputClass}
            />
            <input
              id="complement"
              name="complement"
              autoComplete="address-line2"
              value={form.complement}
              onChange={handleChange}
              placeholder={t.complement}
              className={inputClass}
            />
            <input
              id="district"
              name="district"
              autoComplete="address-level3"
              value={form.district}
              onChange={handleChange}
              placeholder={t.district}
              className={inputClass}
            />
            <input
              id="city"
              name="city"
              autoComplete="address-level2"
              value={form.city}
              onChange={handleChange}
              placeholder={t.city}
              className={inputClass}
            />
            <input
              id="state"
              name="state"
              autoComplete="address-level1"
              value={form.state}
              onChange={handleChange}
              placeholder={t.state}
              className={inputClass}
            />
            <input
              id="phone"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder={t.phone}
              className={`${inputClass} sm:col-span-2`}
            />
            <input
              id="email"
              name="email"
              autoComplete="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder={t.email}
              className={`${inputClass} sm:col-span-2`}
            />
          </div>

          <div>
            <h2 className="mt-6 text-lg font-extrabold text-brand-plum">{t.additionalHeading}</h2>
            <textarea
              id="note"
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder={t.note}
              className={`${inputClass} min-h-28 resize-y`}
            />
          </div>
        </div>

        {/* Coluna direita: resumo e forma de pagamento */}
        <div className="min-w-0 self-start rounded-[22px] border border-[#e8ddf3] bg-white p-5 shadow-[0_10px_28px_rgba(43,15,72,.06)] sm:p-7">
          <h2 className="mb-5 text-lg font-extrabold text-brand-plum">{t.orderHeading}</h2>

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="grid min-w-0 grid-cols-[48px_minmax(0,1fr)] gap-3 border-b border-[#eee7f2] py-4"
            >
              <img
                src={item.imageUrl}
                alt={itemTitle(item)}
                className="h-16 w-12 rounded-lg bg-white object-contain shadow-sm"
              />
              <div className="min-w-0">
                <p className="break-words text-sm font-semibold text-text-primary">
                  {itemTitle(item)}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="size-8 cursor-pointer rounded-full border border-[#d9c6e7] bg-white text-brand-plum transition-colors hover:border-brand-plum hover:bg-[#f1e9f9]"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    -
                  </button>
                  <span className="text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    className="size-8 cursor-pointer rounded-full border border-[#d9c6e7] bg-white text-brand-plum transition-colors hover:border-brand-plum hover:bg-[#f1e9f9]"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="ml-2 cursor-pointer text-xs font-semibold text-[#9a1b18] hover:underline"
                    onClick={() => removeItem(item.id)}
                  >
                    {t.remove}
                  </button>
                </div>
                <span className="mt-2 block break-words text-right text-sm font-medium text-brand-plum">
                  {item.kind === "mycelium" ? cartCopy.priceOnRequest : money(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}

          {/* Cupom de desconto */}
          <div className="mb-4">
            <h3 className="mb-2 font-bold text-brand-plum">{t.couponHeading}</h3>
            <CouponInput 
              value={coupon} 
              onChange={setCoupon} 
              onApply={handleApplyCoupon}
              isValidating={isValidating}
              isValid={couponValid}
              discount={discount}
            />
            {couponValid && (
              <div className="text-green-600 text-sm mt-2">
                ✓ {t.couponApplied.replace("{amount}", money(discount))}
              </div>
            )}
          </div>

          {/* Forma de pagamento */}
          <div className="mb-4">
            <h3 className="mb-2 font-bold text-brand-plum">{t.paymentHeading}</h3>
            <div className="flex flex-wrap items-center gap-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  className="accent-brand-purple"
                  name="payment"
                  value="pix"
                  checked={form.payment === "pix"}
                  onChange={handleChange}
                />
                <span>Pix</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  className="accent-brand-purple"
                  name="payment"
                  value="card"
                  checked={form.payment === "card"}
                  onChange={handleChange}
                />
                <span>{t.creditCard}</span>
              </label>
            </div>
          </div>

          <div className="flex justify-between">
            <span>{t.delivery}</span>
            <span>{shipping > 0 ? money(shipping) : "---"}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>{t.discount}</span>
              <span>-{money(discount)}</span>
            </div>
          )}

          <div className="flex justify-between border-t border-[#eee7f2] pt-4 font-extrabold text-brand-plum">
            <span>{t.total}</span>
            <span>{money(total)}</span>
          </div>

          <p className="mt-4 text-center text-xs text-brand-muted">
            {form.payment === "pix"
              ? t.payPixHint
              : t.payCardHint}
          </p>

          <button
            onClick={onProceed}
            type="button"
            disabled={!canSubmit}
            className="mt-4 min-h-12 w-full cursor-pointer rounded-full bg-brand-plum px-5 py-2 font-bold text-white transition-colors hover:bg-[#57258e] disabled:cursor-not-allowed disabled:bg-[#d9cce8] disabled:text-[#665b73]"
          >
            {form.payment === "pix"
              ? t.finalizePix
              : t.payCard}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFormView;
