import React from 'react';
import { Activity } from '@/types/activity';
import { ReviewForm } from './ReviewForm';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Star, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ActivityReviewsProps {
  activity: Activity;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

export const ActivityReviews = ({ activity }: ActivityReviewsProps) => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', activity.id],
    queryFn: async () => {
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          user_id
        `)
        .eq('activity_id', activity.id)
        .order('created_at', { ascending: false });

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
        throw reviewsError;
      }

      // Fetch profiles separately and handle potential missing profiles
      const reviewsWithProfiles = await Promise.all(
        reviewsData.map(async (review) => {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', review.user_id)
            .maybeSingle();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
          }

          return {
            ...review,
            profiles: profileData || null
          };
        })
      );

      return reviewsWithProfiles as Review[];
    },
  });

  return (
    <div className="space-y-6">
      <ReviewForm activity={activity} />
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Bewertungen</h3>
        {isLoading ? (
          <div>Lädt...</div>
        ) : reviews?.length === 0 ? (
          <div className="text-muted-foreground">Noch keine Bewertungen</div>
        ) : (
          <div className="space-y-4">
            {reviews?.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-8 w-8">
                    {review.profiles?.avatar_url ? (
                      <AvatarImage src={review.profiles.avatar_url} />
                    ) : (
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {review.profiles?.username || 'Anonymer Benutzer'}
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-muted-foreground mt-2">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};