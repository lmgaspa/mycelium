import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@/lib/router";
import type { CartItem } from "../context/CartTypes";
import type { CheckoutFormData } from "../types/CheckoutTypes";
import { cookieStorage } from "../utils/cookieUtils";
import { calculateCheckoutTotals } from "../utils/checkoutTotals";
import { apiPost } from "../api/http";
import { analytics, mapCartItems } from "../analytics";

export interface PixCheckoutResponse {
  qrCode: string;
  qrCodeBase64: string;
  message: string;
  orderId: string;
  txid: string;
  reserveExpiresAt?: string;
  ttlSeconds?: number;
  warningAt?: number;
  securityWarningAt?: number;
}

interface UsePixCheckoutParams {
  cartItems: CartItem[];
  desconto: number;
  couponCode: string | null;
  isCouponValid: boolean;
}

interface UsePixCheckoutResult {
  loading: boolean;
  errorMsg: string | null;
  checkoutData: PixCheckoutResponse | null;
  qrCodeImg: string;
  pixCopiaECola: string;
  orderId: string | null;
  expiresAtMs: number | null;
  frete: number | null;
}

/**
 * Hook para gerenciar checkout Pix
 */
export const usePixCheckout = ({
  cartItems,
  desconto,
  couponCode,
  isCouponValid,
}: UsePixCheckoutParams): UsePixCheckoutResult => {
  const navigate = useNavigate();
  const isMountedRef = useRef(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<PixCheckoutResponse | null>(null);
  const [qrCodeImg, setQrCodeImg] = useState("");
  const [pixCopiaECola, setPixCopiaECola] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [expiresAtMs, setExpiresAtMs] = useState<number | null>(null);
  const [frete, setFrete] = useState<number | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Usa o frete que o cliente confirmou no checkout.
  useEffect(() => {
    const form = cookieStorage.get<CheckoutFormData | null>("checkoutForm", null);
    if (form && cartItems.length > 0) setFrete(Number(form.shipping ?? 0));
  }, [cartItems]);

  // Processar checkout
  useEffect(() => {
    const run = async () => {
      if (frete === null || cartItems.length === 0 || orderId) return;

      const savedForm = cookieStorage.get<CheckoutFormData | null>("checkoutForm", null);
      if (!savedForm) {
        navigate("/checkout");
        return;
      }
      const form = savedForm;

      setLoading(true);
      setErrorMsg(null);
      try {
        // Valida se o cupom ainda está válido antes de enviar
        const finalCouponCode = isCouponValid && couponCode ? couponCode : null;
        const finalDiscount = finalCouponCode ? desconto : 0;

        const payload = {
          firstName: form.firstName,
          lastName: form.lastName,
          cpf: form.cpf,
          country: form.country,
          cep: form.cep,
          address: form.address,
          number: form.number,
          complement: form.complement,
          district: form.district,
          city: form.city,
          state: form.state,
          phone: form.phone,
          email: form.email,
          note: form.note,
          payment: "pix",
          shipping: frete,
          cartItems,
          total: calculateCheckoutTotals(cartItems, frete, finalDiscount).totalBeforeDiscount,
          discount: finalDiscount,
          couponCode: finalCouponCode,
        };

        const data: PixCheckoutResponse = await apiPost<PixCheckoutResponse>("/checkout/pix", payload);
        setCheckoutData(data);

        const img = (data.qrCodeBase64 || "").startsWith("data:image")
          ? data.qrCodeBase64
          : `data:image/png;base64,${data.qrCodeBase64 || ""}`;

        if (!isMountedRef.current) return;

        setQrCodeImg(img);
        setPixCopiaECola(data.qrCode || "");
        setOrderId(String(data.orderId || ""));

        // Expiração
        let expMs: number | null = null;
        if (data.reserveExpiresAt) {
          const t = Date.parse(data.reserveExpiresAt);
          if (!Number.isNaN(t)) expMs = t;
        } else if (typeof data.ttlSeconds === "number" && data.ttlSeconds > 0) {
          expMs = Date.now() + data.ttlSeconds * 1000;
        } else {
          expMs = Date.now() + 15 * 60 * 1000;
        }
        setExpiresAtMs(expMs);

        // GA4: preferência de pagamento (Pix)
        try {
          const itemsPayload = mapCartItems(cartItems);
          const totalComFreteCalculado = calculateCheckoutTotals(cartItems, frete, finalDiscount).total;
          const value = Number(totalComFreteCalculado);
          analytics.addPaymentInfo({
            items: itemsPayload,
            value,
            currency: "BRL",
            payment_type: "pix",
          });
        } catch {
          // tracking nunca quebra tela
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(msg);

        if (msg.includes("409") || msg.includes("422")) {
          setErrorMsg("Indisponível no momento. Outro cliente reservou este item.");
          setTimeout(() => navigate("/"), 2000);
          return;
        }

        setErrorMsg(msg || "Erro ao gerar QR Code.");
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    };
    run();
  }, [frete, cartItems, desconto, navigate, orderId, couponCode, isCouponValid]);

  return {
    loading,
    errorMsg,
    checkoutData,
    qrCodeImg,
    pixCopiaECola,
    orderId,
    expiresAtMs,
    frete,
  };
};

