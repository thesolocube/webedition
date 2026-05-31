"use client";

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getFirebaseConfig, isFirebaseConfigured, getFirebaseConfigErrorMessage } from "./firebase-env";

export {
  isFirebaseConfigured,
  getFirebaseConfigErrorMessage,
  getMissingFirebaseEnvVars,
  FIREBASE_ENV_VARS,
} from "./firebase-env";

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

function assertClient() {
  if (typeof window === "undefined") {
    throw new Error("Firebase ne peut être utilisé que côté client.");
  }
}

function assertConfigured() {
  if (!isFirebaseConfigured()) {
    throw new Error(
      getFirebaseConfigErrorMessage() ??
        "Configuration Firebase manquante. Ajoutez les variables NEXT_PUBLIC_FIREBASE_* dans Netlify → Site configuration → Environment Variables puis redéployez."
    );
  }
}

export function getFirebaseApp(): FirebaseApp {
  assertClient();
  assertConfigured();

  if (!getApps().length) {
    app = initializeApp(getFirebaseConfig());
  } else {
    app = getApps()[0];
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  assertClient();
  assertConfigured();

  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

export function getFirebaseDb(): Firestore {
  assertClient();
  assertConfigured();

  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}
