"use client";

import { useEffect, useId, useRef, useState } from "react";
import { copy, type Lang } from "@/lib/copy";
import { INDIA_STATES } from "@/lib/india";
import { site } from "@/lib/site";

const MIN_RUPEES = 1;
const MAX_RUPEES = 500000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const DOB_RE = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d{2}$/;

type CheckoutSuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type CheckoutOptions = {
  key: string;
  amount: number;
  currency: "INR";
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  handler: (response: CheckoutSuccess) => void;
  notes: Record<string, string>;
  theme: { color: string };
  modal: { ondismiss: () => void };
};

type Checkout = {
  open: () => void;
  on: (event: "payment.failed", handler: () => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: CheckoutOptions) => Checkout;
  }
}

function loadCheckout() {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function normalizePan(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 10);
}

/** Formats typed digits as DD-MM-YYYY while the user types. */
function formatDobInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
}

function isValidDob(value: string) {
  if (!DOB_RE.test(value)) return false;
  const [dd, mm, yyyy] = value.split("-").map(Number);
  const date = new Date(yyyy, mm - 1, dd);
  return date.getFullYear() === yyyy && date.getMonth() === mm - 1 && date.getDate() === dd;
}

export function DonateForm({ lang, razorpayKey }: { lang: Lang; razorpayKey: string }) {
  const t = copy[lang].support.donate;
  const baseId = useId();
  const publicKey = razorpayKey || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
  const formRef = useRef<HTMLFormElement>(null);

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pan, setPan] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [gender, setGender] = useState(t.genders[0].id);
  const [dob, setDob] = useState("");
  const [marital, setMarital] = useState(t.marital[0].id);
  const [country, setCountry] = useState("India");
  const [stateName, setStateName] = useState("Bihar");
  const [city, setCity] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [pincode, setPincode] = useState("");
  const [amount, setAmount] = useState("2500");
  const [purpose, setPurpose] = useState(t.purposes[0].id);
  const [project, setProject] = useState("");

  const [status, setStatus] = useState<
    "idle" | "opening" | "done" | "failed" | "closed" | "missing" | "unavailable"
  >("idle");
  const [paymentId, setPaymentId] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [receipt, setReceipt] = useState<{
    name: string;
    email: string;
    phone: string;
    pan: string;
    aadhaar: string;
    gender: string;
    dob: string;
    marital: string;
    address: string;
    amount: string;
    purpose: string;
    project: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errorDetail, setErrorDetail] = useState("");
  const outcome = useRef<"done" | "failed" | null>(null);

  const rupees = Number(amount);
  const mobile = digitsOnly(phone).slice(-10);
  const panValue = normalizePan(pan);
  const aadhaarValue = digitsOnly(aadhaar).slice(0, 12);
  const purposeLabel = t.purposes.find((item) => item.id === purpose)?.label ?? purpose;
  const projectLabel = t.projects.find((item) => item.id === project)?.label ?? project;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#donate") return;
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  function validate() {
    const next: Record<string, string> = {};
    if (firstName.trim().length < 1) next.firstName = t.errors.firstName;
    if (lastName.trim().length < 1) next.lastName = t.errors.lastName;
    if (!EMAIL_RE.test(email.trim())) next.email = t.errors.email;
    if (mobile.length !== 10) next.phone = t.errors.phone;

    const hasPan = panValue.length > 0;
    const hasAadhaar = aadhaarValue.length > 0;
    if (!hasPan && !hasAadhaar) next.id = t.errors.id;
    if (hasPan && !PAN_RE.test(panValue)) next.pan = t.errors.panInvalid;
    if (hasAadhaar && aadhaarValue.length !== 12) next.aadhaar = t.errors.aadhaarInvalid;

    if (!gender) next.gender = t.errors.gender;
    if (!isValidDob(dob.trim())) next.dob = t.errors.dob;
    if (!marital) next.marital = t.errors.marital;
    if (!country) next.country = t.errors.country;
    if (!stateName) next.state = t.errors.state;
    if (city.trim().length < 2) next.city = t.errors.city;
    if (addressLine.trim().length < 3) next.address = t.errors.address;
    if (digitsOnly(pincode).length !== 6) next.pincode = t.errors.pincode;
    if (!Number.isInteger(rupees) || rupees < MIN_RUPEES || rupees > MAX_RUPEES) next.amount = t.errors.amount;
    if (!purpose) next.purpose = t.errors.purpose;
    if (!project) next.project = t.errors.project;

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPaymentId("");
    setErrorDetail("");
    if (!validate()) {
      setStatus("idle");
      return;
    }
    if (!publicKey) {
      setStatus("missing");
      return;
    }

    setStatus("opening");
    outcome.current = null;

    const fullName = [firstName, middleName, lastName].map((part) => part.trim()).filter(Boolean).join(" ");
    const genderLabel = t.genders.find((item) => item.id === gender)?.label ?? gender;
    const maritalLabel = t.marital.find((item) => item.id === marital)?.label ?? marital;
    // Register API expects English labels (e.g. Male, General, Education support).
    const genderEn =
      ({ male: "Male", female: "Female", transgender: "Transgender" } as Record<string, string>)[gender] ||
      genderLabel;
    const maritalEn = ({ single: "Single", married: "Married" } as Record<string, string>)[marital] || maritalLabel;
    const purposeEn =
      ({ where: "General", education: "School fees and books", supplies: "Uniforms and school supplies" } as Record<
        string,
        string
      >)[purpose] || purposeLabel;
    const projectEn =
      ({
        education: "Education support",
        supplies: "Books and uniforms",
        community: "Community programmes",
        general: "Wherever the need is",
      } as Record<string, string>)[project] || projectLabel;

    const registerPayload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: mobile,
      pan: panValue,
      aadhaar: aadhaarValue,
      gender: genderEn,
      dateOfBirth: dob.trim(),
      maritalStatus: maritalEn,
      country,
      state: stateName,
      city: city.trim(),
      addressLine1: addressLine.trim(),
      pinCode: digitsOnly(pincode),
      amount: rupees,
      purpose: purposeEn,
      projectName: projectEn,
    };

    // GoodKarma register MUST run before create-order (visible in Network as register/).
    let registrationToken = "";
    let gkNotes: Record<string, string> = {
      name: fullName,
      email: email.trim(),
      phone: mobile,
      pan: panValue,
    };
    try {
      const registerRes = await fetch("/api/v1/razorpay-donate/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerPayload),
        cache: "no-store",
      });
      const registerJson = (await registerRes.json().catch(() => ({}))) as {
        details?: {
          data?: {
            registrationToken?: string;
            razorpayNotes?: Record<string, string>;
          };
        };
        data?: {
          registrationToken?: string;
          razorpayNotes?: Record<string, string>;
        };
      };
      const gkData = registerJson.details?.data || registerJson.data;
      if (gkData?.razorpayNotes) {
        gkNotes = { ...gkNotes, ...gkData.razorpayNotes };
      }
      registrationToken =
        gkData?.registrationToken || gkData?.razorpayNotes?.registration_token || "";
      if (registrationToken) {
        gkNotes.registration_token = registrationToken;
      }
    } catch {
      // Continue to payment even if register fails.
    }

    let order: { order_id: string; amount: number; currency: string; key_id?: string };
    try {
      const res = await fetch("/api/create-order/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: rupees * 100,
          currency: "INR",
          purpose,
          language: lang,
          donor_name: fullName,
          donor_email: email.trim(),
          donor_phone: mobile,
          donor_pan: panValue,
          donor_aadhaar_last4: aadhaarValue ? aadhaarValue.slice(-4) : "",
          donor_gender: gender,
          donor_dob: dob.trim(),
          donor_marital: marital,
          donor_country: country,
          donor_state: stateName,
          donor_city: city.trim(),
          donor_address: addressLine.trim(),
          donor_pincode: digitsOnly(pincode),
          project,
          registration_token: registrationToken,
        }),
      });
      const data = (await res.json()) as {
        order_id?: string;
        amount?: number;
        currency?: string;
        key_id?: string;
        error?: string;
      };
      if (!res.ok || !data.order_id || !data.amount) {
        setErrorDetail(data.error || t.unavailable);
        setStatus("unavailable");
        return;
      }
      order = {
        order_id: data.order_id,
        amount: Number(data.amount),
        currency: data.currency || "INR",
        key_id: data.key_id,
      };
    } catch {
      setErrorDetail(t.unavailable);
      setStatus("unavailable");
      return;
    }

    const ready = await loadCheckout();
    if (!ready || !window.Razorpay) {
      setErrorDetail(t.unavailable);
      setStatus("unavailable");
      return;
    }

    const checkout = new window.Razorpay({
      key: order.key_id || publicKey,
      amount: order.amount,
      currency: "INR",
      name: site.nameTitle,
      description: `${purposeLabel} · ${projectLabel}`,
      order_id: order.order_id,
      prefill: {
        name: fullName,
        email: email.trim(),
        contact: `+91${mobile}`,
      },
      notes: {
        ...gkNotes,
        purpose,
        project,
        language: lang,
        donor_name: fullName,
        donor_email: email.trim(),
        donor_phone: mobile,
        donor_pan: panValue,
        donor_city: city.trim(),
        donor_state: stateName,
      },
      theme: { color: "#0f4c4a" },
      handler: async (response) => {
        try {
          const verify = await fetch("/api/verify-payment/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const result = (await verify.json()) as { verified?: boolean; error?: string };
          if (!verify.ok || !result.verified) {
            outcome.current = "failed";
            setErrorDetail(result.error || t.failed);
            setStatus("failed");
            return;
          }
          outcome.current = "done";
          setPaymentId(response.razorpay_payment_id);
          setReceipt({
            name: fullName,
            email: email.trim(),
            phone: `+91${mobile}`,
            pan: panValue,
            aadhaar: aadhaarValue,
            gender: genderEn,
            dob: dob.trim(),
            marital: maritalEn,
            address: [addressLine.trim(), city.trim(), stateName, country, digitsOnly(pincode)]
              .filter(Boolean)
              .join(", "),
            amount: `₹${rupees.toLocaleString("en-IN")}`,
            purpose: purposeEn,
            project: projectEn,
          });
          setShowSuccess(true);
          setStatus("done");
        } catch {
          outcome.current = "failed";
          setStatus("failed");
        }
      },
      modal: {
        ondismiss: () => {
          if (!outcome.current) setStatus("closed");
        },
      },
    });

    checkout.on("payment.failed", () => {
      outcome.current = "failed";
      setStatus("failed");
    });

    setStatus("idle");
    checkout.open();
  }

  return (
    <form id="donate" className="donate donor-reg" ref={formRef} onSubmit={onSubmit} noValidate>
      <h2 className="donate-form-title">{t.formTitle}</h2>
      <p className="donate-hint">{t.hint}</p>

      <div className="reg-row">
        <p className="reg-label">{t.nameLabel}</p>
        <div className="reg-fields reg-3">
          <input className="field" placeholder={t.firstName} value={firstName} aria-invalid={!!fieldErrors.firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input className="field" placeholder={t.middleName} value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
          <input className="field" placeholder={t.lastName} value={lastName} aria-invalid={!!fieldErrors.lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
      </div>
      {(fieldErrors.firstName || fieldErrors.lastName) && (
        <p className="field-error reg-error">{fieldErrors.firstName || fieldErrors.lastName}</p>
      )}

      <div className="reg-row">
        <p className="reg-label">{t.contactLabel}</p>
        <div className="reg-fields reg-2">
          <div className="phone-field">
            <span className="phone-prefix" aria-hidden="true">
              +91
            </span>
            <input
              className="field"
              placeholder={t.phone}
              inputMode="numeric"
              value={phone}
              aria-invalid={!!fieldErrors.phone}
              onChange={(e) => setPhone(digitsOnly(e.target.value).slice(0, 10))}
            />
          </div>
          <input
            className="field"
            type="email"
            placeholder={t.email}
            value={email}
            aria-invalid={!!fieldErrors.email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      {(fieldErrors.phone || fieldErrors.email) && (
        <p className="field-error reg-error">{fieldErrors.phone || fieldErrors.email}</p>
      )}

      <div className="reg-row">
        <p className="reg-label" aria-hidden="true" />
        <div className="reg-id-block">
          <div className="reg-fields reg-2">
            <div>
              <input
                className="field"
                placeholder={t.pan}
                value={pan}
                aria-invalid={!!fieldErrors.pan || !!fieldErrors.id}
                onChange={(e) => setPan(normalizePan(e.target.value))}
              />
              <p className="field-hint">{t.panHelp}</p>
            </div>
            <input
              className="field"
              placeholder={t.aadhaar}
              inputMode="numeric"
              value={aadhaar}
              aria-invalid={!!fieldErrors.aadhaar || !!fieldErrors.id}
              onChange={(e) => setAadhaar(digitsOnly(e.target.value).slice(0, 12))}
            />
          </div>
          <p className="id-note">{t.idNote}</p>
        </div>
      </div>
      {(fieldErrors.id || fieldErrors.pan || fieldErrors.aadhaar) && (
        <p className="field-error reg-error">{fieldErrors.id || fieldErrors.pan || fieldErrors.aadhaar}</p>
      )}

      <div className="reg-row">
        <p className="reg-label">{t.genderLabel}</p>
        <div className="reg-choices" role="radiogroup" aria-label={t.genderLabel}>
          {t.genders.map((item) => (
            <label key={item.id}>
              <input type="radio" name={`${baseId}-gender`} checked={gender === item.id} onChange={() => setGender(item.id)} />
              {item.label}
            </label>
          ))}
        </div>
      </div>
      {fieldErrors.gender ? <p className="field-error reg-error">{fieldErrors.gender}</p> : null}

      <div className="reg-row">
        <p className="reg-label">{t.dobLabel}</p>
        <div className="reg-fields reg-1">
          <input
            className="field"
            inputMode="numeric"
            autoComplete="bday"
            placeholder={t.dobPlaceholder}
            value={dob}
            maxLength={10}
            aria-invalid={!!fieldErrors.dob}
            onChange={(e) => {
              const next = formatDobInput(e.target.value);
              setDob(next);
              if (fieldErrors.dob && isValidDob(next)) {
                setFieldErrors((prev) => {
                  const copyErr = { ...prev };
                  delete copyErr.dob;
                  return copyErr;
                });
              }
            }}
          />
        </div>
      </div>
      {fieldErrors.dob ? <p className="field-error reg-error">{fieldErrors.dob}</p> : null}

      <div className="reg-row">
        <p className="reg-label">{t.maritalLabel}</p>
        <div className="reg-choices" role="radiogroup" aria-label={t.maritalLabel}>
          {t.marital.map((item) => (
            <label key={item.id}>
              <input type="radio" name={`${baseId}-marital`} checked={marital === item.id} onChange={() => setMarital(item.id)} />
              {item.label}
            </label>
          ))}
        </div>
      </div>
      {fieldErrors.marital ? <p className="field-error reg-error">{fieldErrors.marital}</p> : null}

      <div className="reg-row">
        <p className="reg-label">{t.addressLabel}</p>
        <div className="reg-fields reg-3">
          <select className="field" value={country} aria-invalid={!!fieldErrors.country} onChange={(e) => setCountry(e.target.value)}>
            <option value="India">India</option>
          </select>
          <select className="field" value={stateName} aria-invalid={!!fieldErrors.state} onChange={(e) => setStateName(e.target.value)}>
            {INDIA_STATES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input className="field" placeholder={t.city} value={city} aria-invalid={!!fieldErrors.city} onChange={(e) => setCity(e.target.value)} />
        </div>
      </div>
      <div className="reg-row">
        <p className="reg-label" aria-hidden="true" />
        <div className="reg-fields reg-address">
          <input
            className="field"
            placeholder={t.addressLine}
            value={addressLine}
            aria-invalid={!!fieldErrors.address}
            onChange={(e) => setAddressLine(e.target.value)}
          />
          <input
            className="field"
            placeholder={t.pincode}
            inputMode="numeric"
            value={pincode}
            aria-invalid={!!fieldErrors.pincode}
            onChange={(e) => setPincode(digitsOnly(e.target.value).slice(0, 6))}
          />
        </div>
      </div>
      {(fieldErrors.country || fieldErrors.state || fieldErrors.city || fieldErrors.address || fieldErrors.pincode) && (
        <p className="field-error reg-error">
          {fieldErrors.country || fieldErrors.state || fieldErrors.city || fieldErrors.address || fieldErrors.pincode}
        </p>
      )}

      <div className="reg-row">
        <p className="reg-label">{t.amountLabel}</p>
        <div className="reg-fields reg-1">
          <input
            className="field"
            placeholder={t.amountPlaceholder}
            inputMode="numeric"
            value={amount}
            aria-invalid={!!fieldErrors.amount}
            onChange={(e) => setAmount(digitsOnly(e.target.value))}
          />
        </div>
      </div>
      {fieldErrors.amount ? <p className="field-error reg-error">{fieldErrors.amount}</p> : null}

      <div className="reg-row">
        <p className="reg-label">{t.purposeLabel}</p>
        <div className="reg-fields reg-1">
          <select className="field" value={purpose} aria-invalid={!!fieldErrors.purpose} onChange={(e) => setPurpose(e.target.value)}>
            {t.purposes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="reg-row">
        <p className="reg-label">{t.projectLabel}</p>
        <div className="reg-fields reg-1">
          <select className="field" value={project} aria-invalid={!!fieldErrors.project} onChange={(e) => setProject(e.target.value)}>
            <option value="">{t.projectPlaceholder}</option>
            {t.projects.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {fieldErrors.project ? <p className="field-error reg-error">{fieldErrors.project}</p> : null}

      <div className="reg-actions">
        <button className="btn" type="submit" disabled={status === "opening"}>
          {status === "opening" ? t.paying : t.submit}
        </button>
      </div>

      {showSuccess && receipt ? (
        <div
          className="donate-success-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${baseId}-success-title`}
          onClick={() => setShowSuccess(false)}
        >
          <div className="donate-success-modal" onClick={(e) => e.stopPropagation()}>
            <h2 id={`${baseId}-success-title`}>{t.successTitle}</h2>
            <p className="donate-success-body">{t.successBody}</p>
            <p className="donate-success-contact">{t.successContact}</p>
            <dl className="donate-success-details">
              <div>
                <dt>{t.nameLabel}</dt>
                <dd>{receipt.name}</dd>
              </div>
              <div>
                <dt>{t.email}</dt>
                <dd>{receipt.email}</dd>
              </div>
              <div>
                <dt>{t.phone}</dt>
                <dd>{receipt.phone}</dd>
              </div>
              {receipt.pan ? (
                <div>
                  <dt>{t.pan}</dt>
                  <dd>{receipt.pan}</dd>
                </div>
              ) : null}
              {receipt.aadhaar ? (
                <div>
                  <dt>{t.aadhaar}</dt>
                  <dd>{receipt.aadhaar}</dd>
                </div>
              ) : null}
              <div>
                <dt>{t.genderLabel}</dt>
                <dd>{receipt.gender}</dd>
              </div>
              <div>
                <dt>{t.dobLabel}</dt>
                <dd>{receipt.dob}</dd>
              </div>
              <div>
                <dt>{t.maritalLabel}</dt>
                <dd>{receipt.marital}</dd>
              </div>
              <div>
                <dt>{t.addressLabel}</dt>
                <dd>{receipt.address}</dd>
              </div>
              <div>
                <dt>{t.receiptAmount}</dt>
                <dd>{receipt.amount}</dd>
              </div>
              <div>
                <dt>{t.purposeLabel}</dt>
                <dd>{receipt.purpose}</dd>
              </div>
              <div>
                <dt>{t.projectLabel}</dt>
                <dd>{receipt.project}</dd>
              </div>
              {paymentId ? (
                <div>
                  <dt>{t.paymentId}</dt>
                  <dd>{paymentId}</dd>
                </div>
              ) : null}
            </dl>
            <button className="btn" type="button" onClick={() => setShowSuccess(false)}>
              {t.successClose}
            </button>
          </div>
        </div>
      ) : null}
      {status === "failed" ? (
        <p className="form-alert" role="alert">
          {errorDetail || t.failed}
        </p>
      ) : null}
      {status === "closed" ? <p className="form-alert" role="status">{t.closed}</p> : null}
      {status === "unavailable" ? (
        <p className="form-alert" role="alert">
          {errorDetail || t.unavailable}
        </p>
      ) : null}
      {status === "missing" ? <p className="form-alert" role="status">{t.missing}</p> : null}
    </form>
  );
}
