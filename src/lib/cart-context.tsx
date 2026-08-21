"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { cartKey, type CartItem } from "./types";

const STORAGE_KEY = "m3d.cart.v2";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotalCents: number;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  setQuantity: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  keyOf: (item: Pick<CartItem, "productId" | "size">) => string;
  ready: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignora storage indisponível
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignora
    }
  }, [items, ready]);

  const keyOf = useCallback(
    (item: Pick<CartItem, "productId" | "size">) => cartKey(item.productId, item.size),
    []
  );

  const addItem = useCallback((item: Omit<CartItem, "quantity">, qty = 1) => {
    const key = cartKey(item.productId, item.size);
    setItems((prev) => {
      const existing = prev.find((i) => cartKey(i.productId, i.size) === key);
      if (existing) {
        const nextQty = Math.min(existing.quantity + qty, Math.max(item.stock, 1));
        return prev.map((i) =>
          cartKey(i.productId, i.size) === key ? { ...i, ...item, quantity: nextQty } : i
        );
      }
      return [...prev, { ...item, quantity: Math.min(qty, Math.max(item.stock, 1)) }];
    });
  }, []);

  const setQuantity = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          cartKey(i.productId, i.size) === key
            ? { ...i, quantity: Math.max(0, Math.min(qty, Math.max(i.stock, 1))) }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => cartKey(i.productId, i.size) !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { count, subtotalCents } = useMemo(() => {
    return items.reduce(
      (acc, i) => {
        acc.count += i.quantity;
        acc.subtotalCents += i.quantity * i.unitPriceCents;
        return acc;
      },
      { count: 0, subtotalCents: 0 }
    );
  }, [items]);

  const value: CartContextValue = {
    items,
    count,
    subtotalCents,
    addItem,
    setQuantity,
    removeItem,
    clear,
    keyOf,
    ready,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return ctx;
}
