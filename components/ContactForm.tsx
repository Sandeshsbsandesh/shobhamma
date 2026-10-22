"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { Lang } from "@/lib/copy";
import { copy } from "@/lib/copy";
import { prefix } from "@/lib/paths";
import { site } from "@/lib/site";

const REASON_IDS = ["student", "woman", "volunteer", "partner", "drive", "other"] as const;

type ReasonId = (typeof REASON_IDS)[number];

function isReason(value: string): value is ReasonId {
  return (REASON_IDS as readonly string[]).includes(value);
}

export function ContactForm({ lang }: { lang: Lang }) {
  const t = copy[lang].contact.form;
  const baseId = useId();
  const successRef = useRef<HTMLHeadingElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [gave, setGave] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [letter, setLetter] = useState("");
  const [subject, setSubject] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const about = new URLSearchParams(window.location.search).get("about") ?? "";
    if (about === "give") setGave(true);
    else if (isReason(about)) setReason(about);
  }, []);

  function validate() {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = t.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = t.errors.email;
    if (!isReason(reason)) next.reason = t.errors.reason;
    if (message.trim().length < 10) next.message = t.errors.message;
    return next;
  }

  function compose(reasonId: ReasonId) {
    const reasonLabel = t.reasons.find((item) => item.id === reasonId)?.label ?? reasonId;
    const subjectLine = `Shobhaamma — ${reasonLabel}`;
    const body = [
      `Language: ${lang === "hi" ? "Hindi" : "English"}`,
      `About: ${reasonLabel}`,
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      phone.trim() ? `Phone: ${phone.trim()}` : "",
      "",
      message.trim(),
      "",
      "Sent from the contact form at shobhaamma.com",
    ]
      .filter((line) => line !== "")
      .join("\n");
    return { subjectLine, body };
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    setCopied(false);
    if (Object.keys(next).length > 0 || !isReason(reason)) {
      setLetter("");
      return;
    }
    const composed = compose(reason);
    setSubject(composed.subjectLine);
    setLetter(composed.body);
    requestAnimationFrame(() => successRef.current?.focus());
  }

  async function copyLetter() {
    try {
      await navigator.clipboard.writeText(`To: ${site.email}\nSubject: ${subject}\n\n${letter}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const mailtoBody = letter.length > 1500 ? `${letter.slice(0, 1500)}\n\n[…]` : letter;
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailtoBody)}`;

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      {Object.keys(errors).length > 0 ? (
        <p className="form-alert" role="alert">
          {t.errorSummary}
        </p>
      ) : null}

      <label htmlFor={`${baseId}-name`}>
        {t.name}
        <input
          id={`${baseId}-name`}
          className="field"
          name="name"
          autoComplete="name"
          value={name}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? `${baseId}-name-error` : undefined}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      {errors.name ? (
        <p id={`${baseId}-name-error`} className="field-error">
          {errors.name}
        </p>
      ) : null}

      <label htmlFor={`${baseId}-email`}>
        {t.email}
        <input
          id={`${baseId}-email`}
          className="field"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? `${baseId}-email-error` : undefined}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      {errors.email ? (
        <p id={`${baseId}-email-error`} className="field-error">
          {errors.email}
        </p>
      ) : null}

      <label htmlFor={`${baseId}-phone`}>
        <span>
          {t.phone} <span className="optional">({t.optional})</span>
        </span>
        <input
          id={`${baseId}-phone`}
          className="field"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </label>

      <label htmlFor={`${baseId}-reason`}>
        {t.reason}
        <select
          id={`${baseId}-reason`}
          className="field"
          name="reason"
          value={reason}
          aria-invalid={errors.reason ? true : undefined}
          aria-describedby={errors.reason ? `${baseId}-reason-error` : undefined}
          onChange={(event) => setReason(event.target.value)}
        >
          <option value="">{t.placeholder}</option>
          {t.reasons.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      {errors.reason ? (
        <p id={`${baseId}-reason-error`} className="field-error">
          {errors.reason}
        </p>
      ) : null}

      {gave ? (
        <p className="form-alert">
          {t.giveNote}{" "}
          <Link href={`${prefix(lang)}/support#donate`}>{t.giveLink}</Link>
        </p>
      ) : null}

      <label htmlFor={`${baseId}-message`}>
        {t.message}
        <textarea
          id={`${baseId}-message`}
          className="field"
          name="message"
          rows={7}
          maxLength={4000}
          value={message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? `${baseId}-message-error` : undefined}
          onChange={(event) => setMessage(event.target.value)}
        />
      </label>
      {errors.message ? (
        <p id={`${baseId}-message-error`} className="field-error">
          {errors.message}
        </p>
      ) : null}

      <button className="btn" type="submit">
        {t.submit}
      </button>

      {letter ? (
        <div className="letter">
          <h2 ref={successRef} tabIndex={-1}>
            {t.sentTitle}
          </h2>
          <p>{t.sentBody}</p>
          <textarea className="field" readOnly value={letter} rows={8} />
          <div className="actions">
            <a className="btn" href={mailto}>
              {t.mailto}
            </a>
            <button className="btn btn-ghost" type="button" onClick={copyLetter}>
              {copied ? t.copied : t.copy}
            </button>
          </div>
        </div>
      ) : null}
    </form>
  );
}
