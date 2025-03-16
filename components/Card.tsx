"use client"

import React from 'react';
import YoutubeButton from "@/components/YoutubeButton";
import { Badge } from "@/components/ui/badge";

export default function Card({ animeData }: any) {  // Destructure animeData here instead of accessing it as a prop

  
  function truncateString(str: string, num: number) {
    if (str.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:-translate-y-2 hover:shadow-2xl w-[30rem] h-[50rem]">
      <div className="h-[50%]">
        {animeData?.coverImage?.extraLarge ? (
          <img src={animeData.coverImage.extraLarge} className="w-full h-full object-cover bg-gray-800" />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">Image not available</div>
        )}
      </div>
      <div className="h-[50%] p-6 bg-gray-800">
        <h1 className="text-4xl font-bold text-white mb-4">{animeData?.title?.english ? animeData?.title.english : "loading..."}</h1>
        <div className="flex items-center mb-6">
          <div className="flex-grow">
            {animeData?.genres?.map((genre: any) => (
              <Badge key={genre} variant="default" className='mx-1'>{genre}</Badge>
            ))}
          </div>
          <YoutubeButton className="ml-auto" videoId={animeData?.trailer?.id} />
        </div>
        <div>
          <div className="flex-grow">
            {animeData?.description ? truncateString(animeData.description, 350) : "No description available"}
          </div>
        </div>
        <p className="text-lg text-gray-300"></p>
      </div>
    </div>
  );
}
