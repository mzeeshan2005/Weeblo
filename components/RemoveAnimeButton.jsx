import React, { useState } from 'react'
import { Button } from './ui/button'
import { CircleX, Loader2 } from 'lucide-react'
import { useAppContext } from '@/context/page';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
const RemoveAnimeButton = ({ animeId }) => {
    let { user, setUser } = useAppContext();
    const [removeLoading, setRemoveLoading] = useState(false)
    const [errorRemoving, setErrorRemoving] = useState(false)
    const removeAnime = async () => {
        try {
            setRemoveLoading(true)
            const response = await fetch("/api/continueAnime", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userEmail: user?.email, animeId }),
            });
            const data = await response.json();
            if (data.status == 201) {
                const newContinueWatching = user.continueWatching.filter(anime => anime.animeId !== animeId);
                setUser(prevUser => {
                    return { ...prevUser, continueWatching: newContinueWatching }
                })
                setErrorRemoving(false)
                setRemoveLoading(false)
            }
            else {
                throw new Error(data.body.message);
            }

        } catch (error) {
            setRemoveLoading(false)
            setErrorRemoving(true)
            console.log(error.message);
        }
    }
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <div>
                        {user && <Button className={cn("z-30 px-0 bg-transparent hover:bg-transparent hover:text-red-500", errorRemoving && "bg-red-500",)} onClick={removeAnime}>
                            {removeLoading ? <Loader2 className="w-4 animate-spin" /> : <CircleX className="max-w-6" />}
                        </Button>}</div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Remove</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default RemoveAnimeButton