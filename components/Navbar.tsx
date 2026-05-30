"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Mic, LogOut, User, List, Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSpeechToText } from "@/hooks/useSpeechToText";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleVoiceResult = (text: string) => {
    setQuery(text);
    router.push(`/search?q=${encodeURIComponent(text)}`);
  };

  const { listening, supported, startListening } = useSpeechToText(handleVoiceResult);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-dark/95 backdrop-blur-sm shadow-lg" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-12 py-4 gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-netflix font-bold text-xl md:text-2xl tracking-tight whitespace-nowrap">
            TFARAJ M3A ATLAS
          </Link>
          <div className="hidden md:flex items-center gap-4 text-sm text-gray-300">
            <Link href="/" className="hover:text-white flex items-center gap-1">
              <Home className="w-4 h-4" /> Accueil
            </Link>
            {user && (
              <Link href="/my-list" className="hover:text-white flex items-center gap-1">
                <List className="w-4 h-4" /> Ma Liste
              </Link>
            )}
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-md flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher films et séries..."
              className="w-full bg-black/50 border border-gray-700 rounded pl-10 pr-10 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-netflix"
            />
            {supported && (
              <button
                type="button"
                onClick={startListening}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded ${
                  listening ? "text-netflix animate-pulse" : "text-gray-400 hover:text-white"
                }`}
                aria-label="Recherche vocale"
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:flex items-center gap-1 text-sm text-gray-300 truncate max-w-[120px]">
                <User className="w-4 h-4 flex-shrink-0" />
                {user.email}
              </span>
              <button
                type="button"
                onClick={() => logout()}
                className="text-gray-300 hover:text-white p-2"
                aria-label="Déconnexion"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-netflix hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
