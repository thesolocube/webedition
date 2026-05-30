"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2 } from "lucide-react";
import { getAuthErrorMessage, isEmailAlreadyInUse } from "@/lib/authErrors";

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (email: string, password: string) => Promise<void>;
  redirectTo?: string;
}

export default function AuthForm({ mode, onSubmit, redirectTo = "/" }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showLoginLink, setShowLoginLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShowLoginLink(false);

    if (mode === "register" && password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(email, password);
      router.push(redirectTo.startsWith("/") ? redirectTo : "/");
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err, mode));
      setShowLoginLink(mode === "register" && isEmailAlreadyInUse(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark px-4">
      <div className="w-full max-w-md bg-dark-elevated/90 border border-gray-800 rounded-lg p-8 shadow-2xl">
        <Link href="/" className="block text-center text-netflix font-bold text-2xl mb-8">
          TFARAJ M3A ATLAS
        </Link>
        <h1 className="text-2xl font-semibold text-white mb-6">
          {mode === "login" ? "Connexion" : "Créer un compte"}
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-netflix rounded text-sm text-red-200 space-y-2">
            <p>{error}</p>
            {showLoginLink && (
              <Link
                href={redirectTo !== "/" ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login"}
                className="inline-block text-netflix font-medium hover:underline"
              >
                Aller à la connexion →
              </Link>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full bg-dark-card border border-gray-700 rounded pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-netflix"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
              minLength={6}
              className="w-full bg-dark-card border border-gray-700 rounded pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-netflix"
            />
          </div>
          {mode === "register" && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmer le mot de passe"
                required
                minLength={6}
                className="w-full bg-dark-card border border-gray-700 rounded pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-netflix"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-netflix hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {mode === "login" ? "Se connecter" : "S'inscrire"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          {mode === "login" ? (
            <>
              Pas encore de compte ?{" "}
              <Link
                href={redirectTo !== "/" ? `/register?redirect=${encodeURIComponent(redirectTo)}` : "/register"}
                className="text-netflix hover:underline"
              >
                S&apos;inscrire
              </Link>
            </>
          ) : (
            <>
              Déjà un compte ?{" "}
              <Link
                href={redirectTo !== "/" ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login"}
                className="text-netflix hover:underline"
              >
                Se connecter
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
