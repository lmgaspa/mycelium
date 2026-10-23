"use client";
import dynamic from "next/dynamic";
const PixPaymentPage = dynamic(() => import("../../../legacy-pages/PixPaymentPage"), { ssr: false });
export default function Page() { return <PixPaymentPage />; }
