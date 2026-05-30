import type { MyMovieData, Video } from "./tmdb-types";

export function getImageUrl(
  path: string | null,
  size: "w200" | "w300" | "w500" | "w780" | "original" = "w500"
): string {
  if (!path) return "/placeholder-poster.svg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function normalizeMovie(item: Record<string, unknown>): MyMovieData {
  const mediaType = (item.media_type as string) || (item.first_air_date ? "tv" : "movie");
  return {
    id: item.id as number,
    title: (item.title as string) || (item.name as string) || "Sans titre",
    name: item.name as string | undefined,
    poster_path: (item.poster_path as string) || null,
    backdrop_path: (item.backdrop_path as string) || null,
    overview: item.overview as string | undefined,
    media_type: mediaType as "movie" | "tv",
    vote_average: item.vote_average as number | undefined,
    release_date: item.release_date as string | undefined,
    first_air_date: item.first_air_date as string | undefined,
  };
}

export function getTrailerKey(videos: Video[]): string | null {
  const trailer = videos.find((v) => v.site === "YouTube" && v.type === "Trailer");
  return trailer?.key || videos.find((v) => v.site === "YouTube")?.key || null;
}

export { getEmbedUrl } from "./embedPlayer";
