"use client";

import Link from "next/link";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { getMissingFirebaseEnvVars } from "@/lib/firebase-env";

export default function FirebaseConfigError() {
  const missing = getMissingFirebaseEnvVars();

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-dark-elevated border border-netflix/50 rounded-xl p-8 text-center">
        <AlertTriangle className="w-14 h-14 text-netflix mx-auto mb-4" />
        <h1 className="text-xl font-bold text-white mb-2">
          Configuration Firebase manquante
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          L&apos;application ne peut pas se connecter à Firebase. Les variables{" "}
          <code className="text-gray-300">NEXT_PUBLIC_FIREBASE_*</code> sont absentes,
          invalides ou n&apos;ont pas été prises en compte au build Vercel.
        </p>

        {missing.length > 0 && (
          <ul className="text-left text-sm text-gray-300 bg-black/40 rounded-lg p-4 mb-6 space-y-1">
            {missing.map((key) => (
              <li key={key} className="font-mono text-xs">
                • {key}
              </li>
            ))}
          </ul>
        )}

        <div className="text-left text-xs text-gray-500 space-y-2 mb-6">
          <p>1. Console Firebase → Paramètres → Vos applications → Web</p>
          <p>2. Vercel → Settings → Environment Variables</p>
          <p>3. Ajoutez toutes les variables NEXT_PUBLIC_FIREBASE_*</p>
          <p>4. Redéployez le projet (obligatoire après modification)</p>
        </div>

        <a
          href="https://vercel.com/docs/projects/environment-variables"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-netflix hover:underline text-sm font-medium"
        >
          Documentation Vercel
          <ExternalLink className="w-4 h-4" />
        </a>

        <div className="mt-6 pt-6 border-t border-gray-800">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">
            Recharger la page
          </Link>
        </div>
      </div>
    </div>
  );
}
