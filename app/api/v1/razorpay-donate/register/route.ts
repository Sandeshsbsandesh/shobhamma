import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RegisterBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  pan?: string;
  aadhaar?: string;
  gender?: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  country?: string;
  state?: string;
  city?: string;
  addressLine1?: string;
  pinCode?: string;
  amount?: number;
  purpose?: string;
  projectName?: string;
};

function trim(value: unknown, max = 200) {
  return String(value ?? "").trim().slice(0, max);
}

export async function POST(request: Request) {
  let body: RegisterBody;
  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const payload = {
    firstName: trim(body.firstName, 80),
    lastName: trim(body.lastName, 80),
    email: trim(body.email, 120),
    phone: trim(body.phone, 15),
    pan: trim(body.pan, 10).toUpperCase(),
    aadhaar: trim(body.aadhaar, 12),
    gender: trim(body.gender, 40),
    dateOfBirth: trim(body.dateOfBirth, 10),
    maritalStatus: trim(body.maritalStatus, 40),
    country: trim(body.country, 60) || "India",
    state: trim(body.state, 60),
    city: trim(body.city, 80),
    addressLine1: trim(body.addressLine1, 200),
    pinCode: trim(body.pinCode, 6),
    amount: Number(body.amount),
    purpose: trim(body.purpose, 80),
    projectName: trim(body.projectName, 120),
  };

  if (!payload.firstName || !payload.lastName || !payload.email || !payload.phone) {
    return NextResponse.json({ error: "Missing required donor fields" }, { status: 400 });
  }
  if (!Number.isFinite(payload.amount) || payload.amount < 1) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const upstream =
    process.env.RAZORPAY_DONATE_REGISTER_URL?.trim() ||
    (process.env.RAZORPAY_DONATE_API_BASE
      ? `${process.env.RAZORPAY_DONATE_API_BASE.replace(/\/$/, "")}/api/v1/razorpay-donate/register`
      : "");

  // No upstream configured — accept locally so checkout can continue.
  if (!upstream) {
    return NextResponse.json({ ok: true, registered: true, local: true });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const apiKey = process.env.RAZORPAY_DONATE_API_KEY?.trim();
  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }

  try {
    const res = await fetch(upstream, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { raw: text };
    }
    if (!res.ok) {
      return NextResponse.json(
        { error: "Donor registration failed", upstreamStatus: res.status, details: data },
        { status: res.status >= 400 && res.status < 600 ? res.status : 502 },
      );
    }
    return NextResponse.json({ ok: true, registered: true, details: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Donor registration failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
