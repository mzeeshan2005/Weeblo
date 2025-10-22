import Link from 'next/link'
import React from 'react'
import { cn } from '@/lib/utils';
import SaveAnimeButton from './SaveAnimeButton';
import RemoveAnimeButton from './RemoveAnimeButton';
import { History } from 'lucide-react';


const CustomAnimeCard = ({ anime, type }) => {
    const { name, animeId, poster, continueTime, totalTime, episodeNumber } = anime
    return (type == "Saved" ?
        <div className="relative  min-h-[120px] max-h-[120px] min-w-[90px] sm:min-h-[200px] sm:max-h-[250px] sm:min-w-[190px] group ml-1 sm:mb-1 mb-1 mt-1 sm:mt-2 cursor-pointer z-0">
            <div className='md:text-lg rounded-none rounded-bl-sm bg-secondary/50 group-hover:bg-secondary/90 text-sm py-0 px-1 sm:px-2 absolute top-0 right-0 z-30'><SaveAnimeButton animeId={animeId} type="Saved" /></div>
            <Link href={`/animeInfo/${encodeURIComponent(animeId)}`} className="w-fit">
                <div className="absolute inset-0 h-full rounded-sm bg-gradient-to-b from-gray-200/0 via-gray-900/20 hover:via-gray-900/50 to-gray-950/70 hover:to-gray-950/90 z-10"></div>
                <div className="text-white z-20 w-fit font-semibold">
                    <p className={cn("absolute z-20 md:text-lg text-xs max-w-full max-h-[80%] overflow-hidden bottom-2 left-1 sm:bottom-4 sm:left-3")}>{name?.length > 25 ? name.slice(0, 25) + "..." : name}</p>
                </div>
                <img
                    className={cn("w-full min-h-[120px] max-h-[120px] min-w-[90px] sm:min-h-[200px] sm:max-h-[250px] sm:min-w-[190px] object-cover rounded-sm lg:hover:drop-shadow-lg")}
                    alt={name}
                    width={300}
                    height={400}
                    layout="responsive"
                    src={poster ? poster : ""}
                />
            </Link>
        </div> :
        <div className="relative min-h-[120px] max-h-[120px] min-w-[90px] sm:min-h-[200px] sm:max-h-[250px] sm:min-w-[190px] group ml-1 sm:mb-1 mb-1 mt-1 sm:mt-2 cursor-pointer">
            <div className='md:text-lg w-fit rounded-none rounded-bl-md bg-secondary/50 group-hover:bg-secondary/90 text-sm p-0 absolute top-0 right-0 z-30'><RemoveAnimeButton animeId={animeId} /></div>
            <Link href={`/watch/${encodeURIComponent(animeId)}?ep=${episodeNumber}`} className="w-fit">
                <div className='sm:text-lg text-white absolute top-1 left-2 font-semibold z-10 textStroke'>EP{episodeNumber}</div>
                <div className="z-0 absolute inset-0 h-full rounded-t-sm bg-gradient-to-b from-gray-200/0 via-gray-900/20 group-hover:via-gray-900/30 to-gray-950/70 group-hover:to-gray-950/70 "></div>
                <div className="z-0 absolute inset-0 h-full rounded-t-sm bg-gradient-to-tl from-gray-200/0 via-gray-900/10 group-hover:via-gray-900/0 to-gray-950/20 group-hover:to-gray-950/50 "></div>
                <div className='absolute w-full h-full flex items-center justify-center z-10 '><History className='opacity-50 group-hover:opacity-100 group-hover:w-1/4 group-hover:h-1/4 text-white ' /></div>
                <div className="text-white z-20 w-fit font-semibold">
                    <p className={cn("absolute z-20 md:text-lg text-xs max-w-full max-h-[80%] overflow-hidden bottom-2 left-1 sm:bottom-4 sm:left-3")}>{name?.length > 25 ? name.slice(0, 25) + "..." : name}</p>
                </div>
                <img
                    className={cn("w-full min-h-[120px] max-h-[120px] min-w-[90px] sm:min-h-[200px] sm:max-h-[250px] sm:min-w-[190px] object-cover  rounded-t-sm lg:hover:drop-shadow-lg")}
                    alt={name}
                    width={300}
                    height={400}
                    layout="responsive"
                    src={poster ? poster : ""}
                />
            </Link>
            <div className='top-0 bg-slate-400'>
                <div className='bg-primary h-1 md:h-2 max-w-full' style={{ width: `${(continueTime / totalTime) * 100}%` }}></div>
            </div>
        </div>
    )
}

export default CustomAnimeCard