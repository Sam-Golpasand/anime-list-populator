import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsDown, Star } from 'lucide-react';

export default function Home() {
  return (
      <div className="flex w-full h-screen justify-center items-center">
        <div className="flex flex-col items-center">
          <Card />
          <div className="flex justify-between w-full mt-4">
            <Button variant="outline" className="mx-2 rounded-full p-4">
              <ThumbsDown size={48}/>
            </Button>
            <Button variant="outline" className="mx-2 rounded-full p-4">
              <Star size={48}/>
            </Button>
            <Button variant="outline" className="mx-2 rounded-full p-4">
              <Heart size={48}/>
            </Button>
          </div>
        </div>
      </div>
  );
}
