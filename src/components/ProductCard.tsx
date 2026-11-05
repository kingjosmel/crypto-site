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
    <article className="group relative flex flex-col bg-white border border-[#ece8e1] hover:border-[#b0aaa0] transition-all duration-300 rounded-xs overflow-hidden">
      {/* Product Image Frame */}
      <div className="relative aspect-4/3 w-full bg-[#f6f5f2] overflow-hidden block">
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
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
              quality={95}
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
              No image
            </div>
          )}
        </Link>

        {/* Desktop Quick Add Hover Overlay Button */}
        <div className="hidden sm:block absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-10 pointer-events-auto">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full bg-neutral-900/95 hover:bg-black text-white text-[11px] font-semibold uppercase tracking-wider py-2.5 px-3 backdrop-blur-xs transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer rounded-xs"
            style={{ color: "#ffffff" }}
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-white" style={{ color: "#ffffff" }}>Quick Add to Bag</span>
          </button>
        </div>

        {/* Mobile Quick Add Touch Button */}
        <button
          type="button"
          onClick={handleQuickAdd}
          className="sm:hidden absolute bottom-2 right-2 z-10 p-2 bg-neutral-950/90 text-white rounded-full shadow-md flex items-center justify-center min-w-[34px] min-h-[34px] cursor-pointer active:scale-95 transition-transform"
          aria-label={`Quick add ${product.name} to bag`}
          style={{ color: "#ffffff" }}
        >
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {/* Subtle Provenance Tag */}
        <div className="absolute top-2 left-2 z-10 pointer-events-none">
          <span className="text-[9px] sm:text-[10px] font-mono tracking-wider uppercase bg-white/90 backdrop-blur-xs text-neutral-800 px-1.5 py-0.5 border border-[#e5e2da] rounded-xs font-medium">
            {conditionLabel(product.condition)}
          </span>
        </div>
      </div>

      {/* Product Info Section */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-2 sm:gap-3">
        <div>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] text-[#858076] block mb-0.5 sm:mb-1">
            {product.brand}
          </span>
          <h3 className="text-[12.5px] sm:text-[14px] font-medium text-neutral-950 leading-tight line-clamp-2 group-hover:text-neutral-700 transition-colors">
            <Link href={`/product/${product.slug}`}>
              {product.name}
            </Link>
          </h3>
          <p className="text-[10px] sm:text-[11px] text-neutral-500 mt-0.5 sm:mt-1 line-clamp-1">
            {product.sizes?.length ? `Sizes: ${product.sizes.join(", ")}` : product.specs[0]?.value ?? "Archive Selection"}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-[#f0eee9] gap-1">
          <span className="font-mono text-xs sm:text-sm font-semibold text-neutral-950 whitespace-nowrap">
            {formatPrice(product.priceCents)}
          </span>
          <span className="text-[9px] sm:text-[10px] text-[#047857] font-medium flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            <span className="hidden xs:inline">Verified</span>
          </span>
        </div>
      </div>
    </article>
  );
}
