"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useLang } from "@/lib/lang-context";

function SuccessContent() {
  const { clear } = useCart();
  const { t } = useLang();
  const params = useSearchParams();
  const orderId = params.get("order");

  // Esvazia o carrinho ao chegar à página de sucesso
  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="card mx-auto max-w-lg p-10 text-center">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-green-100 text-3xl">
        ✓
      </div>
      <h1 className="text-2xl font-bold text-slate-900">{t("success.title")}</h1>
      <p className="mt-2 text-slate-600">{t("success.subtitle")}</p>
      {orderId && (
        <p className="mt-4 text-sm text-slate-400">
          {t("success.order")}: <span className="font-mono">{orderId.slice(0, 8)}</span>
        </p>
      )}
      <Link href="/" className="btn-primary mt-6">
        {t("success.backHome")}
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="container-page py-20">
      <Suspense fallback={<div className="mx-auto max-w-lg" />}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
