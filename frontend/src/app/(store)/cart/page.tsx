"use client";
import dynamic from "next/dynamic";
const CartPage = dynamic(() => import("./client"), { ssr: false });
export default function Page() { return <CartPage />; }
