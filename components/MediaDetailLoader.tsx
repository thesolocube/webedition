"use client";

import dynamic from "next/dynamic";
import type { CastMember, Season, Video } from "@/lib/tmdb";

const MediaDetailClient = dynamic(() => import("@/components/MediaDetailClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-dark flex items-center justify-center text-gray-400">
      Chargement du lecteur...
    </div>
  ),
});

interface MediaDetailLoaderProps {
  mediaType: "movie" | "tv";
  id: number;
  details: Record<string, unknown>;
  cast: CastMember[];
  videos: Video[];
  seasons?: Season[];
}

export default function MediaDetailLoader(props: MediaDetailLoaderProps) {
  return <MediaDetailClient {...props} />;
}
