import React, { useState, useEffect } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { FormData } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MediaFile } from "@/types/media";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { MediaPreview } from "./MediaPreview";
import { UploadButton } from "./UploadButton";
import { supabase } from "@/integrations/supabase/client";

interface ActivityMediaUploadProps {
  form: UseFormReturn<FormData>;
}

export function ActivityMediaUpload({ form }: ActivityMediaUploadProps) {
  const { toast } = useToast();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const activityId = form.getValues('id');
  const { handleFileUpload, uploading } = useMediaUpload(activityId);

  useEffect(() => {
    const loadExistingMedia = async () => {
      // If no activity ID (new activity), check for image_url in form
      if (!activityId) {
        const currentImageUrl = form.getValues('image_url');
        if (currentImageUrl) {
          setMediaFiles([{ type: 'image', url: currentImageUrl }]);
        }
        return;
      }

      // Only query the database if we have an activity ID
      try {
        const [photosResponse, videosResponse] = await Promise.all([
          supabase.from('photos').select('*').eq('activity_id', activityId),
          supabase.from('videos').select('*').eq('activity_id', activityId)
        ]);

        if (photosResponse.error) throw photosResponse.error;
        if (videosResponse.error) throw videosResponse.error;

        const existingMedia: MediaFile[] = [
          ...(photosResponse.data || []).map(photo => ({
            type: 'image' as const,
            url: photo.image_url,
            id: photo.id,
            caption: photo.caption
          })),
          ...(videosResponse.data || []).map(video => ({
            type: 'video' as const,
            url: video.video_url,
            id: video.id,
            caption: video.caption
          }))
        ];

        setMediaFiles(existingMedia);
      } catch (error) {
        console.error('Error loading media:', error);
        toast({
          title: "Fehler",
          description: "Medien konnten nicht geladen werden.",
          variant: "destructive",
        });
      }
    };

    loadExistingMedia();
  }, [activityId]);

  const handleFileUploadWrapper = async (
    event: React.ChangeEvent<HTMLInputElement>, 
    fileType: 'image' | 'video'
  ) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      
      const files = Array.from(event.target.files);
      const uploadPromises = files.map(file => handleFileUpload(file, fileType));
      const newFiles = await Promise.all(uploadPromises);

      if (fileType === 'image' && mediaFiles.filter(f => f.type === 'image').length === 0) {
        form.setValue('image_url', newFiles[0].url);
      }

      setMediaFiles(prev => [...prev, ...newFiles]);
      
      toast({
        title: "Erfolg",
        description: `${files.length} ${fileType}${files.length > 1 ? 's' : ''} erfolgreich hochgeladen.`,
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Fehler",
        description: "Dateien konnten nicht hochgeladen werden.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (index: number) => {
    const file = mediaFiles[index];
    if (!file.id && !activityId) {
      setMediaFiles(prev => prev.filter((_, i) => i !== index));
      return;
    }

    try {
      if (file.id) {
        const table = file.type === 'image' ? 'photos' : 'videos';
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('id', file.id);

        if (error) throw error;
      }

      setMediaFiles(prev => prev.filter((_, i) => i !== index));
      
      if (file.type === 'image' && file.url === form.getValues('image_url')) {
        const nextImage = mediaFiles.find((f, i) => f.type === 'image' && i !== index);
        form.setValue('image_url', nextImage?.url || '');
      }

      toast({
        title: "Erfolg",
        description: `${file.type === 'image' ? 'Bild' : 'Video'} wurde gelöscht.`,
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Fehler",
        description: "Datei konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Medien</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <ScrollArea className="h-[300px] w-full rounded-md border border-accent p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {mediaFiles.map((file, index) => (
                      <MediaPreview
                        key={index}
                        file={file}
                        onDelete={handleDelete}
                        index={index}
                      />
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex gap-4">
                  <UploadButton
                    type="image"
                    onUpload={(e) => handleFileUploadWrapper(e, 'image')}
                    disabled={uploading}
                  />
                  <UploadButton
                    type="video"
                    onUpload={(e) => handleFileUploadWrapper(e, 'video')}
                    disabled={uploading}
                  />
                </div>
              </div>
            </FormControl>
            <FormMessage className="text-white" />
          </FormItem>
        )}
      />
    </div>
  );
}