import Link from "next/link";
import { Arrow } from "@/components/Arrow";
import { copy, type Lang } from "@/lib/copy";

export function WorkView({ lang }: { lang: Lang }) {
  const t = copy[lang].work;
  const base = lang === "hi" ? "/hi" : "";
  const cls = lang === "hi" ? "lang-hi" : "lang-en";
  const blocks = [
    {
      ...t.students,
      id: "students",
      about: "student",
      image: "/images/students.jpg",
      alt: lang === "hi" ? "भारतीय कक्षा में वर्दी पहनकर लिखते विद्यार्थी" : "Students in uniform writing at desks in an Indian classroom",
    },
    {
      ...t.women,
      id: "women",
      about: "woman",
      image: "/images/women.jpg",
      alt: lang === "hi" ? "साड़ी में एक वृद्ध महिला गाँव की पगडंडी पर चल रही हैं" : "An older woman in a sari walking a village path",
    },
    { ...t.community, id: "drives", about: "drive", image: "", alt: "" },
  ];

  return (
    <div className={cls} lang={lang}>
      {blocks.map((block, index) => (
        <section
          className={index % 2 === 0 ? "section work-block band-paper" : "section work-block"}
          id={block.id}
          key={block.id}
        >
          <div className="wrap">
            {index === 0 ? (
              <div className="section-head">
                <div className="section-head-copy">
                  <p className="kicker">{t.kicker}</p>
                  <h1 className="section-title">{t.title}</h1>
                  <p className="lede section-lede">{t.lede}</p>
                </div>
              </div>
            ) : null}
            <div className={index % 2 === 1 ? "work-layout work-flip" : "work-layout"}>
            {block.image ? (
              <figure className="work-figure">
                <img src={block.image} alt={block.alt} />
              </figure>
            ) : (
              <div className="work-figure work-figure-plain" aria-hidden="true">
                <span>{block.index}</span>
              </div>
            )}
            <div className="work-copy">
              <p className="index">{block.index}</p>
              <h2>{block.title}</h2>
              <p className="lede">{block.intro}</p>
              <div className="work-lists">
                <div>
                  <h3>{block.canTitle}</h3>
                  <ul className="ticks">
                    {block.can.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>{block.askTitle}</h3>
                  <ul className="ticks">
                    {block.ask.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <Link className="btn" href={`${base}/contact?about=${block.about}`}>
                {block.link}
                <Arrow />
              </Link>
            </div>
            </div>
          </div>
        </section>
      ))}

      <section className="section">
        <div className="wrap narrow">
          <h2 className="section-title">{t.limitsTitle}</h2>
          <ul className="ticks limits">
            {t.limits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
