"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface HomeErrorFallbackProps {
  message: string;
}

export default function HomeErrorFallback({ message }: HomeErrorFallbackProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center bg-dark-elevated border border-gray-800 rounded-xl p-8">
        <AlertTriangle className="w-12 h-12 text-netflix mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Catalogue temporairement indisponible
        </h2>
        <p className="text-gray-400 text-sm mb-6">{message}</p>
        <p className="text-gray-500 text-xs mb-6">
          Sur Netlify, ajoutez <code className="text-gray-300">TMDB_API_KEY</code> dans Site configuration →
          Environment Variables, puis redéployez.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-netflix hover:bg-red-700 text-white font-medium px-6 py-2.5 rounded transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Réessayer
        </Link>
      </div>
    </div>
  );
}
