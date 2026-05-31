# webedition ? TFARAJ M3A ATLAS

Application web de streaming (style Netflix) ? version Web de l'application Android.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- Firebase (Auth + Firestore)
- TMDB API

## Installation

```bash
npm install
```

## Configuration

1. Copiez `.env.example` vers `.env.local`.
2. **TMDB** : `TMDB_API_KEY` (serveur uniquement, jamais `NEXT_PUBLIC_`).
3. **Firebase** : cles `NEXT_PUBLIC_FIREBASE_*` depuis la console Firebase.

## Deploiement Vercel

Dans **Vercel ? Project ? Settings ? Environment Variables**, ajoutez :

| Variable | Description |
|----------|-------------|
| `TMDB_API_KEY` | Cle API TMDB (obligatoire) |
| `TMDB_BASE_URL` | `https://api.themoviedb.org/3` (optionnel) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Cle API Web Firebase |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `{project}.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ID projet Firebase |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `{project}.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID Web |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Analytics (optionnel) |

**Important Firebase :** les variables `NEXT_PUBLIC_*` sont injectees au **build**. Apres les avoir ajoutees sur Vercel, faites un **Redeploy** complet. Sinon vous obtiendrez `auth/invalid-api-key`.

Puis **Redeploy** le projet. Sans `TMDB_API_KEY`, l'accueil affiche un message d'erreur au lieu d'un crash 404.

## Lancement local

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Fonctionnalites

- Accueil avec Hero, tendances, genres, populaires, prochainement
- Authentification Firebase (login / register)
- Ma Liste synchronisee (`users/{userId}/favorites/{movieId}`)
- Recherche via `/api/search` (debounce 500ms + vocale)
- Pages details film/serie avec lecteur embed, casting, bande-annonce
- **Continuer a regarder** : Firestore `users/{userId}/continueWatching/{mediaType_id}`

### Regles Firestore (exemple)

```javascript
match /users/{userId}/continueWatching/{docId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
match /users/{userId}/favorites/{docId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

## Structure

```
app/          ? Pages Next.js + API routes
components/   ? UI (Navbar, MovieRow, Player, etc.)
hooks/        ? useAuth, useSpeechToText, useDebounce
lib/          ? tmdb.ts (serveur), tmdb-client.ts (client), firebase.ts
```
