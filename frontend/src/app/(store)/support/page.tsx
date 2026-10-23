"use client";
import dynamic from "next/dynamic";
const SupportPage = dynamic(() => import("../../../legacy-pages/SupportPage"), { ssr: false });
export default function Page() { return <SupportPage />; }
