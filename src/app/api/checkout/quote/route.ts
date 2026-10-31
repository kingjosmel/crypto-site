import { NextRequest, NextResponse } from "next/server";
import { calculateQuote } from "@/lib/catalogData";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, shippingAddress } = body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided in quote request" }, { status: 400 });
    }
    if (!shippingAddress || !shippingAddress.state) {
      return NextResponse.json({ error: "Shipping address state is required" }, { status: 400 });
    }

    const quote = calculateQuote(items, shippingAddress);
    return NextResponse.json(quote);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Quote preparation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
