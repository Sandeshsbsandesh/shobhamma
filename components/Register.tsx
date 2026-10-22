import type { Lang } from "@/lib/copy";
import { copy } from "@/lib/copy";
import { site } from "@/lib/site";

export function Register({ lang }: { lang: Lang }) {
  const t = copy[lang].register;
  const rows = [
    { label: t.name, value: site.name },
    { label: t.founded, value: site.founded[lang] },
    { label: t.number, value: site.registration },
    { label: t.seat, value: t.seatValue },
  ];

  return (
    <dl className="register" aria-label={t.kicker}>
      {rows.map((row) => (
        <div key={row.label}>
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
