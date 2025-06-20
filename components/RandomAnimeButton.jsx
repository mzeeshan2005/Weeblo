import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { random } from "lodash";

const RandomAnimeButton = () => {
    const getRandomNumber=()=>{
        return random(1, 10000);
    }
  return (
    <Link
      href={`/animeInfo/random-anime-${getRandomNumber()}`}
      className="no-underline">
      <Button
        variant="ghost"
        className={cn(
          "z-40 fixed w-fit right-4 bottom-5 mt-10 border bg-secondary/50 hover:bg-secondary/80 text-white px-4 py-2 rounded-full shadow-md transition-all duration-300 border-none"
        )}>
        <Shuffle className="font-semibold w-4 sm:w-6"/>
      </Button>
    </Link>
  );
};

export default RandomAnimeButton;
