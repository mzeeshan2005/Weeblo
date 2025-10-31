"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import { getAnimeInfo } from "@/app/api/getAnimeInfo";
import { getAnimeExtraInfo } from "@/app/api/getAnimeExtraInfo";
import {
  Star,
  StarHalf,
  StarOff,
  Sprout,
  FileVideo,
  Video,
  Captions,
  Mic,
  Clock,
  Calendar,
  Film,
  Loader,
  Play,
  SquarePlay,
  Users,
  Heart,
  CalendarClock,
  TriangleAlert,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ReactPlayer from "react-player";
import { Bakbak_One, Bebas_Neue } from "next/font/google";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

const bebas_nueue = Bebas_Neue({
  weight: ["400"],
  style: "normal",
  subsets: ["latin"],
});
const bakbak_one = Bakbak_One({
  weight: ["400"],
  style: "normal",
  subsets: ["latin"],
});

const AnimesCarousel = dynamic(() => import("@/components/AnimesCarousel"), {
  loading: () => (
    <Loader className="mx-auto relative bottom-0 w-6 animate-spin text-primary" />
  ),
});
const AnimeVerticalCarousel = dynamic(
  () => import("@/components/AnimeVerticalCarousel"),
  {
    loading: () => (
      <Loader className="mx-auto relative bottom-0 w-6 animate-spin text-primary" />
    ),
  }
);
const SaveAnimeButton = dynamic(() => import("@/components/SaveAnimeButton"), {
  loading: () => (
    <Loader className="mx-auto relative bottom-0 w-6 animate-spin text-primary" />
  ),
});
const ScrollTopButton = dynamic(() => import("@/components/ScrollTopButton"), {
  loading: () => (
    <Loader className="mx-auto relative bottom-0 w-6 animate-spin text-primary" />
  ),
});

export default function DetailedInfoCard({ params: { id } }) {
  const animeId = decodeURI(id);
  const [animeInfo, setAnimeInfo] = useState({});
  const [watchId, setWatchId] = useState(null);
  const [animeExtraInfo, setAnimeExtraInfo] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchLoading2, setFetchLoading2] = useState(true);
  const [seeMore, setSeeMore] = useState(false);
  const [redFlag, setRedFlag] = useState(false);

  const renderStars = () => {
    const fullStars = Math.floor(animeInfo?.anime?.moreInfo?.malscore / 2);
    const hasHalfStar = animeInfo?.anime?.moreInfo?.malscore % 2 !== 0;

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star className="w-6 text-yellow-500" key={i} />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf className="w-6 text-yellow-500" key={fullStars} />);
    }
    return stars;
  };

  const fetchInfo = async () => {
    setFetchLoading(true);
    await getAnimeInfo(animeId).then((res) => setAnimeInfo(res));
    setFetchLoading(false);
  };

  const fetchExtraInfo = async () => {
    setFetchLoading2(true);
    await getAnimeExtraInfo(
      animeInfo?.anime?.info?.name,
      animeInfo?.anime?.moreInfo?.japanese
    ).then((res) => setAnimeExtraInfo(res));
    setFetchLoading2(false);
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  useEffect(() => {
    if (animeInfo?.anime?.info?.name) {
      const prefix = id.split("-").at(-1);
      const lowercasename = animeInfo.anime.info.name
        .replaceAll(" ", "-")
        .replaceAll(/[^a-zA-Z0-9-]/g, "")
        .toLowerCase();
      setWatchId(lowercasename + "-" + prefix);
      let redF = animeInfo?.anime?.moreInfo?.genres?.some((genreArray) => {
        return (
          genreArray.includes("Harem") ||
          genreArray.includes("Ecchi") ||
          genreArray.includes("Josei")
        );
      });
      setRedFlag(redF);
      fetchExtraInfo();
    }
  }, [animeInfo]);

  return !fetchLoading ? (
    <>
      <Head>
        <title>
          {animeInfo?.anime?.info?.name
            ? `Weeblo - ${animeInfo.anime.info.name}`
            : "Weeblo - Anime Details"}
        </title>
        <meta
          name="description"
          content={
            animeInfo?.anime?.info?.description
              ? `${animeInfo.anime.info.description.slice(0, 150)}...`
              : "Explore detailed information about your favorite anime, including synopsis, ratings, genres, and more on Weeblo."
          }
        />
        <meta
          name="keywords"
          content={`${animeInfo?.anime?.info?.name || "Anime"}, anime, ${
            animeInfo?.anime?.moreInfo?.genres?.join(", ") || "animation"
          }, Weeblo`}
        />
        <meta
          property="og:title"
          content={animeInfo?.anime?.info?.name || "Anime Details - Weeblo"}
        />
        <meta
          property="og:description"
          content={
            animeInfo?.anime?.info?.description
              ? `${animeInfo.anime.info.description.slice(0, 150)}...`
              : "Discover anime details, ratings, and trailers on Weeblo."
          }
        />
        <meta
          property="og:image"
          content={animeInfo?.anime?.info?.poster || "/default-image.jpg"}
        />
        <meta
          property="og:url"
          content={`https://yourdomain.com/info/${animeId}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={`https://yourdomain.com/info/${animeId}`} />
        <link
          rel="preload"
          href={animeExtraInfo?.coverImage || animeInfo?.anime?.info?.poster}
          as="image"
        />
      </Head>
      <main className="px-1 grid grid-cols-1 mt-16 sm:mt-20 md:grid-cols-3 lg:grid-cols-4 items-start overflow-x-hidden no-scrollbar">
        <article className="col-span-1 md:col-span-2 lg:col-span-3 flex space-y-1 flex-col">
          <header className="relative sm:max-w-[85%]">
            <div className="absolute inset-0 bg-gradient-to-tl from-primary/10 via-gray-900/10 to-gray-950 hover:to-black z-10"></div>
            <Image
              alt={`Banner for ${animeInfo?.anime?.info?.name || "Anime"}`}
              className="aspect-[3360/800] z-0 object-cover h-[40vh] lg:h-[45vh] w-full"
              width={3360}
              height={800}
              src={animeExtraInfo?.coverImage || animeInfo?.anime?.info?.poster}
              priority={true}
            />
            <div className="absolute w-fit right-1 top-1 sm:opacity-80 sm:hover:opacity-100 z-[25]">
              {animeInfo && (
                <SaveAnimeButton
                  animeId={animeId}
                  name={animeInfo?.anime?.info?.name}
                  poster={animeInfo?.anime?.info?.poster}
                />
              )}
            </div>
            <div className="absolute w-full z-20 right-1 md:bottom-2 bottom-4 flex items-center space-x-1 justify-end">
              {!fetchLoading2 && animeExtraInfo?.youtubeVideoId && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-none bg-white dark:text-black dark:hover:text-white sm:opacity-80 sm:hover:opacity-100"
                      aria-label="Watch anime trailer">
                      <SquarePlay aria-hidden="true" />
                      Trailer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="py-0 flex items-center justify-center bg-black">
                    <ReactPlayer
                      playing={true}
                      url={`https://www.youtube.com/watch?v=${animeExtraInfo?.youtubeVideoId}`}
                      controls={false}
                      className="w-screen aspect-square md:aspect-video"
                    />
                  </DialogContent>
                </Dialog>
              )}
              {animeInfo?.anime?.moreInfo.status !== "Not yet aired" && (
                <Link
                  href={`/watch/${encodeURIComponent(watchId)}?ep=1`}
                  className="w-[35%] md:w-[20%]">
                  <Button
                    className="w-full text-white sm:opacity-90 sm:hover:opacity-100"
                    aria-label={`Watch ${animeInfo?.anime?.info?.name}`}>
                    <Play aria-hidden="true" />
                    Watch
                  </Button>
                </Link>
              )}
            </div>
            <h1
              className={cn(
                "absolute z-20 top-2 left-2 text-4xl font-bold text-white",
                bebas_nueue.className
              )}>
              {animeInfo?.anime?.info?.name}
            </h1>
          </header>
          <section className="flex flex-col gap-4">
            <div className="flex space-x-2">
              <Image
                alt={`Poster for ${animeInfo?.anime?.info?.name || "Anime"}`}
                className="aspect-[300/400] rounded-md sm:rounded-lg object-cover border border-gray-200 w-36 dark:border-gray-800"
                height={400}
                src={animeInfo?.anime?.info?.poster || "/default-image.jpg"}
                width={300}
                priority={true}
              />
              <div className="flex flex-col items-center text-sm md:text-lg">
                <div className="w-full flex items-center">
                  {animeInfo?.anime?.moreInfo?.malscore !== "?" ? (
                    <div className="flex items-center">{renderStars()}</div>
                  ) : (
                    <StarOff className="w-4 text-yellow-500" />
                  )}
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    {animeInfo?.anime?.moreInfo?.malscore}
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-x-1 sm:gap-x-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5" aria-hidden="true" />
                    <Link
                      href={`/search/${animeInfo?.anime?.info?.stats?.type}?type=category`}
                      aria-label={`Filter by type: ${animeInfo?.anime?.info?.stats?.type}`}>
                      <span className="hover:text-secondary">
                        {animeInfo?.anime?.info?.stats?.type}
                      </span>
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" aria-hidden="true" />
                    <span>{animeInfo?.anime?.info?.stats?.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileVideo className="w-5 h-5" aria-hidden="true" />
                    <span>{animeInfo?.anime?.info?.stats?.quality}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Captions className="w-4 sm:w-5" aria-hidden="true" />
                      <span>{animeInfo?.anime?.info?.stats?.episodes.sub}</span>
                    </div>
                    <div className="flex items-center">
                      <Mic className="w-4 sm:w-5" aria-hidden="true" />
                      <span>
                        {animeInfo?.anime?.info?.stats?.episodes.dub || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="min-w-5 sm:w-5" aria-hidden="true" />
                    <span>{animeInfo?.anime?.moreInfo.aired}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sprout className="w-8 sm:w-6" aria-hidden="true" />
                    <span>{animeInfo?.anime?.moreInfo.status}</span>
                  </div>
                  <div className="col-span-2 flex flex-wrap items-center gap-2">
                    <Film className="w-5 h-5" aria-hidden="true" />
                    {animeInfo?.anime?.moreInfo?.genres?.map((genre, i) => (
                      <Link
                        key={i}
                        href={`/search/${genre}?type=genre`}
                        aria-label={`Filter by genre: ${genre}`}>
                        <span className="cursor-pointer hover:text-secondary font-semibold">
                          {genre +
                            (i === animeInfo.anime?.moreInfo.genres.length - 1
                              ? ""
                              : ",")}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <section
              id="description-box"
              className={cn(
                "relative z-0 description-box p-1 sm:max-w-[85%] rounded-sm bg-gray-100 dark:bg-inherit flex border max-h-fit overflow-hidden flex-col gap-2 text-sm dark:text-gray-300",
                seeMore && "max-h-[10rem] overflow-y-scroll"
              )}>
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br from-gray-50/0 dark:from-primary/10 via-gray-500/0 dark:via-gray-500/10 to-gray-950/60 dark:to-gray-950 z-10",
                  seeMore && "hidden"
                )}></div>
              <h2 className="text-lg font-semibold">Synopsis</h2>
              <p>
                {animeInfo?.anime?.info?.description &&
                  (seeMore
                    ? animeInfo.anime.info.description
                    : `${animeInfo.anime.info.description.slice(0, 300)}...`)}
              </p>
              <button
                onClick={() => setSeeMore(!seeMore)}
                className={cn(
                  "w-fit text-secondary ml-auto mb-4 cursor-pointer font-semibold z-20"
                )}
                aria-expanded={seeMore}
                aria-controls="description-box">
                {seeMore ? "Collapse synopsis" : "Expand synopsis"}
              </button>
            </section>
            <section className="grid grid-cols-2 gap-1 md:max-w-[85%]">
              <div className="rounded-sm flex space-y-2 flex-col items-center border py-2 px-4">
                <h3 className="font-semibold text-lg leading-none text-secondary">
                  Watches
                </h3>
                <div className="flex items-center space-x-2">
                  <Users aria-hidden="true" />
                  <span>{animeExtraInfo?.userCount || "?"}</span>
                </div>
              </div>
              <div className="rounded-sm flex space-y-2 flex-col items-center border py-2 px-4">
                <h3 className="font-semibold text-lg leading-none text-secondary">
                  Likes
                </h3>
                <div className="flex items-center space-x-2">
                  <Heart aria-hidden="true" />
                  <span>{animeExtraInfo?.favoritesCount || "?"}</span>
                </div>
              </div>
              <div className="rounded-sm flex space-y-2 flex-col items-center border py-2 px-4">
                <h3 className="font-semibold text-lg leading-none text-secondary">
                  Total Duration
                </h3>
                <div className="flex items-center space-x-2">
                  <CalendarClock aria-hidden="true" />
                  <span>
                    {animeExtraInfo?.totalLength
                      ? `${Math.abs(animeExtraInfo.totalLength)} min`
                      : "?"}
                  </span>
                </div>
              </div>
              <div className="rounded-sm flex space-y-2 flex-col items-center border py-2 px-4">
                <h3 className="font-semibold text-lg leading-none text-secondary">
                  18+
                </h3>
                <div className="flex items-center space-x-2">
                  <TriangleAlert aria-hidden="true" />
                  <span>{animeExtraInfo?.nsfw || redFlag ? "Yes" : "No"}</span>
                </div>
              </div>
            </section>
            <section className="grid grid-cols-2 space-y-2 md:max-w-[85%]">
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <h3 className="font-semibold sm:text-lg text-secondary">
                  Rating
                </h3>
                <span className="text-sm">
                  {animeInfo?.anime?.info?.stats?.rating}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-1 sm:gap-2">
                <h3 className="font-semibold sm:text-lg text-secondary">
                  Japanese
                </h3>
                <span className="text-sm">
                  {animeInfo?.anime?.moreInfo?.japanese}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <h3 className="font-semibold sm:text-lg text-secondary">
                  Premiered
                </h3>
                <span className="text-sm">
                  {animeInfo?.anime?.moreInfo?.premiered}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <h3 className="font-semibold sm:text-lg text-secondary">
                  Synonyms
                </h3>
                <span className="text-sm">
                  {animeInfo?.anime?.moreInfo?.synonyms}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <h3 className="font-semibold sm:text-lg text-secondary">
                  Studios
                </h3>
                <span className="text-sm">
                  {animeInfo?.anime?.moreInfo?.studios}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <h3 className="font-semibold sm:text-lg text-secondary">
                  Popularity Rank
                </h3>
                <span className="text-sm">
                  {animeExtraInfo?.popularityRank || "?"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <h3 className="font-semibold sm:text-lg text-secondary">
                  Rating Rank
                </h3>
                <span className="text-sm">
                  {animeExtraInfo?.ratingRank || "?"}
                </span>
              </div>
              <div className="flex flex-col flex-wrap sm:flex-row items-center gap-1 sm:gap-1">
                <h3 className="font-semibold sm:text-lg text-secondary">
                  Producers
                </h3>
                {animeInfo?.anime?.moreInfo?.producers?.map((p, i) => (
                  <Link
                    key={i}
                    href={`/search/${p}?type=producer`}
                    aria-label={`Filter by producer: ${p}`}>
                    <span className="text-sm hover:text-primary leading-none">
                      {p +
                        (i === animeInfo?.anime?.moreInfo?.producers?.length - 1
                          ? ""
                          : ",")}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
            <section className="md:max-w-[85%]">
              {animeInfo?.seasons?.length > 0 && (
                <AnimesCarousel
                  animes={animeInfo?.seasons?.filter(
                    (season) => season.id !== animeId
                  )}
                  type="Seasons"
                />
              )}
            </section>
            {animeInfo?.anime?.info?.promotionalVideos.length > 0 && (
              <section className="flex flex-col gap-2">
                <h2
                  className={cn(
                    "text-secondary ml-2 font-bold text-sm sm:text-lg",
                    bakbak_one.className
                  )}>
                  Promotional Videos
                </h2>
                <div className="md:max-w-[85%] ml-2 flex items-center gap-1 overflow-x-scroll no-scrollbar">
                  {animeInfo?.anime?.info.promotionalVideos.map((video, i) => (
                    <Dialog key={i}>
                      <DialogTrigger asChild>
                        <div className="relative w-[100px] h-[50px] md:w-[150px] md:h-[75px]">
                          <div className="absolute text-red-400 bottom-1 right-0">
                            <Youtube aria-hidden="true" />
                          </div>
                          <Image
                            className="aspect-[200/100] w-full h-full object-cover"
                            src={video.thumbnail}
                            alt={`Thumbnail for ${video.title} promotional video`}
                            width={200}
                            height={100}
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="py-0 flex items-center justify-center bg-black">
                        <ReactPlayer
                          playing={true}
                          url={video.source}
                          controls={false}
                          className="w-screen aspect-square md:aspect-video"
                          aria-label={`Promotional video: ${video.title}`}
                        />
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </section>
            )}
            {animeInfo?.anime?.info?.charactersVoiceActors.length > 0 && (
              <section className="md:max-w-[85%] flex flex-col">
                <h2
                  className={cn(
                    "text-secondary ml-2 font-bold text-sm sm:text-lg",
                    bakbak_one.className
                  )}>
                  Characters & Voice Actors
                </h2>
                <div className="w-full flex gap-x-2 items-center no-scrollbar overflow-x-scroll">
                  {animeInfo?.anime?.info?.charactersVoiceActors?.map((cva) => (
                    <div
                      key={cva.character.id}
                      className="ml-2 bg-transparent flex items-center w-[200px] h-[150px] sm:w-[150px] sm:h-[120px]">
                      <div>
                        <div className="flex items-center">
                          <Avatar>
                            <AvatarImage
                              src={cva.character.poster}
                              width={40}
                              height={20}
                              alt={`${cva.character.name} character image`}
                              className="rounded-full"
                            />
                          </Avatar>
                          <Avatar>
                            <AvatarImage
                              src={cva.voiceActor.poster}
                              width={40}
                              height={20}
                              alt={`${cva.voiceActor.name} voice actor image`}
                              className="rounded-full object-cover object-center scale-95 -ml-1"
                            />
                          </Avatar>
                        </div>
                        <h3
                          className="text-xs font-semibold mb-1 truncate"
                          title={cva.character.name}>
                          {cva.character.name}
                        </h3>
                        <p
                          className="text-[0.65rem] text-gray-200 truncate"
                          title={`Voiced by: ${cva.voiceActor.name}`}>
                          Voiced: {cva.voiceActor.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </section>
        </article>
        <aside className="flex flex-col md:space-y-3 md:-mt-12">
          <section className="sm:mt-5 mt-1">
            <AnimeVerticalCarousel
              animes={animeInfo?.relatedAnimes}
              type="Related"
              page="info"
            />
          </section>
          <section className="mt-3 md:mt-1">
            <Separator className="lg:mt-10 lg:-mb-2" />
            <AnimeVerticalCarousel
              animes={animeInfo?.recommendedAnimes}
              type="Recommended"
              page="info"
            />
          </section>
          <Separator />
        </aside>
        <ScrollTopButton />
      </main>
    </>
  ) : (
    <Loader
      className="mx-auto relative top-48 h-12 w-12 animate-spin text-primary"
      aria-label="Loading anime details"
    />
  );
}
