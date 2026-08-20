"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DEFAULT_LANG, t as translate, type Lang, type TranslationKey } from "./i18n";

const STORAGE_KEY = "m3d.lang";

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === "pt" || saved === "en") setLangState(saved);
    } catch {
      // ignora
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignora
    }
  }, []);

  const t = useCallback((key: TranslationKey) => translate(lang, key), [lang]);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang deve ser usado dentro de <LangProvider>");
  return ctx;
}
