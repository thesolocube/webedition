"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Une erreur est survenue</h2>
        <p className="text-gray-400 text-sm mb-6">
          {error.message || "Impossible de charger cette page."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="bg-netflix hover:bg-red-700 text-white px-5 py-2 rounded font-medium"
          >
            Réessayer
          </button>
          <Link href="/" className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded font-medium">
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
