import MediaDetailLoader from "@/components/MediaDetailLoader";
import {
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
} from "@/lib/tmdb";

interface PageProps {
  params: { id: string };
}

export default async function MoviePage({ params }: PageProps) {
  const id = parseInt(params.id, 10);

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
}
