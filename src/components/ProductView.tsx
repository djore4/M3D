"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useLang } from "@/lib/lang-context";
import { pick } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { effectivePriceCents, type Product } from "@/lib/types";
import ProductThumb from "./ProductThumb";

export default function ProductView({ product }: { product: Product }) {
  const { lang, t } = useLang();
  const { addItem } = useCart();
  const images = product.product_images ?? [];
  const [active, setActive] = useState(0);
  const [size, setSize] = useState<string | null>(product.sizes[0] ?? null);
  const [added, setAdded] = useState(false);

  const name = pick(lang, product.name_pt, product.name_en);
  const description = pick(lang, product.description_pt, product.description_en);
  const price = effectivePriceCents(product);
  const hasPromo = price < product.price_cents;
  const soldOut = product.stock <= 0;
  const cover = images[active]?.url ?? null;

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name,
        size,
        unitPriceCents: price,
        imageUrl: images[0]?.url ?? null,
        stock: product.stock,
      },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className="container-page py-10">
      <Link href="/loja" className="mb-6 inline-flex items-center gap-1 text-sm text-muted transition hover:text-fg">
        ← {t("product.back")}
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Galeria */}
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl border hairline">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt={name} className="h-full w-full object-cover" />
            ) : (
              <ProductThumb product={product} alt={name} iconClassName="h-2/5 w-2/5 text-brand-300" />
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActive(i)}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    i === active ? "border-brand-500" : "border-transparent opacity-60 hover:opacity-100"
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
              <span className="badge border border-brand-500/40 bg-brand-500/15 text-brand-200">★ {t("product.featured")}</span>
            )}
            {hasPromo && <span className="badge border border-sale/40 bg-sale/15 text-[#fda4b4]">{t("product.promo")}</span>}
          </div>

          <h1 className="mt-4 text-4xl font-extrabold leading-tight">{name}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="num text-3xl font-bold text-fg">{formatPrice(price, lang)}</span>
            {hasPromo && (
              <span className="num text-lg text-faint line-through">{formatPrice(product.price_cents, lang)}</span>
            )}
          </div>

          <p className="mt-3 flex items-center gap-2 text-sm text-muted">
            <span className={`h-2 w-2 rounded-full ${product.stock > 0 ? "bg-good shadow-[0_0_8px_#34d399]" : "bg-faint"}`} />
            {product.stock > 0 ? `${product.stock} ${t("product.inStock")}` : t("product.outOfStock")}
          </p>

          {/* Tamanhos */}
          {product.sizes.length > 0 && (
            <div className="mt-7">
              <p className="eyebrow mb-3">{t("product.chooseSize")}</p>
              <div className="flex gap-2.5">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`num min-w-[48px] rounded-xl border py-2.5 text-sm font-semibold transition ${
                      size === s
                        ? "border-brand-500 bg-brand-500/15 text-fg shadow-[inset_0_0_0_1px_#7c6cff]"
                        : "border-line2 bg-surface text-fg hover:border-brand-500"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {description && (
            <div className="mt-7 border-t hairline pt-7">
              <p className="eyebrow mb-3">{lang === "pt" ? "Descrição" : "Description"}</p>
              <p className="whitespace-pre-line leading-relaxed text-muted">{description}</p>
            </div>
          )}

          <div className="mt-8">
            <button className="btn-primary w-full sm:w-auto" onClick={handleAdd} disabled={soldOut}>
              {soldOut ? t("product.outOfStock") : added ? "✓" : t("product.addToCart")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
