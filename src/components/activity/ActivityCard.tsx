import React from 'react';
import { Activity } from '@/types/activity';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Baby, Euro, MapPin, Clock, TreePine } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ActivityBadges } from './ActivityBadges';

// Array of placeholder images from Unsplash
const placeholderImages = [
  'photo-1482938289607-e9573fc25ebb', // river between mountains
  'photo-1509316975850-ff9c5deb0cd9', // pine trees
  'photo-1513836279014-a89f7a76ae86', // trees at daytime
  'photo-1518495973542-4542c06a5843', // sun through trees
  'photo-1469474968028-56623f02e42e', // mountain with sun rays
  'photo-1470813740244-df37b8c1edcb', // starry night
  'photo-1470071459604-3b5ec3a7fe05', // foggy mountain
  'photo-1500375592092-40eb2168fd21', // ocean wave
  'photo-1458668383970-8ddd3927deed', // mountain alps
  'photo-1504893524553-b855bce32c67', // river and rocks
];

// Function to get a random placeholder image
const getRandomPlaceholder = () => {
  const randomIndex = Math.floor(Math.random() * placeholderImages.length);
  return `https://images.unsplash.com/${placeholderImages[randomIndex]}?auto=format&fit=crop&w=800&q=80`;
};

interface ActivityCardProps {
  activity: Activity;
  onSelect: (activity: Activity) => void;
  onClaim?: (activityId: string) => void;
  showClaimButton?: boolean;
}

export const ActivityCard = ({ 
  activity, 
  onSelect, 
  onClaim,
  showClaimButton = false 
}: ActivityCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow rounded-lg">
      <div className="relative">
        <ActivityBadges activity={activity} className="absolute top-2 left-2 right-2 z-10" />
        <div 
          className="h-48 bg-cover bg-center cursor-pointer rounded-t-lg" 
          style={{ 
            backgroundImage: activity.image_url 
              ? `url(${activity.image_url})` 
              : `url(${getRandomPlaceholder()})` 
          }}
          onClick={() => onSelect(activity)}
        />
      </div>
      <CardContent className="p-4">
        <h3 
          className="text-lg font-semibold mb-2 cursor-pointer hover:text-primary"
          onClick={() => onSelect(activity)}
        >
          {activity.title}
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {activity.location}
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <TreePine className="w-4 h-4 mr-2" />
            <Badge variant="secondary" className="rounded-md">{activity.type}</Badge>
          </div>

          {activity.age_range && (
            <div className="flex items-center text-sm text-gray-600">
              <Baby className="w-4 h-4 mr-2" />
              <Badge variant="outline" className="rounded-md">{activity.age_range} Jahre</Badge>
            </div>
          )}

          {activity.price_range && (
            <div className="flex items-center text-sm text-gray-600">
              <Euro className="w-4 h-4 mr-2" />
              <Badge variant="outline" className="rounded-md">{activity.price_range}</Badge>
            </div>
          )}

          {activity.opening_hours && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              {activity.opening_hours}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {showClaimButton && onClaim && (
          <Button 
            variant="outline" 
            className="w-full rounded-md"
            onClick={() => onClaim(activity.id)}
          >
            Als Geschäft beanspruchen
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};