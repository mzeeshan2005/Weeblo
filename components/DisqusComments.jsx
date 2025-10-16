"use client";
import React, { useState, useMemo } from "react";
import { DiscussionEmbed } from "disqus-react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Bakbak_One } from "next/font/google";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";

const bakbak_one = Bakbak_One({
  weight: ["400"],
  style: "normal",
  subsets: ["latin"],
});

const DisqusComments = ({ episode }) => {
  const [openEps, setOpenEps] = useState(false);
  const { theme, systemTheme } = useTheme();
  const disqusShortname = "weeblo";

  // Get effective theme
  const effectiveTheme = useMemo(() => {
    return theme === "system" ? systemTheme : theme;
  }, [theme, systemTheme]);

  // Create config
  const config = useMemo(
    () => ({
      url: typeof window !== "undefined" ? window.location.href : "",
      identifier: `${episode.animeId}?ep=${episode.epNumber}`,
      title: episode.title,
    }),
    [episode.animeId, episode.epNumber, episode.title]
  );

  // Create unique key that changes when theme or identifier changes
  const disqusKey = useMemo(
    () => `disqus-${effectiveTheme}-${config.identifier}`,
    [effectiveTheme, config.identifier]
  );

  return (
    <>
      <div className=" w-full top-0 flex mb-2 justify-between items-center z-10">
        <h2
          className={cn(
            "text-xl font-semibold mb-2 text-secondary",
            bakbak_one.className
          )}>
          Comments
        </h2>
        <Button
          onClick={() => {
            setOpenEps(!openEps);
          }}
          variant="outline"
          className="text-gray-500 z-30 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 focus:outline-none">
          {!openEps && <ChevronUp className="h-5 w-5" />}
          {openEps && <ChevronDown className="h-5 w-5" />}
        </Button>
      </div>
      <div className=" z-0 ">
        <div
          className={cn(
            "bg-inherit max-h-[150vh] overflow-scroll no-scrollbar opacity-0 h-5 space-y-2 relative transition-opacity duration-200 ease-in",
            !openEps &&
              "opacity-100 h-fit transition-opacity duration-200 ease-out"
          )}>
          <DiscussionEmbed
            className="p-0 text-secondary"
            shortname={disqusShortname}
            config={config}
            key={disqusKey}
          />
        </div>
      </div>
    </>
  );
};

export default DisqusComments;