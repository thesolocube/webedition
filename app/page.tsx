import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import HomeContent from "@/components/HomeContent";
import HomeErrorFallback from "@/components/HomeErrorFallback";
import { loadHomePageData } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { trending, popular, upcoming, genreSections, error } = await loadHomePageData();

  if (error) {
    return (
      <Layout>
        <HomeErrorFallback message={error} />
      </Layout>
    );
  }

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
