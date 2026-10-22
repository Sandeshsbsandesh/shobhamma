import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

const pages = ["", "/about", "/work", "/people", "/support", "/contact"];

function url(path: string) {
  if (path === "" || path === "/") return `${site.url}/`;
  return `${site.url}${path.endsWith("/") ? path : `${path}/`}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((page) => {
    const en = url(page);
    const hi = url(page === "" ? "/hi" : `/hi${page}`);
    const languages = { "en-IN": en, "hi-IN": hi };
    return [
      { url: en, alternates: { languages } },
      { url: hi, alternates: { languages } },
    ];
  });
}
