"use client";

import { useEffect, useId, useState } from "react";
import type { Lang } from "@/lib/copy";

type CertId = "80g" | "12a";

const CERTS: Record<
  CertId,
  { label: string; href: string; mark: string }
> = {
  "80g": { label: "80G", href: "/certificates/80G.pdf", mark: "80G" },
  "12a": { label: "12A", href: "/certificates/12A.pdf", mark: "12A" },
};

export function CertBadges({
  lang,
  title,
  hint,
  openLabel,
  closeLabel,
  viewLabel,
}: {
  lang: Lang;
  title: string;
  hint: string;
  openLabel: string;
  closeLabel: string;
  viewLabel: string;
}) {
  const [open, setOpen] = useState<CertId | null>(null);
  const titleId = useId();
  const active = open ? CERTS[open] : null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="cert-badges" lang={lang}>
      <p className="cert-badges-title">{title}</p>
      <p className="cert-badges-hint">{hint}</p>
      <div className="cert-badge-row">
        {(Object.keys(CERTS) as CertId[]).map((id) => {
          const cert = CERTS[id];
          return (
            <button
              key={id}
              type="button"
              className="cert-badge"
              onClick={() => setOpen(id)}
              aria-label={`${openLabel} ${cert.label}`}
            >
              <span className="cert-badge-icon" aria-hidden="true">
                <svg viewBox="0 0 64 64" width="40" height="40">
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
            </button>
          );
        })}
      </div>

      {active ? (
        <div
          className="cert-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={() => setOpen(null)}
        >
          <div className="cert-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cert-modal-head">
              <h2 id={titleId}>{active.label}</h2>
              <div className="cert-modal-actions">
                <a className="text-link" href={active.href} target="_blank" rel="noreferrer">
                  {viewLabel}
                </a>
                <button type="button" className="btn btn-ghost" onClick={() => setOpen(null)}>
                  {closeLabel}
                </button>
              </div>
            </div>
            <iframe className="cert-frame" title={active.label} src={`${active.href}#view=FitH`} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
