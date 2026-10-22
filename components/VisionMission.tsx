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
            src="/images/vision-care.jpg"
            alt={
              lang === "hi"
                ? "नारंगी साड़ी में बैठी एक वृद्ध महिला"
                : "An older woman in an orange sari sitting outdoors"
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
