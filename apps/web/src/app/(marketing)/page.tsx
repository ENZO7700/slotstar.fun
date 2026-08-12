import { getBlogPosts, getGames, getHealth, getProviders } from "@/lib/api/wordpress";
import type { GameSummary } from "@/types/game";
import type { Provider } from "@/types/provider";
import type { BlogPost } from "@/lib/api/wordpress";
import { PartnerStrip } from "@/components/ui/AffiliateComponents";
import { ApiErrorState } from "@/components/states/ApiErrorState";
import {
  LandingCategoryNav,
  LandingEditorial,
  LandingFeatured,
  LandingFinalCta,
  LandingFooter,
  LandingHeader,
  LandingHero,
  LandingHow,
  LandingNew,
  LandingProviders,
  LandingResponsible,
  LandingTrending,
  LandingTrustTicker,
} from "@/components/landing";

export const dynamic = "force-dynamic";

export default async function MarketingHomePage() {
  let health = null;
  let newGames: GameSummary[] = [];
  let featuredGames: GameSummary[] = [];
  let trendingGames: GameSummary[] = [];
  let topProviders: Provider[] = [];
  let posts: BlogPost[] = [];
  let totalGames: number | null = null;
  let errorMsg: string | null = null;

  try {
    const settled = await Promise.allSettled([
      getHealth(),
      getGames({ perPage: 12, orderBy: "date", order: "desc" }),
      getGames({ perPage: 10, orderBy: "trending", order: "desc" }),
      getGames({ perPage: 10, orderBy: "modified", order: "desc" }),
      getProviders({ perPage: 12 }),
      getBlogPosts({ perPage: 3 }),
    ]);

    const healthResult = settled[0];
    const newResult = settled[1];
    const trendingResult = settled[2];
    const featuredResult = settled[3];
    const providersResult = settled[4];
    const blogResult = settled[5];

    if (healthResult.status === "fulfilled") health = healthResult.value;
    if (newResult.status === "fulfilled") {
      newGames = newResult.value.data;
      totalGames = newResult.value.pagination?.total ?? null;
    }
    if (trendingResult.status === "fulfilled") {
      trendingGames =
        trendingResult.value.data.length > 0
          ? trendingResult.value.data
          : newGames.slice(0, 6);
    } else {
      trendingGames = newGames.slice(0, 6);
    }
    if (featuredResult.status === "fulfilled") {
      featuredGames = featuredResult.value.data.filter((g) => g.featured);
      if (featuredGames.length === 0) {
        featuredGames = featuredResult.value.data.slice(0, 5);
      }
    }
    if (providersResult.status === "fulfilled") topProviders = providersResult.value.data;
    if (blogResult.status === "fulfilled") posts = blogResult.value.data;

    if (!health && settled.every((r) => r.status === "rejected")) {
      const first = settled.find((r) => r.status === "rejected") as PromiseRejectedResult;
      throw first.reason instanceof Error ? first.reason : new Error("API unavailable");
    }
  } catch (err: unknown) {
    errorMsg = err instanceof Error ? err.message : "Nepodarilo sa pripojiť k WordPress REST API";
  }

  if (errorMsg && !health) {
    return (
      <>
        <LandingHeader />
        <main className="mx-auto max-w-[1400px] flex-1 px-4 py-16 sm:px-6 lg:px-8">
          <ApiErrorState message={errorMsg} />
        </main>
        <LandingFooter />
      </>
    );
  }

  return (
    <>
      <LandingHeader />
      <main className="flex-1 pb-[calc(var(--fab-height)+1.5rem)]">
        <LandingHero totalGames={totalGames} />
        <LandingTrustTicker />
        <PartnerStrip />
        <LandingTrending games={trendingGames} />
        <LandingCategoryNav />
        <LandingFeatured games={featuredGames} />
        <LandingNew games={newGames} />
        <LandingProviders providers={topProviders} />
        <LandingHow />
        <LandingEditorial posts={posts} />
        <LandingFinalCta />
        <LandingResponsible />
      </main>
      <LandingFooter />
    </>
  );
}
