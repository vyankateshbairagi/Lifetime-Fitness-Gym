"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, X } from "lucide-react";

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: "Gym Space" | "Equipment" | "Training Area";
  title: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    src: "/photos/img_0600.webp",
    alt: "Main training floor with ambient gym lighting",
    category: "Gym Space",
    title: "Main Workout Floor",
  },
  {
    id: "g2",
    src: "/photos/img_0602.webp",
    alt: "Dumbbell racks and progressive free weights",
    category: "Equipment",
    title: "Free Weight Zone",
  },
  {
    id: "g3",
    src: "/photos/img_0603.webp",
    alt: "Cable crossover station and multi-gym equipment",
    category: "Training Area",
    title: "Cable & Multi-Gym Station",
  },
  {
    id: "g4",
    src: "/photos/img_0604.webp",
    alt: "Heavy dumbbell rack and flat benches",
    category: "Equipment",
    title: "Heavy Dumbbell Line",
  },
  {
    id: "g5",
    src: "/photos/img_0605.webp",
    alt: "Spacious training floor with incline benches",
    category: "Gym Space",
    title: "Bench & Movement Area",
  },
  {
    id: "g6",
    src: "/photos/img_0608.webp",
    alt: "Conditioning and functional training floor",
    category: "Training Area",
    title: "Strength & Conditioning Floor",
  },
  {
    id: "g7",
    src: "/photos/img_0610.webp",
    alt: "Targeted resistance training machines",
    category: "Equipment",
    title: "Resistance Machines",
  },
  {
    id: "g8",
    src: "/photos/img_0611.webp",
    alt: "Wide gym layout with rubberized training floor",
    category: "Gym Space",
    title: "Spacious Facility Layout",
  },
];

const CATEGORIES = ["All", "Gym Space", "Equipment", "Training Area"] as const;

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const filteredItems =
    activeCategory === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="scroll-mt-24 bg-[#090909] py-10 sm:py-14 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-red-400">
              <span>FACILITY TOUR</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              INSIDE <span className="text-red-500">LIFETIME FITNESS</span>
            </h2>
            <p className="mt-2 max-w-xl text-xs sm:text-sm text-slate-300">
              Take a visual walkthrough of our training floor, heavy free weights, and dedicated equipment zones in Guruwar Peth.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                  activeCategory === cat
                    ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-label={`View photo: ${item.title}`}
              onClick={() => setActiveImage(item)}
              className="group relative aspect-[16/11] w-full text-left cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-[#120a0b] shadow-lg transition hover:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition group-hover:opacity-90" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                <span className="flex size-9 items-center justify-center rounded-full bg-red-600/90 text-white shadow-lg backdrop-blur-sm">
                  <Eye className="size-4" />
                </span>
              </div>
              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <span className="inline-block rounded bg-black/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-400">
                  {item.category}
                </span>
                <p className="mt-0.5 text-[11px] font-bold uppercase text-white truncate">{item.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-w-4xl w-full overflow-hidden rounded-3xl border border-white/20 bg-[#120a0b] p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveImage(null)}
              className="absolute right-6 top-6 z-10 flex size-10 items-center justify-center rounded-full bg-black/80 text-white hover:bg-red-600 transition"
              aria-label="Close modal"
            >
              <X className="size-5" />
            </button>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
            </div>
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <span className="rounded bg-red-600/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-red-400 border border-red-500/30">
                  {activeImage.category}
                </span>
                <h3 className="mt-2 text-lg font-bold text-white">{activeImage.title}</h3>
                <p className="text-xs text-slate-400">{activeImage.alt}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
