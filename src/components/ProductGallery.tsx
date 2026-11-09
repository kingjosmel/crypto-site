"use client";

import Image from "next/image";
import { useState } from "react";
import type { Image as ProductImageType } from "@/lib/api";

interface ProductGalleryProps {
  images: ProductImageType[];
  productName: string;
  conditionLabelText: string;
}

export function ProductGallery({
  images,
  productName,
  conditionLabelText,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeImage = images[selectedIndex] || images[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Primary Main Image Frame */}
      <div className="relative aspect-4/5 w-full bg-[#f6f5f2] rounded-xs overflow-hidden border border-[#ece8e1] shadow-sm">
        {activeImage && (
          <Image
            src={activeImage.url}
            alt={activeImage.alt || productName}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 750px"
            quality={95}
            className="object-cover transition-opacity duration-300"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Floating Provenance & Inspection Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          <span className="text-[10px] font-mono tracking-widest uppercase bg-white/95 backdrop-blur-xs text-neutral-900 px-3 py-1 border border-[#dedad2] rounded-xs font-semibold shadow-xs">
            {conditionLabelText}
          </span>
          <span className="text-[10px] tracking-wider uppercase bg-[#10b981]/15 backdrop-blur-xs text-[#047857] px-3 py-1 border border-[#10b981]/30 rounded-xs font-semibold shadow-xs">
            Physical Inspection Passed
          </span>
        </div>

        {/* Image Counter indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-xs">
            View {selectedIndex + 1} of {images.length}
          </div>
        )}
      </div>

      {/* Multi-Angle Inspection Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img, idx) => {
            const isActive = selectedIndex === idx;
            return (
              <button
                key={`${img.url}-${idx}`}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative aspect-4/5 bg-[#f6f5f2] rounded-xs overflow-hidden border transition-all cursor-pointer group ${
                  isActive
                    ? "border-neutral-950 ring-2 ring-neutral-950 ring-offset-1"
                    : "border-[#ece8e1] hover:border-neutral-400 opacity-75 hover:opacity-100"
                }`}
                aria-label={`View angle ${idx + 1}`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${productName} view ${idx + 1}`}
                  fill
                  sizes="160px"
                  quality={85}
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1 left-1 text-[9px] font-mono uppercase bg-white/90 px-1 py-0.5 rounded-2xs text-neutral-800 line-clamp-1 opacity-90">
                  {idx === 0 ? "Front" : idx === 1 ? "Detail" : idx === 2 ? "Package" : "Scan"}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
