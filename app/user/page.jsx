"use client"
import React, { useState } from 'react'
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppContext } from '@/context/page';
import { cn } from '@/lib/utils';
import { Bebas_Neue, Oswald } from 'next/font/google';
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from '../../components/ui/dialog'
import { Edit, Loader } from 'lucide-react';

const EditForm = dynamic(() => import("@/components/EditForm"), {
  loading: () => <Loader className="mx-auto relative bottom-0 w-6 animate-spin text-primary" />
})

const AnimeGrid = dynamic(() => import("@/components/AnimeGrid"), {
  loading: () => <Loader className="mx-auto relative bottom-0 w-6 animate-spin text-primary" />
})

const ContinueCard = dynamic(() => import("@/components/ContinueCard"), {
  loading: () => <Loader className="mx-auto relative bottom-0 w-6 animate-spin text-primary" />
})

const bebas_nueue = Bebas_Neue({
  weight: ['400'],
  style: 'normal',
  subsets: ['latin'],
})

const oswald = Oswald({
  weight: ['500'],
  style: 'normal',
  subsets: ['latin'],
})

const User = () => {
  const [open, setOpen] = useState(null)
  let { user } = useAppContext();

  return (
    <div className='mt-16 sm:mt-20 min-h-screen pb-8'>
      <div className='w-full max-w-7xl mx-auto px-4'>
        {/* Profile Header */}
        <div className='relative flex w-full flex-col items-center justify-center py-8'>
          <section className='flex flex-col space-y-3 items-center'>
            <div>
              <Avatar className="drop-shadow-lg w-28 h-28 lg:w-48 lg:h-48 select-none ring-2 p-1 ring-primary ring-offset-1 ring-offset-transparent">
                <AvatarImage alt={user?.username?.[0]} src="https://zz.com/shadcn.png" />
                <AvatarFallback className="text-5xl lg:text-[90px] font-medium">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h2 className={cn('text-3xl lg:text-4xl text-center', bebas_nueue.className)}>
                {user?.username || "User"}
              </h2>
            </div>
            <div>
              <h2 className={cn('text-base sm:text-lg text-secondary/70 text-center', oswald.className)}>
                {user?.email || ""}
              </h2>
            </div>
            
            {/* Edit Button */}
            <div className='absolute top-0 right-0'>
              <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="hover:text-secondary">
                    <Edit className='w-5 h-5' />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm sm:max-w-md">
                  <EditForm setOpen={setOpen} />
                </DialogContent>
              </Dialog>
            </div>
          </section>

          <Separator className="my-6 w-full" />

          {/* Content Section */}
          {user && (
            <section className='w-full grid gap-4 grid-cols-1 lg:grid-cols-5'>
              {/* Continue Watching Section */}
              {user?.continueWatching?.length > 0 && (
                <div className='lg:col-span-1 w-full'>
                  <div className='sticky top-20'>
                    <ContinueCard user={user} anime={user.continueWatching[0]} />
                  </div>
                  <Separator className="my-4 lg:hidden" />
                </div>
              )}

              {/* Saved Anime Grid */}
              <div className={cn(
                'w-full',
                user?.continueWatching?.length > 0 
                  ? 'lg:col-span-4' 
                  : 'lg:col-span-5'
              )}>
                <AnimeGrid 
                  animes={user?.savedAnime || []} 
                  type={"Saved"} 
                />
              </div>
            </section>
          )}

          {/* Loading/Empty State */}
          {!user && (
            <div className='flex items-center justify-center min-h-[50vh]'>
              <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default User;