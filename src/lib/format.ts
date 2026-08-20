import type { Lang } from "./i18n";

/** Formata cêntimos como moeda (EUR por defeito). */
export function formatPrice(cents: number, lang: Lang = "pt", currency = "EUR"): string {
  const locale = lang === "pt" ? "pt-PT" : "en-IE";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(cents / 100);
}

export function formatDate(iso: string, lang: Lang = "pt"): string {
  const locale = lang === "pt" ? "pt-PT" : "en-GB";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** Converte um texto num slug amigável para URLs. */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove acentos/diacríticos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
