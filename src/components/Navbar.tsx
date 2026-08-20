"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useLang } from "@/lib/lang-context";
import LangSwitcher from "./LangSwitcher";

export default function Navbar() {
  const { count } = useCart();
  const { t } = useLang();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">3D</span>
          <span className="hidden sm:inline">M3D</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-medium text-slate-600">
          <Link href="/" className="rounded px-3 py-2 hover:bg-slate-100">
            {t("nav.home")}
          </Link>
          <Link href="/loja" className="rounded px-3 py-2 hover:bg-slate-100">
            {t("nav.shop")}
          </Link>
          <Link href="/carrinho" className="relative rounded px-3 py-2 hover:bg-slate-100">
            {t("nav.cart")}
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LangSwitcher />
          <Link href="/admin" className="hidden rounded px-3 py-2 text-sm text-slate-400 hover:text-slate-600 sm:inline">
            {t("nav.admin")}
          </Link>
        </div>
      </div>
    </header>
  );
}
