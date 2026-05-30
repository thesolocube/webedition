const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || "https://api.themoviedb.org/3";
const DEFAULT_LANG = "fr-FR";

export interface MyMovieData {
  id: number;
  title: string;
  name?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  overview?: string;
  media_type: "movie" | "tv";
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  season_number: number;
}

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const searchParams = new URLSearchParams({
    api_key: API_KEY || "",
    language: DEFAULT_LANG,
    ...params,
  });

  const url = `${BASE_URL}${endpoint}?${searchParams.toString()}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export function getImageUrl(path: string | null, size: "w200" | "w300" | "w500" | "w780" | "original" = "w500"): string {
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

export async function getTrending(): Promise<MyMovieData[]> {
  const data = await tmdbFetch<TMDBResponse<Record<string, unknown>>>("/trending/all/day");
  return data.results.map(normalizeMovie);
}

export async function getPopularMovies(): Promise<MyMovieData[]> {
  const data = await tmdbFetch<TMDBResponse<Record<string, unknown>>>("/movie/popular");
  return data.results.map((item) => normalizeMovie({ ...item, media_type: "movie" }));
}

export async function getUpcomingMovies(): Promise<MyMovieData[]> {
  const data = await tmdbFetch<TMDBResponse<Record<string, unknown>>>("/movie/upcoming");
  return data.results.map((item) => normalizeMovie({ ...item, media_type: "movie" }));
}

export async function discoverByGenre(genreId: number, mediaType: "movie" | "tv" = "movie"): Promise<MyMovieData[]> {
  const data = await tmdbFetch<TMDBResponse<Record<string, unknown>>>(`/discover/${mediaType}`, {
    with_genres: String(genreId),
    sort_by: "popularity.desc",
  });
  return data.results.map((item) => normalizeMovie({ ...item, media_type: mediaType }));
}

export const GENRE_SECTIONS = [
  { id: 28, label: "Action" },
  { id: 35, label: "Comédie" },
  { id: 16, label: "Animation" },
  { id: 27, label: "Horreur" },
  { id: 878, label: "Science-Fiction" },
  { id: 53, label: "Thriller" },
  { id: 10749, label: "Romance" },
  { id: 99, label: "Documentaire" },
] as const;

export async function searchMulti(query: string): Promise<MyMovieData[]> {
  if (!query.trim()) return [];
  const data = await tmdbFetch<TMDBResponse<Record<string, unknown>>>("/search/multi", { query });
  return data.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map(normalizeMovie);
}

export async function getMovieDetails(id: number) {
  return tmdbFetch<Record<string, unknown>>(`/movie/${id}`);
}

export async function getTvDetails(id: number) {
  return tmdbFetch<Record<string, unknown>>(`/tv/${id}`);
}

export async function getMovieCredits(id: number) {
  return tmdbFetch<{ cast: CastMember[] }>(`/movie/${id}/credits`);
}

export async function getTvCredits(id: number) {
  return tmdbFetch<{ cast: CastMember[] }>(`/tv/${id}/credits`);
}

export async function getMovieVideos(id: number) {
  return tmdbFetch<{ results: Video[] }>(`/movie/${id}/videos`);
}

export async function getTvVideos(id: number) {
  return tmdbFetch<{ results: Video[] }>(`/tv/${id}/videos`);
}

export async function getTvSeason(id: number, seasonNumber: number) {
  return tmdbFetch<{ episodes: Episode[] }>(`/tv/${id}/season/${seasonNumber}`);
}

export async function getTvSeasons(id: number) {
  const details = await getTvDetails(id);
  return (details.seasons as Season[]) || [];
}

export function getTrailerKey(videos: Video[]): string | null {
  const trailer = videos.find((v) => v.site === "YouTube" && v.type === "Trailer");
  return trailer?.key || videos.find((v) => v.site === "YouTube")?.key || null;
}

export { getEmbedUrl } from "./embedPlayer";
