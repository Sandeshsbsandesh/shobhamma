import Link from "next/link";
import { Arrow } from "@/components/Arrow";
import { copy, type Lang } from "@/lib/copy";

export type ActivityKey = "media" | "announcements" | "grievances" | "others";

const LINKS: { key: ActivityKey; path: string }[] = [
  { key: "media", path: "/media" },
  { key: "announcements", path: "/announcements" },
  { key: "grievances", path: "/grievances" },
  { key: "others", path: "/others" },
];

export function ActivitiesHubView({ lang }: { lang: Lang }) {
  const t = copy[lang].activities;
  const base = lang === "hi" ? "/hi" : "";
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
          <ul className="activity-list">
            {LINKS.map((item, index) => (
              <li key={item.key}>
                <p className="index">0{index + 1}</p>
                <h2>{t[item.key]}</h2>
                <p>{t.pages[item.key].lede}</p>
                <Link className="text-link" href={`${base}${item.path}`}>
                  {t[item.key]}
                  <Arrow />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export function ActivityView({ lang, page }: { lang: Lang; page: ActivityKey }) {
  const t = copy[lang].activities;
  const content = t.pages[page];
  const base = lang === "hi" ? "/hi" : "";
  const cls = lang === "hi" ? "lang-hi" : "lang-en";

  return (
    <div className={cls} lang={lang}>
      <section className="section band-paper">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head-copy">
              <p className="kicker">{content.kicker}</p>
              <h1 className="section-title">{content.title}</h1>
              <p className="lede section-lede">{content.lede}</p>
            </div>
          </div>
          {content.images.length > 0 ? (
            <div className="activity-media-grid">
              {content.images.map((image) => (
                <figure key={image.src} className="activity-media-figure">
                  <img src={image.src} alt={image.alt} />
                </figure>
              ))}
            </div>
          ) : null}
          {content.body.length > 0 ? (
            <article className="purpose-panel">
              {content.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ) : null}
          <div className="activity-actions">
            <Link className="btn" href={`${base}/contact?about=other`}>
              {t.write}
              <Arrow />
            </Link>
            <Link className="text-link" href={`${base}/activities`}>
              {t.kicker}
              <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
