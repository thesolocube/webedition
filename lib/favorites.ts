"use client";

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase";
import type { MyMovieData } from "./tmdb-types";

export async function loadFavorites(userId: string): Promise<MyMovieData[]> {
  const db = getFirebaseDb();
  const snap = await getDocs(collection(db, "users", userId, "favorites"));
  return snap.docs.map((d) => d.data() as MyMovieData);
}

export function subscribeFavorites(
  userId: string,
  callback: (favorites: MyMovieData[]) => void
): Unsubscribe {
  const db = getFirebaseDb();
  return onSnapshot(collection(db, "users", userId, "favorites"), (snap) => {
    callback(snap.docs.map((d) => d.data() as MyMovieData));
  });
}

export async function addFavorite(userId: string, movie: MyMovieData): Promise<void> {
  const db = getFirebaseDb();
  const ref = doc(db, "users", userId, "favorites", String(movie.id));
  await setDoc(ref, {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    media_type: movie.media_type,
  });
}

export async function removeFavorite(userId: string, movieId: number): Promise<void> {
  const db = getFirebaseDb();
  await deleteDoc(doc(db, "users", userId, "favorites", String(movieId)));
}

export async function isFavorite(userId: string, movieId: number): Promise<boolean> {
  const favorites = await loadFavorites(userId);
  return favorites.some((f) => f.id === movieId);
}
