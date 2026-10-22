"use client";

import { useId, useRef, useState } from "react";
import { copy, type Lang } from "@/lib/copy";
import { site } from "@/lib/site";

const PRESETS = [500, 1000, 2500, 5000] as const;
const MIN_RUPEES = 100;
const MAX_RUPEES = 500000;

type CheckoutSuccess = {
  razorpay_payment_id: string;
};

type CheckoutOptions = {
  key: string;
  amount: number;
  currency: "INR";
  name: string;
  description: string;
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

export function DonateForm({ lang }: { lang: Lang }) {
  const t = copy[lang].support.donate;
  const baseId = useId();
  const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";
  const [preset, setPreset] = useState<number | "other">(2500);
  const [other, setOther] = useState("");
  const [purpose, setPurpose] = useState(t.purposes[2].id);
  const [status, setStatus] = useState<"idle" | "opening" | "done" | "failed" | "closed" | "missing" | "unavailable">("idle");
  const [paymentId, setPaymentId] = useState("");
  const [amountError, setAmountError] = useState("");
  const outcome = useRef<"done" | "failed" | null>(null);

  const rupees = preset === "other" ? Number(other) : preset;
  const purposeLabel = t.purposes.find((item) => item.id === purpose)?.label ?? t.purposes[2].label;

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPaymentId("");
    if (!Number.isInteger(rupees) || rupees < MIN_RUPEES || rupees > MAX_RUPEES) {
      setAmountError(t.min);
      setStatus("idle");
      return;
    }
    setAmountError("");
    if (!key) {
      setStatus("missing");
      return;
    }
    setStatus("opening");
    outcome.current = null;
    const ready = await loadCheckout();
    if (!ready || !window.Razorpay) {
      setStatus("unavailable");
      return;
    }
    const checkout = new window.Razorpay({
      key,
      amount: rupees * 100,
      currency: "INR",
      name: site.nameTitle,
      description: purposeLabel,
      notes: { purpose, language: lang },
      theme: { color: "#0f4c4a" },
      handler: (response) => {
        outcome.current = "done";
        setPaymentId(response.razorpay_payment_id);
        setStatus("done");
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
    <form id="donate" className="donate" onSubmit={onSubmit} noValidate>
      <fieldset>
        <legend>{t.amountLabel}</legend>
        <div className="amount-row">
          {PRESETS.map((amount) => (
            <button
              key={amount}
              type="button"
              aria-pressed={preset === amount}
              onClick={() => {
                setPreset(amount);
                setAmountError("");
              }}
            >
              ₹{amount.toLocaleString("en-IN")}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={preset === "other"}
            onClick={() => setPreset("other")}
          >
            {t.other}
          </button>
        </div>
        {preset === "other" ? (
          <label htmlFor={`${baseId}-amount`}>
            {t.otherLabel}
            <input
              id={`${baseId}-amount`}
              className="field"
              inputMode="numeric"
              autoComplete="transaction-amount"
              value={other}
              aria-invalid={amountError ? true : undefined}
              onChange={(event) => setOther(event.target.value.replace(/\D/g, ""))}
            />
          </label>
        ) : null}
        {amountError ? <p className="field-error">{amountError}</p> : null}
      </fieldset>

      <fieldset>
        <legend>{t.purposeLabel}</legend>
        <div className="purpose-row">
          {t.purposes.map((item) => (
            <label key={item.id}>
              <input
                type="radio"
                name={`${baseId}-purpose`}
                value={item.id}
                checked={purpose === item.id}
                onChange={() => setPurpose(item.id)}
              />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>

      <button className="btn" type="submit" disabled={status === "opening"}>
        {status === "opening" ? t.paying : t.submit}
      </button>

      {status === "done" ? (
        <div className="donate-result" role="status">
          <h2>{t.successTitle}</h2>
          <p>{t.successBody}</p>
          {paymentId ? (
            <p>
              {t.paymentId}: <span>{paymentId}</span>
            </p>
          ) : null}
        </div>
      ) : null}
      {status === "failed" ? <p className="form-alert" role="alert">{t.failed}</p> : null}
      {status === "closed" ? <p className="form-alert" role="status">{t.closed}</p> : null}
      {status === "unavailable" ? <p className="form-alert" role="alert">{t.unavailable}</p> : null}
      {status === "missing" ? <p className="form-alert" role="status">{t.missing}</p> : null}
    </form>
  );
}
