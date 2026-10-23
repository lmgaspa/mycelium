"use client";
import dynamic from "next/dynamic";
const BookPage = dynamic(() => import("./client"), { ssr: false });
export default function Page() { return <BookPage />; }
