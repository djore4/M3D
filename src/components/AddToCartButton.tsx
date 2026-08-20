"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useLang } from "@/lib/lang-context";
import { pick } from "@/lib/i18n";
import { effectivePriceCents, type Product } from "@/lib/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { lang, t } = useLang();
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: pick(lang, product.name_pt, product.name_en),
        unitPriceCents: effectivePriceCents(product),
        imageUrl: product.product_images?.[0]?.url ?? null,
        stock: product.stock,
      },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button className="btn-primary w-full sm:w-auto" onClick={handleAdd} disabled={soldOut}>
      {soldOut ? t("product.outOfStock") : added ? "✓" : t("product.addToCart")}
    </button>
  );
}
