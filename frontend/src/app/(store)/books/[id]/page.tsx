"use client";
import dynamic from "next/dynamic";
const BookPage = dynamic(() => import("../../../../legacy-pages/BookPage"), { ssr: false });
export default function Page() { return <BookPage />; }
