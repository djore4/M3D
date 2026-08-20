"use client";

import { useLang } from "@/lib/lang-context";
import ProductGrid from "./ProductGrid";
import type { Product } from "@/lib/types";

export default function ShopView({ products }: { products: Product[] }) {
  const { t } = useLang();
  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">{t("shop.title")}</h1>
      {products.length === 0 ? (
        <p className="text-slate-500">{t("shop.empty")}</p>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
