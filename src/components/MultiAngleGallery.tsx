"use client";

import React, { useState, useRef, useMemo } from "react";
import Image from "next/image";
import type { Product } from "@/lib/api";

interface GalleryAngle {
  url: string;
  alt: string;
  label: string;
  detail: string;
}

interface MultiAngleGalleryProps {
  product: Product;
  conditionLabelText: string;
}

export function MultiAngleGallery({ product, conditionLabelText }: MultiAngleGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate 4-5 curated inspection views based on product category & available images
  const angles: GalleryAngle[] = useMemo(() => {
    const list: GalleryAngle[] = [];

    const isLeather =
      product.categoryId === "660000000000000000000003" ||
      product.brand.toLowerCase().includes("goyard") ||
      product.brand.toLowerCase().includes("hermès") ||
      product.brand.toLowerCase().includes("hermes");

    const isFootwear =
      product.categoryId === "660000000000000000000002" ||
      product.name.toLowerCase().includes("sneaker") ||
      product.name.toLowerCase().includes("loafer") ||
      product.name.toLowerCase().includes("derby");

    // Primary image from product
    if (product.images[0]?.url) {
      list.push({
        url: product.images[0].url,
        alt: `${product.name} primary view`,
        label: isLeather ? "Exterior Face & Leather" : isFootwear ? "Lateral Silhouette" : "Primary Silhouette Cut",
        detail: isLeather ? "Tannery finish & silhouette balance" : isFootwear ? "Sole welt & upper curvature" : "Fabric drape & atelier shoulder cut",
      });
    }

    // Secondary images if already provided in product data
    product.images.slice(1).forEach((img, idx) => {
      list.push({
        url: img.url,
        alt: img.alt || `${product.name} angle ${idx + 2}`,
        label: `Archival Angle ${idx + 2}`,
        detail: "Direct atelier inspection perspective",
      });
    });

    // If fewer than 4 images, add curated contextual museum inspection assets
    if (list.length < 2) {
      list.push({
        url: isLeather
          ? "/images/editorial_collection_curation.jpg"
          : "/images/editorial_atelier.jpg",
        alt: `${product.name} atelier inspection`,
        label: isLeather ? "Saddle Stitch & Edge Glazing" : isFootwear ? "Welt Stitching & Leather Insole" : "Fabric Weave & Sartorial Seams",
        detail: isLeather ? "Hand-waxed linen thread & edge finish" : isFootwear ? "Reinforced stitch lines & brand markings" : "Weave density & hand-finished edges",
      });
    }

    if (list.length < 3) {
      list.push({
        url: "/images/editorial_collection_curation.jpg",
        alt: `${product.name} presentation packaging`,
        label: "Dust Bag, Tags & Provenance",
        detail: "Original presentation case, serial card & dust covers",
      });
    }

    if (list.length < 4) {
      list.push({
        url: "/images/editorial_white_glove_courier.jpg",
        alt: `${product.name} priority courier custody`,
        label: "Atelier Packaging & Courier Seal",
        detail: "Tamper-evident serialized security containment",
      });
    }

    return list;
  }, [product]);

  const activeAngle = angles[selectedIndex] || angles[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : angles.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < angles.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* Main High-Resolution Frame */}
      <div
        ref={containerRef}
        className="group relative aspect-4/3 w-full bg-[#f6f5f2] rounded-xs overflow-hidden border border-[#ece8e1] shadow-sm select-none cursor-crosshair"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        {activeAngle && (
          <Image
            src={activeAngle.url}
            alt={activeAngle.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 750px"
            quality={95}
            className={`object-cover transition-transform duration-200 ${
              isHovered ? "scale-135 pointer-events-none" : "scale-100"
            }`}
            style={
              isHovered
                ? {
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  }
                : undefined
            }
            referrerPolicy="no-referrer"
          />
        )}

        {/* Condition Badge (Top Left) */}
        <div className="absolute top-3.5 left-3.5 z-10 pointer-events-none">
          <span className="text-[10px] font-sans tracking-wider uppercase bg-white/95 backdrop-blur-xs text-neutral-900 px-3 py-1.5 border border-[#dedad2] rounded-xs font-semibold shadow-xs">
            {conditionLabelText}
          </span>
        </div>

        {/* Active Angle Descriptor Pill (Top Right) */}
        <div className="absolute top-3.5 right-3.5 z-10 pointer-events-none">
          <span className="text-[10px] font-mono tracking-wider bg-neutral-950/85 backdrop-blur-xs text-white px-2.5 py-1 rounded-xs font-medium">
            Angle {selectedIndex + 1}/{angles.length}
          </span>
        </div>

        {/* Zoom Hint / Magnifier Button (Bottom Right) */}
        <div className="absolute bottom-3.5 right-3.5 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="cursor-pointer bg-white/95 hover:bg-white text-neutral-800 hover:text-black border border-[#d6d2c8] px-2.5 py-1.5 rounded-xs text-[11px] font-medium shadow-xs flex items-center gap-1.5 transition-colors"
            title="Expand Fullscreen Lightbox"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span className="hidden sm:inline">Fullscreen Zoom</span>
          </button>
        </div>

        {/* Navigation Arrows on Hover */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-neutral-900 border border-[#d6d2c8] flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer z-10"
          aria-label="Previous image angle"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-neutral-900 border border-[#d6d2c8] flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer z-10"
          aria-label="Next image angle"
        >
          ›
        </button>
      </div>

      {/* Angle Caption Under Main Frame */}
      {activeAngle && (
        <div className="flex items-center justify-between text-xs px-1 text-neutral-600">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            <strong className="text-neutral-950 font-medium">{activeAngle.label}</strong>
            <span className="text-neutral-400 hidden sm:inline">·</span>
            <span className="text-neutral-500 hidden sm:inline">{activeAngle.detail}</span>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono">Hover to magnify</span>
        </div>
      )}

      {/* Thumbnail Carousel Strip */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 sm:gap-3 pt-1">
        {angles.map((angle, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <button
              key={`${angle.url}-${idx}`}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-4/3 rounded-xs overflow-hidden border transition-all cursor-pointer text-left ${
                isSelected
                  ? "border-neutral-950 ring-2 ring-neutral-950/20 shadow-xs"
                  : "border-[#ece8e1] hover:border-neutral-400 opacity-75 hover:opacity-100"
              }`}
            >
              <Image
                src={angle.url}
                alt={angle.alt}
                fill
                sizes="(max-width: 640px) 25vw, 150px"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 bg-neutral-950/80 backdrop-blur-xs py-0.5 px-1 text-[9px] text-white truncate text-center font-sans font-medium">
                {angle.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Header */}
          <div className="w-full max-w-6xl flex items-center justify-between text-white z-10 pb-4 border-b border-neutral-800">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37] block">
                {product.brand} · Archival Inspection
              </span>
              <h3 className="font-serif text-lg sm:text-xl text-white font-normal">{product.name}</h3>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-neutral-400">
                Angle {selectedIndex + 1} of {angles.length}
              </span>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Close Lightbox"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Lightbox Image Container */}
          <div
            className="relative w-full max-w-5xl h-[65vh] sm:h-[75vh] flex items-center justify-center my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {activeAngle && (
              <div className="relative w-full h-full">
                <Image
                  src={activeAngle.url}
                  alt={activeAngle.alt}
                  fill
                  sizes="100vw"
                  quality={100}
                  className="object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Nav Arrows */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-neutral-900/80 hover:bg-neutral-900 text-white border border-neutral-700 flex items-center justify-center text-xl cursor-pointer"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-neutral-900/80 hover:bg-neutral-900 text-white border border-neutral-700 flex items-center justify-center text-xl cursor-pointer"
            >
              ›
            </button>
          </div>

          {/* Lightbox Footer Angle Selector */}
          <div
            className="w-full max-w-3xl flex items-center justify-center gap-2 sm:gap-3 pt-4 border-t border-neutral-800 overflow-x-auto z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {angles.map((angle, idx) => (
              <button
                key={`lb-${angle.url}-${idx}`}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-16 h-12 rounded-xs overflow-hidden border shrink-0 transition-all cursor-pointer ${
                  idx === selectedIndex
                    ? "border-[#d4af37] ring-2 ring-[#d4af37]/40"
                    : "border-neutral-700 opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={angle.url}
                  alt={angle.alt}
                  fill
                  sizes="80px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
