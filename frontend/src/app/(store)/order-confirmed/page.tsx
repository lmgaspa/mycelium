"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
const OrderConfirmedPage = dynamic(() => import("./client"), { ssr: false });
export default function Page() { return <Suspense fallback={null}><OrderConfirmedPage /></Suspense>; }
