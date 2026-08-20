"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useLang } from "@/lib/lang-context";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, subtotalCents, setQuantity, removeItem, ready } = useCart();
  const { lang, t } = useLang();

  if (!ready) return <div className="container-page py-16" />;

  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">{t("cart.title")}</h1>

      {items.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-slate-500">{t("cart.empty")}</p>
          <Link href="/loja" className="btn-primary mt-4">
            {t("cart.continue")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div key={item.productId} className="card flex items-center gap-4 p-4">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-2xl text-slate-300">🖨️</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/produto/${item.slug}`} className="font-semibold text-slate-900 hover:underline">
                    {item.name}
                  </Link>
                  <p className="text-sm text-slate-500">{formatPrice(item.unitPriceCents, lang)}</p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="mt-1 text-xs text-red-600 hover:underline"
                  >
                    {t("cart.remove")}
                  </button>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center rounded-lg border border-slate-300">
                    <button
                      className="px-3 py-1 text-lg text-slate-600 hover:bg-slate-100"
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      className="px-3 py-1 text-lg text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                      onClick={() => setQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {formatPrice(item.unitPriceCents * item.quantity, lang)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="card sticky top-20 space-y-4 p-6">
              <div className="flex justify-between text-slate-700">
                <span>{t("cart.subtotal")}</span>
                <span className="font-semibold">{formatPrice(subtotalCents, lang)}</span>
              </div>
              <p className="text-xs text-slate-400">
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
