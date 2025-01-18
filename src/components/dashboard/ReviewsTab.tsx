import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Star } from 'lucide-react';

export const ReviewsTab = () => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['userReviews'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          activities (
            title,
            location
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="text-white">Lädt...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-white">Meine Bewertungen</h2>
      <div className="space-y-4">
        {reviews?.map((review) => (
          <div key={review.id} className="border border-white/10 rounded-lg p-4 bg-accent/10">
            <h3 className="font-semibold text-white">{review.activities?.title}</h3>
            <p className="text-sm text-white/60">{review.activities?.location}</p>
            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            {review.comment && (
              <p className="mt-2 text-white/80">{review.comment}</p>
            )}
          </div>
        ))}
        {reviews?.length === 0 && (
          <p className="text-white/60">Sie haben noch keine Bewertungen abgegeben.</p>
        )}
      </div>
    </div>
  );
};