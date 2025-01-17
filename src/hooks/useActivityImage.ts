import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getRandomPlaceholder } from '@/utils/imageUtils';

export const useActivityImage = (activityId: string, mainImageUrl: string | null) => {
  const [displayImage, setDisplayImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Get all available images (main image + user uploaded photos)
        const { data: photos, error } = await supabase
          .from('photos')
          .select('image_url')
          .eq('activity_id', activityId);

        if (error) {
          console.error('Error fetching photos:', error);
          setDisplayImage(getRandomPlaceholder());
          return;
        }

        // Combine main image with user photos if they exist
        const allImages = [
          ...(mainImageUrl ? [{ image_url: mainImageUrl }] : []),
          ...(photos || [])
        ];

        if (allImages.length > 0) {
          // Randomly select an image from all available images
          const randomIndex = Math.floor(Math.random() * allImages.length);
          setDisplayImage(allImages[randomIndex].image_url);
        } else {
          setDisplayImage(getRandomPlaceholder());
        }
      } catch (error) {
        console.error('Error in useActivityImage:', error);
        setDisplayImage(getRandomPlaceholder());
      }
    };

    fetchImages();
  }, [activityId, mainImageUrl]);

  return displayImage;
};