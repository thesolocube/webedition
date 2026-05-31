"use client";

import FirebaseConfigGuard from "@/components/FirebaseConfigGuard";
import { AuthProvider } from "@/hooks/useAuth";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseConfigGuard>
      <AuthProvider>{children}</AuthProvider>
    </FirebaseConfigGuard>
  );
}
