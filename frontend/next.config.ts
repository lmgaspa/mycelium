import type { NextConfig } from "next";

const backend = (
  process.env.MYCELIUM_BACKEND_URL ||
  process.env.VITE_API_BASE ||
  "http://localhost:8080"
).replace(/\/api\/v1\/?$|\/$/g, "");

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_EFI_PAYEE_CODE: process.env.NEXT_PUBLIC_EFI_PAYEE_CODE || process.env.VITE_EFI_PAYEE_CODE || "",
    NEXT_PUBLIC_EFI_SANDBOX: process.env.NEXT_PUBLIC_EFI_SANDBOX || process.env.VITE_EFI_SANDBOX || "false",
    NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID || process.env.VITE_GA4_ID || "",
    NEXT_PUBLIC_COUPON_CODE: process.env.NEXT_PUBLIC_COUPON_CODE || process.env.VITE_COUPON_CODE || "",
    NEXT_PUBLIC_COUPON_DISCOUNT_VALUE: process.env.NEXT_PUBLIC_COUPON_DISCOUNT_VALUE || process.env.VITE_COUPON_DISCOUNT_VALUE || "",
    NEXT_PUBLIC_COUPON_LANCAMENTO_CODE: process.env.NEXT_PUBLIC_COUPON_LANCAMENTO_CODE || process.env.VITE_COUPON_LANCAMENTO_CODE || "",
    NEXT_PUBLIC_COUPON_LANCAMENTO_DISCOUNT_VALUE: process.env.NEXT_PUBLIC_COUPON_LANCAMENTO_DISCOUNT_VALUE || process.env.VITE_COUPON_LANCAMENTO_DISCOUNT_VALUE || "",
  },
  async rewrites() {
    return [{ source: "/api/v1/:path*", destination: `${backend}/api/v1/:path*` }];
  },
};

export default nextConfig;
