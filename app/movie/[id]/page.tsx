import MediaDetailLoader from "@/components/MediaDetailLoader";
import HomeErrorFallback from "@/components/HomeErrorFallback";
import Layout from "@/components/Layout";
import { TmdbError, getMovieDetails, getMovieCredits, getMovieVideos } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default async function MoviePage({ params }: PageProps) {
  const id = parseInt(params.id, 10);

  if (!Number.isFinite(id) || id <= 0) {
    return (
      <Layout>
        <HomeErrorFallback message="Identifiant de film invalide." />
      </Layout>
    );
  }

  try {
    const [details, credits, videos] = await Promise.all([
      getMovieDetails(id),
      getMovieCredits(id),
      getMovieVideos(id),
    ]);

    return (
      <MediaDetailLoader
        mediaType="movie"
        id={id}
        details={details}
        cast={credits.cast}
        videos={videos.results}
      />
    );
  } catch (error) {
    const message =
      error instanceof TmdbError
        ? error.message
        : "Impossible de charger ce film.";
    return (
      <Layout>
        <HomeErrorFallback message={message} />
      </Layout>
    );
  }
}
