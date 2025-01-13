import React from 'react';
import { Activity } from '@/types/activity';
import { useActivityPhotos } from '@/hooks/useActivityPhotos';
import { CarouselItem } from './gallery/CarouselItem';
import {
  Carousel,
  CarouselContent,
  CarouselItem as CarouselItemWrapper,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ImageGalleryProps {
  activity: Activity;
}

export const ImageGallery = ({ activity }: ImageGalleryProps) => {
  const { getGalleryImages, refetchPhotos } = useActivityPhotos(activity);
  const galleryImages = getGalleryImages();

  if (galleryImages.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full aspect-[16/9]">
      <Carousel className="w-full h-full">
        <CarouselContent>
          {galleryImages.map((image, index) => (
            <CarouselItemWrapper key={`${image.url}-${index}`}>
              <CarouselItem 
                image={image}
                activityTitle={activity.title}
                onImageDelete={refetchPhotos}
              />
            </CarouselItemWrapper>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
};