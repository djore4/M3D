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
    <div className="container-page py-10">
      <Link href="/loja" className="mb-6 inline-flex items-center gap-1 text-sm text-ink-500 transition hover:text-ink-900">
        ← {t("product.back")}
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Galeria */}
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl border hairline bg-ink-100">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt={name} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center text-7xl text-ink-300">🖨️</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActive(i)}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    i === active ? "border-brand-600" : "border-transparent opacity-70 hover:opacity-100"
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
        <div className="lg:pt-2">
          <div className="flex flex-wrap gap-2">
            {product.is_featured && (
              <span className="badge bg-brand-50 text-brand-700">★ {t("product.featured")}</span>
            )}
            {hasPromo && <span className="badge bg-rose-600 text-white">{t("product.promo")}</span>}
          </div>

          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-ink-950">{name}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="num text-3xl font-bold text-ink-950">{formatPrice(price, lang)}</span>
            {hasPromo && (
              <span className="num text-lg text-ink-400 line-through">{formatPrice(product.price_cents, lang)}</span>
            )}
          </div>

          <p className="mt-2 flex items-center gap-2 text-sm text-ink-500">
            <span className={`h-2 w-2 rounded-full ${product.stock > 0 ? "bg-emerald-500" : "bg-ink-300"}`} />
            {product.stock > 0 ? `${product.stock} ${t("product.inStock")}` : t("product.outOfStock")}
          </p>

          {description && (
            <div className="mt-7 border-t hairline pt-7">
              <p className="eyebrow mb-3">{lang === "pt" ? "Descrição" : "Description"}</p>
              <p className="whitespace-pre-line leading-relaxed text-ink-700">{description}</p>
            </div>
          )}

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
