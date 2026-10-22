"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { copy } from "@/lib/copy";
import { languageFromPath } from "@/lib/paths";
import { site } from "@/lib/site";

export function Footer() {
  const pathname = usePathname() ?? "/";
  const lang = languageFromPath(pathname);
  const t = copy[lang];
  const base = lang === "hi" ? "/hi" : "";
  const year = new Date().getFullYear();
  const span = year > site.foundedYear ? `${site.foundedYear}–${year}` : String(site.foundedYear);
  const lines = site.address[lang];

  return (
    <footer className={`site-footer ${lang === "hi" ? "lang-hi" : "lang-en"}`} lang={lang}>
      <div className="wrap footer-grid">
        <div>
          <Link className="logo-link" href={base || "/"} aria-label={t.nav.home}>
            <Logo tone="light" />
          </Link>
        </div>
        <div>
          <p className="kicker">{t.footer.org}</p>
          <Link href={`${base}/about`}>{t.nav.about}</Link>
          <Link href={`${base}/work`}>{t.nav.work}</Link>
          <Link href={`${base}/people`}>{t.nav.people}</Link>
          <Link href={`${base}/about#record`}>{t.about.recordTitle}</Link>
        </div>
        <div>
          <p className="kicker">{t.nav.support}</p>
          <Link href={`${base}/support`}>{t.support.paths[0].title}</Link>
          <Link href={`${base}/support`}>{t.support.paths[1].title}</Link>
          <Link href={`${base}/support`}>{t.support.paths[2].title}</Link>
          <Link href={`${base}/contact`}>{t.nav.contact}</Link>
        </div>
        <div>
          <p className="kicker">{t.footer.visit}</p>
          <address>
            {lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={site.maps} target="_blank" rel="noopener noreferrer">
            {t.footer.map}
          </a>
        </div>
      </div>
      <div className="wrap footer-base">
        <p>
          © {span} {site.nameTitle}. {t.footer.rights}
        </p>
        <p>
          {t.register.number}: {site.registration}
        </p>
      </div>
    </footer>
  );
}
