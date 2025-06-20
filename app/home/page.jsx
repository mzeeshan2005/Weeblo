"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAppContext } from "@/context/page";
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
      <Loader className="mx-auto  my-[9.4rem] relative bottom-0 w-6 animate-spin text-primary" />
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
import { Separator } from "@/components/ui/separator";
import { Loader } from "lucide-react";
// import RandomAnimeButton from "@/components/RandomAnimeButton";
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
  useEffect(() => {
    fetch("/api/get-ip");
  }, []);
  return spotlightAnimes ? (
    <main className="relative flex flex-col overflow-x-hidden w-screen no-scrollbar">
      <CarouselBanner animes={spotlightAnimes} />
      <div className="grid grid-cols-1  sm:min-h-screen">
        <AnimesCarousel
          animes={top10Animes && top10Animes[topTypeValue]}
          type="Top 10"
          topTypeValue={topTypeValue}
          setTopTypeValue={setTopTypeValue}
        />
        <Separator className="my-2 md:hidden" />
        <AnimesCarousel animes={trendingAnimes} type="Trending" />
        <Separator className="my-2 md:hidden" />
        <AnimesCarousel animes={topAiringAnimes} type="Top Airing" />
        {user && <Separator className="my-2" />}
        {user && (
          <AnimesCarousel
            animes={user?.continueWatching}
            type="Continue Watching"
          />
        )}
        <Separator className="my-2 md:hidden" />
        <div className="px-2 md:space-x-2 grid grid-cols-1 sm:mt-16 lg:grid-cols-3 gap-x-4 items-center mb-4">
          <AnimeVerticalCarousel
            animes={mostPopularAnimes}
            type={"Most Popular Animes"}
          />
          <AnimeVerticalCarousel
            animes={mostFavoriteAnimes}
            type={"Most Favorite Animes"}
          />
          <AnimeVerticalCarousel
            animes={latestCompletedAnimes}
            type={"Latest Completed Animes"}
          />
        </div>
      </div>
      <Separator className="my-2" />
      <div className="px-2 md:space-x-2 grid grid-cols-1 mt-10 sm:mt-16 lg:grid-cols-4 items-start">
        <div className="lg:border-r mb-2 md:mb-0">
          <AnimeVerticalCarousel animes={topUpcomingAnimes} type={"Upcoming"} />
        </div>
        <Separator className="my-2 md:hidden" />
        <div className="col-span-1 md:col-span-2 lg:col-span-3 md:h-[100vh] overflow-y-scroll no-scrollbar">
          <AnimeGrid animes={latestEpisodeAnimes} type={"Latest Episodes"} />
        </div>
      </div>
      <Separator className="my-2 md:hidden" />
      <AnimesCarousel animes={moviesData} type="Latest Movies" />
      <Separator className="mt-5 md:mt-9 mb-3" />
      <div>
        <Schedules />
      </div>
      <ScrollTopButton />
      {/* <RandomAnimeButton /> */}
    </main>
  ) : (
    <Loader className="mx-auto relative top-48 h-12 w-12 animate-spin text-primary" />
  );
}
