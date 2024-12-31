import React from 'react';
import { MapPin, Clock, Euro, Users, Tag, Navigation, Camera, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Activity } from '@/types/activity';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

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

export const ActivityDetails = ({ activity }: ActivityDetailsProps) => {
  const handleNavigate = () => {
    const encodedAddress = encodeURIComponent(activity.location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank', 'noopener,noreferrer');
  };

  // Generate an array of placeholder images with metadata
  const galleryImages = Array(6).fill(null).map((_, index) => ({
    url: index === 0 && activity.image_url ? activity.image_url : getRandomPlaceholder(),
    isOwner: index === 0, // First image is always from owner
    photographer: index === 0 ? 'Owner' : `User ${index}`,
    caption: index === 0 ? 'Featured Image' : `Community Photo ${index}`
  }));

  return (
    <div className="space-y-8">
      {/* Feature Image */}
      <div className="relative">
        <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg">
          <img
            src={galleryImages[0].url}
            alt={activity.title}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
        <Badge 
          variant="secondary" 
          className="absolute top-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm"
        >
          <Camera className="w-3 h-3" />
          Official Photo
        </Badge>
      </div>

      {/* Image Gallery Grid */}
      <div>
        <h3 className="text-lg font-semibold text-primary mb-4">Community Gallery</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.slice(1).map((image, index) => (
            <div key={index} className="group relative">
              <AspectRatio ratio={1} className="overflow-hidden rounded-lg">
                <img
                  src={image.url}
                  alt={`${activity.title} gallery image ${index + 2}`}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-3 h-3" />
                    <span>{image.photographer}</span>
                  </div>
                  <p className="text-xs opacity-90 mt-1">{image.caption}</p>
                </div>
              </AspectRatio>
            </div>
          ))}
        </div>
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