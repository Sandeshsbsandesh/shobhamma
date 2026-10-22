import { ContactForm } from "@/components/ContactForm";
import { copy, type Lang } from "@/lib/copy";
import { site } from "@/lib/site";

export function ContactView({ lang }: { lang: Lang }) {
  const t = copy[lang].contact;
  const lines = site.address[lang];
  const cls = lang === "hi" ? "lang-hi" : "lang-en";

  return (
    <div className={cls} lang={lang}>
      <section className="section band-paper">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head-copy">
              <p className="kicker">{t.kicker}</p>
              <h1 className="section-title">{t.title}</h1>
              <p className="lede section-lede">{t.lede}</p>
            </div>
          </div>
          <div className="contact-grid">
          <ContactForm lang={lang} />
          <aside className="contact-aside">
            <div>
              <h2>{t.addressTitle}</h2>
              <address>
                {lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
              <a href={site.maps} target="_blank" rel="noopener noreferrer">
                {copy[lang].footer.map}
              </a>
            </div>
            <div>
              <h2>{t.emailTitle}</h2>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
            <p className="note">{t.phoneNote}</p>
          </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
