import React, { useState, useEffect } from 'react';
import { Activity } from '@/types/activity';
import { Card, CardContent } from "@/components/ui/card";
import { ActivityBadges } from './ActivityBadges';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { ActivityCardHeader } from './card/ActivityCardHeader';
import { ActivityCardDetails } from './card/ActivityCardDetails';
import { ActivityCardOpeningHours } from './card/ActivityCardOpeningHours';
import { ActivityCardActions } from './card/ActivityCardActions';

const placeholderImages = [
  'photo-1482938289607-e9573fc25ebb',
  'photo-1509316975850-ff9c5deb0cd9',
  'photo-1513836279014-a89f7a76ae86',
  'photo-1518495973542-4542c06a5843',
  'photo-1469474968028-56623f02e42e',
  'photo-1470813740244-df37b8c1edcb',
  'photo-1470071459604-3b5ec3a7fe05',
  'photo-1500375592092-40eb2168fd21',
  'photo-1458668383970-8ddd3927deed',
  'photo-1504893524553-b855bce32c67',
];

const getRandomPlaceholder = () => {
  const randomIndex = Math.floor(Math.random() * placeholderImages.length);
  return `https://images.unsplash.com/${placeholderImages[randomIndex]}?auto=format&fit=crop&w=800&q=80`;
};

interface ActivityCardProps {
  activity: Activity;
  onSelect: (activity: Activity) => void;
  onClaim?: (activityId: string) => void;
  onEdit?: (activity: Activity) => void;
  showClaimButton?: boolean;
  onRefresh?: () => void;
}

export const ActivityCard = ({ 
  activity, 
  onSelect, 
  onClaim,
  onEdit,
  showClaimButton = false,
  onRefresh
}: ActivityCardProps) => {
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [isOwner, setIsOwner] = useState(false);
  const { isAdmin } = useIsAdmin();

  useEffect(() => {
    const checkOwnership = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsOwner(activity.created_by === user.id);
      }
    };
    checkOwnership();
  }, [activity.created_by]);

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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow rounded-3xl bg-black/5 backdrop-blur-md border border-white/10">
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
        <ActivityCardHeader 
          activity={activity}
          averageRating={averageRating}
          reviewCount={reviewCount}
          onSelect={onSelect}
        />
        <ActivityCardDetails activity={activity} />
        <ActivityCardOpeningHours activity={activity} />
      </CardContent>
      <ActivityCardActions 
        activity={activity}
        onClaim={onClaim}
        onEdit={onEdit}
        showClaimButton={showClaimButton}
        isOwner={isOwner}
        isAdmin={isAdmin}
        onApprove={onRefresh}
      />
    </Card>
  );
};