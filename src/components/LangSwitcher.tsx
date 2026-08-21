"use client";

import { useLang } from "@/lib/lang-context";
import { LANGS } from "@/lib/i18n";

export default function LangSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center rounded-xl border border-line bg-surface p-0.5">
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`num rounded-lg px-2 py-1 text-[11px] font-bold uppercase tracking-wider transition ${
            lang === l ? "bg-brand-500 text-[#0a0a0e]" : "text-faint hover:text-fg"
          }`}
          aria-pressed={lang === l}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
