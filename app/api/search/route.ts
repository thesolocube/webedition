import { NextResponse } from "next/server";
import { searchMulti, TmdbError } from "@/lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json({ results: [] }, { status: 200 });
  }

  if (!process.env.TMDB_API_KEY?.trim()) {
    return NextResponse.json(
      { error: "TMDB_API_KEY non configurée.", results: [] },
      { status: 503 }
    );
  }

  try {
    const results = await searchMulti(query);
    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    const status = error instanceof TmdbError ? error.status : 500;
    const message =
      error instanceof Error ? error.message : "Recherche indisponible.";

    return NextResponse.json(
      { error: message, results: [] },
      { status: status >= 400 && status < 600 ? status : 500 }
    );
  }
}
