"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";
import type { MyMovieData } from "@/lib/tmdb";

interface MovieRowProps {
  title: string;
  movies: MyMovieData[];
  onMovieClick?: (movie: MyMovieData) => void;
}

export default function MovieRow({ title, movies, onMovieClick }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (!movies.length) return null;

  return (
    <section className="mb-8 group/row">
      <h2 className="text-lg md:text-xl font-semibold text-white mb-3 px-4 md:px-12">
        {title}
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
          className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide px-4 md:px-12 pb-2 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie) => (
            <MovieCard
              key={`${movie.media_type}-${movie.id}`}
              movie={movie}
              onClick={() => onMovieClick?.(movie)}
            />
          ))}
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
