"use client"
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsDown, Star } from 'lucide-react';
import { motion, useAnimation } from "motion/react";
import { useEffect, useState } from "react";

export default function Home() {
  const controls = useAnimation()
  const [isThrown, setIsThrown] = useState(false)

  async function throwCard (direction: any) {
    setIsThrown(true)
    await controls.start({
      x: direction == "left" ? -500 : direction === "right" ? 500 : 0,
      y: direction == "down" ? 500 : 0,
      rotate: direction === "left" ? -45 : direction === "right" ? 45 : 0,
      opacity: 0,
      transition: { duration: 0.5 },
    })
    setIsThrown(false);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.keyCode) {
        case 37: // Left arrow
          console.log('left');
          throwCard("left");
          break;
        case 39: // Right arrow
          console.log('right');
          throwCard("right");
          break;
        case 40: // Down arrow
          console.log('down');
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
  }, [controls]);



  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className="flex flex-col items-center">
        <motion.div 
        animate={controls}
        initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}>
          <Card />
        </motion.div>
      </div>  
    </div>
  );
}