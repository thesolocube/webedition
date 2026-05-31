/**
 * IMPORTANT Next.js : process.env.NEXT_PUBLIC_* doit être lu avec
 * des accès statiques (process.env.NEXT_PUBLIC_XXX), pas process.env[key].
 * Sinon les valeurs ne sont pas injectées au build et restent vides en prod.
 */

export const FIREBASE_ENV_VARS = {
  apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
  authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  storageBucket: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  appId: "NEXT_PUBLIC_FIREBASE_APP_ID",
  measurementId: "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID",
} as const;

export type FirebaseEnvKey = (typeof FIREBASE_ENV_VARS)[keyof typeof FIREBASE_ENV_VARS];

const PLACEHOLDER_VALUES = new Set([
  "",
  "VOTRE_CLE",
  "VOTRE_DOMAINE",
  "VOTRE_BUCKET",
  "VOTRE_ID",
  "VOTRE_APP_ID",
  "your_api_key",
  "undefined",
]);

/** Lit les variables Firebase — accès statique requis pour le bundle client. */
export function readFirebaseEnvValues() {
  return {
    apiKey: (process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "").trim(),
    authDomain: (process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "").trim(),
    projectId: (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "").trim(),
    storageBucket: (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "").trim(),
    messagingSenderId: (process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "").trim(),
    appId: (process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "").trim(),
    measurementId: (process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "").trim(),
  };
}

function isValidValue(value: string): boolean {
  return value.length > 0 && !PLACEHOLDER_VALUES.has(value);
}

export function getMissingFirebaseEnvVars(): FirebaseEnvKey[] {
  const env = readFirebaseEnvValues();
  const missing: FirebaseEnvKey[] = [];

  if (!isValidValue(env.apiKey)) missing.push(FIREBASE_ENV_VARS.apiKey);
  if (!isValidValue(env.authDomain)) missing.push(FIREBASE_ENV_VARS.authDomain);
  if (!isValidValue(env.projectId)) missing.push(FIREBASE_ENV_VARS.projectId);
  if (!isValidValue(env.storageBucket)) missing.push(FIREBASE_ENV_VARS.storageBucket);
  if (!isValidValue(env.messagingSenderId)) missing.push(FIREBASE_ENV_VARS.messagingSenderId);
  if (!isValidValue(env.appId)) missing.push(FIREBASE_ENV_VARS.appId);

  return missing;
}

export function isFirebaseConfigured(): boolean {
  return getMissingFirebaseEnvVars().length === 0;
}

export function getFirebaseConfigErrorMessage(): string | null {
  const missing = getMissingFirebaseEnvVars();
  if (missing.length === 0) return null;

  return `Configuration Firebase manquante ou invalide. Variables absentes : ${missing.join(", ")}.`;
}

export function getFirebaseConfig() {
  const missing = getMissingFirebaseEnvVars();
  if (missing.length > 0) {
    throw new Error(getFirebaseConfigErrorMessage() ?? "Configuration Firebase manquante.");
  }

  const env = readFirebaseEnvValues();

  return {
    apiKey: env.apiKey,
    authDomain: env.authDomain,
    projectId: env.projectId,
    storageBucket: env.storageBucket,
    messagingSenderId: env.messagingSenderId,
    appId: env.appId,
    measurementId: env.measurementId || undefined,
  };
}
