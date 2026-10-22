import type { Lang } from "@/lib/copy";

export function normalizePath(pathname: string) {
  const path = pathname.split("#")[0]?.split("?")[0] || "/";
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path || "/";
}

export function languageFromPath(pathname: string): Lang {
  const path = normalizePath(pathname);
  return path === "/hi" || path.startsWith("/hi/") ? "hi" : "en";
}

export function languageSwitch(pathname: string) {
  const path = normalizePath(pathname);
  const isHi = path === "/hi" || path.startsWith("/hi/");
  const en = isHi ? path.replace(/^\/hi/, "") || "/" : path;
  const hi = en === "/" ? "/hi" : `/hi${en}`;
  return { en, hi };
}

export function prefix(lang: Lang) {
  return lang === "hi" ? "/hi" : "";
}

export function supportHref(lang: Lang, id: string, here?: "support") {
  const base = prefix(lang);
  if (id === "give") return here === "support" ? "#donate" : `${base}/support#donate`;
  return `${base}/contact?about=${id}`;
}

export function withSlash(path: string) {
  if (path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
}
