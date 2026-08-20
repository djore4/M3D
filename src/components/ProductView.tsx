"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { pick } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { effectivePriceCents, type Product } from "@/lib/types";
import AddToCartButton from "./AddToCartButton";

export default function ProductView({ product }: { product: Product }) {
  const { lang, t } = useLang();
  const images = product.product_images ?? [];
  const [active, setActive] = useState(0);
  const name = pick(lang, product.name_pt, product.name_en);
  const description = pick(lang, product.description_pt, product.description_en);
  const price = effectivePriceCents(product);
  const hasPromo = price < product.price_cents;
  const cover = images[active]?.url ?? null;

  return (
    <div className="container-page py-8">
      <Link href="/loja" className="mb-6 inline-block text-sm text-slate-500 hover:text-slate-800">
        ← {t("product.back")}
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Galeria */}
        <div>
          <div className="aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt={name} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center text-7xl text-slate-300">🖨️</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActive(i)}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                    i === active ? "border-brand-600" : "border-transparent"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap gap-2">
            {product.is_featured && (
              <span className="badge bg-amber-100 text-amber-800">★ {t("product.featured")}</span>
            )}
            {hasPromo && <span className="badge bg-red-100 text-red-700">{t("product.promo")}</span>}
          </div>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">{name}</h1>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-brand-700">{formatPrice(price, lang)}</span>
            {hasPromo && (
              <span className="text-lg text-slate-400 line-through">
                {formatPrice(product.price_cents, lang)}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-slate-500">
            {product.stock > 0 ? `${product.stock} ${t("product.inStock")}` : t("product.outOfStock")}
          </p>

          {description && (
            <p className="mt-6 whitespace-pre-line leading-relaxed text-slate-700">{description}</p>
          )}

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
