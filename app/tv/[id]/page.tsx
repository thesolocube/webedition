import MediaDetailLoader from "@/components/MediaDetailLoader";
import HomeErrorFallback from "@/components/HomeErrorFallback";
import Layout from "@/components/Layout";
import {
  TmdbError,
  getTvDetails,
  getTvCredits,
  getTvVideos,
} from "@/lib/tmdb";
import type { Season } from "@/lib/tmdb-types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default async function TvPage({ params }: PageProps) {
  const id = parseInt(params.id, 10);

  if (!Number.isFinite(id) || id <= 0) {
    return (
      <Layout>
        <HomeErrorFallback message="Identifiant de série invalide." />
      </Layout>
    );
  }

  try {
    const [details, credits, videos] = await Promise.all([
      getTvDetails(id),
      getTvCredits(id),
      getTvVideos(id),
    ]);

    const seasons = (details.seasons as Season[]) || [];

    return (
      <MediaDetailLoader
        mediaType="tv"
        id={id}
        details={details}
        cast={credits.cast}
        videos={videos.results}
        seasons={seasons}
      />
    );
  } catch (error) {
    const message =
      error instanceof TmdbError
        ? error.message
        : "Impossible de charger cette série.";
    return (
      <Layout>
        <HomeErrorFallback message={message} />
      </Layout>
    );
  }
}
