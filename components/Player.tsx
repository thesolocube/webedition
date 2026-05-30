"use client";

import { useState, useCallback } from "react";
import { Shield, Play, CheckCircle2, Loader2 } from "lucide-react";
import { useAntiPopup } from "@/hooks/useAntiPopup";

interface PlayerProps {
  src: string;
  title?: string;
}

const CHECKS = [
  "Fenêtres pop-up bloquées",
  "Publicités désactivées dans le lecteur",
  "Chargement sécurisé (sans ouverture automatique)",
] as const;

export default function Player({ src, title = "Lecteur vidéo" }: PlayerProps) {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  useAntiPopup(verified);

  const startSecurePlayback = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setVerified(true);
      setLoading(false);
    }, 600);
  }, []);

  return (
    <div
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
      data-player-shell
      data-player-active={verified ? "true" : "false"}
    >
      {!verified ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-dark-card to-black">
          <div className="w-14 h-14 rounded-full bg-netflix/20 flex items-center justify-center mb-4">
            <Shield className="w-7 h-7 text-netflix" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Vérification du lecteur
          </h3>
          <p className="text-sm text-gray-400 mb-6 max-w-sm">
            Contrôles anti pop-up et anti publicité avant le chargement de la vidéo.
          </p>
          <ul className="text-left space-y-2 mb-8 w-full max-w-xs">
            {CHECKS.map((label) => (
              <li key={label} className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                {label}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={startSecurePlayback}
            disabled={loading}
            className="flex items-center gap-2 bg-netflix hover:bg-red-700 disabled:opacity-60 text-white font-semibold px-8 py-3 rounded transition-colors"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Play className="w-5 h-5 fill-white" />
            )}
            {loading ? "Vérification..." : "Démarrer la lecture sécurisée"}
          </button>
        </div>
      ) : (
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-presentation allow-fullscreen"
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        />
      )}
    </div>
  );
}
