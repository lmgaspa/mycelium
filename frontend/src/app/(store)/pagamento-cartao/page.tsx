"use client";
import dynamic from "next/dynamic";
const CardPaymentPage = dynamic(() => import("../../../legacy-pages/CardPaymentPage"), { ssr: false });
export default function Page() { return <CardPaymentPage />; }
