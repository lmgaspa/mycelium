"use client";

// src/pages/CheckoutPage.tsx
import { useState, useEffect, useMemo, useCallback, useRef, useContext } from "react";
import { useNavigate } from "@/lib/router";
import { useCoupon } from "@/hooks/useCoupon";
import { formatCep, formatCpf, formatCelular } from "@/utils/masks";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import type { CartItem } from "@/context/CartTypes";
import { calcularFreteComBaseEmCarrinho } from "@/utils/freteUtils";
import { cookieStorage } from "@/utils/cookieUtils";
import { calculateCheckoutTotals } from "@/utils/checkoutTotals";
import { analytics, mapCartItems } from "@/analytics";
import { CartContext } from "@/context/CartContext";
import { useCopy } from "@/i18n/useCopy";
import { useLocale } from "next-intl";

type FormState = {
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
  payment: string;
  shipping?: number;
};

const DEFAULT_FORM: FormState = {
  firstName: "",
  lastName: "",
  cpf: "",
  country: "Brasil",
  cep: "",
  address: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "",
  phone: "",
  email: "",
  note: "",
  delivery: "",
  payment: "pix",
  shipping: 0,
};

const CheckoutPage = () => {
  const t = useCopy("Checkout");
  const locale = useLocale();
  const navigate = useNavigate();
  const cartContext = useContext(CartContext);
  const { 
    applyCoupon, 
    getDiscountAmount, 
    isValid: couponValid, 
    inputValue, 
    setInputValue,
    isValidating
  } = useCoupon();
  const [form, setForm] = useState<FormState>(() =>
    cookieStorage.get<FormState>("checkoutForm", DEFAULT_FORM)
  );
  const [shipping, setShipping] = useState(() => {
    const savedForm = cookieStorage.get<FormState>("checkoutForm", DEFAULT_FORM);
    return savedForm.shipping ?? 0;
  });

  if (!cartContext) {
    throw new Error("CheckoutPage must be used within a CartProvider");
  }

  const { cartItems, updateQuantity: updateQuantityContext, removeFromCart, totalPrice } = cartContext;
  const totalItems = totalPrice;
  const totals = calculateCheckoutTotals(cartItems, shipping, getDiscountAmount(totalItems));

  const onNavigateBack = () => navigate("/products");

  // GA4: controla se já disparamos o begin_checkout nesta visita.
  // Extensão de comportamento (analytics) sem alterar o fluxo principal (OCP).
  const beginCheckoutTrackedRef = useRef(false);

  const cpfCepInfo = useMemo(() => {
    const cpf = form.cpf.replace(/\D/g, "");
    const cep = form.cep.replace(/\D/g, "");
    const phone = form.phone.replace(/\D/g, "");
    return { cpf, cep, phone };
  }, [form]);

  const cartItemsRef = useRef<CartItem[]>([]);
  
  // Atualizar ref quando cartItems mudar
  useEffect(() => {
    cartItemsRef.current = cartItems;
  }, [cartItems]);

  // GA4: begin_checkout — “Início da finalização da compra”
  // Disparamos UMA VEZ quando o usuário chega à página de checkout com itens no carrinho.
  // Isso estende o comportamento com analytics, mantendo o fluxo de negócio intacto (OCP).
  useEffect(() => {
    if (beginCheckoutTrackedRef.current) return;
    if (!cartItems || cartItems.length === 0) return;

    try {
      const itemsPayload = mapCartItems(cartItems);
      const value = calculateCheckoutTotals(cartItems, shipping, getDiscountAmount(totalItems)).total;

      analytics.beginCheckout({
        items: itemsPayload,
        value: Number(value),
        currency: "BRL",
        // no futuro podemos passar cupom, se quiser:
        // coupon: inputValue || undefined,
      });

      beginCheckoutTrackedRef.current = true;
    } catch {
      // nunca deixamos o fluxo de checkout quebrar por causa de tracking
    }
  }, [cartItems, totalItems, shipping, getDiscountAmount]);

  // Sincronizar shipping com o valor salvo no formulário
  useEffect(() => {
    if (form.shipping !== undefined && form.shipping !== shipping) {
      setShipping(form.shipping);
    }
  }, [form.shipping, shipping]);

  // Função estabilizada para calcular frete
  const calcularFrete = useCallback(async () => {
    const currentCartItems = cartItemsRef.current;
    
    // Se já temos um frete válido salvo, usar ele
    if (form.shipping && form.shipping > 0) {
      setShipping(form.shipping);
      return;
    }
    
    if (
      cpfCepInfo.cpf === "00000000000" ||
      cpfCepInfo.cep.length !== 8 ||
      currentCartItems.length === 0
    ) {
      setShipping(0);
      return;
    }

    // Se já temos um frete calculado e válido, não recalcular
    if (shipping > 0 && form.shipping === shipping) {
      return;
    }

    try {
      const v = await calcularFreteComBaseEmCarrinho(
        { cpf: cpfCepInfo.cpf, cep: cpfCepInfo.cep },
        currentCartItems
      );
      
      setShipping(v);

      // GA4: add_shipping_info (mantido para uso presente/futuro)
      try {
        const itemsPayload = mapCartItems(currentCartItems);
        const orderValue = currentCartItems.reduce(
          (acc, i) => acc + i.price * i.quantity,
          0
        );
        analytics.addShippingInfo({
          items: itemsPayload,
          value: Number(orderValue + v),
          shipping: Number(v),
          shipping_tier: "default",
          currency: "BRL",
        });
      } catch {
        // no-op
      }
    } catch {
      setShipping(0);
    }
  }, [cpfCepInfo, shipping, form.shipping]);

  // Calcula frete e envia GA4: add_shipping_info
  useEffect(() => {
    calcularFrete();
  }, [calcularFrete]);

  // Salvar formulário no cookie (sem causar loop)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      cookieStorage.set("checkoutForm", { ...form, shipping });
    }, 100); // Debounce para evitar loops
    
    return () => clearTimeout(timeoutId);
  }, [form, shipping]);

  const updateQuantity = useCallback((id: string, delta: number) => {
    const currentItem = cartItems.find((i) => i.id === id);
    if (!currentItem) return;
    const next = currentItem.quantity + delta;
    if (next <= 0) {
      removeFromCart(id);
      return;
    }
    updateQuantityContext(id, delta);
  }, [cartItems, updateQuantityContext, removeFromCart]);

  const removeItem = useCallback((id: string) => {
    removeFromCart(id);
  }, [removeFromCart]);

  const handleApplyCoupon = async (): Promise<{ success: boolean; discountAmount?: number }> => {
    // Converter cartItems para o formato esperado pelo backend
    const cartItemsForValidation = cartItems.map(item => ({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl
    }));
    
    const result = await applyCoupon(inputValue, totalItems, cartItemsForValidation);
    if (result.success && result.discountAmount !== undefined) {
      // Usar o valor retornado pela API, mas limitado a R$ 15
      const maxDiscount = 15.00;
      const actualDiscount = Math.min(result.discountAmount, maxDiscount);
      alert(t.couponApplied.replace("{amount}", new Intl.NumberFormat(locale, { style: "currency", currency: "BRL" }).format(actualDiscount)));
    }
    return result;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value: raw } = e.target;
    let value = raw;
    if (name === "cep") value = formatCep(value);
    if (name === "cpf") value = formatCpf(value);
    if (name === "phone") value = formatCelular(value);
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "cep" && value.replace(/\D/g, "").length === 8) {
      fetch(`https://viacep.com.br/ws/${value.replace(/\D/g, "")}/json/`)
        .then((res) => res.json())
        .then((data) => {
          setForm((prev) => ({
            ...prev,
            address: data.logradouro || "",
            district: data.bairro || "",
            city: data.localidade || "",
            state: data.uf || "",
          }));
        })
        .catch(() => {
          // silencioso
        });
    }
  };

  return (
    <CheckoutForm
      cartItems={cartItems}
      total={totals.total}
      shipping={shipping}
      discount={totals.discount}
      coupon={inputValue}
      setCoupon={setInputValue}
      handleApplyCoupon={handleApplyCoupon}
      couponValid={couponValid}
      isValidating={isValidating}
      form={form}
      updateQuantity={updateQuantity}
      removeItem={removeItem}
      handleChange={handleChange}
      onNavigateBack={onNavigateBack}
    />
  );
};

export default CheckoutPage;
