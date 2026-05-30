"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Play, Plus, Check, ArrowLeft, Lock } from "lucide-react";
import Player from "./Player";
import { useAuth } from "@/hooks/useAuth";
import { addFavorite, removeFavorite, subscribeFavorites } from "@/lib/favorites";
import { addToWatchHistory, getLoginRedirectUrl } from "@/lib/watchHistory";
import {
  getImageUrl,
  getEmbedUrl,
  getTrailerKey,
  type CastMember,
  type Season,
  type Episode,
  type Video,
  type MyMovieData,
} from "@/lib/tmdb";

interface DetailPageProps {
  mediaType: "movie" | "tv";
  id: number;
  details: Record<string, unknown>;
  cast: CastMember[];
  videos: Video[];
  seasons?: Season[];
}

export default function DetailPage({
  mediaType,
  id,
  details,
  cast,
  videos,
  seasons = [],
}: DetailPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const autoPlay = searchParams.get("play") === "1";
  const urlSeason = searchParams.get("season");
  const urlEpisode = searchParams.get("episode");
  const { user, loading: authLoading } = useAuth();

  const title = (details.title as string) || (details.name as string) || "";
  const overview = (details.overview as string) || "";
  const posterPath = details.poster_path as string | null;
  const backdropPath = details.backdrop_path as string | null;

  const [showPlayer, setShowPlayer] = useState(false);
  const [inList, setInList] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(
    urlSeason ? parseInt(urlSeason, 10) : 1
  );
  const [selectedEpisode, setSelectedEpisode] = useState(
    urlEpisode ? parseInt(urlEpisode, 10) : 1
  );
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [listLoading, setListLoading] = useState(false);

  const movieData: MyMovieData = useMemo(
    () => ({
      id,
      title,
      poster_path: posterPath,
      backdrop_path: backdropPath,
      overview,
      media_type: mediaType,
    }),
    [id, title, posterPath, backdropPath, overview, mediaType]
  );

  const trailerKey = getTrailerKey(videos);
  const filteredSeasons = seasons.filter((s) => s.season_number > 0);

  const currentPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  const saveProgress = useCallback(() => {
    if (!user) return;
    addToWatchHistory(movieData, user.uid, {
      season: mediaType === "tv" ? selectedSeason : undefined,
      episode: mediaType === "tv" ? selectedEpisode : undefined,
    }).catch(console.error);
  }, [user, movieData, mediaType, selectedSeason, selectedEpisode]);

  const startPlayback = useCallback(() => {
    if (authLoading) return;
    if (!user) {
      router.push(getLoginRedirectUrl(currentPath));
      return;
    }
    saveProgress();
    setShowPlayer(true);
  }, [authLoading, user, router, currentPath, saveProgress]);

  useEffect(() => {
    if (authLoading) return;
    if (autoPlay && !user) {
      router.replace(getLoginRedirectUrl(currentPath));
      return;
    }
    if (autoPlay && user) {
      saveProgress();
      setShowPlayer(true);
    }
  }, [autoPlay, user, authLoading, router, currentPath, saveProgress]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeFavorites(user.uid, (favorites) => {
      setInList(favorites.some((f) => f.id === id));
    });
    return unsub;
  }, [user, id]);

  useEffect(() => {
    if (mediaType !== "tv" || !filteredSeasons.length) return;
    fetch(`/api/tv/${id}/season/${selectedSeason}`)
      .then((res) => res.json())
      .then((data) => setEpisodes(data.episodes || []))
      .catch(console.error);
  }, [mediaType, id, selectedSeason, filteredSeasons.length]);

  useEffect(() => {
    if (showPlayer && user) {
      saveProgress();
    }
  }, [selectedSeason, selectedEpisode, showPlayer, user, saveProgress]);

  const toggleFavorite = async () => {
    if (!user) {
      router.push(getLoginRedirectUrl(currentPath));
      return;
    }
    setListLoading(true);
    try {
      if (inList) {
        await removeFavorite(user.uid, id);
      } else {
        await addFavorite(user.uid, movieData);
      }
    } finally {
      setListLoading(false);
    }
  };

  const embedUrl =
    mediaType === "movie"
      ? getEmbedUrl("movie", id)
      : getEmbedUrl("tv", id, selectedSeason, selectedEpisode);

  return (
    <div className="min-h-screen bg-dark pb-16">
      <div className="relative h-[50vh] md:h-[60vh]">
        <Image
          src={getImageUrl(backdropPath || posterPath, "original")}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
        <Link
          href="/"
          className="absolute top-20 left-4 md:left-12 z-10 flex items-center gap-2 text-white hover:text-netflix transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Retour
        </Link>
      </div>

      <div className="relative -mt-32 px-4 md:px-12 flex flex-col md:flex-row gap-8 z-10">
        <div className="flex-shrink-0 w-40 md:w-56 aspect-[2/3] relative rounded overflow-hidden shadow-2xl mx-auto md:mx-0">
          <Image
            src={getImageUrl(posterPath, "w500")}
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
          <p className="text-gray-300 leading-relaxed mb-6 max-w-3xl">{overview}</p>

          {!user && !authLoading && (
            <div className="mb-4 flex items-center gap-2 text-sm text-amber-200/90 bg-amber-900/30 border border-amber-700/50 rounded px-4 py-3 max-w-lg">
              <Lock className="w-4 h-4 flex-shrink-0" />
              Connectez-vous pour regarder ce contenu
            </div>
          )}

          <div className="flex flex-wrap gap-3 mb-8">
            <button
              type="button"
              onClick={startPlayback}
              disabled={authLoading}
              className="flex items-center gap-2 bg-netflix hover:bg-red-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded"
            >
              <Play className="w-5 h-5 fill-white" />
              {user ? "Lecture" : "Se connecter pour regarder"}
            </button>
            <button
              type="button"
              onClick={toggleFavorite}
              disabled={listLoading}
              className="flex items-center gap-2 bg-gray-600/80 hover:bg-gray-600 text-white font-semibold px-6 py-2.5 rounded disabled:opacity-50"
            >
              {inList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {inList ? "Dans ma liste" : "Ma liste"}
            </button>
          </div>

          {mediaType === "tv" && filteredSeasons.length > 0 && (
            <div className="mb-8 space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Saison</label>
                <select
                  value={selectedSeason}
                  onChange={(e) => {
                    setSelectedSeason(Number(e.target.value));
                    setSelectedEpisode(1);
                  }}
                  className="bg-dark-card border border-gray-700 rounded px-4 py-2 text-white"
                >
                  {filteredSeasons.map((s) => (
                    <option key={s.id} value={s.season_number}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              {episodes.length > 0 && (
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Épisode</label>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {episodes.map((ep) => (
                      <button
                        key={ep.id}
                        type="button"
                        onClick={() => setSelectedEpisode(ep.episode_number)}
                        className={`flex-shrink-0 px-4 py-2 rounded text-sm ${
                          selectedEpisode === ep.episode_number
                            ? "bg-netflix text-white"
                            : "bg-dark-card text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        E{ep.episode_number}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {showPlayer && user && (
            <div className="mb-10">
              <Player src={embedUrl} title={title} />
            </div>
          )}

          {trailerKey && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Bande-annonce</h2>
              <div className="relative w-full max-w-3xl aspect-video rounded overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  title="Bande-annonce"
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {cast.length > 0 && (
        <section className="mt-12 px-4 md:px-12">
          <h2 className="text-xl font-semibold mb-4">Casting</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {cast.slice(0, 15).map((member) => (
              <div key={member.id} className="flex-shrink-0 w-28 text-center">
                <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden bg-dark-card mb-2">
                  <Image
                    src={getImageUrl(member.profile_path, "w200")}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-white truncate">{member.name}</p>
                <p className="text-xs text-gray-500 truncate">{member.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
