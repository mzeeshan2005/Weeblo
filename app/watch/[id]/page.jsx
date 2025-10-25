"use client";
import React, { useEffect, useState, useCallback } from "react";
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
import { useAppContext } from "@/context/page";
import GenerateRoom from "@/components/GenerateRoom";

const VideoPlayer = dynamic(() => import("@/components/VideoPlayer"), {
  loading: () => (
    <Loader className="mx-auto my-[9.4rem] relative bottom-0 w-6 animate-spin text-primary" />
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
  const [serverLoading, setServerLoading] = useState(false);
  const [fetchLoading2, setfetchLoading2] = useState(false);

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

  // Set page metadata dynamically
  useEffect(() => {
    if (animeInfo?.anime?.info?.name && currentEp) {
      const title = `Watch ${animeInfo.anime.info.name} Episode ${currentEp.number} - ${currentEp.title} | Weeblo`;
      document.title = title;

      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          `Watch ${animeInfo.anime.info.name} Episode ${currentEp.number} "${currentEp.title}" online in HD quality. Stream with English subtitles and dubs. Previous and next episodes available.`
        );
      }

      // Update OG tags
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', title);

      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (!ogDescription) {
        ogDescription = document.createElement('meta');
        ogDescription.setAttribute('property', 'og:description');
        document.head.appendChild(ogDescription);
      }
      ogDescription.setAttribute(
        'content',
        `Stream ${animeInfo.anime.info.name} Episode ${currentEp.number} online free in HD quality`
      );

      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute('content', animeInfo.anime.info.poster);
    }
  }, [animeInfo, currentEp]);

  // Initialize client-side and preferences
  useEffect(() => {
    setIsClient(true);
    const storedPreferences = localStorage.getItem("userPreferences");
    if (storedPreferences) {
      setUserPreferences(JSON.parse(storedPreferences));
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    if (isClient) {
      setUserPreferencesToLocalStorage(userPreferences);
    }
  }, [userPreferences, isClient]);

  // Initial data fetch
  useEffect(() => {
    if (!animeId || !isClient) return;

    const fetchInitialData = async () => {
      try {
        setfetchLoading(true);
        const [episodes, info] = await Promise.all([
          getAnimeEpisodes(animeId),
          getAnimeInfo(animeId),
        ]);
        setEpisodesResults(episodes);
        setAnimeInfo(info);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setfetchLoading(false);
      }
    };

    fetchInitialData();
  }, [animeId, isClient]);

  // Set current episode from URL params
  useEffect(() => {
    if (!episodesResults?.episodes) return;

    const epNumber = searchParams?.get("ep");
    const epIndex = epNumber ? Number(epNumber) - 1 : 0;
    const validIndex =
      epIndex >= 0 && epIndex < episodesResults.episodes.length
        ? epIndex
        : episodesResults.episodes.length - 1;

    const episode = episodesResults.episodes[validIndex];
    setCurrentEp(episode);
    setEpisodeServerLink(null);
  }, [episodesResults?.episodes, searchParams]);

  // Fetch servers and info for current episode
  useEffect(() => {
    if (!currentEp?.episodeId || !isClient) return;

    const fetchEpisodeData = async () => {
      try {
        const servers = await getAnimeEpisodeServers(currentEp.episodeId);
        setEpisodeServers(servers);
      } catch (error) {
        console.error("Error fetching servers:", error);
      }
    };

    fetchEpisodeData();
  }, [currentEp?.episodeId, isClient]);

  // Determine server type
  useEffect(() => {
    if (!episodeServers) return;
    setCurrentServerType((prev) =>
      episodeServers?.dub?.length > 0 ? prev : "sub"
    );
  }, [episodeServers]);

  // Fetch episode link with retry
  useEffect(() => {
    if (!currentEp?.episodeId || !currentServerType || !isClient) return;

    let isCancelled = false;

    const fetchLink = async (retry = 0) => {
      try {
        setServerLoading(true);
        setEpisodeServerLink(null);

        const link = await getAnimeEpisodeServerLink(
          currentEp.episodeId,
          "hd-2",
          currentServerType
        );

        if (!isCancelled) {
          if (link?.sources?.length) {
            setEpisodeServerLink(link);
          } else if (retry < 2) {
            setTimeout(() => fetchLink(retry + 1), 500);
          }
        }
      } catch (error) {
        console.error("Error fetching episode link:", error);
        if (!isCancelled && retry < 2) {
          setTimeout(() => fetchLink(retry + 1), 500);
        }
      } finally {
        if (!isCancelled) setServerLoading(false);
      }
    };

    fetchLink();

    return () => {
      isCancelled = true;
    };
  }, [currentEp?.episodeId, currentServerType, isClient]);

  // Fetch extra anime info
  useEffect(() => {
    if (!animeInfo?.anime?.info?.name || !isClient) return;

    const fetchExtra = async () => {
      try {
        setfetchLoading2(true);
        const extra = await getAnimeExtraInfo(
          animeInfo.anime.info.name,
          animeInfo.anime.moreInfo?.japanese
        );
        setAnimeExtraInfo(extra);
      } catch (error) {
        console.error("Error fetching extra info:", error);
      } finally {
        setfetchLoading2(false);
      }
    };

    fetchExtra();
  }, [
    animeInfo?.anime?.info?.name,
    animeInfo?.anime?.moreInfo?.japanese,
    isClient,
  ]);

  // Fetch episode details
  useEffect(() => {
    if (
      !animeExtraInfo?.episodes ||
      !currentEp?.number ||
      !isClient ||
      !animeInfo?.anime?.info?.stats?.type
    )
      return;

    const animeType = animeInfo.anime.info.stats.type;
    const isSeriesType =
      animeType === "TV" ||
      animeType === "OVA" ||
      animeType === "Special" ||
      animeType === "ONA";

    if (!isSeriesType) return;

    const fetchDetails = async () => {
      try {
        setfetchLoading2(true);
        const res = await fetch(animeExtraInfo.episodes, {
          headers: {
            Accept: "application/vnd.api+json",
            "Content-Type": "application/vnd.api+json",
          },
        });

        const epsData = await res.json();
        if (epsData.data.length < currentEp.number) {
          setEpInfo(null);
          return;
        }

        const epId = epsData.data[currentEp.number - 1].id;
        const details = await getEpisodeDetail(epId);
        setEpInfo(details);
      } catch (error) {
        console.error("Error fetching episode details:", error);
      } finally {
        setfetchLoading2(false);
      }
    };

    fetchDetails();
  }, [
    animeExtraInfo?.episodes,
    currentEp?.number,
    isClient,
    animeInfo?.anime?.info?.stats?.type,
  ]);

  // Handle checkbox changes
  const handleCheckboxChange = useCallback((key, value) => {
    setUserPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Navigation handlers
  const nextEp = useCallback(() => {
    if (!currentEp || !episodesResults?.episodes) return;
    if (currentEp.number < episodesResults.episodes.length) {
      router.push(`${pathname}?ep=${currentEp.number + 1}`);
      setEpEnded(false);
    }
  }, [currentEp, episodesResults?.episodes, router, pathname]);

  const prevEp = useCallback(() => {
    if (!currentEp) return;
    if (currentEp.number > 1) {
      router.push(`${pathname}?ep=${currentEp.number - 1}`);
      setEpEnded(false);
    }
  }, [currentEp, router, pathname]);

  // Auto next episode
  useEffect(() => {
    if (epEnded && userPreferences?.AutoNext) {
      nextEp();
    }
  }, [epEnded, userPreferences?.AutoNext, nextEp]);

  // Continue watching
  useEffect(() => {
    if (
      !user?.email ||
      !playedTime ||
      !totalTime ||
      Math.floor(playedTime % 2) !== 0
    )
      return;

    const saveContinueWatching = async () => {
      try {
        const data = {
          animeId,
          name: animeInfo?.anime?.info?.name,
          poster: animeInfo?.anime?.info?.poster,
          continueTime: playedTime,
          totalTime,
          episodeNumber: currentEp?.number,
          userEmail: user.email,
        };

        const response = await fetch("/api/continueAnime", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        if (result.status === 200) {
          const updatedAnime = { ...data };
          const index = user.continueWatching.findIndex(
            (a) => a.animeId === data.animeId
          );

          const updatedUser = {
            ...user,
            continueWatching: [...user.continueWatching],
          };
          if (index !== -1) {
            updatedUser.continueWatching.splice(index, 1);
          }
          updatedUser.continueWatching.unshift(updatedAnime);
          setUser(updatedUser);
        }
      } catch (error) {
        console.error("Continue watching error:", error);
      }
    };

    saveContinueWatching();
  }, [
    playedTime,
    totalTime,
    user?.email,
    currentEp?.number,
    animeId,
    animeInfo?.anime?.info?.name,
    animeInfo?.anime?.info?.poster,
    user,
    setUser,
  ]);

  // Set continue watch time
  useEffect(() => {
    if (!user?.continueWatching || !currentEp || !isClient) return;
    const anime = user.continueWatching.find((a) => a.animeId === animeId);
    if (anime?.episodeNumber === currentEp.number) {
      setContinueWatchTime(anime.continueTime);
    } else {
      setContinueWatchTime(null);
    }
  }, [user?.continueWatching, currentEp, isClient, animeId]);

  // Copy URL
  const handleCopyUrl = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShared(true);
      setTimeout(() => setShared(false), 3000);
    });
  }, []);

  // Structured data for video
  const videoStructuredData = animeInfo && currentEp ? {
    "@context": "https://schema.org",
    "@type": "TVEpisode",
    name: `${animeInfo.anime.info.name} - Episode ${currentEp.number}: ${currentEp.title}`,
    episodeNumber: currentEp.number,
    description: epInfo?.description || `Watch ${animeInfo.anime.info.name} Episode ${currentEp.number}`,
    image: animeInfo.anime.info.poster,
    partOfSeries: {
      "@type": "TVSeries",
      name: animeInfo.anime.info.name,
    },
    potentialAction: {
      "@type": "WatchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: typeof window !== 'undefined' ? window.location.href : '',
      },
    },
  } : null;

  // Loading state
  if (!isClient || fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!animeId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Anime not found</p>
      </div>
    );
  }

  return (
    <>
      <main 
        className="lg:pl-1 flex-grow-0 flex flex-col mt-10 sm:mt-16"
        itemScope
        itemType="https://schema.org/VideoObject"
      >
        <article className="relative flex flex-col">
          {/* Video Player Section */}
          <section 
            className="flex gap-2 flex-col lg:flex-row"
            aria-label="Video player and episodes"
          >
            <div 
              className="flex-grow mb-2 lg:mb-0 max-h-[90vh] bg-black lg:min-w-[75vw] px-2 py-4 sm:p-0 aspect-video lg:aspect-auto flex-1"
              itemProp="video"
              itemScope
              itemType="https://schema.org/VideoObject"
            >
              {serverLoading && (
                <Loader className="mx-auto relative top-1/2 h-8 w-8 animate-spin text-primary" />
              )}
              {!serverLoading && episodeServerLink?.sources?.[0]?.url && (
                <VideoPlayer
                  Url={episodeServerLink.sources[0].url}
                  tracks={episodeServerLink.tracks}
                  type={episodeServerLink.sources[0].type}
                  outro={episodeServerLink.outro}
                  intro={episodeServerLink.intro}
                  setEpEnded={setEpEnded}
                  userPreferences={userPreferences}
                  setUserPreferences={setUserPreferences}
                  setPlayedTime={setPlayedTime}
                  setTotalTime={setTotalTime}
                  continueWatchTime={continueWatchTime}
                />
              )}
            </div>

            <aside aria-label="Episodes list">
              <EpisodesList
                animeId={animeId}
                episodes={episodesResults?.episodes}
                currentEp={currentEp}
              />
            </aside>
          </section>

          <div className="grid lg:grid-cols-4">
            <div className="px-4 col-span-1 lg:col-span-3 py-2">
              {/* Episode Controls */}
              <nav 
                className="w-fit ml-auto mb-2 lg:mb-0 flex space-x-3 text-xs items-center"
                aria-label="Episode navigation"
              >
                <Button
                  variant="none"
                  className="flex items-center space-x-1 p-0"
                  onClick={prevEp}
                  aria-label="Previous episode"
                  disabled={currentEp?.number === 1}
                >
                  <StepBack className="w-4" />
                  <span>Prev</span>
                </Button>
                <Button
                  variant="none"
                  className="flex items-center space-x-1 p-0"
                  onClick={nextEp}
                  aria-label="Next episode"
                  disabled={currentEp?.number === episodesResults?.episodes.length}
                >
                  <span>Next</span>
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
                  <label htmlFor="autoPlay" className="font-medium leading-none">
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
                  <label htmlFor="autoNext" className="font-medium leading-none">
                    Auto Next
                  </label>
                </div>
              </nav>

              {/* Episode Title */}
              <h1
                className={cn(
                  "text-2xl md:text-3xl font-bold",
                  bebas_nueue.className
                )}
                itemProp="name"
              >
                {animeInfo?.anime?.info?.stats?.type !== "TV"
                  ? `${animeInfo?.anime?.info?.name} - ${currentEp?.title}`
                  : `Episode ${currentEp?.number} - ${currentEp?.title}`}
              </h1>

              {/* Share and Server Options */}
              <div className="flex justify-between items-center space-x-4 my-4">
                <div className="flex items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" onClick={handleCopyUrl} aria-label="Share episode">
                          <Share2
                            className={cn(
                              "hover:text-primary",
                              shared && "text-secondary"
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
                            name={animeInfo.anime.info.name}
                            epNo={currentEp.number}
                            epId={currentEp.episodeId}
                            category={currentServerType}
                            poster={animeInfo.anime.info.poster}
                            host={user._id}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Cinema Room</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>

                {/* Server Type Toggle */}
                <div className="flex items-center space-x-2" role="group" aria-label="Audio language selection">
                  <ToggleGroup
                    type="single"
                    value={currentServerType}
                    onValueChange={(e) => e && setCurrentServerType(e)}
                  >
                    {episodeServers?.raw?.length > 0 && (
                      <ToggleGroupItem value="raw" className="text-xs rounded-sm">
                        Raw
                      </ToggleGroupItem>
                    )}
                    <ToggleGroupItem value="sub" className="text-xs rounded-sm">
                      Original
                    </ToggleGroupItem>
                    {episodeServers?.dub?.length > 0 && (
                      <ToggleGroupItem value="dub" className="text-xs rounded-sm">
                        Dubbed
                      </ToggleGroupItem>
                    )}
                  </ToggleGroup>
                </div>
              </div>

              {/* Anime Link */}
              <div className="my-4">
                <Link
                  className="flex items-center space-x-2 my-2 hover:underline"
                  href={`/animeInfo/${encodeURIComponent(id)}`}
                  itemProp="partOfSeries"
                >
                  <Avatar>
                    <AvatarImage
                      alt={`${animeInfo?.anime?.info?.name} poster`}
                      src={animeInfo?.anime?.info?.poster}
                    />
                  </Avatar>
                  <span className="text-sm font-semibold">
                    {animeInfo?.anime?.info?.name}
                  </span>
                </Link>
              </div>

              {/* Episode Details */}
              <section aria-labelledby="episode-details" itemProp="description">
                <h2 id="episode-details" className="sr-only">Episode Details</h2>
                <div className="mt-4 space-y-2">
                  {fetchLoading2 ? (
                    <Loader className="mx-auto h-6 w-6 animate-spin text-secondary" />
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
              </section>

              <Separator className="my-2" />

              {/* Comments Section */}
              <section aria-labelledby="comments-section">
                <h2 id="comments-section" className="sr-only">Episode Comments</h2>
                <div className="rounded-lg mt-5 overflow-hidden z-0">
                  {currentEp && (
                    <DisqusComments
                      episode={{
                        title: currentEp.title,
                        animeId: animeId,
                        epNumber: currentEp.number,
                      }}
                    />
                  )}
                </div>
              </section>
            </div>

            <Separator className="my-2 lg:hidden" />

            {/* Related Anime Sidebar */}
            <aside className="w-full lg:w-80 p-4" aria-label="Related anime">
              <AnimeVerticalCarousel
                animes={animeInfo?.relatedAnimes}
                type={"Related"}
                page="info"
              />
            </aside>
          </div>
        </article>

        <ScrollTopButton />
      </main>

      {/* Structured Data */}
      {videoStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(videoStructuredData),
          }}
        />
      )}
    </>
  );
}