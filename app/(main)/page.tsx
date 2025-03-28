"use client";
import Card from "@/components/Card";
import { createClient } from "@/utils/supabase/client"
import { motion, useAnimation } from "motion/react";
import { useEffect, useState } from "react";
import { AniListAuthButton } from "@/components/AniListAuthButton"

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
  };
};

export default function Home() {
  const controls = useAnimation();
  const [isThrown, setIsThrown] = useState(false);
  const [animeList, setAnimeList] = useState<AnimeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [animeNumber, setAnimeNumber] = useState(0);
  const [page, setPage] = useState(1);
  const [anilistLoggedIn, setAilistLoggedIn] = useState(false)

  async function fetchAnime(page: number, perPage: number) {
    if (loading) return;

    setLoading(true);

    const query = `
      query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          media(sort: POPULARITY_DESC) {
            title {
              english
              native
              romaji
            }
            description
            coverImage {
              extraLarge
            }
            trailer {
              id
              site
            }
            genres
          }
        }
      }
    `;
    const variables = { page, perPage };

    const url = 'https://graphql.anilist.co';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (data?.data?.Page?.media) {
        setAnimeList(prevData => [...prevData, ...data?.data?.Page?.media]);
      }
    } catch (error) {
      alert("Error, check console.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }


  async function getMoreAnime() {
    setPage((prevPage) => prevPage + 1);
  }

  useEffect(() => {
    fetchAnime(page, 50);
  }, [page]);

  useEffect(() => {
    async function fetchAccessToken() {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()

      let { data: tokens, error } = await supabase
        .from('tokens')
        .select('access_token')
        .eq('user_id', user?.id)

      console.log(tokens?.length == 0)

      if (tokens?.length != 0) {
        setAilistLoggedIn(true)
      } else {
        setAilistLoggedIn(false)
      }
    }
    fetchAccessToken()
  }, [])

  function UpdateAnime() {

    setAnimeNumber((prevNumber) => {
      const nextNumber = prevNumber < animeList.length - 1 ? prevNumber + 1 : prevNumber;

      // TODO fetches multiple times when spamming buttons
      if (nextNumber === animeList.length - 1 && animeList.length % 50 === 0) {
        setTimeout(() => {
          getMoreAnime();
        }, 1000);
      }

      return nextNumber;
    });
  }

  async function throwCard(direction: any) {
    if (isThrown == true ) return
    setIsThrown(true);

    await controls.start({
      x: direction === "left" ? -500 : direction === "right" ? 500 : 0,
      y: direction === "down" ? 500 : 0,
      rotate: direction === "left" ? -45 : direction === "right" ? 45 : 0,
      opacity: 0,
      transition: { duration: 0.5 },
    });


    UpdateAnime();
    controls.set({ x: 0, y: 0, rotate: 0, scale: 0, opacity: 0 });
    await controls.start(transition);

    setIsThrown(false)
  }

  const transition = {
    duration: 2,
    delay: 2,
    opacity: 1,
    scale: 1,
    ease: [0, 0.71, 0.2, 1.01],
  };

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (isThrown == true) return;
      switch (e.keyCode) {
        case 37: // Left arrow
          throwCard("left")
          break;
        case 39: // Right arrow
          throwCard("right");
          break;
        case 40: // Down arrow
          throwCard("down");
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [controls, animeList, isThrown]);

  return (
    <div className="flex w-full h-screen justify-center items-center">
      {anilistLoggedIn ? (
        <div className="flex flex-col items-center">
          <motion.div
            animate={controls}
            transition={transition}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          >
            {animeList && animeList.length > 0 ? (
              <Card animeData={animeList[animeNumber]} />
            ) : (
              <p>Loading...</p>
            )}
          </motion.div>
        </div>
      ) : !anilistLoggedIn ? (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h1 className="mb-6 text-2xl font-bold text-center">Connect AniList Account</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Connect your AniList account to access your anime and manga lists.
          </p>
          <div className="flex justify-center">
            <AniListAuthButton className="w-full" />
          </div>
        </div>
      ) : <p></p>}

    </div>
  );
}
