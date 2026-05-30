"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import MovieCard from "@/components/MovieCard";
import { useAuth } from "@/hooks/useAuth";
import { subscribeFavorites } from "@/lib/favorites";
import type { MyMovieData } from "@/lib/tmdb-client";
import { List } from "lucide-react";

export default function MyListPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<MyMovieData[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    return subscribeFavorites(user.uid, setFavorites);
  }, [user]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh] text-gray-400">
          Chargement...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 md:px-12 py-8 min-h-screen">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
          <List className="w-8 h-8 text-netflix" />
          Ma Liste
        </h1>
        <p className="text-gray-400 mb-8">
          Synchronisée avec votre application Android
        </p>

        {favorites.length === 0 ? (
          <p className="text-gray-500">
            Votre liste est vide. Ajoutez des films depuis leur page de détails.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favorites.map((movie) => (
              <MovieCard key={`${movie.media_type}-${movie.id}`} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
