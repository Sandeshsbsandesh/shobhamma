import type { Metadata } from "next";
import { copy, type Lang } from "@/lib/copy";
import { withSlash } from "@/lib/paths";

const PATHS = {
  home: "",
  about: "/about",
  work: "/work",
  people: "/people",
  support: "/support",
  contact: "/contact",
} as const;

export type PageKey = keyof typeof PATHS;

export function metadataFor(lang: Lang, key: PageKey): Metadata {
  const meta = copy[lang].meta[key];
  const stem = PATHS[key];
  const enPath = withSlash(stem || "/");
  const hiPath = withSlash(stem ? `/hi${stem}` : "/hi");
  const canonical = lang === "hi" ? hiPath : enPath;

  return {
    title: { absolute: meta.title },
    description: meta.description,
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
      siteName: "Shobhaamma Charitable Foundation",
      locale: lang === "hi" ? "hi_IN" : "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: meta.title,
      description: meta.description,
    },
  };
}
