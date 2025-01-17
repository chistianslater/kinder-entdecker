import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../../types";
import { useImageCompression } from "./useImageCompression";

export const useImageUpload = (form: UseFormReturn<FormData>) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const { compressImage } = useImageCompression();

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Fehler",
          description: "Bitte wähle eine gültige Bilddatei aus.",
          variant: "destructive",
        });
        return null;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Fehler",
          description: "Das Bild darf nicht größer als 10MB sein.",
          variant: "destructive",
        });
        return null;
      }

      const processedFile = file.size > 2 * 1024 * 1024 ? await compressImage(file) : file;
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('activity-photos')
        .upload(filePath, processedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('activity-photos')
        .getPublicUrl(filePath);

      const activityId = form.getValues('id');
      if (activityId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error: photoError } = await supabase
          .from('photos')
          .insert({
            activity_id: activityId,
            user_id: user.id,
            image_url: publicUrl,
            caption: file.name
          });

        if (photoError) throw photoError;
      }

      toast({
        title: "Erfolg",
        description: "Bild wurde erfolgreich hochgeladen.",
      });

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Fehler",
        description: "Bild konnte nicht hochgeladen werden.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading };
};