import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Activity } from '@/types/activity';

export const useExistingFiles = (activity: Activity, reviewId?: string) => {
  const [existingFiles, setExistingFiles] = useState<{ id: string; url: string }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchExistingFiles = async () => {
      if (!reviewId) return;

      const { data: photos, error } = await supabase
        .from('photos')
        .select('id, image_url')
        .eq('activity_id', activity.id)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) {
        console.error('Error fetching photos:', error);
        return;
      }

      setExistingFiles(photos.map(photo => ({
        id: photo.id,
        url: photo.image_url
      })));
    };

    fetchExistingFiles();
  }, [reviewId, activity.id]);

  const handleDeleteExisting = async (photoId: string) => {
    try {
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;

      setExistingFiles(prev => prev.filter(file => file.id !== photoId));
      
      toast({
        title: "Erfolg",
        description: "Bild wurde erfolgreich gelöscht.",
      });
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Fehler",
        description: "Bild konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    }
  };

  return {
    existingFiles,
    handleDeleteExisting,
  };
};