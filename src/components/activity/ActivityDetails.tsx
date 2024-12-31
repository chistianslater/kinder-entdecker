import React from 'react';
import { MapPin, Clock, Euro, Users, Tag, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Activity } from '@/types/activity';
import { AspectRatio } from "@/components/ui/aspect-ratio";

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

  // Generate an array of placeholder images
  const galleryImages = Array(6).fill(null).map((_, index) => 
    index === 0 && activity.image_url 
      ? activity.image_url 
      : getRandomPlaceholder()
  );

  return (
    <div className="space-y-8">
      {/* Feature Image */}
      <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg">
        <img
          src={galleryImages[0]}
          alt={activity.title}
          className="object-cover w-full h-full"
        />
      </AspectRatio>

      {/* Image Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {galleryImages.slice(1).map((image, index) => (
          <AspectRatio key={index} ratio={1} className="overflow-hidden rounded-lg">
            <img
              src={image}
              alt={`${activity.title} gallery image ${index + 2}`}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
            />
          </AspectRatio>
        ))}
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