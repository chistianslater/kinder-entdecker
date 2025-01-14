import { useState, useEffect } from 'react';
import { Activity } from '@/types/activity';
import { MediaFile } from '@/types/media';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useActivityPhotos = (activity: Activity) => {
  const [photos, setPhotos] = useState<MediaFile[]>([]);
  const { toast } = useToast();
  const { session } = useAuth();

  const fetchPhotos = async () => {
    try {
      // Always include the main activity image if it exists
      const mainImage = activity.image_url 
        ? [{ 
            type: 'image' as const, 
            url: activity.image_url,
            caption: 'Featured Image'
          }] 
        : [];

      // If no activity ID, just return the main image
      if (!activity.id) {
        setPhotos(mainImage);
        return;
      }

      // Only fetch additional photos if we have an activity ID
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('activity_id', activity.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const additionalPhotos = data?.map(photo => ({
        type: 'image' as const,
        url: photo.image_url,
        id: photo.id,
        caption: photo.caption
      })) || [];

      setPhotos([...mainImage, ...additionalPhotos]);
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast({
        title: "Error",
        description: "Could not load photos",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (session) {
      fetchPhotos();
    }
  }, [activity.id, session]);

  const getGalleryImages = () => photos;

  return {
    photos,
    getGalleryImages,
    refetchPhotos: fetchPhotos
  };
};