"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/hooks/useAuth";

function LoginContent() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectTo.startsWith("/") ? redirectTo : "/");
    }
  }, [user, loading, router, redirectTo]);

  return <AuthForm mode="login" onSubmit={login} redirectTo={redirectTo} />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark flex items-center justify-center text-gray-400">Chargement...</div>}>
      <LoginContent />
    </Suspense>
  );
}
