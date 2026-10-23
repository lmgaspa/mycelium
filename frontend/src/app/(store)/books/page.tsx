"use client";
import dynamic from "next/dynamic";
const BooksListPage = dynamic(() => import("../../../legacy-pages/BooksListPage"), { ssr: false });
export default function Page() { return <BooksListPage />; }
