"use client";

import { useLang } from "@/lib/lang-context";

export default function SobrePage() {
  const { t } = useLang();

  const values = [
    { title: t("about.v1t"), body: t("about.v1p") },
    { title: t("about.v2t"), body: t("about.v2p") },
    { title: t("about.v3t"), body: t("about.v3p") },
  ];

  return (
    <div className="container-page py-16">
      <p className="eyebrow">{t("about.eyebrow")}</p>
      <h1 className="mb-7 mt-3 text-4xl font-extrabold sm:text-5xl">{t("about.title")}</h1>
      <p className="max-w-3xl text-xl leading-relaxed text-fg/90">{t("about.lead")}</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {values.map((v, i) => (
          <div key={i} className="card p-6">
            <div className="num text-xs tracking-widest text-accent2">0{i + 1}</div>
            <h3 className="mt-3 text-lg font-bold">{v.title}</h3>
            <p className="mt-1.5 text-sm text-muted">{v.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-10 border-t hairline pt-8">
        {[
          ["1.2k+", t("about.st1")],
          ["PLA · Resina", t("about.st2")],
          ["100%", t("about.st3")],
        ].map(([b, s]) => (
          <div key={s}>
            <div className="bg-gradient-to-r from-white to-brand-400 bg-clip-text font-display text-3xl font-extrabold text-transparent">
              {b}
            </div>
            <div className="mt-1 text-sm text-faint">{s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
