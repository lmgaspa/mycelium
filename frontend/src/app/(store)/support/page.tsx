"use client";
import dynamic from "next/dynamic";
const SupportPage = dynamic(() => import("./client"), { ssr: false });
export default function Page() { return <SupportPage />; }
