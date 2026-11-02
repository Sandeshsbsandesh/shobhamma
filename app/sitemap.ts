import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

const pages = ["", "/about", "/work", "/people", "/support", "/contact"] as const;

function url(path: string) {
  if (path === "" || path === "/") return `${site.url}/`;
  return `${site.url}${path.endsWith("/") ? path : `${path}/`}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return pages.flatMap((page) => {
    const en = url(page);
    const hi = url(page === "" ? "/hi" : `/hi${page}`);
    const languages = { "en-IN": en, "hi-IN": hi, "x-default": en };
    const priority = page === "" ? 1 : page === "/about" || page === "/work" ? 0.9 : 0.7;

    return [
      {
        url: en,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority,
        alternates: { languages },
      },
      {
        url: hi,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority,
        alternates: { languages },
      },
    ];
  });
}
