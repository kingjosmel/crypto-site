"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BadgeCheck, Star, Truck, MessageSquarePlus } from "lucide-react";

export interface VerifiedReviewItem {
  reviewId: string;
  orderNumber: string;
  productId: string;
  productSlug: string;
  productName: string;
  reviewerName: string;
  reviewerLocation?: string;
  rating: number;
  deliveryRating: number;
  comment: string;
  photoUrl?: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export function ProductReviewsSection({
  productId,
  productName,
}: {
  productId: string;
  productSlug: string;
  productName: string;
}) {
  const [reviews, setReviews] = useState<VerifiedReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerLocation, setReviewerLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [comment, setComment] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (active && Array.isArray(data.items)) {
            setReviews(data.items);
          }
        }
      } catch {
        // fail quietly to honest empty state
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber,
          email,
          productId,
          reviewerName,
          reviewerLocation,
          rating,
          deliveryRating,
          comment,
          photoUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to submit review.");
      }
      if (data.review) {
        setReviews((prev) => [data.review, ...prev]);
      }
      setSubmitSuccess("Thank you. Your verified purchase review has been published.");
      setShowForm(false);
      setOrderNumber("");
      setEmail("");
      setReviewerName("");
      setReviewerLocation("");
      setComment("");
      setPhotoUrl("");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not publish review.");
    } finally {
      setSubmitting(false);
    }
  }

  const avgProductRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  const avgDeliveryRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.deliveryRating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <section
      id="verified-reviews"
      className="mt-16 pt-12 border-t border-[#dcdcdc]"
      aria-label="Verified Customer Reviews"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#047857] block mb-1">
            Verified Purchase Records Only
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-neutral-950 font-normal">
            Customer Reviews · {productName}
          </h2>
          {reviews.length > 0 ? (
            <p className="text-xs text-neutral-600 mt-1.5 font-mono">
              {avgProductRating} / 5.0 Product Rating · {avgDeliveryRating} / 5.0 Delivery Experience ({reviews.length}{" "}
              {reviews.length === 1 ? "verified review" : "verified reviews"})
            </p>
          ) : (
            <p className="text-xs text-neutral-600 mt-1.5">
              We never publish unverified or placeholder reviews. Reviews appear only after a confirmed paid order is fulfilled.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForm((prev) => !prev);
            setSubmitError("");
            setSubmitSuccess("");
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-neutral-50 text-neutral-950 border border-[#cccccc] text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer shrink-0"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" aria-hidden="true" />
          {showForm ? "Close Review Form" : "Write a Verified Review"}
        </button>
      </div>

      {submitSuccess && (
        <div
          role="status"
          className="mb-6 p-4 bg-[#f0fdf4] border border-[#bbf7d0] text-[#047857] text-xs rounded-xs font-medium"
        >
          {submitSuccess}
        </div>
      )}

      {/* Verified Review Submission Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 bg-white border border-[#dcdcdc] p-6 rounded-xs space-y-4"
        >
          <div className="border-b border-[#e5e5e5] pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950">
              Submit Post-Delivery Verified Review
            </h3>
            <p className="text-[11px] text-neutral-500 mt-1">
              Enter the Order Number and checkout email from your paid order containing this item.
            </p>
          </div>

          {submitError && (
            <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs">
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rev-order" className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Order Number <span className="text-red-500">*</span>
              </label>
              <input
                id="rev-order"
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="NS-00000001"
                className="w-full px-3 py-2.5 bg-[#fafafa] border border-[#cccccc] text-xs font-mono text-neutral-900 focus:border-black focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="rev-email" className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Checkout Email <span className="text-red-500">*</span>
              </label>
              <input
                id="rev-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 bg-[#fafafa] border border-[#cccccc] text-xs text-neutral-900 focus:border-black focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="rev-name" className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Display Name <span className="text-red-500">*</span>
              </label>
              <input
                id="rev-name"
                type="text"
                required
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Jordan M."
                className="w-full px-3 py-2.5 bg-[#fafafa] border border-[#cccccc] text-xs text-neutral-900 focus:border-black focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="rev-loc" className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                City, State <span className="text-neutral-400 font-normal lowercase">(optional)</span>
              </label>
              <input
                id="rev-loc"
                type="text"
                value={reviewerLocation}
                onChange={(e) => setReviewerLocation(e.target.value)}
                placeholder="e.g. Austin, TX"
                className="w-full px-3 py-2.5 bg-[#fafafa] border border-[#cccccc] text-xs text-neutral-900 focus:border-black focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="rev-rating" className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Item Quality Rating
              </label>
              <select
                id="rev-rating"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-[#fafafa] border border-[#cccccc] text-xs text-neutral-900 focus:border-black focus:bg-white focus:outline-none"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} / 5 Stars
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="rev-delivery" className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Delivery &amp; Packaging Rating
              </label>
              <select
                id="rev-delivery"
                value={deliveryRating}
                onChange={(e) => setDeliveryRating(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-[#fafafa] border border-[#cccccc] text-xs text-neutral-900 focus:border-black focus:bg-white focus:outline-none"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} / 5 Stars
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="rev-photo" className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Delivery Photo URL <span className="text-neutral-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              id="rev-photo"
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2.5 bg-[#fafafa] border border-[#cccccc] text-xs text-neutral-900 focus:border-black focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="rev-comment" className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              id="rev-comment"
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details on packaging, condition upon arrival, authenticity inspection tags, and courier delivery..."
              className="w-full px-3 py-2.5 bg-[#fafafa] border border-[#cccccc] text-xs text-neutral-900 focus:border-black focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider rounded-xs cursor-pointer disabled:opacity-60"
              style={{ color: "#ffffff", backgroundColor: "#0f0f0f" }}
            >
              <span style={{ color: "#ffffff" }}>
                {submitting ? "Verifying Order…" : "Publish Verified Review"}
              </span>
            </button>
          </div>
        </form>
      )}

      {/* Reviews List or Honest Empty State */}
      {loading ? (
        <div className="p-6 bg-[#fafafa] border border-[#e5e5e5] rounded-xs text-xs text-neutral-500">
          Loading verified purchase reviews…
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-6 sm:p-8 bg-[#fafafa] border border-[#e5e5e5] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              No Verified Reviews Yet For This Piece
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Northstar only displays reviews tied to settled customer orders. Every order is covered by our{" "}
              <Link href="/buyer-protection" className="underline font-medium text-neutral-900">
                Buyer Protection Policy
              </Link>{" "}
              and serialized inspection record above.
            </p>
          </div>
          <Link
            href="/track"
            className="text-xs font-semibold text-[#047857] hover:underline shrink-0"
          >
            Track an order &amp; leave a review →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <article
              key={rev.reviewId}
              className="p-5 bg-white border border-[#dcdcdc] rounded-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#047857] mb-1">
                    <BadgeCheck className="w-3.5 h-3.5" aria-hidden="true" />
                    Verified Purchase · {rev.orderNumber}
                  </div>
                  <h3 className="text-xs font-bold text-neutral-950">
                    {rev.reviewerName}
                    {rev.reviewerLocation ? ` · ${rev.reviewerLocation}` : ""}
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-neutral-500">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-neutral-700">
                <span className="inline-flex items-center gap-1 font-medium">
                  <Star className="w-3.5 h-3.5 text-[#a3702b] fill-[#a3702b]" aria-hidden="true" />
                  Item: {rev.rating}/5
                </span>
                <span className="inline-flex items-center gap-1 font-medium">
                  <Truck className="w-3.5 h-3.5 text-[#047857]" aria-hidden="true" />
                  Delivery: {rev.deliveryRating}/5
                </span>
              </div>

              <p className="text-xs text-neutral-700 leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>

              {rev.photoUrl && (
                <div className="relative w-32 h-24 rounded-xs overflow-hidden border border-[#e5e5e5]">
                  <Image
                    src={rev.photoUrl}
                    alt={`Customer photo for ${rev.productName}`}
                    fill
                    unoptimized
                    sizes="128px"
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
