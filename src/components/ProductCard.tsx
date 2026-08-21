"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { pick } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { effectivePriceCents, type Product } from "@/lib/types";
import ProductThumb from "./ProductThumb";

export default function ProductCard({ product }: { product: Product }) {
  const { lang, t } = useLang();
  const name = pick(lang, product.name_pt, product.name_en);
  const price = effectivePriceCents(product);
  const hasPromo = price < product.price_cents;
  const soldOut = product.stock <= 0;

  return (
    <Link
      href={`/produto/${product.slug}`}
      className="group card overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-line2 hover:shadow-glow"
    >
      <div className="relative aspect-square overflow-hidden">
        <div className="h-full w-full transition duration-500 group-hover:scale-[1.04]">
          <ProductThumb product={product} alt={name} />
        </div>
        <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1.5">
          {product.is_featured && (
            <span className="badge border border-brand-500/40 bg-brand-500/15 text-brand-200">★ {t("product.featured")}</span>
          )}
          {hasPromo && <span className="badge border border-sale/40 bg-sale/15 text-[#fda4b4]">{t("product.promo")}</span>}
          {soldOut && <span className="badge border border-line2 bg-white/5 text-muted">{t("product.outOfStock")}</span>}
        </div>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-1 font-semibold text-fg">{name}</h3>
        {product.sizes.length > 0 && (
          <div className="mt-2 flex gap-1.5">
            {product.sizes.map((s) => (
              <span key={s} className="num rounded-md border border-line px-1.5 py-0.5 text-[10.5px] text-faint">
                {s}
              </span>
            ))}
          </div>
        )}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="num text-[17px] font-semibold text-fg">{formatPrice(price, lang)}</span>
          {hasPromo && (
            <span className="num text-[13px] text-faint line-through">{formatPrice(product.price_cents, lang)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
