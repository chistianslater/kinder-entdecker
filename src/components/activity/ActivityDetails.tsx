import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Euro, Users, Tag, Navigation, Camera, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Activity } from '@/types/activity';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Array of placeholder images from Unsplash
const placeholderImages = [
  'photo-1482938289607-e9573fc25ebb', // river between mountains
  'photo-1509316975850-ff9c5deb0cd9', // pine trees
  'photo-1513836279014-a89f7a76ae86', // trees at daytime
  'photo-1518495973542-4542c06a5843', // sun through trees
  'photo-1469474968028-56623f02e42e', // mountain with sun rays
];

// Function to get a random placeholder image
const getRandomPlaceholder = () => {
  const randomIndex = Math.floor(Math.random() * placeholderImages.length);
  return `https://images.unsplash.com/${placeholderImages[randomIndex]}?auto=format&fit=crop&w=800&q=80`;
};

interface ActivityDetailsProps {
  activity: Activity;
}

interface Photo {
  id: string;
  image_url: string;
  caption: string;
  user_id: string;
}

export const ActivityDetails = ({ activity }: ActivityDetailsProps) => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('activity_id', activity.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching photos:', error);
        return;
      }

      if (data) {
        // Get public URLs for each photo
        const photosWithUrls = await Promise.all(data.map(async (photo) => {
          const { data: publicUrl } = supabase
            .storage
            .from('activity-photos')
            .getPublicUrl(photo.image_url);
          
          return {
            ...photo,
            image_url: publicUrl.publicUrl
          };
        }));
        setPhotos(photosWithUrls);
      }
    };

    fetchPhotos();
  }, [activity.id]);

  const handleNavigate = () => {
    const encodedAddress = encodeURIComponent(activity.location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank', 'noopener,noreferrer');
  };

  // Combine activity's main image with uploaded photos
  const galleryImages = [
    // Add main activity image if it exists
    ...(activity.image_url ? [{
      url: activity.image_url,
      isOwner: true,
      photographer: 'Owner',
      caption: 'Featured Image'
    }] : []),
    // Add uploaded photos
    ...photos.map(photo => ({
      url: photo.image_url,
      isOwner: false,
      photographer: 'Community Member',
      caption: photo.caption || 'Community Photo'
    })),
    // Add placeholder images only if there are no real images
    ...(activity.image_url || photos.length > 0 ? [] : Array(6).fill(null).map((_, index) => ({
      url: getRandomPlaceholder(),
      isOwner: false,
      photographer: `User ${index}`,
      caption: `Community Photo ${index}`
    })))
  ];

  return (
    <div className="space-y-8">
      {/* Feature Image Carousel */}
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {galleryImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative">
                  <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg">
                    <img
                      src={image.url}
                      alt={`${activity.title} - ${image.caption}`}
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>

      <h3 className="text-lg font-semibold text-primary">Details</h3>
      <div className="grid gap-4">
        <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary" />
            <span>{activity.location}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNavigate}
            className="shrink-0"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Navigation
          </Button>
        </div>

        <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
          <Clock className="w-5 h-5 text-primary" />
          <span>{activity.opening_hours || 'Not specified'}</span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
          <Euro className="w-5 h-5 text-primary" />
          <span>{activity.price_range || 'Not specified'}</span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
          <Users className="w-5 h-5 text-primary" />
          <span>{activity.age_range || 'Not specified'}</span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
          <Tag className="w-5 h-5 text-primary" />
          <span>{activity.type}</span>
        </div>
      </div>
    </div>
  );
};