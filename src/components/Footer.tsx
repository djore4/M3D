"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import CubeMark from "./CubeMark";

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t hairline bg-white/60">
      <div className="container-page flex flex-col items-center justify-between gap-4 py-10 sm:flex-row">
        <Link href="/" className="flex items-center gap-2 text-ink-800">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-white">
            <CubeMark className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-extrabold">M3D</span>
        </Link>
        <p className="text-sm text-ink-400">
          © {year} M3D · {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
