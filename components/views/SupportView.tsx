import Link from "next/link";
import { Arrow } from "@/components/Arrow";
import { DonateForm } from "@/components/DonateForm";
import { copy, type Lang } from "@/lib/copy";
import { supportHref } from "@/lib/paths";

export function SupportView({ lang }: { lang: Lang }) {
  const t = copy[lang].support;
  const cls = lang === "hi" ? "lang-hi" : "lang-en";

  return (
    <div className={cls} lang={lang}>
      <section className="section band-paper">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head-copy">
              <p className="kicker">{t.kicker}</p>
              <h1 className="section-title">{t.title}</h1>
              <p className="lede section-lede">{t.lede}</p>
            </div>
          </div>
          <DonateForm lang={lang} />
          <div className="support-grid">
            {t.paths.map((path) => (
              <article key={path.index}>
                <p className="index">{path.index}</p>
                <h2>{path.title}</h2>
                <p>{path.text}</p>
                <div className="stack-links">
                  {path.links.map((link) => (
                    <Link key={link.id} href={supportHref(lang, link.id, "support")}>
                      {link.label}
                      <Arrow />
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <aside className="note note-strong">
            <p>{t.warning}</p>
          </aside>
        </div>
      </section>
    </div>
  );
}
