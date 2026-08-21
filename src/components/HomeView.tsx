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

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b hairline">
        <div className="container-page grid gap-12 py-20 sm:py-28 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <p className="eyebrow mb-5">Merch · 3D · Studio</p>
            <h1 className="text-[2.7rem] font-extrabold leading-[1.03] sm:text-6xl">
              {lang === "pt" ? "Objetos impressos " : "Objects printed "}
              <span className="bg-gradient-to-r from-white via-brand-400 to-accent2 bg-clip-text text-transparent">
                {lang === "pt" ? "em 3D" : "in 3D"}
              </span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">{t("home.hero.subtitle")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/loja" className="btn-primary">
                {t("home.hero.cta")}
                <span aria-hidden>→</span>
              </Link>
              <Link href="/sobre" className="btn-secondary">
                {t("nav.about")}
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-8">
              {[
                ["0.1", "mm", lang === "pt" ? "precisão" : "precision"],
                ["PLA", "", lang === "pt" ? "reciclável" : "recyclable"],
                ["24h", "", lang === "pt" ? "resposta" : "reply"],
              ].map(([a, b, c]) => (
                <div key={c} className="flex flex-col gap-0.5">
                  <span className="num text-xl font-semibold text-fg">
                    {a}
                    <span className="text-[13px]">{b}</span>
                  </span>
                  <span className="text-xs text-faint">{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Painel visual */}
          <div className="relative mx-auto hidden aspect-square w-full max-w-sm overflow-hidden rounded-[26px] border border-line2 lg:block"
            style={{ background: "radial-gradient(120% 120% at 30% 20%,#1b1830,#0c0c14)" }}>
            <div className="techgrid absolute inset-0 opacity-60" />
            <div className="absolute inset-0 grid place-items-center">
              <CubeMark className="h-40 w-40 text-brand-400 drop-shadow-[0_20px_40px_rgba(124,108,255,.6)]" />
            </div>
            <div className="num absolute bottom-5 left-5 rounded-lg border border-line2 bg-bg/60 px-3 py-1.5 text-xs text-fg backdrop-blur">
              {"// rendering · 0.1mm"}
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
        <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}
