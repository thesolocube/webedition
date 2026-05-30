"use client";

import MovieRow from "./MovieRow";
import ContinueWatchingRow from "./ContinueWatchingRow";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { useAuth } from "@/hooks/useAuth";
import type { MyMovieData } from "@/lib/tmdb";

interface HomeContentProps {
  trending: MyMovieData[];
  popular: MyMovieData[];
  upcoming: MyMovieData[];
  genreSections: { label: string; movies: MyMovieData[] }[];
}

export default function HomeContent({
  trending,
  popular,
  upcoming,
  genreSections,
}: HomeContentProps) {
  const { user } = useAuth();
  const { history } = useWatchHistory();

  return (
    <div className="relative -mt-24 z-10 pb-16">
      {user && history.length > 0 && <ContinueWatchingRow items={history} />}
      <MovieRow title="Tendances" movies={trending.slice(1)} />
      <MovieRow title="Populaires" movies={popular} />
      <MovieRow title="Prochainement" movies={upcoming} />
      {genreSections.map((section) => (
        <MovieRow key={section.label} title={section.label} movies={section.movies} />
      ))}
    </div>
  );
}
