"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { AvatarImage, Avatar } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Loader, Share2, StepBack, StepForward } from "lucide-react";
import { getAnimeEpisodes } from "@/app/api/getAnimeEpisodes";
import { getAnimeInfo } from "@/app/api/getAnimeInfo";
import { getEpisodeDetail } from "@/app/api/getEpisodeDetail";
import { getAnimeExtraInfo } from "@/app/api/getAnimeExtraInfo";
import { Bebas_Neue } from "next/font/google";
import {
  getAnimeEpisodeServerLink,
  getAnimeEpisodeServers,
} from "@/app/api/getAnimeEpisodeServers";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
const VideoPlayer = dynamic(() => import("@/components/VideoPlayer"), {
  loading: () => (
    <Loader className="mx-auto  my-[9.4rem] relative bottom-0 w-6 animate-spin text-primary" />
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
const EpisodesList = dynamic(() => import("@/components/EpisodesList"), {
  loading: () => (
    <Loader className="mx-auto my-[47vh] relative bottom-0 w-6 animate-spin text-primary" />
  ),
});
const EpDetail = dynamic(() => import("@/components/EpDetail"), {
  loading: () => (
    <Loader className="mx-auto relative bottom-0 w-6 animate-spin text-primary" />
  ),
});
const DisqusComments = dynamic(() => import("@/components/DisqusComments"), {
  loading: () => (
    <Loader className="mx-auto relative bottom-0 w-6 animate-spin text-primary" />
  ),
});
const ScrollTopButton = React.lazy(() =>
  import("@/components/ScrollTopButton")
);
import { useAppContext } from "@/context/page";
import GenerateRoom from "@/components/GenerateRoom";

const bebas_nueue = Bebas_Neue({
  weight: ["400"],
  style: "normal",
  subsets: ["latin"],
});

const initialUserPreferences = {
  AutoPlay: false,
  AutoNext: true,
  qualityLevel: 720,
  volumeLevel: 0.9,
};

const setUserPreferencesToLocalStorage = (preferences) => {
  localStorage.setItem("userPreferences", JSON.stringify(preferences));
};

export default function WatchPage({ params: { id } }) {
  let { user, setUser } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const animeId = decodeURI(id);

  // Loading states
  const [isClient, setIsClient] = useState(false);
  const [fetchLoading, setfetchLoading] = useState(true);
  const [serverLoading, setServerLoading] = useState(null);
  const [fetchLoading2, setfetchLoading2] = useState(null);

  // Data states
  const [episodesResults, setEpisodesResults] = useState(null);
  const [userPreferences, setUserPreferences] = useState(initialUserPreferences);
  const [episodeServers, setEpisodeServers] = useState(null);
  const [epEnded, setEpEnded] = useState(false);
  const [episodeServerLink, setEpisodeServerLink] = useState(null);
  const [animeInfo, setAnimeInfo] = useState(null);
  const [animeExtraInfo, setAnimeExtraInfo] = useState(null);
  const [epInfo, setEpInfo] = useState(null);
  const [currentEp, setCurrentEp] = useState(null);
  const [currentServerType, setCurrentServerType] = useState("sub");
  const [playedTime, setPlayedTime] = useState(0);
  const [totalTime, setTotalTime] = useState(null);
  const [continueWatchTime, setContinueWatchTime] = useState(null);
  const [shared, setShared] = useState(null);

  // Initialize client-side and preferences
  useEffect(() => {
    setIsClient(true);
    const storedPreferences = localStorage.getItem("userPreferences");
    if (storedPreferences) {
      setUserPreferences(JSON.parse(storedPreferences));
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (isClient) {
      setUserPreferencesToLocalStorage(userPreferences);
    }
  }, [userPreferences, isClient]);

  // Fetch episodes
  const fetchEpisodes = async () => {
    try {
      setfetchLoading(true);
      const res = await getAnimeEpisodes(animeId);
      setEpisodesResults(res);
    } catch (error) {
      console.error("Error fetching episodes:", error);
    } finally {
      setfetchLoading(false);
    }
  };

  // Fetch episode servers
  const fetchEpServers = async () => {
    if (!currentEp) return;
    try {
      const res = await getAnimeEpisodeServers(currentEp.episodeId);
      setEpisodeServers(res);
    } catch (error) {
      console.error("Error fetching episode servers:", error);
    }
  };

  // Fetch episode server link
  const fetchEpServerLink = async () => {
    if (!currentServerType) return;
    try {
      setServerLoading(true);
      const res = await getAnimeEpisodeServerLink(
        currentEp?.episodeId,
        "hd-2",
        currentServerType
      );
      setEpisodeServerLink(res);
    } catch (error) {
      console.error("Error fetching episode server link:", error);
    } finally {
      setServerLoading(false);
    }
  };

  // Fetch anime info
  const fetchInfo = async () => {
    try {
      setfetchLoading2(true);
      const res = await getAnimeInfo(animeId);
      setAnimeInfo(res);
    } catch (error) {
      console.error("Error fetching anime info:", error);
    } finally {
      setfetchLoading2(false);
    }
  };

  // Fetch extra anime info
  const fetchExtraInfo = async () => {
    if (!animeInfo?.anime?.info?.name) return;
    try {
      setfetchLoading2(true);
      const res = await getAnimeExtraInfo(
        animeInfo?.anime?.info?.name,
        animeInfo?.anime?.moreInfo?.japanese
      );
      setAnimeExtraInfo(res);
    } catch (error) {
      console.error("Error fetching extra info:", error);
    } finally {
      setfetchLoading2(false);
    }
  };

  // Fetch episode info
  const fetchEPInfo = async () => {
    try {
      setfetchLoading2(true);
      if (!animeExtraInfo?.episodes || !currentEp) return;

      const res = await fetch(animeExtraInfo?.episodes, {
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
        },
        next: {
          revalidate: 60 * 60 * 24,
        },
      });

      const epsData = await res.json();
      if (epsData.data.length < currentEp?.number) {
        setEpInfo(null);
        return;
      }

      const epId = epsData.data[currentEp?.number - 1].id;
      const epDetailRes = await getEpisodeDetail(epId);
      setEpInfo(epDetailRes);
    } catch (error) {
      console.error("Error fetching episode data:", error);
    } finally {
      setfetchLoading2(false);
    }
  };

  // Continue watching handler
  const continueWatchingHandler = async () => {
    if (!user?.email || !animeInfo?.anime?.info?.name) return;

    const continueWatchingData = {
      animeId,
      name: animeInfo?.anime?.info?.name,
      poster: animeInfo?.anime?.info?.poster,
      continueTime: playedTime,
      totalTime: totalTime,
      episodeNumber: currentEp?.number,
      userEmail: user.email,
    };

    try {
      const response = await fetch("/api/continueAnime", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(continueWatchingData),
      });

      const data = await response.json();
      if (data.status === 200) {
        const updatedAnime = {
          animeId: continueWatchingData.animeId,
          continueTime: continueWatchingData.continueTime,
          totalTime: continueWatchingData.totalTime,
          episodeNumber: continueWatchingData.episodeNumber,
          name: continueWatchingData.name,
          poster: continueWatchingData.poster,
        };

        const index = user.continueWatching.findIndex(
          (anime) => anime.animeId === continueWatchingData.animeId
        );

        const updatedUser = {
          ...user,
          continueWatching: [...user.continueWatching],
        };

        if (index !== -1) {
          updatedUser.continueWatching.splice(index, 1);
          updatedUser.continueWatching.unshift(updatedAnime);
        } else {
          updatedUser.continueWatching.unshift(updatedAnime);
        }
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Continue watching error:", error);
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (key, value) => {
    setUserPreferences((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  // Initial fetch - when animeId is available
  useEffect(() => {
    if (!animeId || !isClient) return;
    fetchEpisodes();
    fetchInfo();
  }, [animeId, isClient]);

  // Set current episode based on query params
  useEffect(() => {
    if (!episodesResults?.episodes) return;
    const epNumber = searchParams?.get("ep");
    const epIndex = epNumber ? Number(epNumber) - 1 : 0;
    const validIndex =
      epIndex >= 0 && epIndex < episodesResults.episodes.length
        ? epIndex
        : episodesResults.episodes.length - 1;
    setCurrentEp(episodesResults.episodes[validIndex]);
  }, [episodesResults, searchParams]);

  // Fetch servers when episode changes
  useEffect(() => {
    if (!currentEp || !isClient) return;
    fetchEpServers();
  }, [currentEp, isClient]);

  // Set server type based on available servers
  useEffect(() => {
    if (!episodeServers || !isClient) return;
    setCurrentServerType((prevState) =>
      episodeServers?.dub?.length > 0 ? prevState : "sub"
    );
  }, [episodeServers, isClient]);

  // Fetch server link when server type or episode changes
  useEffect(() => {
    if (!currentEp || !isClient) return;
    fetchEpServerLink();
  }, [currentServerType, currentEp, isClient]);

  // Fetch extra info and episode info when anime info is available
  useEffect(() => {
    if (!animeInfo?.anime?.info?.name || !isClient) return;
    fetchExtraInfo();
    if (
      animeInfo?.anime?.info?.stats?.type === "TV" ||
      animeInfo?.anime?.info?.stats?.type === "OVA" ||
      animeInfo?.anime?.info?.stats?.type === "Special" ||
      animeInfo?.anime?.info?.stats?.type === "ONA"
    ) {
      fetchEPInfo();
    }
  }, [animeInfo, isClient]);

  // Fetch episode info when extra info or current episode changes
  useEffect(() => {
    if (
      !animeInfo?.anime?.info?.name ||
      !currentEp ||
      !isClient ||
      !animeExtraInfo
    )
      return;

    if (
      animeInfo?.anime?.info?.stats?.type === "TV" ||
      animeInfo?.anime?.info?.stats?.type === "OVA" ||
      animeInfo?.anime?.info?.stats?.type === "Special" ||
      animeInfo?.anime?.info?.stats?.type === "ONA"
    ) {
      fetchEPInfo();
    }
  }, [animeExtraInfo, currentEp, isClient]);

  // Update page title
  useEffect(() => {
    if (!animeInfo?.anime?.info?.name || !isClient) return;
    window.document.title =
      "Weeblo - Watch " + animeInfo?.anime?.info?.name;
  }, [animeInfo, isClient]);

  // Next episode handler
  const nextEp = () => {
    if (currentEp?.number < episodesResults?.episodes.length) {
      router.push(`${pathname}?ep=${currentEp?.number + 1}`);
      setEpEnded(false);
    }
  };

  // Previous episode handler
  const prevEp = () => {
    if (currentEp?.number > 1) {
      router.push(`${pathname}?ep=${currentEp?.number - 1}`);
      setEpEnded(false);
    }
  };

  // Auto next episode when ended
  useEffect(() => {
    if (epEnded && userPreferences?.AutoNext) {
      nextEp();
    }
  }, [epEnded, userPreferences?.AutoNext]);

  // Continue watching update
  useEffect(() => {
    if (
      !user?.email ||
      !playedTime ||
      !totalTime ||
      Math.floor(playedTime % 2) !== 0 ||
      Math.round(playedTime % 2) !== 0
    )
      return;
    continueWatchingHandler();
  }, [playedTime, totalTime, user?.email]);

  // Set continue watch time
  useEffect(() => {
    if (!user?.continueWatching || !currentEp || !isClient) return;
    const anime = user.continueWatching.find(
      (anime) => anime.animeId === animeId
    );
    if (anime?.episodeNumber === currentEp.number) {
      setContinueWatchTime(anime.continueTime);
    } else {
      setContinueWatchTime(null);
    }
  }, [user?.continueWatching, currentEp, serverLoading, isClient, animeId]);

  // Copy URL handler
  const handleCopyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setShared(true);
      setTimeout(() => {
        setShared(false);
      }, 3000);
    });
  };

  // Loading state
  if (!isClient || fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Guard against missing animeId
  if (!animeId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Anime not found</p>
      </div>
    );
  }

  return (
    <div className="lg:pl-1 flex-grow-0 flex flex-col mt-10 sm:mt-16">
      <div className="relative flex flex-col">
        <div className="flex gap-2 flex-col lg:flex-row">
          <div className="flex-grow mb-2 lg:mb-0 max-h-[90vh] bg-black lg:min-w-[75vw] px-2 py-4 sm:p-0 aspect-video lg:aspect-auto flex-1">
            {serverLoading && (
              <Loader className="mx-auto relative top-1/2 h-8 w-8 animate-spin text-primary" />
            )}
            {!serverLoading && episodeServerLink?.sources?.[0]?.url && (
              <VideoPlayer
                Url={episodeServerLink?.sources[0]?.url}
                tracks={episodeServerLink?.tracks}
                type={episodeServerLink?.sources[0]?.type}
                outro={episodeServerLink?.outro}
                intro={episodeServerLink?.intro}
                setEpEnded={setEpEnded}
                userPreferences={userPreferences}
                setUserPreferences={setUserPreferences}
                setPlayedTime={setPlayedTime}
                setTotalTime={setTotalTime}
                continueWatchTime={continueWatchTime}
              />
            )}
          </div>
          <EpisodesList
            animeId={animeId}
            episodes={episodesResults?.episodes}
            currentEp={currentEp}
          />
        </div>

        <div className="grid lg:grid-cols-4">
          <div className="px-4 col-span-1 lg:col-span-3 py-2">
            <div className="w-fit ml-auto mb-2 lg:mb-0 flex space-x-3 text-xs items-center">
              <Button
                variant="none"
                className="flex items-center space-x-1 p-0"
                onClick={prevEp}
                id="prev">
                <StepBack className="w-4" />
                <label
                  htmlFor="prev"
                  className="cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Prev
                </label>
              </Button>
              <Button
                variant="none"
                className="flex items-center space-x-1 p-0"
                onClick={nextEp}
                id="next">
                <label
                  htmlFor="next"
                  className="cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Next
                </label>
                <StepForward className="w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={userPreferences?.AutoPlay || false}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("AutoPlay", checked)
                  }
                  id="autoPlay"
                />
                <label
                  htmlFor="autoPlay"
                  className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Auto Play
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={userPreferences?.AutoNext !== false}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("AutoNext", checked)
                  }
                  id="autoNext"
                />
                <label
                  htmlFor="autoNext"
                  className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Auto Next
                </label>
              </div>
            </div>

            <h1
              className={cn(
                "text-2xl md:text-3xl font-bold",
                bebas_nueue.className
              )}>
              {animeInfo?.anime?.info?.stats?.type !== "TV"
                ? animeInfo?.anime?.info?.name + " - " + currentEp?.title
                : currentEp?.number + " - " + currentEp?.title}
            </h1>

            <div className="flex justify-between items-center space-x-4 my-4">
              <div className="flex items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" onClick={handleCopyUrl}>
                        <Share2
                          className={cn(
                            "hover:text-primary",
                            shared && "text-secondary hover:text-secondary"
                          )}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{shared ? "URL copied!" : "Share"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {user && animeInfo && currentEp && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <GenerateRoom
                          name={animeInfo?.anime?.info?.name}
                          epNo={currentEp?.number}
                          epId={currentEp?.episodeId}
                          category={currentServerType}
                          poster={animeInfo?.anime?.info?.poster}
                          host={user?._id}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cinema Room</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <ToggleGroup
                  type="single"
                  value={currentServerType}
                  onValueChange={(e) => {
                    if (e) setCurrentServerType(e);
                  }}>
                  {episodeServers?.raw?.length > 0 && (
                    <ToggleGroupItem
                      value="raw"
                      aria-label="Raw"
                      className="text-xs focus:bg-primary/50 data-[state=on]:bg-primary/50 rounded-sm">
                      Raw
                    </ToggleGroupItem>
                  )}
                  <ToggleGroupItem
                    value="sub"
                    aria-label="Original"
                    className="text-xs focus:bg-primary/50 data-[state=on]:bg-primary/50 rounded-sm">
                    Original
                  </ToggleGroupItem>
                  {episodeServers?.dub?.length > 0 && (
                    <ToggleGroupItem
                      value="dub"
                      aria-label="Dubbed"
                      className="text-xs focus:bg-primary/50 data-[state=on]:bg-primary/50 rounded-sm">
                      Dubbed
                    </ToggleGroupItem>
                  )}
                </ToggleGroup>
              </div>
            </div>

            <div className="my-4">
              <Link
                className="flex items-center space-x-2 my-2"
                href={`/animeInfo/${encodeURIComponent(id)}`}>
                <Avatar>
                  <AvatarImage
                    alt={animeInfo?.anime?.info?.name?.[0]}
                    src={animeInfo?.anime?.info?.poster}
                  />
                </Avatar>
                <span className="text-sm font-semibold">
                  {animeInfo?.anime?.info?.name}
                </span>
              </Link>
            </div>

            <div className="mt-4 space-y-2">
              {fetchLoading2 ? (
                <Loader className="mx-auto my-auto h-6 w-6 animate-spin text-secondary" />
              ) : (
                <EpDetail
                  epInfo={epInfo}
                  animeInfo={animeInfo}
                  animeExtraInfo={animeExtraInfo}
                  title={
                    animeInfo?.anime?.info?.stats?.type !== "TV"
                      ? animeInfo?.anime?.info?.name
                      : currentEp?.title
                  }
                />
              )}
            </div>

            <Separator className="my-2" />

            <div className="rounded-lg mt-5 overflow-hidden z-0">
              {currentEp && (
                <DisqusComments
                  episode={{
                    title: currentEp?.title,
                    animeId: animeId,
                    epNumber: currentEp?.number,
                  }}
                />
              )}
            </div>
          </div>

          <Separator className="my-2 lg:hidden" />

          <div className="w-full lg:w-80 p-4">
            <AnimeVerticalCarousel
              animes={animeInfo?.relatedAnimes}
              type={"Related"}
              page="info"
            />
          </div>
        </div>
      </div>
      <ScrollTopButton />
    </div>
  );
}