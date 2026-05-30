import { NextResponse } from "next/server";
import { getTvSeason, TmdbError } from "@/lib/tmdb";

interface RouteParams {
  params: { id: string; season: string };
}

export async function GET(_request: Request, { params }: RouteParams) {
  const id = parseInt(params.id, 10);
  const season = parseInt(params.season, 10);

  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json(
      { error: "Identifiant série invalide.", episodes: [] },
      { status: 400 }
    );
  }

  if (!Number.isFinite(season) || season < 0) {
    return NextResponse.json(
      { error: "Numéro de saison invalide.", episodes: [] },
      { status: 400 }
    );
  }

  if (!process.env.TMDB_API_KEY?.trim()) {
    return NextResponse.json(
      {
        error: "TMDB_API_KEY non configurée sur le serveur.",
        episodes: [],
      },
      { status: 503 }
    );
  }

  try {
    const data = await getTvSeason(id, season);
    return NextResponse.json(
      { episodes: data.episodes ?? [] },
      { status: 200 }
    );
  } catch (error) {
    const status = error instanceof TmdbError ? error.status : 500;
    const message =
      error instanceof Error ? error.message : "Impossible de charger la saison.";

    return NextResponse.json(
      { error: message, episodes: [] },
      { status: status >= 400 && status < 600 ? status : 500 }
    );
  }
}
