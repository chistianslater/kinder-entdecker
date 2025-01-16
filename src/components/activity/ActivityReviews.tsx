import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Activity } from '@/types/activity';
import { ReviewForm } from './ReviewForm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Pencil } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Review {
  id: string;
  activity_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string | null;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  };
}

interface ActivityReviewsProps {
  activity: Activity;
}

export const ActivityReviews = ({ activity }: ActivityReviewsProps) => {
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: reviews, isLoading, refetch } = useQuery({
    queryKey: ['reviews', activity.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          activity_id,
          user_id,
          rating,
          comment,
          created_at,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('activity_id', activity.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
  });

  if (isLoading) {
    return <div>Lädt Bewertungen...</div>;
  }

  const handleEditSuccess = () => {
    refetch();
    setEditingReviewId(null);
  };

  return (
    <div className="space-y-8">
      <ReviewForm 
        activity={activity} 
        onSuccess={() => refetch()}
      />
      
      <div className="space-y-6">
        {reviews?.map((review) => (
          <div key={review.id} className="space-y-2">
            {editingReviewId === review.id ? (
              <ReviewForm
                activity={activity}
                existingReview={review}
                onSuccess={handleEditSuccess}
                onCancelEdit={() => setEditingReviewId(null)}
              />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={review.profiles?.avatar_url || undefined} />
                      <AvatarFallback>
                        {review.profiles?.username?.[0]?.toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-white">
                        {review.profiles?.username || 'Anonymer Benutzer'}
                      </div>
                      <div className="flex">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star 
                            key={i} 
                            className="w-4 h-4 fill-primary text-primary" 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {currentUser?.id === review.user_id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingReviewId(review.id)}
                      className="h-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {review.comment && (
                  <p className="text-muted-foreground">{review.comment}</p>
                )}
              </>
            )}
          </div>
        ))}
        {reviews?.length === 0 && (
          <p className="text-muted-foreground">
            Noch keine Bewertungen für diese Aktivität.
          </p>
        )}
      </div>
    </div>
  );
};