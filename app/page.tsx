"use client";
import Card from "@/components/Card";
import { motion, useAnimation } from "motion/react";
import { useEffect, useState } from "react";

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
  const [animeList, setAnimeList] = useState<AnimeData[]>([]); // Initialize as an empty array
  const [loading, setLoading] = useState(false);
  const [animeNumber, setAnimeNumber] = useState(0);
  const [page, setPage] = useState(1);  // Start at page 1

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
      console.log(data); // Check the fetched data
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

  // Increment page and fetch more anime
  async function getMoreAnime() {
    setPage((prevPage) => {
      const newPage = prevPage + 1;
      fetchAnime(newPage, 50);
      return newPage;
    });
  }

  useEffect(() => {
    fetchAnime(page, 50);  // Initial fetch
  }, [page]);

  useEffect(() => {
    console.log(animeList); // Check the updated anime list
  }, [animeList]);

  // Ensure anime number increments and fetch more anime if needed
  async function delayedUpdateAnime() {
    await new Promise(resolve => setTimeout(resolve, 440));

    setAnimeNumber((prevNumber) => {
      const nextNumber = prevNumber < animeList.length - 1 ? prevNumber + 1 : prevNumber;
      
      // Fetch more anime if we reach the end of the current list
      if (nextNumber === animeList.length - 1 && animeList.length % 50 === 0) {
        getMoreAnime();
      }
      
      return nextNumber;
    });
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.keyCode) {
        case 37: // Left arrow
          console.log('left');
          throwCard("left");
          delayedUpdateAnime();
          break;
        case 39: // Right arrow
          console.log('right');
          throwCard("right");
          delayedUpdateAnime();
          break;
        case 40: // Down arrow
          console.log('down');
          throwCard("down");
          delayedUpdateAnime();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [controls, animeList]);

  const transition = {
    duration: 2,
    delay: 2,
    opacity: 1,
    scale: 1,
    ease: [0, 0.71, 0.2, 1.01],
  };

  async function throwCard(direction: any) {
    setIsThrown(true);

    await controls.start({
      x: direction === "left" ? -500 : direction === "right" ? 500 : 0,
      y: direction === "down" ? 500 : 0,
      rotate: direction === "left" ? -45 : direction === "right" ? 45 : 0,
      opacity: 0,
      transition: { duration: 0.5 },
    });

    controls.set({ x: 0, y: 0, rotate: 0, scale: 0, opacity: 0 });
    controls.start(transition);
    setIsThrown(false);
  }

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className="flex flex-col items-center">
        <motion.div
          animate={controls}
          transition={transition}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
        >
          {animeList && animeList.length > 0 ? (
            <Card animeData={animeList[animeNumber]} />  // Pass a single anime object as the prop 'animeData'
          ) : (
            <p>Loading...</p>  // Show loading text while fetching data
          )}
        </motion.div>
      </div>
    </div>
  );
}
