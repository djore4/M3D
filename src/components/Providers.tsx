"use client";

import { CartProvider } from "@/lib/cart-context";
import { LangProvider } from "@/lib/lang-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <CartProvider>{children}</CartProvider>
    </LangProvider>
  );
}
