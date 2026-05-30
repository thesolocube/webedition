import { NextResponse } from "next/server";
import { getTvSeason } from "@/lib/tmdb";

export async function GET(
  _request: Request,
  { params }: { params: { id: string; season: string } }
) {
  const id = parseInt(params.id, 10);
  const season = parseInt(params.season, 10);

  try {
    const data = await getTvSeason(id, season);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch season" }, { status: 500 });
  }
}
