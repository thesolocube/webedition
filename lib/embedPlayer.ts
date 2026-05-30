/**
 * Paramètres embed anti-pub / anti-popup (meilleur effort selon le fournisseur).
 */
export function buildEmbedQueryParams(): string {
  const params = new URLSearchParams({
    ds_lang: "ar",
    primaryColor: "#E50914",
    autoplay: "1",
    ads: "0",
    ad_free: "1",
    popup: "0",
    popups: "0",
    share: "0",
    download: "0",
    noblock: "0",
  });
  return `?${params.toString()}`;
}

export function getEmbedUrl(
  mediaType: "movie" | "tv",
  id: number,
  season?: number,
  episode?: number
): string {
  const base = "https://vaplayer.ru/embed";
  const query = buildEmbedQueryParams();
  if (mediaType === "movie") {
    return `${base}/movie/${id}${query}`;
  }
  return `${base}/tv/${id}/${season ?? 1}/${episode ?? 1}${query}`;
}
