import React, { useState, useEffect } from 'react';
import { Activity } from '@/types/activity';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Baby, Euro, MapPin, Clock, TreePine, Star } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ActivityBadges } from './ActivityBadges';
import { supabase } from '@/integrations/supabase/client';

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
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number>(0);

  useEffect(() => {
    const fetchRatings = async () => {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('activity_id', activity.id);

      if (error) {
        console.error('Error fetching ratings:', error);
        return;
      }

      if (reviews && reviews.length > 0) {
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        setAverageRating(total / reviews.length);
        setReviewCount(reviews.length);
      }
    };

    fetchRatings();
  }, [activity.id]);

  const isCurrentlyOpen = () => {
    if (!activity.opening_hours) return null;

    const now = new Date();
    const currentDay = now.toLocaleDateString('de-DE', { weekday: 'long' }).toLowerCase();
    const currentTime = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

    const isOpen = activity.opening_hours.toLowerCase().split('\n').some(schedule => {
      const [days, hours] = schedule.split(':').map(s => s.trim());
      if (!hours) return false;

      // Check if current day is in the schedule
      const isDayIncluded = days.split(',').some(dayRange => {
        const [start, end] = dayRange.split('-').map(d => d.trim());
        const daysOfWeek = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag', 'sonntag'];
        const startIdx = daysOfWeek.indexOf(start.toLowerCase());
        const endIdx = end ? daysOfWeek.indexOf(end.toLowerCase()) : startIdx;
        const currentIdx = daysOfWeek.indexOf(currentDay);
        return currentIdx >= startIdx && currentIdx <= endIdx;
      });

      if (!isDayIncluded) return false;

      // Check if current time is within opening hours
      const [openTime, closeTime] = hours.split('-').map(t => t.trim());
      return currentTime >= openTime && currentTime <= closeTime;
    });

    return isOpen;
  };

  const openStatus = isCurrentlyOpen();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow rounded-2xl bg-black/5 backdrop-blur-md border border-white/10">
      <div className="relative">
        <ActivityBadges activity={activity} className="absolute top-2 left-2 right-2 z-10" />
        <div 
          className="h-48 bg-cover bg-center cursor-pointer rounded-t-2xl" 
          style={{ 
            backgroundImage: activity.image_url 
              ? `url(${activity.image_url})` 
              : `url(${getRandomPlaceholder()})` 
          }}
          onClick={() => onSelect(activity)}
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 
            className="text-lg font-semibold cursor-pointer hover:text-primary text-[#eee]"
            onClick={() => onSelect(activity)}
          >
            {activity.title}
          </h3>
          {averageRating !== null && (
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-[#eee]">{averageRating.toFixed(1)}</span>
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="text-sm text-[#eee]/80">({reviewCount})</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-[#eee]/90">
            <MapPin className="w-4 h-4 mr-2 text-[#eee]" />
            {activity.location}
          </div>

          <div className="flex items-center text-sm text-[#eee]/90">
            <TreePine className="w-4 h-4 mr-2 text-[#eee]" />
            <Badge variant="secondary" className="rounded-md">{activity.type}</Badge>
          </div>

          {activity.age_range && (
            <div className="flex items-center text-sm text-[#eee]/90">
              <Baby className="w-4 h-4 mr-2 text-[#eee]" />
              <Badge variant="outline" className="rounded-md">{activity.age_range} Jahre</Badge>
            </div>
          )}

          {activity.price_range && (
            <div className="flex items-center text-sm text-[#eee]/90">
              <Euro className="w-4 h-4 mr-2 text-[#eee]" />
              <Badge variant="outline" className="rounded-md">{activity.price_range}</Badge>
            </div>
          )}

          {activity.opening_hours && (
            <div className="flex items-center justify-between text-sm text-[#eee]/90">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-[#eee]" />
                {activity.opening_hours}
              </div>
              {openStatus !== null && (
                <Badge 
                  className={`ml-2 ${
                    openStatus 
                      ? "bg-[#F2FCE2] text-green-700 hover:bg-[#F2FCE2]" 
                      : "bg-[#FFDEE2] text-red-700 hover:bg-[#FFDEE2]"
                  }`}
                >
                  {openStatus ? "Geöffnet" : "Geschlossen"}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {showClaimButton && onClaim && (
          <Button 
            variant="outline" 
            className="w-full rounded-md text-[#eee]"
            onClick={() => onClaim(activity.id)}
          >
            Als Geschäft beanspruchen
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
