import type { Lang } from "@/lib/copy";
import { copy } from "@/lib/copy";
import { site } from "@/lib/site";

const CERTS = [
  { id: "80g", mark: "80G", number: site.certs.section80G },
  { id: "12a", mark: "12A", number: site.certs.section12A },
] as const;

export function CertBadges({ lang, title }: { lang: Lang; title: string }) {
  const regLabel = copy[lang].about.certRegNo;

  return (
    <div className="cert-badges" lang={lang}>
      <p className="cert-badges-title">{title}</p>
      <ul className="cert-badge-row">
        {CERTS.map((cert) => (
          <li key={cert.id} className="cert-badge">
            <div className="cert-badge-top">
              <span className="cert-badge-icon" aria-hidden="true">
                <svg viewBox="0 0 64 64" width="28" height="28">
                  <path
                    d="M32 4 52 12v18c0 14.5-9.2 24.8-20 28-10.8-3.2-20-13.5-20-28V12L32 4z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 32.5 29 39.5 43 24.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="cert-badge-mark">{cert.mark}</span>
            </div>
            <p className="cert-number">
              <span className="cert-reg-label">{regLabel}</span>
              <span className="cert-reg-value">{cert.number}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
