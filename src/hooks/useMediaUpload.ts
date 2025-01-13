import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { MediaFile } from "@/types/media";

export const useMediaUpload = (activityId?: string) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const uploadToStorage = async (file: File, fileType: 'image' | 'video') => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;
    const bucketName = fileType === 'image' ? 'activity-photos' : 'activity-videos';

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const saveToDatabase = async (
    publicUrl: string, 
    file: File, 
    fileType: 'image' | 'video'
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    if (fileType === 'image') {
      const { data, error } = await supabase
        .from('photos')
        .insert({
          activity_id: activityId,
          user_id: user.id,
          image_url: publicUrl,
          caption: file.name
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('videos')
        .insert({
          activity_id: activityId,
          user_id: user.id,
          video_url: publicUrl,
          caption: file.name
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  };

  const handleFileUpload = async (file: File, fileType: 'image' | 'video') => {
    try {
      setUploading(true);
      const publicUrl = await uploadToStorage(file, fileType);
      const data = await saveToDatabase(publicUrl, file, fileType);

      return {
        type: fileType,
        url: publicUrl,
        id: data.id,
        caption: file.name
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return { handleFileUpload, uploading };
};