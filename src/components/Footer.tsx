"use client";

import { useLang } from "@/lib/lang-context";

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="container-page flex flex-col items-center justify-between gap-2 py-8 text-sm text-slate-500 sm:flex-row">
        <p>© {year} M3D</p>
        <p>{t("footer.rights")}</p>
      </div>
    </footer>
  );
}
