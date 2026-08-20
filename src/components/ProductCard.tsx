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
      className="group card overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-square overflow-hidden bg-ink-100">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-ink-100 to-ink-200 text-5xl text-ink-300">
            🖨️
          </div>
        )}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
          {product.is_featured && (
            <span className="badge bg-white/90 text-brand-700 backdrop-blur">★ {t("product.featured")}</span>
          )}
          {hasPromo && <span className="badge bg-rose-600 text-white">{t("product.promo")}</span>}
          {soldOut && <span className="badge bg-ink-900/80 text-white backdrop-blur">{t("product.outOfStock")}</span>}
        </div>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-1 font-semibold text-ink-900">{name}</h3>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="num text-[17px] font-semibold text-ink-950">{formatPrice(price, lang)}</span>
          {hasPromo && (
            <span className="num text-[13px] text-ink-400 line-through">{formatPrice(product.price_cents, lang)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
