import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useActivityRating = (activityId: string) => {
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number>(0);

  useEffect(() => {
    const fetchRatings = async () => {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('activity_id', activityId);

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
  }, [activityId]);

  return { averageRating, reviewCount };
};