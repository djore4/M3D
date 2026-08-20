"use client";

import { useLang } from "@/lib/lang-context";
import { LANGS } from "@/lib/i18n";

export default function LangSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center gap-1 text-xs font-semibold">
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded px-2 py-1 uppercase transition ${
            lang === l ? "bg-brand-600 text-white" : "text-slate-500 hover:bg-slate-100"
          }`}
          aria-pressed={lang === l}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
