"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { pick } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { effectivePriceCents, type Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const { lang, t } = useLang();
  const name = pick(lang, product.name_pt, product.name_en);
  const image = product.product_images?.[0]?.url ?? null;
  const price = effectivePriceCents(product);
  const hasPromo = price < product.price_cents;
  const soldOut = product.stock <= 0;

  return (
    <Link
      href={`/produto/${product.slug}`}
      className="card group overflow-hidden transition hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-slate-300">
            <span className="text-5xl">🖨️</span>
          </div>
        )}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.is_featured && (
            <span className="badge bg-amber-100 text-amber-800">★ {t("product.featured")}</span>
          )}
          {hasPromo && <span className="badge bg-red-100 text-red-700">{t("product.promo")}</span>}
          {soldOut && <span className="badge bg-slate-200 text-slate-600">{t("product.outOfStock")}</span>}
        </div>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-1 font-semibold text-slate-900">{name}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-bold text-brand-700">{formatPrice(price, lang)}</span>
          {hasPromo && (
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(product.price_cents, lang)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
