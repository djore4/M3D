"use client";

import { useState } from "react";
import { useLang } from "@/lib/lang-context";
import ProductGrid from "./ProductGrid";
import type { Product } from "@/lib/types";

const SIZES = ["S", "M", "L"];

export default function ShopView({ products }: { products: Product[] }) {
  const { lang, t } = useLang();
  const [size, setSize] = useState<string>("");

  const list = size ? products.filter((p) => p.sizes.includes(size)) : products;

  return (
    <div className="container-page py-12">
      <p className="eyebrow mb-2">{lang === "pt" ? "Catálogo completo" : "Full catalogue"}</p>
      <h1 className="mb-7 text-4xl font-extrabold">{t("shop.title")}</h1>

      <div className="mb-7 flex flex-wrap items-center gap-2.5">
        <span className="eyebrow mr-1">{t("product.size")}</span>
        <FilterChip active={size === ""} onClick={() => setSize("")}>
          {t("shop.allSizes")}
        </FilterChip>
        {SIZES.map((s) => (
          <FilterChip key={s} active={size === s} onClick={() => setSize(s)}>
            {s}
          </FilterChip>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="card grid place-items-center p-16 text-center text-muted">{t("shop.empty")}</div>
      ) : (
        <ProductGrid products={list} />
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`num rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
        active
          ? "border-brand-500 bg-brand-500 text-[#0a0a0e]"
          : "border-line bg-surface text-muted hover:border-line2 hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}
