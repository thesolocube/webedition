"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { MyMovieData } from "@/lib/tmdb-client";
import { getImageUrl } from "@/lib/tmdb-client";

interface MovieCardProps {
  movie: MyMovieData;
  onClick?: () => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  const href = `/${movie.media_type}/${movie.id}`;

  return (
    <Link href={href} onClick={onClick} className="block flex-shrink-0">
      <motion.div
        className="relative w-[140px] sm:w-[160px] md:w-[180px] aspect-[2/3] rounded overflow-hidden cursor-pointer"
        whileHover={{ scale: 1.08, zIndex: 10 }}
        transition={{ duration: 0.2 }}
      >
        <Image
          src={getImageUrl(movie.poster_path, "w300")}
          alt={movie.title}
          fill
          sizes="(max-width: 640px) 140px, 180px"
          className="object-cover"
        />
      </motion.div>
    </Link>
  );
}
