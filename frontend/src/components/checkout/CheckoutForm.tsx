"use client";

import React from "react";
import { useNavigate } from "@/lib/router";
import type { CartItem } from "@/context/CartTypes";
import CheckoutFormView from "@/components/checkout/CheckoutFormView";
import { useCopy } from "@/i18n/useCopy";

interface CheckoutFormProps {
  cartItems: CartItem[];
  total: number;    // itens + frete - desconto
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
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onNavigateBack: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = (props) => {
  const t = useCopy("Checkout");
  const navigate = useNavigate();
  const required: (keyof CheckoutFormProps["form"])[] = [
    "firstName", "lastName", "cpf", "cep", "address", "number",
    "district", "city", "state", "email", "phone",
  ];
  const cpfDigits = props.form.cpf.replace(/\D/g, "");
  const cepDigits = props.form.cep.replace(/\D/g, "");
  const phoneDigits = props.form.phone.replace(/\D/g, "");
  const canSubmit = props.cartItems.length > 0
    && required.every((key) => props.form[key].trim() !== "")
    && cpfDigits.length === 11
    && cepDigits.length === 8
    && phoneDigits.length === 11
    && phoneDigits[2] === "9"
    && (props.form.payment === "pix" || props.form.payment === "card");

  const handleCheckout = () => {
    if (!props.cartItems.length) {
      alert(t.emptyCart);
      return;
    }

    const missing = required.find((k) => String(props.form[k] ?? "").trim() === "");
    if (missing) {
      alert(t.requiredFields);
      return;
    }

    if (cpfDigits.length !== 11) { alert(t.invalidCpf); return; }
    if (cepDigits.length !== 8) { alert(t.invalidCep); return; }
    if (phoneDigits.length !== 11 || phoneDigits[2] !== "9") {
      alert(t.invalidPhone); return;
    }

    if (props.form.payment === "pix") {
      navigate("/payment/pix", {
        state: {
          form: props.form,
          cartItems: props.cartItems,
          total: props.total,
          shipping: props.shipping,
          discount: props.discount,
          coupon: props.coupon,
        },
      });
      return;
    }

    if (props.form.payment === "card") {
      // Sem coletar dados aqui; a próxima tela tokeniza via Efí
      navigate("/payment/card");
      return;
    }

    alert(t.invalidPayment);
  };

  return (
    <CheckoutFormView
      cartItems={props.cartItems}
      total={props.total}
      shipping={props.shipping}
      discount={props.discount}
      coupon={props.coupon}
      setCoupon={props.setCoupon}
      handleApplyCoupon={props.handleApplyCoupon}
      couponValid={props.couponValid}
      isValidating={props.isValidating}
      form={props.form}
      handleChange={props.handleChange}
      updateQuantity={props.updateQuantity}
      removeItem={props.removeItem}
      handleCheckout={handleCheckout}
      canSubmit={canSubmit}
      onNavigateBack={props.onNavigateBack}
    />
  );
};

export default CheckoutForm;
