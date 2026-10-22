"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { copy } from "@/lib/copy";
import { languageFromPath } from "@/lib/paths";

export function NotFoundView() {
  const pathname = usePathname() ?? "/";
  const lang = languageFromPath(pathname);
  const t = copy[lang].notFound;
  const base = lang === "hi" ? "/hi" : "";
  const cls = lang === "hi" ? "lang-hi" : "lang-en";

  return (
    <div className={`${cls} page-missing`} lang={lang}>
      <div className="wrap narrow">
        <p className="kicker">{t.kicker}</p>
        <h1>{t.title}</h1>
        <p className="lede">{t.text}</p>
        <Link className="btn" href={base || "/"}>
          {t.home}
        </Link>
      </div>
    </div>
  );
}
