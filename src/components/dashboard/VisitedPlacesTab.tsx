import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MapPin } from 'lucide-react';

export const VisitedPlacesTab = () => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['visitedPlaces'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          activities (
            id,
            title,
            location,
            type,
            image_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Lädt...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Besuchte Orte</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews?.map((review) => review.activities && (
          <div key={review.activities.id} className="border rounded-lg overflow-hidden">
            {review.activities.image_url && (
              <img 
                src={review.activities.image_url} 
                alt={review.activities.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold">{review.activities.title}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="w-4 h-4" />
                {review.activities.location}
              </div>
              <span className="inline-block bg-secondary px-2 py-1 rounded text-sm mt-2">
                {review.activities.type}
              </span>
            </div>
          </div>
        ))}
        {reviews?.length === 0 && (
          <p className="text-muted-foreground col-span-2">Sie haben noch keine Orte besucht.</p>
        )}
      </div>
    </div>
  );
};