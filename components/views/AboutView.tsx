import { Register } from "@/components/Register";
import { VisionMission } from "@/components/VisionMission";
import { copy, type Lang } from "@/lib/copy";
import { site } from "@/lib/site";

export function AboutView({ lang }: { lang: Lang }) {
  const t = copy[lang].about;
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
            <p className="display-date">{site.founded[lang]}</p>
          </div>
          <article className="purpose-panel">
            <h2>{t.storyTitle}</h2>
            {t.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        </div>
      </section>

      <VisionMission lang={lang} />

      <section className="section band-paper">
        <div className="wrap">
          <h2 className="section-title">{t.valuesTitle}</h2>
          <ol className="values">
            {t.values.map((value, index) => (
              <li key={value.title}>
                <span>0{index + 1}</span>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" id="record">
        <div className="wrap">
          <h2 className="section-title">{t.recordTitle}</h2>
          <Register lang={lang} />
          <p className="note">{t.recordNote}</p>
        </div>
      </section>
    </div>
  );
}
