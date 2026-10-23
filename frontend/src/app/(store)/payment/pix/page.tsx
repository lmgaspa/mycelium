"use client";
import dynamic from "next/dynamic";
const PixPaymentPage = dynamic(() => import("./client"), { ssr: false });
export default function Page() { return <PixPaymentPage />; }
