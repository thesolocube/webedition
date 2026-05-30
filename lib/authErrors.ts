type AuthMode = "login" | "register";

const MESSAGES: Record<string, { login?: string; register?: string; default: string }> = {
  "auth/email-already-in-use": {
    register:
      "Cet email est déjà utilisé. Connectez-vous avec le même compte que sur l'application Android.",
    default: "Cet email est déjà associé à un compte.",
  },
  "auth/invalid-email": {
    default: "Adresse email invalide.",
  },
  "auth/user-disabled": {
    default: "Ce compte a été désactivé.",
  },
  "auth/user-not-found": {
    login: "Aucun compte avec cet email. Créez un compte ou vérifiez l'adresse.",
    default: "Utilisateur introuvable.",
  },
  "auth/wrong-password": {
    login: "Mot de passe incorrect.",
    default: "Mot de passe incorrect.",
  },
  "auth/invalid-credential": {
    login: "Email ou mot de passe incorrect.",
    default: "Identifiants invalides.",
  },
  "auth/too-many-requests": {
    default: "Trop de tentatives. Réessayez dans quelques minutes.",
  },
  "auth/weak-password": {
    register: "Mot de passe trop faible (minimum 6 caractères).",
    default: "Mot de passe trop faible.",
  },
  "auth/network-request-failed": {
    default: "Problème de connexion. Vérifiez votre réseau.",
  },
};

function extractAuthCode(err: unknown): string | null {
  if (err && typeof err === "object" && "code" in err && typeof err.code === "string") {
    return err.code;
  }
  if (err instanceof Error) {
    const match = err.message.match(/\(auth\/[^)]+\)/);
    if (match) return match[0].slice(1, -1);
  }
  return null;
}

export function getAuthErrorMessage(err: unknown, mode: AuthMode): string {
  const code = extractAuthCode(err);
  if (code && MESSAGES[code]) {
    const entry = MESSAGES[code];
    return (mode === "login" ? entry.login : entry.register) ?? entry.default;
  }

  if (err instanceof Error && err.message && !err.message.startsWith("Firebase:")) {
    return err.message;
  }

  return mode === "login"
    ? "Connexion impossible. Vérifiez votre email et mot de passe."
    : "Inscription impossible. Réessayez ou connectez-vous si vous avez déjà un compte.";
}

export function isEmailAlreadyInUse(err: unknown): boolean {
  return extractAuthCode(err) === "auth/email-already-in-use";
}
