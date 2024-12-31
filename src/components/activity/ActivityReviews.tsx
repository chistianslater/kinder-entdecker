import React from 'react';
import { ReviewForm } from './ReviewForm';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { TreePine, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Activity } from '@/types/activity';

interface ActivityReviewsProps {
  activity: Pick<Activity, 'id'>;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
  activity_id: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

export const ActivityReviews = ({ activity }: ActivityReviewsProps) => {
  const { data: reviews, isLoading, refetch } = useQuery<Review[]>({
    queryKey: ['reviews', activity.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles!reviews_user_id_fkey(
            username,
            avatar_url
          )
        `)
        .eq('activity_id', activity.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    },
  });

  const renderTrees = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <TreePine
        key={index}
        className={`w-5 h-5 ${
          index < rating 
            ? 'fill-primary text-primary' 
            : 'fill-muted text-muted hover:fill-primary/20 hover:text-primary/20'
        }`}
      />
    ));
  };

  if (isLoading) {
    return <div>Lädt Bewertungen...</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Bewertungen</h3>
      
      <ReviewForm activity={activity} onSuccess={refetch} />

      <div className="space-y-4 mt-6">
        {reviews?.map((review) => (
          <div key={review.id} className="bg-accent/10 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={review.profiles?.avatar_url || ''} />
                <AvatarFallback>
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      {review.profiles?.username || 'Anonymer Benutzer'}
                    </div>
                    <div className="flex items-center gap-0.5">
                      {renderTrees(review.rating)}
                    </div>
                  </div>
                </div>
                {review.comment && (
                  <p className="mt-2 text-muted-foreground">
                    {review.comment}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};