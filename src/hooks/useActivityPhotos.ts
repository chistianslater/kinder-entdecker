import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { getRandomPlaceholder } from '@/utils/imageUtils';
import { Activity } from '@/types/activity';

interface Photo {
  id: string;
  image_url: string;
  caption: string;
  user_id: string;
}

export const useActivityPhotos = (activity: Activity) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('activity_id', activity.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activity.id) {
      fetchPhotos();
    }
  }, [activity.id]);

  const getGalleryImages = () => {
    const images = [
      ...(activity.image_url ? [{
        url: activity.image_url,
        isOwner: true,
        photographer: 'Owner',
        caption: 'Featured Image'
      }] : []),
      ...photos.map(photo => ({
        url: photo.image_url,
        isOwner: false,
        photographer: 'Community Member',
        caption: photo.caption || 'Community Photo',
        id: photo.id
      }))
    ];

    return images.length > 0 ? images : [];
  };

  return {
    photos,
    loading,
    getGalleryImages,
    refetchPhotos: fetchPhotos
  };
};