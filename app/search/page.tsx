"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Layout from "@/components/Layout";
import MovieCard from "@/components/MovieCard";
import { useDebounce } from "@/hooks/useDebounce";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import type { MyMovieData } from "@/lib/tmdb-client";
import { Mic, Search, Loader2, AlertTriangle } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<MyMovieData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 500);

  const handleVoiceResult = (text: string) => setQuery(text);
  const { listening, supported, startListening } = useSpeechToText(handleVoiceResult);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Recherche indisponible.");
        }
        setResults(data.results ?? []);
      })
      .catch((err: Error) => {
        setResults([]);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  return (
    <div className="px-4 md:px-12 py-8 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Recherche</h1>

      <div className="relative max-w-2xl mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Films, séries..."
          autoFocus
          className="w-full bg-dark-card border border-gray-700 rounded-lg pl-12 pr-14 py-4 text-lg text-white placeholder-gray-500 focus:outline-none focus:border-netflix"
        />
        {supported && (
          <button
            type="button"
            onClick={startListening}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded ${
              listening ? "text-netflix animate-pulse" : "text-gray-400 hover:text-white"
            }`}
            aria-label="Recherche vocale"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-amber-200 bg-amber-900/30 border border-amber-700/50 rounded px-4 py-3 mb-6 max-w-2xl">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          Recherche en cours...
        </div>
      )}

      {!loading && !error && debouncedQuery && results.length === 0 && (
        <p className="text-gray-400">Aucun résultat pour &quot;{debouncedQuery}&quot;</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {results.map((movie) => (
          <MovieCard key={`${movie.media_type}-${movie.id}`} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Layout>
      <Suspense fallback={<div className="p-12 text-center text-gray-400">Chargement...</div>}>
        <SearchContent />
      </Suspense>
    </Layout>
  );
}
