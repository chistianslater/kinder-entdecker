import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Activity } from '@/types/activity';
import { ReviewForm } from './ReviewForm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  activity_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string | null;
  user: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

interface ActivityReviewsProps {
  activity: Activity;
}

export const ActivityReviews = ({ activity }: ActivityReviewsProps) => {
  const { data: reviews, isLoading, refetch } = useQuery<Review[]>({
    queryKey: ['reviews', activity.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, user:profiles!reviews_user_id_fkey(username, avatar_url)')
        .eq('activity_id', activity.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Review[];
    },
  });

  if (isLoading) {
    return <div>Lädt Bewertungen...</div>;
  }

  return (
    <div className="space-y-8">
      <ReviewForm 
        activity={activity} 
        onSuccess={() => refetch()}
      />
      
      <div className="space-y-6">
        {reviews?.map((review) => (
          <div key={review.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={review.user?.avatar_url || undefined} />
                <AvatarFallback>
                  {review.user?.username?.[0]?.toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {review.user?.username || 'Anonymer Benutzer'}
                </div>
                <div className="flex">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-4 h-4 fill-yellow-400 text-yellow-400" 
                    />
                  ))}
                </div>
              </div>
            </div>
            {review.comment && (
              <p className="text-muted-foreground">{review.comment}</p>
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