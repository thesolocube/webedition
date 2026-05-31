/** Variables Firebase requises côté client (NEXT_PUBLIC_). */
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

const REQUIRED_KEYS: FirebaseEnvKey[] = [
  FIREBASE_ENV_VARS.apiKey,
  FIREBASE_ENV_VARS.authDomain,
  FIREBASE_ENV_VARS.projectId,
  FIREBASE_ENV_VARS.storageBucket,
  FIREBASE_ENV_VARS.messagingSenderId,
  FIREBASE_ENV_VARS.appId,
];

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

function readEnv(key: FirebaseEnvKey): string {
  return (process.env[key] ?? "").trim();
}

function isValidValue(value: string): boolean {
  return value.length > 0 && !PLACEHOLDER_VALUES.has(value);
}

export function getMissingFirebaseEnvVars(): FirebaseEnvKey[] {
  return REQUIRED_KEYS.filter((key) => !isValidValue(readEnv(key)));
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

  return {
    apiKey: readEnv(FIREBASE_ENV_VARS.apiKey),
    authDomain: readEnv(FIREBASE_ENV_VARS.authDomain),
    projectId: readEnv(FIREBASE_ENV_VARS.projectId),
    storageBucket: readEnv(FIREBASE_ENV_VARS.storageBucket),
    messagingSenderId: readEnv(FIREBASE_ENV_VARS.messagingSenderId),
    appId: readEnv(FIREBASE_ENV_VARS.appId),
    measurementId: readEnv(FIREBASE_ENV_VARS.measurementId) || undefined,
  };
}
