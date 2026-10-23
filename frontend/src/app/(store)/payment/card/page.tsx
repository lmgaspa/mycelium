"use client";
import dynamic from "next/dynamic";
const CardPaymentPage = dynamic(() => import("./client"), { ssr: false });
export default function Page() { return <CardPaymentPage />; }
