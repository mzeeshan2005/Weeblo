import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Bakbak_One } from "next/font/google";
import { cn } from "@/lib/utils";
import AnimeHorizontalCard from "./AnimeHorizontalCard";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
// import { Loader } from 'lucide-react'

const bakbak_one = Bakbak_One({
  weight: ["400"],
  style: "normal",
  subsets: ["latin"],
});
const AnimeVerticalCarousel = ({ animes, type, page }) => {
  const special =
    type == "Most Popular Animes" ||
    type == "Most Favorite Animes" ||
    type == "Latest Completed Animes" ||
    type == "Ai Suggestions";
  const promptToUse = type
    .replace("Animes", "")
    .replace("Latest", "")
    .trim()
    .replace(" ", "-")
    .toLowerCase();
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: type != "suggestions" ? 4000 : 5000,
        }),
      ]}
      orientation="vertical"
      className={cn("w-full border-none", page == "info" && "md:mt-20")}>
      {type != "suggestions" && type != "Ai Suggestions" && (
        <p
          className={cn(
            "text-secondary ml-2 font-bold text-lg sm:text-xl lg:text-2xl select-none",
            bakbak_one.className
          )}>
          {type}
        </p>
      )}
      {special && type != "Ai Suggestions" && (
        <div className="w-full text-right pr-2">
          <Link href={`/search/${promptToUse}?type=category`}>
            <span className="font-semibold text-xs hover:text-secondary hover:cursor-pointer">
              see more
            </span>
          </Link>
        </div>
      )}
      <CarouselContent
        className={cn(
          "max-h-[20vh] md:max-h-[70vh] z-0",
          type == "suggestions" && "md:max-h-[55vh] min-w-40"
        )}>
        {animes?.map((anime) => (
          <CarouselItem key={anime.id} className="basis-1 min-h-[9.4rem] z-0">
            <AnimeHorizontalCard anime={anime} type={type} />
          </CarouselItem>
        ))}
      </CarouselContent>

      {type != "suggestions" && !special && <CarouselPrevious />}
      {type != "suggestions" && !special && <CarouselNext />}
    </Carousel>
  );
};

export default AnimeVerticalCarousel;
