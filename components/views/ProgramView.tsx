import Link from "next/link";
import { Arrow } from "@/components/Arrow";
import { copy, type Lang } from "@/lib/copy";

export type ProgramKey = "womenSkills" | "environment";

const PROGRAM: Record<
  ProgramKey,
  {
    about: string;
    images: { src: string; altEn: string; altHi: string }[];
  }
> = {
  womenSkills: {
    about: "women",
    images: [
      {
        src: "/images/women-skill-sewing.jpg",
        altEn: "Women learning stitching and beauty skills in a training workshop",
        altHi: "प्रशिक्षण कार्यशाला में सिलाई और सौंदर्य कौशल सीखती महिलाएँ",
      },
      {
        src: "/images/women-skill-handwork.png",
        altEn: "Women sitting together learning knitting and handwork skills",
        altHi: "एक साथ बैठकर बुनाई और हस्तकला कौशल सीखती महिलाएँ",
      },
    ],
  },
  environment: {
    about: "environment",
    images: [
      {
        src: "/images/environment-solar.jpg",
        altEn: "Solar panels generating clean energy near a city skyline",
        altHi: "शहर के पास स्वच्छ ऊर्जा पैदा करते सौर पैनल",
      },
      {
        src: "/images/environment-farming.jpg",
        altEn: "A farmer tending green crops in a field as part of land care",
        altHi: "भूमि की देखभाल के रूप में खेत में हरी फसल संभालते किसान",
      },
    ],
  },
};

export function ProgramView({ lang, program }: { lang: Lang; program: ProgramKey }) {
  const t = copy[lang].work;
  const content = t[program];
  const meta = PROGRAM[program];
  const [hero, ...more] = meta.images;
  const base = lang === "hi" ? "/hi" : "";
  const cls = lang === "hi" ? "lang-hi" : "lang-en";

  return (
    <div className={cls} lang={lang}>
      <section className="section band-paper">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head-copy">
              <p className="kicker">{t.kicker}</p>
              <h1 className="section-title">{content.title}</h1>
              <p className="lede section-lede">{content.intro}</p>
            </div>
          </div>
          <div className="work-layout">
            <figure className="work-figure">
              <img src={hero.src} alt={lang === "hi" ? hero.altHi : hero.altEn} />
            </figure>
            <div className="work-copy">
              <p className="index">{content.index}</p>
              <div className="work-lists">
                <div>
                  <h3>{content.canTitle}</h3>
                  <ul className="ticks">
                    {content.can.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>{content.askTitle}</h3>
                  <ul className="ticks">
                    {content.ask.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {more.length > 0 ? (
            <div className="program-gallery">
              {more.map((image) => (
                <figure key={image.src} className="work-figure">
                  <img src={image.src} alt={lang === "hi" ? image.altHi : image.altEn} />
                </figure>
              ))}
            </div>
          ) : null}
          <article className="purpose-panel program-panel">
            {content.pageBody.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
          {content.challenges.length > 0 ? (
            <section className="program-challenges">
              <h2 className="section-title">{content.challengesTitle}</h2>
              <ul className="program-challenge-list">
                {content.challenges.map((item) => (
                  <li key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          <div className="activity-actions">
            <Link className="btn" href={`${base}/contact?about=${meta.about}`}>
              {content.link}
              <Arrow />
            </Link>
            <Link className="text-link" href={`${base}/work`}>
              {t.title}
              <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
