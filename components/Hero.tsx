"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Play, Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { MyMovieData } from "@/lib/tmdb-client";
import { getImageUrl } from "@/lib/tmdb-client";
import { getLoginRedirectUrl } from "@/lib/watchHistory";

interface HeroProps {
  movie: MyMovieData;
}

export default function Hero({ movie }: HeroProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const href = `/${movie.media_type}/${movie.id}`;
  const playHref = `${href}?play=1`;

  const handlePlay = () => {
    if (loading) return;
    if (!user) {
      router.push(getLoginRedirectUrl(playHref));
      return;
    }
    router.push(playHref);
  };

  return (
    <section className="relative h-[70vh] md:h-[85vh] w-full">
      <Image
        src={getImageUrl(movie.backdrop_path || movie.poster_path, "original")}
        alt={movie.title}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/40 to-transparent" />

      <div className="absolute bottom-[20%] left-4 md:left-12 max-w-xl md:max-w-2xl z-10">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          {movie.title}
        </h1>
        {movie.overview && (
          <p className="text-sm md:text-base text-gray-200 line-clamp-3 mb-6 drop-shadow">
            {movie.overview}
          </p>
        )}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handlePlay}
            className="flex items-center gap-2 bg-white text-black font-semibold px-6 py-2.5 rounded hover:bg-gray-200 transition-colors"
          >
            <Play className="w-5 h-5 fill-black" />
            Lecture
          </button>
          <Link
            href={href}
            className="flex items-center gap-2 bg-gray-500/70 text-white font-semibold px-6 py-2.5 rounded hover:bg-gray-500/90 transition-colors"
          >
            <Info className="w-5 h-5" />
            Plus d&apos;infos
          </Link>
        </div>
        {!user && !loading && (
          <p className="text-xs text-gray-400 mt-3">
            Connexion requise pour regarder
          </p>
        )}
      </div>
    </section>
  );
}
