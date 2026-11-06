import { NextResponse } from "next/server";
import { getRazorpayClient, getRazorpayCredentials } from "@/lib/razorpay";

export const runtime = "nodejs";

const MIN_PAISE = 100;
const MAX_PAISE = 500000 * 100;

type Body = {
  amount?: number;
  currency?: string;
  purpose?: string;
  language?: string;
  project?: string;
  donor_name?: string;
  donor_email?: string;
  donor_phone?: string;
  donor_pan?: string;
  donor_aadhaar_last4?: string;
  donor_gender?: string;
  donor_dob?: string;
  donor_marital?: string;
  donor_country?: string;
  donor_state?: string;
  donor_city?: string;
  donor_address?: string;
  donor_pincode?: string;
  registration_token?: string;
};

function note(value: unknown, max = 100) {
  return String(value || "").slice(0, max);
}

export async function POST(request: Request) {
  const { keyId, keySecret } = getRazorpayCredentials();
  if (!keyId || !keySecret) {
    return NextResponse.json(
      {
        error:
          "Live Razorpay keys are missing. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET (rzp_live_...) to .env.local and restart the server.",
      },
      { status: 401 },
    );
  }
  if (keyId.startsWith("rzp_test_")) {
    return NextResponse.json(
      {
        error:
          "Test keys are still in use. Switch to Live API Keys (rzp_live_...) in .env.local for real payments.",
      },
      { status: 400 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const amount = Number(body.amount);
  const currency = (body.currency || "INR").toUpperCase();

  if (!Number.isInteger(amount) || amount < MIN_PAISE || amount > MAX_PAISE) {
    return NextResponse.json(
      { error: `Amount must be an integer between ${MIN_PAISE} and ${MAX_PAISE} paise` },
      { status: 400 },
    );
  }

  if (currency !== "INR") {
    return NextResponse.json({ error: "Only INR is supported" }, { status: 400 });
  }

  try {
    const razorpay = getRazorpayClient();
    // Keep notes small — Razorpay rejects oversized / empty note maps.
    const notes: Record<string, string> = {};
    const add = (key: string, value: unknown, max = 100) => {
      const text = note(value, max).trim();
      if (text) notes[key] = text;
    };
    add("registration_token", body.registration_token, 80);
    add("purpose", body.purpose);
    add("project", body.project);
    add("name", body.donor_name);
    add("donor_name", body.donor_name);
    add("email", body.donor_email);
    add("donor_email", body.donor_email);
    add("phone", body.donor_phone, 20);
    add("donor_phone", body.donor_phone, 20);
    add("pan", body.donor_pan, 10);
    add("donor_pan", body.donor_pan, 10);
    add("donor_city", body.donor_city);
    add("donor_state", body.donor_state);

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `scf_${Date.now()}`,
      notes,
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
    });
  } catch (error) {
    const razorpayError = error as {
      statusCode?: number;
      error?: { description?: string; code?: string };
      message?: string;
    };
    const description = razorpayError.error?.description || razorpayError.message || "Razorpay order failed";
    const status = razorpayError.statusCode === 401 ? 401 : 500;
    const message =
      razorpayError.statusCode === 401
        ? "Razorpay authentication failed. Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local, then restart the server."
        : description;
    return NextResponse.json({ error: message }, { status });
  }
}
