import MediaDetailLoader from "@/components/MediaDetailLoader";
import {
  getTvDetails,
  getTvCredits,
  getTvVideos,
  type Season,
} from "@/lib/tmdb";

interface PageProps {
  params: { id: string };
}

export default async function TvPage({ params }: PageProps) {
  const id = parseInt(params.id, 10);

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
}
