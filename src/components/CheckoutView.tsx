"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useLang } from "@/lib/lang-context";
import { formatPrice } from "@/lib/format";
import { shippingCostCents } from "@/lib/shipping";
import type { ShippingRate } from "@/lib/types";

export default function CheckoutView({ rates }: { rates: ShippingRate[] }) {
  const { items, subtotalCents, keyOf, ready } = useCart();
  const { lang, t } = useLang();
  const [rateId, setRateId] = useState(rates[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", name: "", phone: "", address: "", postal: "", city: "" });

  const selectedRate = rates.find((r) => r.id === rateId) ?? null;
  const shippingCents = useMemo(
    () => (selectedRate ? shippingCostCents(selectedRate, subtotalCents) : 0),
    [selectedRate, subtotalCents]
  );
  const totalCents = subtotalCents + shippingCents;

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, size: i.size })),
          shippingRateId: rateId,
          customer: form,
          lang,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout error");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
      setLoading(false);
    }
  }

  if (!ready) return <div className="container-page py-16" />;

  if (items.length === 0) {
    return (
      <div className="container-page py-16 text-center">
        <p className="text-muted">{t("cart.empty")}</p>
        <Link href="/loja" className="btn-primary mt-4">
          {t("cart.continue")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-3xl font-bold">{t("checkout.title")}</h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-semibold">{t("checkout.contact")}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">{t("checkout.email")} *</label>
                <input type="email" required className="input" value={form.email} onChange={(e) => update("email", e.target.value)} />
              </div>
              <div>
                <label className="label">{t("checkout.name")} *</label>
                <input required className="input" value={form.name} onChange={(e) => update("name", e.target.value)} />
              </div>
              <div>
                <label className="label">{t("checkout.phone")}</label>
                <input className="input" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="mb-4 text-lg font-semibold">{t("checkout.shipping")}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">{t("checkout.address")} *</label>
                <input required className="input" value={form.address} onChange={(e) => update("address", e.target.value)} />
              </div>
              <div>
                <label className="label">{t("checkout.postal")} *</label>
                <input required className="input" value={form.postal} onChange={(e) => update("postal", e.target.value)} />
              </div>
              <div>
                <label className="label">{t("checkout.city")} *</label>
                <input required className="input" value={form.city} onChange={(e) => update("city", e.target.value)} />
              </div>
            </div>

            <div className="mt-6">
              <label className="label">{t("checkout.shippingMethod")}</label>
              <div className="space-y-2">
                {rates.map((rate) => {
                  const cost = shippingCostCents(rate, subtotalCents);
                  return (
                    <label
                      key={rate.id}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 ${
                        rateId === rate.id ? "border-brand-500 bg-brand-500/10" : "border-line"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <input type="radio" name="shipping" checked={rateId === rate.id} onChange={() => setRateId(rate.id)} />
                        <span className="text-sm font-medium">{rate.name}</span>
                      </span>
                      <span className="num text-sm font-semibold">
                        {cost === 0 ? t("checkout.free") : formatPrice(cost, lang)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-20 space-y-3 p-6">
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {items.map((i) => (
                <div key={keyOf(i)} className="flex justify-between text-sm text-muted">
                  <span className="truncate">
                    {i.quantity}× {i.name}
                    {i.size ? ` (${i.size})` : ""}
                  </span>
                  <span className="num">{formatPrice(i.unitPriceCents * i.quantity, lang)}</span>
                </div>
              ))}
            </div>
            <hr className="border-line" />
            <div className="flex justify-between text-muted">
              <span>{t("cart.subtotal")}</span>
              <span className="num">{formatPrice(subtotalCents, lang)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>{t("cart.shipping")}</span>
              <span className="num">{shippingCents === 0 ? t("checkout.free") : formatPrice(shippingCents, lang)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>{t("cart.total")}</span>
              <span className="num">{formatPrice(totalCents, lang)}</span>
            </div>

            {error && <p className="text-sm text-sale">{error}</p>}

            <button type="submit" className="btn-primary w-full" disabled={loading || !rateId}>
              {loading ? "…" : `${t("checkout.pay")} ${formatPrice(totalCents, lang)}`}
            </button>
            <p className="text-center text-xs text-faint">Stripe · 🔒</p>
          </div>
        </div>
      </form>
    </div>
  );
}
