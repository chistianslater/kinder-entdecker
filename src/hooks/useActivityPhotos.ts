import { useState, useEffect } from 'react';
import { Activity } from '@/types/activity';
import { MediaFile } from '@/types/media';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useActivityPhotos = (activity: Activity) => {
  const [photos, setPhotos] = useState<MediaFile[]>([]);
  const { toast } = useToast();

  const fetchPhotos = async () => {
    try {
      if (!activity.id) {
        // If no activity ID, just use the main image if it exists
        if (activity.image_url) {
          setPhotos([{ type: 'image', url: activity.image_url }]);
        } else {
          setPhotos([]);
        }
        return;
      }

      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('activity_id', activity.id);

      if (error) throw error;

      const photoFiles: MediaFile[] = [
        // Include the main activity image if it exists
        ...(activity.image_url ? [{ type: 'image' as const, url: activity.image_url }] : []),
        // Add the additional photos
        ...(data?.map(photo => ({
          type: 'image' as const,
          url: photo.image_url,
          id: photo.id,
          caption: photo.caption
        })) || [])
      ];

      setPhotos(photoFiles);
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
    fetchPhotos();
  }, [activity.id]);

  const getGalleryImages = () => photos;

  return {
    photos,
    getGalleryImages,
    refetchPhotos: fetchPhotos
  };
};