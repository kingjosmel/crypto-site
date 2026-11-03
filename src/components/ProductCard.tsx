"use client";

import Image from "next/image";
import Link from "next/link";
import { conditionLabel, formatPrice, type Product } from "@/lib/api";
import { addToCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      priceCents: product.priceCents,
      imageUrl: image?.url,
    });
    window.dispatchEvent(new Event("northstar-cart-open"));
  };

  return (
    <article className="group relative flex flex-col bg-white border border-[#ece8e1] hover:border-[#b0aaa0] transition-all duration-300 rounded-xs overflow-hidden">
      {/* Product Image Frame */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-4/3 w-full bg-[#f6f5f2] overflow-hidden block"
        aria-label={`View ${product.name}`}
      >
        {image ? (
          <Image
            src={image.url}
            alt={image.alt || product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            quality={95}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
            No image
          </div>
        )}

        {/* Quick Add Hover Overlay Button (Shopify Plus signature) */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full bg-neutral-900/90 hover:bg-black text-white text-[11px] font-semibold uppercase tracking-wider py-2.5 px-3 backdrop-blur-xs transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer rounded-xs"
            style={{ color: "#ffffff" }}
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-white" style={{ color: "#ffffff" }}>Quick Add</span>
          </button>
        </div>

        {/* Subtle Provenance Tag */}
        <div className="absolute top-2.5 left-2.5">
          <span className="text-[10px] font-mono tracking-wider uppercase bg-white/90 backdrop-blur-xs text-neutral-800 px-2 py-0.5 border border-[#e5e2da] rounded-xs font-medium">
            {conditionLabel(product.condition)}
          </span>
        </div>
      </Link>

      {/* Product Info Section */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#858076] block mb-1">
            {product.brand}
          </span>
          <h3 className="text-[14px] font-medium text-neutral-950 leading-snug line-clamp-1 group-hover:text-neutral-700 transition-colors">
            <Link href={`/product/${product.slug}`}>
              {product.name}
            </Link>
          </h3>
          <p className="text-[11px] text-neutral-500 mt-1 line-clamp-1">
            {product.sizes?.length ? `Available: ${product.sizes.join(", ")}` : product.specs[0]?.value ?? "Masterpiece Archive"}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#f0eee9]">
          <span className="font-mono text-sm font-semibold text-neutral-950">
            {formatPrice(product.priceCents)}
          </span>
          <span className="text-[10px] text-[#047857] font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            Verified Authentic
          </span>
        </div>
      </div>
    </article>
  );
}
