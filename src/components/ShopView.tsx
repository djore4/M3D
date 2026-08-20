"use client";

import { useLang } from "@/lib/lang-context";
import ProductGrid from "./ProductGrid";
import type { Product } from "@/lib/types";

export default function ShopView({ products }: { products: Product[] }) {
  const { lang, t } = useLang();
  return (
    <div className="container-page py-12">
      <p className="eyebrow mb-2">{lang === "pt" ? "Catálogo completo" : "Full catalogue"}</p>
      <h1 className="mb-8 text-4xl font-extrabold text-ink-950">{t("shop.title")}</h1>
      {products.length === 0 ? (
        <div className="card grid place-items-center p-16 text-center">
          <span className="text-4xl">🖨️</span>
          <p className="mt-3 text-ink-500">{t("shop.empty")}</p>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
