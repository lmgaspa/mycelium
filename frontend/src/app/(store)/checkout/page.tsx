"use client";
import dynamic from "next/dynamic";
const CheckoutPage = dynamic(() => import("./client"), { ssr: false });
export default function Page() { return <CheckoutPage />; }
