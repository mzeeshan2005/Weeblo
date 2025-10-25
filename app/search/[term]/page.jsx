"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  getAnimeAZ,
  getCategoryResults,
  getGenreResults,
  getProducerResults,
  getSearchResults,
  getSearchSuggestions,
} from "@/app/api/getSearchResults";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronDown, FilterX, Loader } from "lucide-react";
import { Bakbak_One } from "next/font/google";

const AnimeGrid = dynamic(() => import("@/components/AnimeGrid"), {
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
const Pagination = dynamic(() => import("@/components/SearchPagination"), {
  loading: () => (
    <Loader className="mx-auto relative bottom-0 w-6 animate-spin text-primary" />
  ),
});

const bakbak_one = Bakbak_One({
  weight: ["400"],
  style: "normal",
  subsets: ["latin"],
});

const SearchPage = ({ params: { term }, searchParams: { type } }) => {
  const [fetchLoading, setfetchLoading] = useState(null);
  const [fetchLoading2, setfetchLoading2] = useState(null);
  const [searchResults, setSearchResults] = useState({});
  const [filterdResults, setFilterdResults] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [durationFilter, setDurationFilter] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  if (!term) notFound();
  const termToUse = decodeURI(term);

  useEffect(() => {
    const typeLabel =
      {
        genre: "Genre",
        search: "Search",
        producer: "Producer",
        category: "Category",
        az: "A-Z",
      }[type] || "Search";

    const title = `${termToUse} ${typeLabel} Anime Results | Watch ${termToUse} Online - Weeblo`;
    const description = `Explore ${termToUse} anime ${typeLabel.toLowerCase()} results. Stream HD episodes with English subs & dubs. Filter by type, duration, or popularity — all on Weeblo.`;
    const keywords = `${termToUse} anime, watch ${termToUse}, anime ${typeLabel.toLowerCase()}, ${termToUse} streaming, anime ${typeLabel} list`;

    document.title = title;

    const metaDescription =
      document.querySelector('meta[name="description"]') ||
      Object.assign(document.createElement("meta"), { name: "description" });
    metaDescription.content = description;
    document.head.appendChild(metaDescription);

    const metaKeywords =
      document.querySelector('meta[name="keywords"]') ||
      Object.assign(document.createElement("meta"), { name: "keywords" });
    metaKeywords.content = keywords;
    document.head.appendChild(metaKeywords);

    const canonical =
      document.querySelector('link[rel="canonical"]') ||
      Object.assign(document.createElement("link"), { rel: "canonical" });
    canonical.href = `https://weeblo.vercel.app/search/${termToUse}?type=${type}`;
    document.head.appendChild(canonical);
  }, [termToUse, type]);

  //  Fetch anime data
  const fetchSearchResults = async () => {
    setfetchLoading(true);
    try {
      let results;
      if (type === "genre")
        results = await getGenreResults(termToUse.toLowerCase(), currentPage);
      else if (type === "search")
        results = await getSearchResults(termToUse.toLowerCase(), currentPage);
      else if (type === "producer")
        results = await getProducerResults(
          termToUse.replace(" ", "-").toLowerCase(),
          currentPage
        );
      else if (type === "az") results = await getAnimeAZ(termToUse, currentPage);
      else
        results = await getCategoryResults(termToUse.toLowerCase(), currentPage);
      setSearchResults(results);
    } catch (e) {
      console.error("Error fetching results", e);
    } finally {
      setfetchLoading(false);
    }
  };

  const fetchSearchSuggestions = async () => {
    setfetchLoading2(true);
    try {
      const suggestions = await getSearchSuggestions(termToUse.toLowerCase());
      setSearchSuggestions(suggestions);
    } catch (e) {
      console.error("Error fetching suggestions", e);
    } finally {
      setfetchLoading2(false);
    }
  };

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchSearchResults();
  };

  useEffect(() => {
    fetchSearchResults();
    fetchSearchSuggestions();
  }, []);

  //  Filter logic
  useEffect(() => {
    if (!typeFilter && !durationFilter) return;
    let filtered = searchResults.animes;

    if (typeFilter) filtered = filtered.filter((a) => a.type === typeFilter);

    if (durationFilter) {
      const [min, max] =
        durationFilter !== "40+"
          ? durationFilter.split("-").map(Number)
          : [40, 200];
      filtered = filtered.filter((a) => {
        const duration = Number(a.duration.split("m")[0]);
        return duration >= min && duration <= max;
      });
    }
    setFilterdResults(filtered);
  }, [typeFilter, durationFilter]);

  //  JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${termToUse} Anime Results`,
    itemListElement:
      searchResults.animes?.map((anime, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "TVSeries",
          name: anime.name,
          url: `https://weeblo.vercel.app/anime/${anime.id}`,
          image: anime.poster,
        },
      })) || [],
  };

  return (
    <>
      <main
        className="px-2 min-h-screen grid grid-cols-1 md:space-x-2 mt-16 lg:grid-cols-4 items-start"
        itemScope
        itemType="https://schema.org/SearchResultsPage"
      >
        {/* ---------- MAIN RESULTS ---------- */}
        <div className="col-span-1 lg:col-span-3 py-2">
          <header className="flex items-center space-x-4 mb-3">
            <h1
              className={cn(
                "text-secondary ml-2 font-bold text-lg sm:text-xl lg:text-2xl",
                bakbak_one.className
              )}
              itemProp="name"
            >
              Results for
            </h1>
            <span className="text-lg font-semibold" itemProp="query">
              “{termToUse}”
            </span>
          </header>

          {/* Filters */}
          <section
            className="w-fit flex px-2 ml-auto mb-1"
            role="group"
            aria-label="Search filters"
          >
            {/* Type Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex items-center text-xs sm:text-sm mr-5 text-secondary dark:text-white font-semibold">
                  {typeFilter || "Type"} <ChevronDown />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="backdrop-blur-xl w-fit p-0 mr-5">
                {["TV", "Movie", "Special", "OVA", "ONA"].map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className="cursor-pointer text-white"
                  >
                    <Button variant="ghost" className="w-full text-xs sm:text-sm">
                      {type}
                    </Button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Duration Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex items-center text-xs sm:text-sm mr-5 text-secondary dark:text-white font-semibold">
                  {durationFilter ? `${durationFilter} min` : "Duration"}{" "}
                  <ChevronDown />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="backdrop-blur-xl w-fit p-0 mr-5">
                {["0-10", "10-20", "20-30", "30-40", "40+"].map((dur) => (
                  <DropdownMenuItem
                    key={dur}
                    onClick={() => setDurationFilter(dur)}
                    className="cursor-pointer text-white"
                  >
                    <Button variant="ghost" className="w-full text-xs sm:text-sm">
                      {dur} min
                    </Button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              onClick={() => {
                setFilterdResults(null);
                setDurationFilter(null);
                setTypeFilter(null);
              }}
              className={cn(
                "w-fit border-none bg-inherit",
                filterdResults && "bg-primary/90 hover:bg-primary"
              )}
            >
              <FilterX className="w-5" />
            </Button>
          </section>

          {/* Results Grid */}
          <section
            className="min-h-[80%] sm:max-h-[110vh] mb-1 border lg:border-r p-1 overflow-y-scroll no-scrollbar"
            itemProp="mainEntity"
          >
            <AnimeGrid
              animes={filterdResults || searchResults?.animes}
              type=""
            />
          </section>

          {/* Pagination */}
          {searchResults && !filterdResults && (
            <Pagination
              currentPage={currentPage}
              totalPages={searchResults.totalPages}
              hasNextPage={searchResults.hasNextPage}
              fetchLoading={fetchLoading}
              handlePagination={handlePagination}
            />
          )}
        </div>

        {/* ---------- SIDEBAR ---------- */}
        <aside className="mt-10 sm:mt-20 lg:mt-10">
          <section >
            {!fetchLoading && (type === "genre" || type === "producer") && (
              <AnimeVerticalCarousel
                animes={searchResults?.topAiringAnimes}
                type="Top Airing"
              />
            )}
            {!fetchLoading && type === "search" && (
              <AnimeVerticalCarousel
                animes={searchResults?.mostPopularAnimes}
                type="Popular"
              />
            )}
          </section>

          <Separator />

          <section >
            {!fetchLoading2 && type === "search" && (
              <AnimeVerticalCarousel
                animes={searchSuggestions?.suggestions}
                type="Suggestions"
              />
            )}
            {!fetchLoading && (type === "producer" || type === "category") && (
              <AnimeVerticalCarousel
                animes={searchResults?.top10Animes?.week}
                type="Top 10"
              />
            )}
          </section>
        </aside>
      </main>

      {searchResults?.animes?.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
    </>
  );
};

export default SearchPage;
