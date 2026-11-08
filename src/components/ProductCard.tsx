"use client";

import Image from "next/image";
import Link from "next/link";
import { conditionLabel, formatPrice, type Product } from "@/lib/api";
import { addToCart, openCartDrawer } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      addToCart({
        productId: product._id,
        slug: product.slug,
        name: product.name,
        priceCents: product.priceCents,
        imageUrl: image?.url,
      });
      openCartDrawer();
    } catch (err) {
      console.error("Quick add failed:", err);
    }
  };

  return (
    <article className="group relative flex flex-col bg-white border border-[#ece8e1] hover:border-[#b5b0a6] transition-all duration-300 rounded-xs overflow-hidden shadow-2xs hover:shadow-md">
      {/* Product Image Frame (Shopify-standard 4:5 vertical proportion) */}
      <div className="relative aspect-4/5 w-full bg-[#f7f6f3] overflow-hidden block">
        <Link
          href={`/product/${product.slug}`}
          className="absolute inset-0 block"
          aria-label={`View ${product.name}`}
        >
          {image ? (
            <Image
              src={image.url}
              alt={image.alt || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
              quality={95}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
              No image
            </div>
          )}
        </Link>

        {/* Condition tag */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <span className="text-[10px] font-mono tracking-wider uppercase bg-white/95 backdrop-blur-xs text-neutral-800 px-2 py-0.5 border border-[#e2ded6] rounded-xs font-medium shadow-2xs">
            {conditionLabel(product.condition)}
          </span>
        </div>

        {/* Quick Add Hover Overlay Button (Shopify Luxury Signature) */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-10 pointer-events-auto">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full bg-neutral-950/95 hover:bg-black text-white text-[11px] font-semibold uppercase tracking-wider py-3 px-4 backdrop-blur-xs transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer rounded-xs"
            style={{ color: "#ffffff" }}
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-white" style={{ color: "#ffffff" }}>Quick Add to Bag</span>
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3 bg-white">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#858076] block mb-1">
            {product.brand}
          </span>
          <h3 className="text-[14px] font-medium text-neutral-950 leading-snug line-clamp-1 group-hover:text-neutral-700 transition-colors">
            <Link href={`/product/${product.slug}`}>
              {product.name}
            </Link>
          </h3>
          <p className="text-[11.5px] text-neutral-500 mt-1 line-clamp-1">
            {product.sizes?.length ? `Sizes: ${product.sizes.join(", ")}` : "Authentic Luxury Leather"}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-[#f2f0ec]">
          <span className="font-mono text-sm font-semibold text-neutral-950">
            {formatPrice(product.priceCents)}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
            24h USA Delivery
          </span>
        </div>
      </div>
    </article>
  );
}
