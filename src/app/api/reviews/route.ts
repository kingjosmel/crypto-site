import { NextRequest, NextResponse } from "next/server";
import { INITIAL_PRODUCTS } from "@/lib/catalogData";
import {
  createVerifiedReviewInFirestore,
  getOrderFromFirestore,
  getReviewsForProductFromFirestore,
} from "@/lib/firestoreStore";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get("productId")?.trim() || "";
  if (!productId) {
    return NextResponse.json({ items: [] });
  }

  const items = await getReviewsForProductFromFirestore(productId);
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  let body: {
    orderNumber?: string;
    email?: string;
    productId?: string;
    reviewerName?: string;
    reviewerLocation?: string;
    rating?: number;
    deliveryRating?: number;
    comment?: string;
    photoUrl?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const orderNumber = String(body.orderNumber || "").trim().toUpperCase();
  const email = String(body.email || "").trim().toLowerCase();
  const productId = String(body.productId || "").trim();
  const reviewerName = String(body.reviewerName || "").trim();
  const reviewerLocation = String(body.reviewerLocation || "").trim();
  const rating = Number(body.rating);
  const deliveryRating = Number(body.deliveryRating);
  const comment = String(body.comment || "").trim();
  const photoUrl = String(body.photoUrl || "").trim();

  if (!/^NS-[0-9]{8}$/.test(orderNumber)) {
    return NextResponse.json(
      { error: "Please enter a valid order number in the format NS-00000001." },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid checkout email address." }, { status: 400 });
  }

  if (!productId || !/^[a-zA-Z0-9_-]{3,128}$/.test(productId)) {
    return NextResponse.json({ error: "Invalid product identifier." }, { status: 400 });
  }

  if (reviewerName.length < 2 || reviewerName.length > 80) {
    return NextResponse.json(
      { error: "Please enter your display name (2 to 80 characters)." },
      { status: 400 }
    );
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Product rating must be between 1 and 5." }, { status: 400 });
  }

  if (!Number.isInteger(deliveryRating) || deliveryRating < 1 || deliveryRating > 5) {
    return NextResponse.json({ error: "Delivery rating must be between 1 and 5." }, { status: 400 });
  }

  if (comment.length < 8 || comment.length > 1200) {
    return NextResponse.json(
      { error: "Review comment must be between 8 and 1,200 characters." },
      { status: 400 }
    );
  }

  if (photoUrl) {
    const validProto = photoUrl.startsWith("https://") || photoUrl.startsWith("/");
    if (!validProto || photoUrl.length > 400) {
      return NextResponse.json(
        { error: "Customer photo URL must be a valid https:// image link under 400 characters." },
        { status: 400 }
      );
    }
  }

  const order = await getOrderFromFirestore(orderNumber);
  if (!order) {
    return NextResponse.json(
      { error: "Order not found. Only verified Northstar orders can submit reviews." },
      { status: 404 }
    );
  }

  if (order.email.trim().toLowerCase() !== email) {
    return NextResponse.json(
      { error: "The email entered does not match the email used on this order." },
      { status: 403 }
    );
  }

  if (order.paymentStatus !== "paid") {
    return NextResponse.json(
      { error: "Reviews can only be submitted after payment is confirmed and your order has shipped." },
      { status: 400 }
    );
  }

  const matchingOrderItem = order.items.find((item) => item.productId === productId);
  if (!matchingOrderItem) {
    return NextResponse.json(
      { error: "This product was not included in the specified order." },
      { status: 400 }
    );
  }

  const product = INITIAL_PRODUCTS.find((p) => p._id === productId);
  const productSlug = product?.slug || productId;
  const productName = product?.name || matchingOrderItem.name;
  const reviewId = `${order.orderNumber}_${productId}`;

  const existingReviews = await getReviewsForProductFromFirestore(productId);
  if (existingReviews.some((r) => r.reviewId === reviewId)) {
    return NextResponse.json(
      { error: "A verified review has already been submitted for this item on this order." },
      { status: 409 }
    );
  }

  const review = {
    reviewId,
    orderNumber: order.orderNumber,
    productId,
    productSlug,
    productName,
    reviewerName,
    reviewerLocation: reviewerLocation || undefined,
    rating,
    deliveryRating,
    comment,
    photoUrl: photoUrl || undefined,
    verifiedPurchase: true as const,
    createdAt: new Date().toISOString(),
  };

  try {
    await createVerifiedReviewInFirestore(review);
    return NextResponse.json({ review }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Unable to publish review right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
