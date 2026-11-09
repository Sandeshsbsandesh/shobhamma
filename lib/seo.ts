import type { Metadata } from "next";
import { copy, type Lang } from "@/lib/copy";
import { withSlash } from "@/lib/paths";
import { site } from "@/lib/site";

const PATHS = {
  home: "",
  about: "/about",
  work: "/work",
  people: "/people",
  support: "/support",
  contact: "/contact",
  activities: "/activities",
  media: "/media",
  announcements: "/announcements",
  grievances: "/grievances",
  others: "/others",
  womenSkills: "/work/women-skill-development",
  environment: "/work/environment-development",
} as const;

export type PageKey = keyof typeof PATHS;

const ogImage = {
  url: "/images/education-study.jpg",
  width: 1600,
  height: 900,
  alt: "Shobhaamma Charitable Foundation — education for children and students",
};

export function metadataFor(lang: Lang, key: PageKey): Metadata {
  const meta = copy[lang].meta[key];
  const stem = PATHS[key];
  const enPath = withSlash(stem || "/");
  const hiPath = withSlash(stem ? `/hi${stem}` : "/hi");
  const canonical = lang === "hi" ? hiPath : enPath;

  return {
    title: { absolute: meta.title },
    description: meta.description,
    keywords: [
      site.nameTitle,
      site.name,
      ...site.alsoKnownAs,
      "education charity India",
      "student scholarship Patna",
      "charitable foundation Bihar",
    ],
    applicationName: site.nameTitle,
    authors: [{ name: site.nameTitle, url: site.url }],
    creator: site.nameTitle,
    publisher: site.nameTitle,
    category: "nonprofit",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical,
      languages: {
        "en-IN": enPath,
        "hi-IN": hiPath,
        "x-default": enPath,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonical,
      siteName: site.nameTitle,
      locale: lang === "hi" ? "hi_IN" : "en_IN",
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [ogImage.url],
    },
  };
}
