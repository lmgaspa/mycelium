"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
const PedidoConfirmado = dynamic(() => import("../../../legacy-pages/PedidoConfirmado"), { ssr: false });
export default function Page() { return <Suspense fallback={null}><PedidoConfirmado /></Suspense>; }
