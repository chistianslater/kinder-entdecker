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

  return (
    <div className="relative">
      <Carousel className="w-full">
        <CarouselContent>
          {galleryImages.map((image, index) => (
            <CarouselItemWrapper key={`${index}`}>
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