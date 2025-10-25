"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAppContext } from "@/context/page";
import { Separator } from "@/components/ui/separator";
import { Loader } from "lucide-react";

const CarouselBanner = dynamic(() => import("@/components/CarouselBanner"), {
  loading: () => (
    <Loader className="mx-auto my-[12rem] relative bottom-0 w-6 animate-spin text-primary" />
  ),
});

const AnimesCarousel = dynamic(() => import("@/components/AnimesCarousel"), {
  loading: () => (
    <Loader className="mx-auto my-[120px] relative bottom-0 w-6 animate-spin text-primary" />
  ),
});

const AnimeVerticalCarousel = dynamic(
  () => import("@/components/AnimeVerticalCarousel"),
  {
    loading: () => (
      <Loader className="mx-auto my-[9.4rem] relative bottom-0 w-6 animate-spin text-primary" />
    ),
  }
);

const AnimeGrid = dynamic(() => import("@/components/AnimeGrid"), {
  loading: () => (
    <Loader className="mx-auto my-10 relative bottom-0 w-6 animate-spin text-primary" />
  ),
});

const Schedules = dynamic(() => import("@/components/Schedules"), {
  loading: () => (
    <Loader className="mx-auto relative bottom-0 w-6 animate-spin text-primary" />
  ),
});

const ScrollTopButton = dynamic(() => import("@/components/ScrollTopButton"), {
  loading: () => (
    <Loader className="mx-auto relative bottom-0 w-6 animate-spin text-primary" />
  ),
});

const RandomAnimeButton = dynamic(() => import("@/components/RandomAnimeButton"));

export default function Home() {
  let {
    spotlightAnimes,
    trendingAnimes,
    latestEpisodeAnimes,
    topUpcomingAnimes,
    top10Animes,
    topAiringAnimes,
    mostPopularAnimes,
    mostFavoriteAnimes,
    latestCompletedAnimes,
    moviesData,
    user,
  } = useAppContext();

  const [topTypeValue, setTopTypeValue] = useState("week");

  // Set page metadata dynamically
  useEffect(() => {
    document.title = "Watch Anime Online - Latest Episodes & Top Anime Series | Weeblo";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Stream the latest anime episodes online. Watch trending, popular, and top-rated anime series. Browse thousands of anime shows including One Piece, Naruto, Attack on Titan, and more."
      );
    }

    // Add keywords meta if it doesn't exist
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute(
      "content",
      "watch anime, anime streaming, latest anime episodes, trending anime, top anime, anime series, dubbed anime, subbed anime"
    );
  }, []);

  useEffect(() => {
    fetch("/api/get-ip");
  }, []);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Watch Anime Online - Latest Episodes & Top Series",
    description: "Stream the latest anime episodes and discover trending anime series",
    url: "https://www.weeblo.vercel.app/home",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: spotlightAnimes?.slice(0, 5).map((anime, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "TVSeries",
          name: anime.name,
          image: anime.poster,
        },
      })),
    },
  };

  if (!spotlightAnimes) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <main 
        className="relative flex flex-col overflow-x-hidden w-screen no-scrollbar"
        itemScope
        itemType="https://schema.org/WebPage"
      >
        {/* Hero Banner Section */}
        <section aria-label="Featured anime spotlight">
          <CarouselBanner animes={spotlightAnimes} />
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 sm:min-h-screen">
          {/* Top 10 Anime */}
          <section aria-labelledby="top-10-heading">
            <h2 id="top-10-heading" className="sr-only">
              Top 10 Anime of the Week
            </h2>
            <AnimesCarousel
              animes={top10Animes && top10Animes[topTypeValue]}
              type="Top 10"
              topTypeValue={topTypeValue}
              setTopTypeValue={setTopTypeValue}
            />
          </section>

          <Separator className="my-2 md:hidden" />

          {/* Trending Anime */}
          <section aria-labelledby="trending-heading">
            <h2 id="trending-heading" className="sr-only">
              Trending Anime Series
            </h2>
            <AnimesCarousel animes={trendingAnimes} type="Trending" />
          </section>

          <Separator className="my-2 md:hidden" />

          {/* Top Airing */}
          <section aria-labelledby="top-airing-heading">
            <h2 id="top-airing-heading" className="sr-only">
              Top Currently Airing Anime
            </h2>
            <AnimesCarousel animes={topAiringAnimes} type="Top Airing" />
          </section>

          {/* Continue Watching - Only for logged in users */}
          {user && (
            <>
              <Separator className="my-2" />
              <section aria-labelledby="continue-watching-heading">
                <h2 id="continue-watching-heading" className="sr-only">
                  Continue Watching Your Anime
                </h2>
                <AnimesCarousel
                  animes={user?.continueWatching}
                  type="Continue Watching"
                />
              </section>
            </>
          )}

          <Separator className="my-2 md:hidden" />

          {/* Popular, Favorite, Completed Anime Grid */}
          <div className="px-2 md:space-x-2 grid grid-cols-1 sm:mt-16 lg:grid-cols-3 gap-x-4 items-center mb-4">
            <section aria-labelledby="popular-heading">
              <h2 id="popular-heading" className="sr-only">
                Most Popular Anime
              </h2>
              <AnimeVerticalCarousel
                animes={mostPopularAnimes}
                type={"Most Popular Animes"}
              />
            </section>

            <section aria-labelledby="favorite-heading">
              <h2 id="favorite-heading" className="sr-only">
                Most Favorite Anime
              </h2>
              <AnimeVerticalCarousel
                animes={mostFavoriteAnimes}
                type={"Most Favorite Animes"}
              />
            </section>

            <section aria-labelledby="completed-heading">
              <h2 id="completed-heading" className="sr-only">
                Latest Completed Anime Series
              </h2>
              <AnimeVerticalCarousel
                animes={latestCompletedAnimes}
                type={"Latest Completed Animes"}
              />
            </section>
          </div>
        </div>

        <Separator className="my-2" />

        {/* Latest Episodes Section */}
        <div className="px-2 md:space-x-2 grid grid-cols-1 mt-10 sm:mt-16 lg:grid-cols-4 items-start">
          <aside className="lg:border-r mb-2 md:mb-0" aria-label="Upcoming anime">
            <section aria-labelledby="upcoming-heading">
              <h2 id="upcoming-heading" className="sr-only">
                Upcoming Anime Releases
              </h2>
              <AnimeVerticalCarousel animes={topUpcomingAnimes} type={"Upcoming"} />
            </section>
          </aside>

          <Separator className="my-2 md:hidden" />

          <section 
            className="col-span-1 md:col-span-2 lg:col-span-3 md:h-[100vh] overflow-y-scroll no-scrollbar"
            aria-labelledby="latest-episodes-heading"
          >
            <h2 id="latest-episodes-heading" className="sr-only">
              Latest Anime Episodes Released
            </h2>
            <AnimeGrid animes={latestEpisodeAnimes} type={"Latest Episodes"} />
          </section>
        </div>

        <Separator className="my-2 md:hidden" />

        {/* Latest Movies */}
        <section aria-labelledby="movies-heading">
          <h2 id="movies-heading" className="sr-only">
            Latest Anime Movies
          </h2>
          <AnimesCarousel animes={moviesData} type="Latest Movies" />
        </section>

        <Separator className="mt-5 md:mt-9 mb-3" />

        {/* Today's Schedule */}
        <section aria-labelledby="schedules-heading">
          <h2 id="schedules-heading" className="sr-only">
            Today's Anime Release Schedule
          </h2>
          <Schedules />
        </section>

        {/* Utility Buttons */}
        <ScrollTopButton />
        <RandomAnimeButton />
      </main>

      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}