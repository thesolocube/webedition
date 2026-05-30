import type { MyMovieData } from "./tmdb-types";
import { addToContinueWatching } from "./continueWatching";

export interface WatchProgress extends MyMovieData {
  season?: number | null;
  episode?: number | null;
  watchedAt: number;
}

export async function addToWatchHistory(
  movie: MyMovieData,
  userId: string,
  progress?: { season?: number; episode?: number }
): Promise<void> {
  await addToContinueWatching(userId, movie, progress);
}

export function getResumeHref(item: WatchProgress): string {
  const base = `/${item.media_type}/${item.id}`;
  if (item.media_type === "tv" && item.season != null && item.episode != null) {
    return `${base}?play=1&season=${item.season}&episode=${item.episode}`;
  }
  return `${base}?play=1`;
}

export function getLoginRedirectUrl(path: string): string {
  return `/login?redirect=${encodeURIComponent(path)}`;
}
