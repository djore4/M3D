"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useLang } from "@/lib/lang-context";
import { formatPrice } from "@/lib/format";
import LineIcon from "@/components/LineIcon";

export default function CartPage() {
  const { items, subtotalCents, setQuantity, removeItem, keyOf, ready } = useCart();
  const { lang, t } = useLang();

  if (!ready) return <div className="container-page py-16" />;

  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-3xl font-bold">{t("cart.title")}</h1>

      {items.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-muted">{t("cart.empty")}</p>
          <Link href="/loja" className="btn-primary mt-4">
            {t("cart.continue")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => {
              const key = keyOf(item);
              return (
                <div key={key} className="card flex items-center gap-4 p-4">
                  <div className="grid h-20 w-20 flex-shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-bg2">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <LineIcon name="cube" className="h-8 w-8 text-brand-300" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/produto/${item.slug}`} className="font-semibold text-fg hover:underline">
                      {item.name}
                    </Link>
                    <p className="num text-sm text-muted">
                      {item.size ? `${t("product.size")} ${item.size} · ` : ""}
                      {formatPrice(item.unitPriceCents, lang)}
                    </p>
                    <button
                      onClick={() => removeItem(key)}
                      className="mt-1 text-xs text-sale hover:underline"
                    >
                      {t("cart.remove")}
                    </button>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center rounded-lg border border-line">
                      <button
                        className="px-3 py-1 text-lg text-muted hover:text-fg"
                        onClick={() => setQuantity(key, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="num w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        className="px-3 py-1 text-lg text-muted hover:text-fg disabled:opacity-40"
                        onClick={() => setQuantity(key, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>
                    <span className="num font-semibold text-fg">
                      {formatPrice(item.unitPriceCents * item.quantity, lang)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="card sticky top-20 space-y-4 p-6">
              <div className="flex justify-between text-muted">
                <span>{t("cart.subtotal")}</span>
                <span className="num font-semibold text-fg">{formatPrice(subtotalCents, lang)}</span>
              </div>
              <p className="text-xs text-faint">
                {t("cart.shipping")} — {lang === "pt" ? "calculado no checkout" : "calculated at checkout"}
              </p>
              <Link href="/checkout" className="btn-primary w-full">
                {t("cart.checkout")}
              </Link>
              <Link href="/loja" className="btn-secondary w-full">
                {t("cart.continue")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
