"use client";
import dynamic from "next/dynamic";
const HomePage = dynamic(() => import("../../legacy-pages/HomePage"), { ssr: false });
export default function Page() { return <HomePage />; }
