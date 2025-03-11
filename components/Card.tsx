import React from 'react'
import YoutubeButton from "@/components/YoutubeButton";
import { Badge } from "@/components/ui/badge";

export default function Card() {
  return (
    <div className="border-4 border-gray-500 h-[50rem] w-[30rem] rounded-xl">
    <div className="h-[35%] bg-amber-300 rounded-xl">

    </div>
    <div className="h-[65%] p-4 bg-gray-800  rounded-xl">
      <h1 className="text-5xl font-semibold text-white">Dragon Ball</h1>
      <div className="flex mb-18 p-4">
        <div className="grid *:">
        <Badge variant="default" className="h-6"> Adventure</Badge>
        <Badge variant="default" className="h-6"> Friends</Badge>
        </div>

        <div className="flex-grow"></div>
        <YoutubeButton />
      </div>
      <p className="text-xl">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consequuntur a impedit quis natus, magnam hic aliquid velit officia odit id doloremque, commodi quas quasi dolor facilis molestiae voluptatum laudantium! Sequi?</p>
    </div>
  </div>
  )
}
