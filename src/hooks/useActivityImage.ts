import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getRandomPlaceholder } from '@/utils/imageUtils';

export const useActivityImage = (activityId: string, mainImageUrl: string | null) => {
  const [displayImage, setDisplayImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      if (mainImageUrl) {
        setDisplayImage(mainImageUrl);
        return;
      }

      const { data: photos, error } = await supabase
        .from('photos')
        .select('image_url')
        .eq('activity_id', activityId);

      if (error) {
        console.error('Error fetching photos:', error);
        setDisplayImage(getRandomPlaceholder());
        return;
      }

      if (photos && photos.length > 0) {
        const randomIndex = Math.floor(Math.random() * photos.length);
        setDisplayImage(photos[randomIndex].image_url);
      } else {
        setDisplayImage(getRandomPlaceholder());
      }
    };

    fetchImages();
  }, [activityId, mainImageUrl]);

  return displayImage;
};