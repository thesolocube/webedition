import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import HomeContent from "@/components/HomeContent";
import {
  getTrending,
  getPopularMovies,
  getUpcomingMovies,
  discoverByGenre,
  GENRE_SECTIONS,
} from "@/lib/tmdb";

export default async function HomePage() {
  const [trending, popular, upcoming] = await Promise.all([
    getTrending(),
    getPopularMovies(),
    getUpcomingMovies(),
  ]);

  const genreSections = await Promise.all(
    GENRE_SECTIONS.map(async (genre) => ({
      label: genre.label,
      movies: await discoverByGenre(genre.id),
    }))
  );

  const heroMovie = trending[0];

  return (
    <Layout>
      {heroMovie && <Hero movie={heroMovie} />}
      <HomeContent
        trending={trending}
        popular={popular}
        upcoming={upcoming}
        genreSections={genreSections}
      />
    </Layout>
  );
}
