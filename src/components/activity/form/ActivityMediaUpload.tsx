import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, Video } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { FormData } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ActivityMediaUploadProps {
  form: UseFormReturn<FormData>;
}

export function ActivityMediaUpload({ form }: ActivityMediaUploadProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = React.useState(false);
  const [mediaFiles, setMediaFiles] = React.useState<Array<{ type: 'image' | 'video', url: string, id?: string }>>([]);

  React.useEffect(() => {
    // Initialize with existing media
    const currentImageUrl = form.getValues('image_url');
    if (currentImageUrl) {
      setMediaFiles([{ type: 'image', url: currentImageUrl }]);
    }
  }, [form]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fileType: 'image' | 'video') => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      
      setUploading(true);
      const files = Array.from(event.target.files);
      const uploadPromises = files.map(async (file) => {
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

        // If it's the first image, set it as the main activity image
        if (fileType === 'image' && mediaFiles.filter(f => f.type === 'image').length === 0) {
          form.setValue('image_url', publicUrl);
        }

        // Store in the appropriate table
        const { data, error: dbError } = await supabase
          .from(fileType === 'image' ? 'photos' : 'videos')
          .insert({
            activity_id: form.getValues('id'),
            user_id: (await supabase.auth.getUser()).data.user?.id,
            [fileType === 'image' ? 'image_url' : 'video_url']: publicUrl,
            caption: file.name
          })
          .select()
          .single();

        if (dbError) throw dbError;

        return {
          type: fileType,
          url: publicUrl,
          id: data.id
        };
      });

      const newFiles = await Promise.all(uploadPromises);
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
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (index: number) => {
    const file = mediaFiles[index];
    if (!file.id) return;

    try {
      const table = file.type === 'image' ? 'photos' : 'videos';
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', file.id);

      if (error) throw error;

      setMediaFiles(prev => prev.filter((_, i) => i !== index));
      
      // If we're deleting the main image, update form
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
            <FormLabel>Medien</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {mediaFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        {file.type === 'image' ? (
                          <img
                            src={file.url}
                            alt={`Media ${index + 1}`}
                            className="w-full h-40 object-cover rounded-lg"
                          />
                        ) : (
                          <video
                            src={file.url}
                            className="w-full h-40 object-cover rounded-lg"
                            controls
                          />
                        )}
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDelete(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex gap-4">
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload(e, 'image')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploading}
                    />
                    <Button type="button" variant="outline" disabled={uploading}>
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Bilder hochladen
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={(e) => handleFileUpload(e, 'video')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploading}
                    />
                    <Button type="button" variant="outline" disabled={uploading}>
                      <Video className="w-4 h-4 mr-2" />
                      Videos hochladen
                    </Button>
                  </div>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}