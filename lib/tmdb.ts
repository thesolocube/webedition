import "server-only";

import {
  type MyMovieData,
  type TMDBResponse,
  type CastMember,
  type Video,
  type Season,
  type Episode,
  type HomePageData,
  GENRE_SECTIONS,
} from "./tmdb-types";
import { normalizeMovie } from "./tmdb-utils";

const BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const DEFAULT_LANG = "fr-FR";

export class TmdbError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "TmdbError";
    this.status = status;
  }
}

function getTmdbApiKey(): string {
  const key = process.env.TMDB_API_KEY?.trim();
  if (!key) {
    throw new TmdbError(
      "TMDB_API_KEY non configurée. Ajoutez-la dans Vercel → Settings → Environment Variables.",
      503
    );
  }
  return key;
}

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const apiKey = getTmdbApiKey();
  const searchParams = new URLSearchParams({
    api_key: apiKey,
    language: DEFAULT_LANG,
    ...params,
  });

  const url = `${BASE_URL}${endpoint}?${searchParams.toString()}`;

  let res: Response;
  try {
    res = await fetch(url, { next: { revalidate: 3600 } });
  } catch {
    throw new TmdbError("Impossible de contacter l'API TMDB.", 503);
  }

  if (!res.ok) {
    const message =
      res.status === 401
        ? "Clé API TMDB invalide ou non autorisée."
        : `Erreur TMDB (${res.status}).`;
    throw new TmdbError(message, res.status);
  }

  return res.json() as Promise<T>;
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

export async function discoverByGenre(
  genreId: number,
  mediaType: "movie" | "tv" = "movie"
): Promise<MyMovieData[]> {
  const data = await tmdbFetch<TMDBResponse<Record<string, unknown>>>(`/discover/${mediaType}`, {
    with_genres: String(genreId),
    sort_by: "popularity.desc",
  });
  return data.results.map((item) => normalizeMovie({ ...item, media_type: mediaType }));
}

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

export async function loadHomePageData(): Promise<HomePageData> {
  try {
    const [trending, popular, upcoming] = await Promise.all([
      getTrending(),
      getPopularMovies(),
      getUpcomingMovies(),
    ]);

    const genreSections = await Promise.all(
      GENRE_SECTIONS.map(async (genre) => ({
        label: genre.label,
        movies: await discoverByGenre(genre.id),
      }))
    );

    return { trending, popular, upcoming, genreSections };
  } catch (error) {
    const message =
      error instanceof TmdbError
        ? error.message
        : "Impossible de charger le catalogue pour le moment.";
    return {
      trending: [],
      popular: [],
      upcoming: [],
      genreSections: [],
      error: message,
    };
  }
}

export { GENRE_SECTIONS };
