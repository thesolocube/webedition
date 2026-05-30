"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { getImageUrl } from "@/lib/tmdb-client";
import { getResumeHref, type WatchProgress } from "@/lib/watchHistory";

interface ContinueWatchingRowProps {
  items: WatchProgress[];
}

export default function ContinueWatchingRow({ items }: ContinueWatchingRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (!items.length) return null;

  return (
    <section className="mb-8 group/row">
      <h2 className="text-lg md:text-xl font-semibold text-white mb-3 px-4 md:px-12">
        Continuer à regarder
      </h2>
      <div className="relative">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-20 w-10 md:w-12 bg-black/60 opacity-0 group-hover/row:opacity-100 hover:bg-black/80 flex items-center justify-center transition-opacity"
          aria-label="Défiler à gauche"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide px-4 md:px-12 pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => {
            const href = getResumeHref(item);
            const progressLabel =
              item.media_type === "tv" && item.season != null && item.episode != null
                ? `S${item.season} · E${item.episode}`
                : null;

            return (
              <Link
                key={`${item.media_type}-${item.id}`}
                href={href}
                className="block flex-shrink-0 group/card"
              >
                <motion.div
                  className="relative w-[200px] sm:w-[240px] md:w-[280px] aspect-video rounded overflow-hidden"
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src={getImageUrl(item.backdrop_path || item.poster_path, "w500")}
                    alt={item.title}
                    fill
                    sizes="280px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity bg-black/40">
                    <div className="w-12 h-12 rounded-full bg-netflix flex items-center justify-center">
                      <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                    {progressLabel && (
                      <p className="text-xs text-gray-300 mt-0.5">{progressLabel}</p>
                    )}
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-20 w-10 md:w-12 bg-black/60 opacity-0 group-hover/row:opacity-100 hover:bg-black/80 flex items-center justify-center transition-opacity"
          aria-label="Défiler à droite"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      </div>
    </section>
  );
}
