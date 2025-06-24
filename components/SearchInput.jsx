"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./ui/button";
import {
  getSearchResults,
  getSearchSuggestions,
} from "@/app/api/getSearchResults";
import AnimeVerticalCarousel from "./AnimeVerticalCarousel";
import { cn } from "@/lib/utils";

const SearchInput = () => {
  const [fetchLoading, setfetchLoading] = useState(null);
  const [isAiSearch, setIsAiSearch] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState({});
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();
  let timeout;
  function onSubmit(values) {
    if (isAiSearch) {
      handleAiSearch(values.searchPrompt);
      return;
    }
    router.push(`/search/${values.searchPrompt}?type=search`);
  }
  const handleFetch = async (value) => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      setfetchLoading(true);
      await getSearchSuggestions(value).then((res) =>
        setSearchSuggestions(res)
      );
      setfetchLoading(false);
    }, 500);
  };
  const handleAiSearch = async (prompt) => {
    try {
      setfetchLoading(true);

      const resp = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({
          prompt,
          type: "string",
        }),
        cache: "no-cache",
      });

      const data = await resp.json();
      const suggestions = JSON.parse(data.body.message)?.anime_recommendations;

      const results = await Promise.all(
        suggestions?.map(async (sug) => {
          try {
            const res = await getSearchResults(sug);
            if (!res || !res.animes || res.animes.length === 0) return null;

            const matched = res.animes.find((anime) => anime.name === sug);
            return matched || null;
          } catch (err) {
            console.error(`Failed to fetch for ${sug}`, err);
            return null;
          }
        })
      );

      const filteredResults = results.filter(Boolean);
      setSearchSuggestions({ suggestions: filteredResults });
    } catch (error) {
      console.error("Something went wrong during AI search", error);
    } finally {
      setfetchLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="text-white outline-none"
            size="icon">
            <Search />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-2 mr-4 relative sm:right-3 sm:pl-3 w-screen sm:w-96">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center justify-around gap-1 sm:gap-2 focus:w-full sm:focus:shadow-md dark:sm:focus:shadow-blue-500">
            <Input
              autoComplete="off"
              onChangeCapture={(e) =>
                !isAiSearch && handleFetch(e.currentTarget.value)
              }
              {...register("searchPrompt", { required: true })}
              className="ml-2 sm:ml-1 font-semibold bg-opacity-50 dark:bg-blue-950/50 border-none bg-slate-50 transition-all ease-linear focus:translate-x-[-6px] sm:focus:translate-x-[-10px] placeholder:text-slate-950  dark:placeholder:text-slate-400"
              placeholder={isAiSearch ? "eg. Best shounen animes" : "Search"}
            />
            <Button
              type="submit"
              name="searchPrompt"
              disabled={fetchLoading}
              className={cn(
                "sm:hidden px-3 py-1 w-14 text-white bg-primary rounded-sm",
                isAiSearch && "bg-secondary/90"
              )}>
              <p className="font-semibold">Search</p>
            </Button>
          </form>
          <Button
            onClick={() => {
              setIsAiSearch((prev) => !prev);
              setSearchSuggestions({});
              reset();
            }}
            name="aisearchPrompt"
            className={cn(
              "py-0 text-white bg-secondary/50 hover:bg-secondary/90 mx-auto my-1 rounded-3xl flex items-center space-x-1",
              isAiSearch && "bg-secondary/90"
            )}>
            <p className="font-semibold ">Ask Ai</p>
            <Sparkles className="w-4 sm:w-6" />
          </Button>
          {!fetchLoading ? (
            <AnimeVerticalCarousel
              animes={searchSuggestions?.suggestions}
              type={isAiSearch ? "Ai Suggestions" : "suggestions"}
            />
          ) : (
            <Skeleton className="w-screen sm:w-full cursor-pointer border-none z-0 flex items-start p-2 space-x-2">
              <Skeleton className="aspect-[200/100] bg-primary/10 rounded-sm min-h-[90px] max-h-[90px] max-w-[80px] sm:max-h-[100px] sm:min-h-[100px] sm:min-w-[70px] sm:max-w-[70px]" />
              <div className="flex flex-col space-y-2 w-full">
                <div className="grid grid-cols-4 gap-2 w-full h-6">
                  <Skeleton className="bg-primary/70 text-white rounded-sm" />
                  <Skeleton className="col-span-2 bg-white bg-opacity-70 text-black rounded-sm" />
                  <Skeleton className="bg-gray-200 bg-opacity-20 rounded-sm" />
                </div>
                <Skeleton className="h-4 w-full bg-gray-400 rounded-sm" />
                <Skeleton className="ml-auto h-4 w-1/4 bg-gray-500 rounded-sm" />
              </div>
            </Skeleton>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SearchInput;
