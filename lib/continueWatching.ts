"use client";

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  limit,
  Unsubscribe,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase";
import type { MyMovieData } from "./tmdb";
import type { WatchProgress } from "./watchHistory";

const MAX_ITEMS = 10;
const COLLECTION = "continueWatching";

export function continueWatchingDocId(mediaType: string, id: number): string {
  return `${mediaType}_${id}`;
}

export async function addToContinueWatching(
  userId: string,
  movie: MyMovieData,
  progress?: { season?: number; episode?: number }
): Promise<void> {
  const db = getFirebaseDb();
  const docId = continueWatchingDocId(movie.media_type, movie.id);
  const ref = doc(db, "users", userId, COLLECTION, docId);

  await setDoc(ref, {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path ?? null,
    media_type: movie.media_type,
    season: progress?.season ?? null,
    episode: progress?.episode ?? null,
    watchedAt: Date.now(),
  });

  const snap = await getDocs(collection(db, "users", userId, COLLECTION));
  const sorted = snap.docs
    .map((d) => ({ ref: d.ref, watchedAt: (d.data().watchedAt as number) || 0 }))
    .sort((a, b) => b.watchedAt - a.watchedAt);

  await Promise.all(sorted.slice(MAX_ITEMS).map((item) => deleteDoc(item.ref)));
}

export function subscribeContinueWatching(
  userId: string,
  callback: (items: WatchProgress[]) => void
): Unsubscribe {
  const db = getFirebaseDb();
  const q = query(
    collection(db, "users", userId, COLLECTION),
    orderBy("watchedAt", "desc"),
    limit(MAX_ITEMS)
  );

  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => d.data() as WatchProgress));
  });
}

/** Migre l'ancien historique localStorage vers Firestore (une seule fois). */
export async function migrateLocalWatchHistory(userId: string): Promise<void> {
  if (typeof window === "undefined") return;

  const legacyKey = `tfaraj_continue_watching_${userId}`;
  const migratedFlag = `${legacyKey}_migrated`;

  if (localStorage.getItem(migratedFlag)) return;

  try {
    const raw = localStorage.getItem(legacyKey);
    if (!raw) {
      localStorage.setItem(migratedFlag, "1");
      return;
    }

    const items = JSON.parse(raw) as WatchProgress[];
    for (const item of items) {
      await addToContinueWatching(
        userId,
        {
          id: item.id,
          title: item.title,
          poster_path: item.poster_path,
          backdrop_path: item.backdrop_path,
          media_type: item.media_type,
        },
        {
          season: item.season ?? undefined,
          episode: item.episode ?? undefined,
        }
      );
    }

    localStorage.removeItem(legacyKey);
    localStorage.setItem(migratedFlag, "1");
  } catch (e) {
    console.error("Migration continueWatching:", e);
  }
}
