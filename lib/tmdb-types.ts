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

export interface HomePageData {
  trending: MyMovieData[];
  popular: MyMovieData[];
  upcoming: MyMovieData[];
  genreSections: { label: string; movies: MyMovieData[] }[];
  error?: string;
}
