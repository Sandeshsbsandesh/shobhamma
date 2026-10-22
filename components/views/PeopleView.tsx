import { copy, type Lang } from "@/lib/copy";
import { officers } from "@/lib/site";

export function PeopleView({ lang }: { lang: Lang }) {
  const t = copy[lang].people;
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
          <ul className="people">
            {t.members.map((member) => {
              const officer = officers.find((item) => item.id === member.id);
              const photo = officer?.image;
              const initials = officer?.initials;
              return (
                <li key={member.id}>
                  {photo ? (
                    <img
                      className={
                        officer?.portrait === "center"
                          ? "portrait portrait-large portrait-center"
                          : "portrait portrait-large"
                      }
                      src={photo}
                      alt={member.name}
                    />
                  ) : (
                    <span className="seal seal-large" aria-hidden="true">
                      {initials}
                    </span>
                  )}
                  <div>
                    <h2>{member.name}</h2>
                    <p className="roster-role">{member.role}</p>
                    <p>{member.bio}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          {t.photoNote ? <p className="note">{t.photoNote}</p> : null}
        </div>
      </section>
    </div>
  );
}
