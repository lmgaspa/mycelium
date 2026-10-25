"use client";

import { Suspense, type ReactNode } from "react";
import { CartProvider } from "../../context/CartContext";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import AnalyticsGate from "../../components/AnalyticsGate";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <Navbar />
      <main className="bg-background">{children}</main>
      <Footer />
      <Suspense fallback={null}><AnalyticsGate /></Suspense>
    </CartProvider>
  );
}
