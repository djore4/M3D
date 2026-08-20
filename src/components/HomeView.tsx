"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import ProductGrid from "./ProductGrid";
import type { Product } from "@/lib/types";

export default function HomeView({
  featured,
  promos,
}: {
  featured: Product[];
  promos: Product[];
}) {
  const { t } = useLang();

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-br from-brand-50 to-white">
        <div className="container-page grid gap-8 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              {t("home.hero.title")}
            </h1>
            <p className="mt-4 text-lg text-slate-600">{t("home.hero.subtitle")}</p>
            <Link href="/loja" className="btn-primary mt-6">
              {t("home.hero.cta")}
            </Link>
          </div>
          <div className="hidden justify-center lg:flex">
            <div className="grid h-64 w-64 place-items-center rounded-3xl bg-white text-8xl shadow-inner">
              🖨️
            </div>
          </div>
        </div>
      </section>

      <div className="container-page space-y-12 py-12">
        {promos.length > 0 && (
          <section>
            <h2 className="mb-4 text-2xl font-bold text-slate-900">{t("home.promos")}</h2>
            <ProductGrid products={promos} />
          </section>
        )}

        {featured.length > 0 && (
          <section>
            <h2 className="mb-4 text-2xl font-bold text-slate-900">{t("home.featured")}</h2>
            <ProductGrid products={featured} />
          </section>
        )}
      </div>
    </div>
  );
}
