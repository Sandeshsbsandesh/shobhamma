import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { getRazorpayCredentials } from "@/lib/razorpay";

export const runtime = "nodejs";

type Body = {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
};

function signaturesMatch(expected: string, received: string) {
  const a = Buffer.from(expected);
  const b = Buffer.from(received);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const { keySecret } = getRazorpayCredentials();
  if (!keySecret) {
    return NextResponse.json({ error: "Payment is not configured" }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const orderId = body.razorpay_order_id?.trim() || "";
  const paymentId = body.razorpay_payment_id?.trim() || "";
  const signature = body.razorpay_signature?.trim() || "";

  if (!orderId || !paymentId || !signature) {
    return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
  }

  const expected = createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (!signaturesMatch(expected, signature)) {
    return NextResponse.json({ error: "Signature mismatch", verified: false }, { status: 400 });
  }

  return NextResponse.json({
    verified: true,
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
  });
}
