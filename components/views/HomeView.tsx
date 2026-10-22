import Link from "next/link";
import { Arrow, Heart } from "@/components/Arrow";
import { HeroSlides } from "@/components/HeroSlides";
import { Reveal } from "@/components/Reveal";
import { VisionMission } from "@/components/VisionMission";
import { copy, type Lang } from "@/lib/copy";
import { supportHref } from "@/lib/paths";
import { officers } from "@/lib/site";

export function HomeView({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const s = t.showcase;
  const base = lang === "hi" ? "/hi" : "";
  const cls = lang === "hi" ? "lang-hi" : "lang-en";
  const spheres = [
    {
      image: "/images/students.jpg",
      alt: lang === "hi" ? "भारतीय कक्षा में वर्दी पहनकर लिखते विद्यार्थी" : "Students in uniform writing at desks in an Indian classroom",
      title: t.promises.studentTitle,
      text: t.promises.studentText,
      href: `${base}/work#students`,
      link: t.promises.studentLink,
    },
    {
      image: "/images/women.jpg",
      alt: lang === "hi" ? "साड़ी में एक वृद्ध महिला गाँव की पगडंडी पर चल रही हैं" : "An older woman in a sari walking a village path",
      title: t.promises.womanTitle,
      text: t.promises.womanText,
      href: `${base}/work#women`,
      link: t.promises.womanLink,
    },
    {
      image: "/images/community.jpg",
      alt: lang === "hi" ? "साड़ियों में बैठी महिलाओं का एक जमावड़ा" : "A gathering of women in saris sitting together",
      title: t.promises.communityTitle,
      text: t.promises.communityText,
      href: `${base}/work#drives`,
      link: t.promises.communityLink,
    },
  ];

  return (
    <div className={cls} lang={lang}>
      <section className="hero">
        <HeroSlides />
        <div className="hero-shade" aria-hidden="true" />
        <div className="wrap hero-layout">
          <div className="hero-copy">
            <div className="pulse" aria-hidden="true">
              <svg viewBox="0 0 480 32" preserveAspectRatio="none">
                <path
                  d="M0 20 H46 L58 20 L70 8 L84 26 L96 14 L108 20 H286 L298 20 L310 8 L324 26 L336 14 L348 20 H480"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="hero-place">{s.place}</p>
            <h1>
              {(() => {
                let count = 0;
                return s.title.split("\n").map((line) => (
                  <span className="hero-line" key={line}>
                    {line.split(" ").filter(Boolean).map((word) => {
                      const i = count;
                      count += 1;
                      return (
                        <span className="hero-word" key={`${line}-${i}`} style={{ ["--i" as string]: i }}>
                          {word}
                        </span>
                      );
                    })}
                  </span>
                ));
              })()}
            </h1>
            <p className="hero-deck">{t.hero.deck}</p>
            <div className="actions">
              <Link className="btn" href={`${base}/support`}>
                <Heart />
                {t.hero.primary}
                <Arrow />
              </Link>
              <Link className="btn btn-on-dark" href={`${base}/about`}>
                {t.hero.secondary}
                <Arrow />
              </Link>
            </div>
            <p className="hero-local" lang={lang === "hi" ? "en" : "hi"}>
              {localLines(s.local).map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
          </div>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 46c160 34 280 48 460 28s300-58 480-36 300 52 500 28v24H0Z" fill="currentColor" />
        </svg>
      </section>

      <div className="wrap stats-wrap">
        <dl className="stats">
          {s.stats.map((item) => (
            <div key={item.label}>
              <dt>{item.value}</dt>
              <dd>{item.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <section className="section section-after-stats band-paper">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head-copy">
              <p className="kicker">{s.spheresKicker}</p>
              <div className="section-head-title">
                <h2 className="section-title">{s.spheresTitle}</h2>
                <Link className="text-link" href={`${base}/work`}>
                  {t.nav.work}
                  <Arrow />
                </Link>
              </div>
              <p className="lede section-lede">{t.work.lede}</p>
            </div>
          </div>
          <div className="fact-grid">
            {s.stats.slice(0, 3).map((item, index) => (
              <Link className={`fact fact-${index}`} href={factHref(base, index)} key={item.label}>
                <span className="fact-icon" aria-hidden="true">
                  <FactIcon index={index} />
                </span>
                <span className="fact-copy">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </span>
                <span className="fact-go" aria-hidden="true">
                  <Arrow />
                </span>
              </Link>
            ))}
          </div>
          <div className="sphere-grid">
            {spheres.map((item, index) => (
              <article className="sphere" key={item.href}>
                <img src={item.image} alt={item.alt} />
                <div className="sphere-body">
                  <p className="index">0{index + 1}</p>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <Link className="text-link" href={item.href}>
                    {item.link}
                    <Arrow />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <VisionMission lang={lang} />

      <section className="section">
        <div className="wrap chart-wrap">
          <p className="kicker">{t.steps.kicker}</p>
          <h2 className="section-title">{t.steps.title}</h2>
          <Reveal className="chart-reveal">
            <ol className="chart">
              {t.steps.items.map((item) => (
                <li key={item.index}>
                  <span className="chart-dot">{item.index}</span>
                  <article className="chart-card">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="section band-navy">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="kicker">{t.roster.kicker}</p>
              <h2 className="section-title">{s.peopleTitle}</h2>
            </div>
            <Link className="text-link" href={`${base}/people`}>
              {t.roster.link}
              <Arrow />
            </Link>
          </div>
          <ul className="roster">
            {t.people.members.map((member) => {
              const officer = officers.find((item) => item.id === member.id);
              return (
                <li key={member.id}>
                  {officer?.image ? (
                    <img
                      className={officer.portrait === "center" ? "portrait portrait-center" : "portrait"}
                      src={officer.image}
                      alt={member.name}
                    />
                  ) : (
                    <span className="seal">{officer?.initials}</span>
                  )}
                  <span className="roster-name">{member.name}</span>
                  <span className="roster-role">{member.role}</span>
                  <p className="roster-bio">{member.bio}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section involve-band">
        <div className="wrap involve-split">
          <div>
            <p className="kicker">{s.involveKicker}</p>
            <h2 className="section-title">{s.involveTitle}</h2>
            <p className="lede section-lede">{t.support.lede}</p>
          </div>
          <div className="involve-grid">
            {t.support.paths.slice(0, 3).map((path) => (
              <article key={path.index}>
                <span className="involve-icon">
                  <InvolveIcon id={path.links[0].id} />
                </span>
                <h3>{path.title}</h3>
                <p>{path.text}</p>
                <Link className="text-link" href={supportHref(lang, path.links[0].id)}>
                  {path.links[0].label}
                  <Arrow />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="close-band">
        <div className="wrap close-layout">
          <div>
            <p className="kicker">{t.close.kicker}</p>
            <h2>{t.close.title}</h2>
            <p>{t.close.text}</p>
          </div>
          <Link className="btn" href={`${base}/contact`}>
            {t.close.primary}
            <Arrow />
          </Link>
        </div>
      </section>
    </div>
  );
}

function localLines(text: string) {
  if (text.includes("।")) {
    return text.split("। ").map((part, index, all) => (index < all.length - 1 ? `${part}।` : part));
  }
  const parts = text.split(". ");
  if (parts.length === 2) return [`${parts[0]}.`, parts[1]];
  return [text];
}

function factHref(base: string, index: number) {
  if (index === 0) return `${base}/work#students`;
  if (index === 1) return `${base}/work#women`;
  if (index === 2) return `${base}/work#drives`;
  return `${base}/about`;
}

function FactIcon({ index }: { index: number }) {
  const props = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (index === 0) {
    return (
      <svg {...props}>
        <path d="M3 10.5 12 4l9 6.5" />
        <path d="M6 10v8h12v-8" />
        <path d="M10 18v-4h4v4" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg {...props}>
        <path d="M12 19s-6-3.7-6-8a3.4 3.4 0 0 1 6-2 3.4 3.4 0 0 1 6 2c0 4.3-6 8-6 8z" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg {...props}>
        <circle cx="9" cy="9" r="2.4" />
        <circle cx="16" cy="10" r="2" />
        <path d="M4.5 18.5a4.6 4.6 0 0 1 9 0" />
        <path d="M14 18.5a3.6 3.6 0 0 1 5.5-3" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3.5V7M16 3.5V7M4 10h16" />
    </svg>
  );
}

function InvolveIcon({ id }: { id: string }) {
  const props = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
  if (id === "give") {
    return (
      <svg {...props}>
        <path d="M12 20.5s-6.5-4.1-6.5-9.2A3.7 3.7 0 0 1 12 8.4a3.7 3.7 0 0 1 6.5 2.9c0 5.1-6.5 9.2-6.5 9.2z" />
      </svg>
    );
  }
  if (id === "volunteer") {
    return (
      <svg {...props}>
        <path d="M8 12.5V11a4 4 0 0 1 8 0v1.5" />
        <path d="M4.5 12.5h3.2L9 19.5H7.2A2.2 2.2 0 0 1 5 17.3v-4.8z" />
        <path d="M19.5 12.5h-3.2L15 19.5h1.8a2.2 2.2 0 0 0 2.2-2.2v-4.8z" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <circle cx="9" cy="8" r="2.6" />
      <path d="M4 18.5a5 5 0 0 1 10 0" />
      <circle cx="16.5" cy="9" r="2" />
      <path d="M15.2 18.5a4.2 4.2 0 0 1 4.3-3.6" />
    </svg>
  );
}
