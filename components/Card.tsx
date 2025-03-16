"use client"

import React, { useEffect, useState } from 'react';
import YoutubeButton from "@/components/YoutubeButton";
import { Badge } from "@/components/ui/badge";

type AnimeData = {
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  description: string;
  genres: string[];
  coverImage: {
    extraLarge: string;
  };
  trailer: {
    id: string;
    site: string;
  }
};

export default function Card() {
  const [animeData, setAnimeData] = useState<AnimeData | null>(null);

  useEffect(() => {
    const query = `
    query ($id: Int) {
      Media (id: $id, type: ANIME) {
      id
      title {
        romaji
        english
        native
        }
        description
      coverImage {
        extraLarge
        }
        trailer{
          id
          site 
        }
      genres
      }
    }
    `
    const variables = { id: 154587}

    const url = 'https://graphql.anilist.co',
      options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          variables: variables
      })
      }
      fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          if (data?.data?.Media) {
            setAnimeData(data.data.Media)
            console.log(animeData?.title?.romaji)
          }

        })
        .catch((error) => {
          alert("error, check console.")
          console.log(error)
        })
  }, [])

  useEffect(() => {
    console.log(animeData)
  }, [animeData])

  function truncateString(str: string, num: number) {
    // Clear out that junk in your trunk
    if (str.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  }
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:-translate-y-2 hover:shadow-2xl w-[30rem] h-[50rem]">
      <div className="h-[50%] ">
        <img src={animeData ? animeData?.coverImage.extraLarge : undefined} className="w-full h-full object-cover bg-gray-800" />
      </div>
      <div className="h-[50%] p-6 bg-gray-800">
        <h1 className="text-4xl font-bold text-white mb-4">{animeData?.title.english ? animeData?.title.english : "loading..." }</h1>
        <div className="flex items-center mb-6">
          <div className="flex-grow">
            {animeData ? (animeData?.genres.map((genre) => <Badge key={genre} variant="default" className='mx-1'>{genre}</Badge>)) : undefined} 
          </div>
          <YoutubeButton className="ml-auto" videoId={animeData ? animeData?.trailer?.id : undefined} />
        </div>
        <div>
        <div className="flex-grow">
            {animeData ? truncateString(animeData?.description, 350) : undefined}
          </div>
        </div>
        <p className="text-lg text-gray-300"></p>
      </div>
    </div>
  );
}
