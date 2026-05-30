"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/hooks/useAuth";

function RegisterContent() {
  const { register, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectTo.startsWith("/") ? redirectTo : "/");
    }
  }, [user, loading, router, redirectTo]);

  return <AuthForm mode="register" onSubmit={register} redirectTo={redirectTo} />;
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark flex items-center justify-center text-gray-400">Chargement...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
