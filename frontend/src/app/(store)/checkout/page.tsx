"use client";
import dynamic from "next/dynamic";
const CheckoutPage = dynamic(() => import("../../../legacy-pages/CheckoutPage"), { ssr: false });
export default function Page() { return <CheckoutPage />; }
