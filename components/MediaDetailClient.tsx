"use client";

import { Suspense } from "react";
import Layout from "@/components/Layout";
import DetailPage from "@/components/DetailPage";
import type { CastMember, Season, Video } from "@/lib/tmdb-client";

interface MediaDetailClientProps {
  mediaType: "movie" | "tv";
  id: number;
  details: Record<string, unknown>;
  cast: CastMember[];
  videos: Video[];
  seasons?: Season[];
}

export default function MediaDetailClient(props: MediaDetailClientProps) {
  return (
    <Layout>
      <Suspense fallback={<div className="p-12 text-center text-gray-400">Chargement...</div>}>
        <DetailPage {...props} />
      </Suspense>
    </Layout>
  );
}
