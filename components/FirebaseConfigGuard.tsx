"use client";

import { isFirebaseConfigured } from "@/lib/firebase-env";
import FirebaseConfigError from "./FirebaseConfigError";

interface FirebaseConfigGuardProps {
  children: React.ReactNode;
}

export default function FirebaseConfigGuard({ children }: FirebaseConfigGuardProps) {
  if (!isFirebaseConfigured()) {
    return <FirebaseConfigError />;
  }

  return <>{children}</>;
}
