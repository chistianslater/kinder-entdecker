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

      if (data) {
        const photosWithUrls = await Promise.all(data.map(async (photo) => {
          const { data: publicUrl } = supabase
            .storage
            .from('activity-photos')
            .getPublicUrl(photo.image_url);
          
          return {
            ...photo,
            image_url: publicUrl.publicUrl
          };
        }));
        setPhotos(photosWithUrls);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
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
      })),
      ...(activity.image_url || photos.length > 0 ? [] : Array(6).fill(null).map((_, index) => ({
        url: getRandomPlaceholder(),
        isOwner: false,
        photographer: `User ${index}`,
        caption: `Community Photo ${index}`
      })))
    ];

    return images;
  };

  return {
    photos,
    loading,
    getGalleryImages,
    refetchPhotos: fetchPhotos
  };
};