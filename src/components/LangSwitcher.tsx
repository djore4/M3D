"use client";

import { useLang } from "@/lib/lang-context";
import { LANGS } from "@/lib/i18n";

export default function LangSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center rounded-xl border border-ink-200 bg-white/80 p-0.5">
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`num rounded-lg px-2 py-1 text-[11px] font-bold uppercase tracking-wider transition ${
            lang === l ? "bg-brand-600 text-white" : "text-ink-400 hover:text-ink-700"
          }`}
          aria-pressed={lang === l}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
