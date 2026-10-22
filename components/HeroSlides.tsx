"use client";

import { useEffect, useState } from "react";

const slides = [
  { src: "/images/hero.jpg", pos: "center 30%" },
  { src: "/images/hero-mobile.jpg", pos: "center 22%", girl: true },
  { src: "/images/students.jpg", pos: "center 62%" },
  { src: "/images/women.jpg", pos: "center 42%" },
  { src: "/images/community.jpg", pos: "center 48%" },
];

export function HeroSlides() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setIndex((value) => (value + 1) % slides.length);
    }, 3500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="hero-slides" aria-hidden="true">
      {slides.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt=""
          className={slide.girl ? "slide-girl" : undefined}
          data-on={i === index ? "true" : "false"}
          style={{ ["--pos" as string]: slide.pos }}
        />
      ))}
    </div>
  );
}
