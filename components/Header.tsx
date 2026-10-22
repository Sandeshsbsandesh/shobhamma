"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Heart } from "@/components/Arrow";
import { Logo } from "@/components/Logo";
import { copy } from "@/lib/copy";
import { languageFromPath, languageSwitch, normalizePath } from "@/lib/paths";

export function Header() {
  const pathname = usePathname() ?? "/";
  const lang = languageFromPath(pathname);
  const t = copy[lang];
  const base = lang === "hi" ? "/hi" : "";
  const { en, hi } = languageSwitch(pathname);
  const [open, setOpen] = useState(false);
  const current = normalizePath(pathname);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang === "hi" ? "hi" : "en";
    root.classList.toggle("lang-hi", lang === "hi");
    root.classList.toggle("lang-en", lang !== "hi");
  }, [lang]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const onHome = current === "/" || current === "/hi";
  const homeHref = base || "/";

  const menus = [
    {
      label: t.nav.about,
      href: `${base}/about`,
      items: [
        { href: `${base}/about`, label: t.about.storyTitle },
        { href: `${base}/people`, label: t.nav.people },
        { href: `${base}/about#record`, label: t.about.recordTitle },
      ],
    },
    { label: t.nav.work, href: `${base}/work`, items: undefined },
    {
      label: t.nav.support,
      href: `${base}/support`,
      items: [
        { href: `${base}/support#donate`, label: t.support.donate.submit },
        { href: `${base}/contact?about=student`, label: t.support.paths[1].title },
        { href: `${base}/contact?about=volunteer`, label: t.support.paths[2].title },
      ],
    },
    { label: t.nav.contact, href: `${base}/contact`, items: undefined },
  ];

  function active(href: string) {
    return normalizePath(href) === current;
  }

  return (
    <header className={`site-header ${lang === "hi" ? "lang-hi" : "lang-en"}`} lang={lang}>
      <a className="skip" href="#content">
        {t.nav.skip}
      </a>
      <div className="wrap header-bar">
        <Link className="logo-link" href={base || "/"} aria-label={t.nav.home}>
          <Logo />
        </Link>
        <nav className="desktop-nav" aria-label={lang === "hi" ? "मुख्य" : "Main"}>
          {onHome ? null : (
            <div className="nav-item">
              <Link href={homeHref}>{t.nav.homeLink}</Link>
            </div>
          )}
          {menus.map((menu) => (
            <div className="nav-item" key={menu.href}>
              <Link href={menu.href} aria-current={active(menu.href) ? "page" : undefined}>
                {menu.label}
                {menu.items ? <Caret /> : null}
              </Link>
              {menu.items ? (
                <div className="dropdown">
                  {menu.items.map((item) => (
                    <Link key={item.href + item.label} href={item.href}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
        <div className="header-tools">
          <Link className="btn header-donate" href={`${base}/support#donate`}>
            <Heart />
            <span className="donate-full">{t.support.donate.submit}</span>
            <span className="donate-short">{lang === "hi" ? "दान" : "Donate"}</span>
          </Link>
          <nav className="lang-switch" aria-label={t.lang.label}>
            <Link href={en} hrefLang="en" aria-current={lang === "en" ? "page" : undefined}>
              {t.lang.en}
            </Link>
            <Link href={hi} hrefLang="hi" lang="hi" aria-current={lang === "hi" ? "page" : undefined}>
              {t.lang.hi}
            </Link>
          </nav>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? t.nav.close : t.nav.menu}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="menu-word">{open ? t.nav.close : t.nav.menu}</span>
            <span className="menu-icon" aria-hidden="true">
              {open ? (
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path d="M5 5l10 10M15 5 5 15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path d="M3 6h14M3 10h14M3 14h14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              )}
            </span>
          </button>
        </div>
      </div>
      <div id="site-menu" className={open ? "nav-panel open" : "nav-panel"} hidden={!open}>
        <div className="panel-tools">
          <nav className="lang-switch panel-lang" aria-label={t.lang.label}>
            <Link href={en} hrefLang="en" aria-current={lang === "en" ? "page" : undefined}>
              {t.lang.en}
            </Link>
            <Link href={hi} hrefLang="hi" lang="hi" aria-current={lang === "hi" ? "page" : undefined}>
              {t.lang.hi}
            </Link>
          </nav>
        </div>
        <nav className="panel-nav" aria-label={t.nav.menu}>
          {onHome ? null : (
            <div className="panel-group">
              <Link className="panel-main" href={homeHref} onClick={() => setOpen(false)}>
                {t.nav.homeLink}
              </Link>
            </div>
          )}
          {menus.map((menu) => (
            <div className="panel-group" key={menu.href}>
              <Link
                className="panel-main"
                href={menu.href}
                aria-current={active(menu.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {menu.label}
              </Link>
              {menu.items ? (
                <div className="panel-sub">
                  {menu.items.map((item) => (
                    <Link key={item.href + item.label} href={item.href} onClick={() => setOpen(false)}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
        <Link className="btn panel-donate" href={`${base}/support#donate`} onClick={() => setOpen(false)}>
          {t.support.donate.submit}
        </Link>
      </div>
    </header>
  );
}

function Caret() {
  return (
    <svg className="caret" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
