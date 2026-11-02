import { copy, type Lang } from "@/lib/copy";

export function VisionMission({ lang }: { lang: Lang }) {
  const t = copy[lang].about;

  return (
    <section className="section mv-band" id="vision">
      <div className="wrap mv">
        <div className="mv-stage">
          <p className="mv-ribbon">{t.mvRibbon}</p>
          <span className="mv-dots" aria-hidden="true" />
          <img
            className="mv-photo mv-photo-small"
            src="/images/vision-students.jpg"
            alt={
              lang === "hi"
                ? "भारतीय कक्षा में साथ पढ़ती छात्राएँ"
                : "Girls learning together in an Indian classroom"
            }
          />
          <img
            className="mv-photo mv-photo-main"
            src="/images/education-study.jpg"
            alt={
              lang === "hi"
                ? "सीढ़ियों पर बैठकर किताबें पढ़ते भारतीय बच्चे"
                : "Indian children reading books together on stone steps"
            }
          />
          <p className="mv-badge">
            <strong>{t.mvMark}</strong>
            <span>{t.mvMarkLabel}</span>
          </p>
        </div>
        <div className="mv-copy">
          <p className="mv-seal">{t.mvSeal}</p>
          <h2>{t.visionTitle}</h2>
          <p className="mv-highlight">{t.vision}</p>
          <h2>{t.missionTitle}</h2>
          <p className="mv-highlight">{t.mission}</p>
        </div>
      </div>
    </section>
  );
}
