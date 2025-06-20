"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
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
export default function DetailedInfoCard({ params: { id } }) {
  const animeId = decodeURI(id);
  const [animeInfo, setAnimeInfo] = useState({});
  const [watchId, setWatchId] = useState(null);
  const [animeExtraInfo, setAnimeExtraInfo] = useState(null);
  const [fetchLoading, setfetchLoading] = useState(null);
  const [fetchLoading2, setfetchLoading2] = useState(null);
  const [seeMore, setSeeMore] = useState(false);
  const [redFlag, setRedFlag] = useState(false);
  const renderStars = () => {
    const fullStars = Math.floor(animeInfo?.anime?.moreInfo.malscore / 2);
    const hasHalfStar = animeInfo?.anime?.moreInfo.malscore % 2 !== 0;

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
    setfetchLoading(true);
    await getAnimeInfo(animeId).then((res) => setAnimeInfo(res));
    setfetchLoading(false);
  };
  const fetchExtraInfo = async () => {
    setfetchLoading2(true);
    await getAnimeExtraInfo(
      animeInfo?.anime?.info?.name,
      animeInfo?.anime?.moreInfo?.japanese
    ).then((res) => setAnimeExtraInfo(res));
    setfetchLoading2(false);
  };
  useEffect(() => {
    fetchInfo();
  }, []);
  useEffect(() => {
    if (animeInfo) {
      const prefix = id.split("-").at(-1);
      const lowercasename = animeInfo?.anime?.info?.name
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
      if (animeInfo?.anime?.info?.name) {
        window.document.title = "Weeblo -" + animeInfo?.anime?.info?.name;
      }
    }
  }, [animeInfo]);
  return !fetchLoading ? (
    <div className="px-1 grid grid-cols-1 mt-16 sm:mt-20 md:grid-cols-3 lg:grid-cols-4 items-start overflow-x-hidden no-scrollbar">
      <div className="col-span-1 md:col-span-2 lg:col-span-3 flex space-y-1 flex-col">
        <div className="relative sm:max-w-[85%]">
          <div className="absolute inset-0 bg-gradient-to-tl from-primary/10 via-gray-900/10 to-gray-950 hover:to-black z-10"></div>
          <img
            alt="Banner"
            className="aspect-[3360/800] z-0 object-cover h-[40vh] lg:h-[45vh] w-full"
            width={3360}
            height={800}
            src={
              animeExtraInfo?.coverImage
                ? animeExtraInfo.coverImage
                : animeInfo?.anime?.info?.poster
            }
          />
          {
            <div className="absolute w-fit right-1 top-1 sm:opacity-80 sm:hover:opacity-100 z-[25]">
              {animeInfo && (
                <SaveAnimeButton
                  animeId={animeId}
                  name={animeInfo?.anime?.info?.name}
                  poster={animeInfo?.anime?.info?.poster}
                />
              )}
            </div>
          }
          <div className="absolute w-full z-20 right-1 md:bottom-2 bottom-4 flex items-center space-x-1 justify-end">
            {!fetchLoading2 && animeExtraInfo?.youtubeVideoId && (
              <Dialog>
                <DialogTrigger>
                  <Button
                    variant="outline"
                    className="border-none bg-white dark:text-black dark:hover:text-white sm:opacity-80 sm:hover:opacity-100">
                    <SquarePlay />
                    Trailer
                  </Button>
                </DialogTrigger>
                <DialogContent className="py-0 flex items-center justify-center bg-black">
                  <ReactPlayer
                    playing={true}
                    url={`https://www.youtube.com/watch?v=${animeExtraInfo?.youtubeVideoId}`}
                    controls={false}
                    className="w-screen aspect-square  md:aspect-video"
                  />
                </DialogContent>
              </Dialog>
            )}
            {animeInfo?.anime?.moreInfo.status != "Not yet aired" && (
              <Link
                href={`/watch/${encodeURIComponent(watchId)}?ep=1`}
                className="w-[35%] md:w-[20%]">
                <Button className="w-full text-white sm:opacity-90 sm:hover:opacity-100">
                  <Play />
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
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex space-x-2">
            <img
              alt="Poster"
              className="aspect-[300/400] rounded-md sm:rounded-lg object-cover border border-gray-200 w-36 dark:border-gray-800"
              height={400}
              src={animeInfo?.anime?.info?.poster}
              width={300}
            />
            <div className="flex flex-col items-center text-sm md:text-lg ">
              <div className="w-full flex items-center ">
                {animeInfo?.anime?.moreInfo?.malscore != "?" ? (
                  <div className="flex items-center">{renderStars()}</div>
                ) : (
                  <div>
                    <StarOff className="w-4 text-yellow-500" />
                  </div>
                )}
                <h2 className="text-xl sm:text-2xl font-semibold">
                  {animeInfo?.anime?.moreInfo?.malscore}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-x-1 sm:gap-x-4 space-y-1">
                <div className="flex items-center gap-2 ">
                  <Video className="w-5 h-5" />
                  <Link
                    href={`/search/${animeInfo?.anime?.info?.stats?.type}?type=category`}>
                    <span className="hover:text-secondary">
                      {animeInfo?.anime?.info?.stats?.type}
                    </span>
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{animeInfo?.anime?.info?.stats?.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileVideo className="w-5 h-5" />
                  <span>{animeInfo?.anime?.info?.stats?.quality}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center ">
                    <Captions className="w-4 sm:w-5" />
                    <span>{animeInfo?.anime?.info?.stats?.episodes.sub}</span>
                  </div>
                  <div className="flex items-center ">
                    <Mic className="w-4 sm:w-5" />
                    <span>
                      {animeInfo?.anime?.info?.stats?.episodes.dub
                        ? animeInfo.anime?.info?.stats?.episodes.dub
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="min-w-5 sm:w-5" />
                  <span>{animeInfo?.anime?.moreInfo.aired}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sprout className="w-8 sm:w-6 " />
                  <span>{animeInfo?.anime?.moreInfo.status}</span>
                </div>
                <div className="col-span-2 flex flex-wrap items-center gap-2">
                  <Film className="w-5 h-5" />
                  {animeInfo?.anime?.moreInfo?.genres?.map((genre, i) => (
                    <Link key={i} href={`/search/${genre}?type=genre`}>
                      <span className="cursor-pointer hover:text-secondary font-semibold">
                        {genre +
                          (i == animeInfo.anime?.moreInfo.genres.length - 1
                            ? ""
                            : ",")}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div
            className={cn(
              "relative z-0 description-box p-1 sm:max-w-[85%] rounded-sm bg-gray-100 dark:bg-inherit flex border max-h-fit overflow-hidden flex-col gap-2 text-sm dark:text-gray-300",
              seeMore && "max-h-[10rem] overflow-y-scroll"
            )}>
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br from-gray-50/0 dark:from-primary/10 via-gray-500/0 dark:via-gray-500/10 to-gray-950/60 dark:to-gray-950 z-10",
                seeMore && "hidden"
              )}></div>
            <p className="">
              {animeInfo?.anime?.info?.description &&
                (seeMore
                  ? animeInfo?.anime?.info?.description
                  : animeInfo?.anime?.info?.description?.slice(0, 300) + "...")}
            </p>
            <p
              id="seeMoreBtn"
              onClick={() => {
                setSeeMore(!seeMore);
              }}
              className={cn(
                "w-fit text-secondary ml-auto mb-4 cursor-pointer font-semibold z-20"
              )}>
              {seeMore ? "See less" : "See more"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-1 md:max-w-[85%] ">
            <div className="rounded-sm flex space-y-2 flex-col items-center border py-2 px-4">
              <p className="font-semibold text-lg leading-none text-secondary">
                Watches
              </p>
              <div className="flex items-center space-x-2">
                <Users />
                <span>
                  {animeExtraInfo?.userCount ? animeExtraInfo.userCount : "?"}
                </span>
              </div>
            </div>
            <div className="rounded-sm flex space-y-2 flex-col items-center border py-2 px-4">
              <p className="font-semibold text-lg leading-none text-secondary">
                Likes
              </p>
              <div className="flex items-center space-x-2">
                <Heart />
                <span>
                  {animeExtraInfo?.favoritesCount
                    ? animeExtraInfo.favoritesCount
                    : "?"}
                </span>
              </div>
            </div>
            <div className="rounded-sm flex space-y-2 flex-col items-center border py-2 px-4">
              <p className="font-semibold text-lg leading-none text-secondary">
                Total Duration
              </p>
              <div className="flex items-center space-x-2">
                <CalendarClock />
                <span>
                  {animeExtraInfo?.totalLength
                    ? Math.abs(animeExtraInfo.totalLength) + " min"
                    : "?"}
                </span>
              </div>
            </div>
            <div className="rounded-sm flex space-y-2 flex-col items-center border py-2 px-4">
              <p className="font-semibold text-lg leading-none text-secondary">
                18+
              </p>
              <div className="flex items-center space-x-2">
                <TriangleAlert />
                <span>
                  {animeExtraInfo?.nsfw ? "Yes" : redFlag ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 space-y-2 md:max-w-[85%]">
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <p className="font-semibold sm:text-lg text-secondary">Rating </p>
              <span className="text-sm">
                {animeInfo?.anime?.info?.stats?.rating}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-1 sm:gap-2">
              <p className="font-semibold sm:text-lg text-secondary">
                Japanese{" "}
              </p>
              <span className="text-sm">
                {animeInfo?.anime?.moreInfo?.japanese}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <p className="font-semibold sm:text-lg text-secondary">
                Premiered{" "}
              </p>
              <span className="text-sm">
                {animeInfo?.anime?.moreInfo?.premiered}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <p className="font-semibold sm:text-lg text-secondary">
                Synonyms{" "}
              </p>
              <span className="text-sm">
                {animeInfo?.anime?.moreInfo?.synonyms}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <p className="font-semibold sm:text-lg text-secondary">
                Studios{" "}
              </p>
              <span className="text-sm">
                {animeInfo?.anime?.moreInfo?.studios}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <p className="font-semibold sm:text-lg text-secondary">
                Popularity Rank{" "}
              </p>
              <span className="text-sm">
                {animeExtraInfo?.popularityRank
                  ? animeExtraInfo?.popularityRank
                  : "?"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <p className="font-semibold sm:text-lg text-secondary">
                Rating Rank{" "}
              </p>
              <span className="text-sm">
                {animeExtraInfo?.ratingRank ? animeExtraInfo?.ratingRank : "?"}
              </span>
            </div>
            <div className="flex flex-col flex-wrap sm:flex-row items-center gap-1 sm:gap-1">
              <p className="font-semibold sm:text-lg text-secondary">
                Producers{" "}
              </p>
              {animeInfo?.anime?.moreInfo?.producers?.map((p, i) => (
                <Link key={i} href={`/search/${p}?type=producer`}>
                  <span className="text-sm hover:text-primary leading-none">
                    {p +
                      (i == animeInfo?.anime?.moreInfo?.producers?.length - 1
                        ? ""
                        : ",")}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="md:max-w-[85%]">
            {animeInfo?.seasons?.length > 0 && (
              <AnimesCarousel
                animes={animeInfo?.seasons?.filter(
                  (season) => season.id != animeId
                )}
                type="Seasons"
              />
            )}
          </div>
          {animeInfo?.anime?.info?.promotionalVideos.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3
                className={cn(
                  "text-secondary ml-2 font-bold text-sm sm:text-lg",
                  bakbak_one.className
                )}>
                PVs
              </h3>

              <div className="md:max-w-[85%] ml-2 flex items-center gap-1 overflow-x-scroll no-scrollbar">
                {animeInfo?.anime?.info.promotionalVideos.map((video, i) => {
                  return (
                    <Dialog key={i}>
                      <DialogTrigger>
                        <div className="relative w-[100px] h-[50px] md:w-[150px] md:h-[75px]">
                          <div className="absolute text-red-400 bottom-1 right-0">
                            <Youtube />
                          </div>
                          <img
                            className="aspect-[200/100] w-full h-full object-cover"
                            src={video.thumbnail}
                            alt={video.title}
                            name="Video"
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="py-0 flex items-center justify-center bg-black">
                        <ReactPlayer
                          name="VideoPlayer"
                          playing={true}
                          url={video.source}
                          controls={false}
                          className="w-screen aspect-square  md:aspect-video"
                        />
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>
            </div>
          )}
          {animeInfo?.anime?.info?.charactersVoiceActors.length > 0 && (
            <div className="md:max-w-[85%] flex flex-col">
              <h3
                className={cn(
                  "text-secondary ml-2 font-bold text-sm sm:text-lg",
                  bakbak_one.className
                )}>
                C&VA
              </h3>
              <div className="w-full flex gap-x-2 items-center no-scrollbar overflow-x-scroll">
                {animeInfo?.anime?.info?.charactersVoiceActors?.map((cva) => {
                  return (
                    <div
                      key={cva.character.id}
                      className="ml-2 bg-transparent flex items-center w-[200px] h-[150px] sm:w-[150px] sm:h-[120px]">
                      <div className="">
                        <div className="flex items-center">
                          <Avatar className="">
                            <AvatarImage
                              src={cva.character.poster}
                              width={"40"}
                              height={"20"}
                              alt={`${cva.character.name}`}
                              className="rounded-full"
                            />
                          </Avatar>
                          <Avatar className="">
                            <AvatarImage
                              src={cva.voiceActor.poster}
                              width={"40"}
                              height={"20"}
                              alt={`${cva.voiceActor.poster}`}
                              className="rounded-full object-cover object-center scale-95 -ml-1"
                            />
                          </Avatar>
                        </div>
                        <h2
                          className="text-xs font-semibold mb-1 truncate"
                          title={cva.character.name}>
                          {cva.character.name}
                        </h2>
                        <p
                          className="text-[0.65rem] text-gray-200 truncate"
                          title={`Voiced by: ${cva.voiceActor.name}`}>
                          Voiced: {cva.voiceActor.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col md:space-y-3 md:-mt-12">
        <div className="sm:mt-5 mt-1 ">
          <AnimeVerticalCarousel
            animes={animeInfo?.relatedAnimes}
            type={"Related"}
            page="info"
          />
        </div>
        <div className="mt-3 md:mt-1 ">
          <Separator className="lg:mt-10 lg:-mb-2" />
          <AnimeVerticalCarousel
            animes={animeInfo?.recommendedAnimes}
            type={"Recommended"}
            page="info"
          />
        </div>
        <Separator />
      </div>
      <ScrollTopButton />
    </div>
  ) : (
    <Loader className="mx-auto relative top-48 h-12 w-12 animate-spin text-primary" />
  );
}
