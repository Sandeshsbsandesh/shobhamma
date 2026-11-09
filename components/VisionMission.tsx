"use client";

import { useEffect, useState } from "react";
import { copy, type Lang } from "@/lib/copy";

type Slide = { src: string; altEn: string; altHi: string };

const MAIN_SLIDES: Slide[] = [
  {
    src: "/images/education-study.jpg",
    altEn: "Children reading books together",
    altHi: "एक साथ किताबें पढ़ते बच्चे",
  },
  {
    src: "/images/environment-solar.jpg",
    altEn: "Solar panels generating clean energy",
    altHi: "स्वच्छ ऊर्जा पैदा करते सौर पैनल",
  },
  {
    src: "/images/women-skill-sewing.jpg",
    altEn: "Women learning stitching skills in a training workshop",
    altHi: "प्रशिक्षण में सिलाई कौशल सीखती महिलाएँ",
  },
  {
    src: "/images/environment-farming.jpg",
    altEn: "A farmer tending green crops in a field",
    altHi: "खेत में हरी फसल संभालते किसान",
  },
  {
    src: "/images/community.jpg",
    altEn: "Students learning together in a classroom",
    altHi: "कक्षा में साथ सीखते विद्यार्थी",
  },
];

const SMALL_SLIDES: Slide[] = [
  {
    src: "/images/women-skill-sewing.jpg",
    altEn: "Women learning stitching and beauty skills",
    altHi: "सिलाई और सौंदर्य कौशल सीखती महिलाएँ",
  },
  {
    src: "/images/students.jpg",
    altEn: "Students writing in a classroom",
    altHi: "कक्षा में लिखते विद्यार्थी",
  },
  {
    src: "/images/women-skill-handwork.png",
    altEn: "Women learning knitting and handwork together",
    altHi: "एक साथ बुनाई और हस्तकला सीखती महिलाएँ",
  },
  {
    src: "/images/environment-solar.jpg",
    altEn: "Clean energy from a solar farm",
    altHi: "सौर फार्म से स्वच्छ ऊर्जा",
  },
  {
    src: "/images/vision-students.jpg",
    altEn: "Girls learning together in class",
    altHi: "कक्षा में साथ पढ़ती छात्राएँ",
  },
];

function PhotoStack({
  slides,
  index,
  className,
  lang,
}: {
  slides: Slide[];
  index: number;
  className: string;
  lang: Lang;
}) {
  return (
    <div className={`mv-photo-stack ${className}`} aria-hidden={false}>
      {slides.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={i === index ? (lang === "hi" ? slide.altHi : slide.altEn) : ""}
          data-on={i === index ? "true" : "false"}
        />
      ))}
    </div>
  );
}

export function VisionMission({ lang }: { lang: Lang }) {
  const t = copy[lang].about;
  const [mainIndex, setMainIndex] = useState(0);
  const [smallIndex, setSmallIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mainId = window.setInterval(() => {
      setMainIndex((value) => (value + 1) % MAIN_SLIDES.length);
    }, 3800);

    const smallId = window.setInterval(() => {
      setSmallIndex((value) => (value + 1) % SMALL_SLIDES.length);
    }, 3200);

    return () => {
      window.clearInterval(mainId);
      window.clearInterval(smallId);
    };
  }, []);

  return (
    <section className="section mv-band" id="vision">
      <div className="wrap mv">
        <div className="mv-stage">
          <p className="mv-ribbon">{t.mvRibbon}</p>
          <span className="mv-dots" aria-hidden="true" />
          <PhotoStack
            slides={SMALL_SLIDES}
            index={smallIndex}
            className="mv-photo-small"
            lang={lang}
          />
          <PhotoStack
            slides={MAIN_SLIDES}
            index={mainIndex}
            className="mv-photo-main"
            lang={lang}
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
