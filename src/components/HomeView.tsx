"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import ProductGrid from "./ProductGrid";
import CubeMark from "./CubeMark";
import type { Product } from "@/lib/types";

export default function HomeView({
  featured,
  promos,
}: {
  featured: Product[];
  promos: Product[];
}) {
  const { lang, t } = useLang();

  const specs =
    lang === "pt"
      ? ["Impressão sob encomenda", "PLA / Resina", "Feito em Portugal"]
      : ["Made to order", "PLA / Resin", "Made in Portugal"];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b hairline">
        <div className="container-page grid gap-12 py-20 sm:py-28 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <p className="eyebrow mb-5">Merch · 3D · Studio</p>
            <h1 className="text-[2.6rem] font-extrabold leading-[1.02] text-ink-950 sm:text-6xl">
              {t("home.hero.title")}
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-500">{t("home.hero.subtitle")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/loja" className="btn-primary">
                {t("home.hero.cta")}
                <span aria-hidden>→</span>
              </Link>
              <Link href="/loja" className="btn-secondary">
                {lang === "pt" ? "Ver promoções" : "See sale"}
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
              {specs.map((s) => (
                <span key={s} className="flex items-center gap-2 text-sm text-ink-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Painel visual */}
          <div className="relative mx-auto hidden aspect-square w-full max-w-sm lg:block">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400 shadow-lift" />
            <div
              className="absolute inset-0 rounded-[2rem] opacity-[0.15]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div className="absolute inset-0 grid place-items-center">
              <CubeMark className="h-40 w-40 text-white drop-shadow-2xl" />
            </div>
            <div className="num absolute bottom-5 left-5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              0.1mm · precision
            </div>
          </div>
        </div>
      </section>

      <div className="container-page space-y-16 py-16">
        {promos.length > 0 && (
          <Section eyebrow={lang === "pt" ? "Preços especiais" : "Special prices"} title={t("home.promos")}>
            <ProductGrid products={promos} />
          </Section>
        )}
        {featured.length > 0 && (
          <Section eyebrow={lang === "pt" ? "Seleção da casa" : "Editor's picks"} title={t("home.featured")}>
            <ProductGrid products={featured} />
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-6">
        <p className="eyebrow mb-2">{eyebrow}</p>
        <h2 className="text-2xl font-bold text-ink-950 sm:text-3xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}
