import { site } from "@/lib/site";

export function Logo({ tone = "color" }: { tone?: "color" | "light" }) {
  return (
    <img
      className="logo-lockup"
      src={tone === "light" ? "/images/logo-light.png" : "/images/logo.png"}
      alt={site.nameTitle}
      width={520}
      height={160}
      decoding="async"
    />
  );
}
