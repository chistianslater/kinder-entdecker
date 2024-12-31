import React from 'react';
import { Camera, User } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface CarouselItemProps {
  image: {
    url: string;
    isOwner: boolean;
    photographer: string;
    caption: string;
  };
  activityTitle: string;
}

export const CarouselItem = ({ image, activityTitle }: CarouselItemProps) => {
  return (
    <div className="relative">
      <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg">
        <img
          src={image.url}
          alt={`${activityTitle} - ${image.caption}`}
          className="object-cover w-full h-full"
        />
      </AspectRatio>
      <Badge 
        variant="secondary" 
        className="absolute top-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm"
      >
        <Camera className="w-3 h-3" />
        {image.isOwner ? 'Official Photo' : 'Community Photo'}
      </Badge>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
        <div className="flex items-center gap-2 text-white">
          <User className="w-4 h-4" />
          <span className="text-sm font-medium">{image.photographer}</span>
        </div>
        <p className="text-xs text-white/90 mt-1">{image.caption}</p>
      </div>
    </div>
  );
};