"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useLang } from "@/lib/lang-context";
import LangSwitcher from "./LangSwitcher";
import CubeMark from "./CubeMark";

export default function Navbar() {
  const { count } = useCart();
  const { t } = useLang();

  return (
    <header className="sticky top-0 z-40 border-b hairline bg-bg/70 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-[#0a0a0e] shadow-glow transition-transform group-hover:-translate-y-0.5">
            <CubeMark className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight text-fg">M3D</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium text-muted sm:flex">
          <Link href="/" className="rounded-lg px-3 py-2 transition hover:bg-surface hover:text-fg">
            {t("nav.home")}
          </Link>
          <Link href="/loja" className="rounded-lg px-3 py-2 transition hover:bg-surface hover:text-fg">
            {t("nav.shop")}
          </Link>
          <Link href="/sobre" className="rounded-lg px-3 py-2 transition hover:bg-surface hover:text-fg">
            {t("nav.about")}
          </Link>
        </nav>

        <div className="flex items-center gap-2.5">
          <LangSwitcher />
          <Link
            href="/carrinho"
            className="relative flex items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2 text-sm font-semibold text-fg transition hover:border-brand-500 hover:shadow-glow"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 3h2l2.4 12.3a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L21 7H6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9.5" cy="20" r="1.3" /><circle cx="18" cy="20" r="1.3" />
            </svg>
            <span className="hidden sm:inline">{t("nav.cart")}</span>
            {count > 0 && (
              <span className="num grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1 text-[11px] font-bold text-[#0a0a0e]">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
