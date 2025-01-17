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
import { Upload, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { FormData } from "../types";
import imageCompression from "browser-image-compression";

interface ActivityImageUploadProps {
  form: UseFormReturn<FormData>;
}

export function ActivityImageUpload({ form }: ActivityImageUploadProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const currentImageUrl = form.getValues('image_url');
    if (currentImageUrl) {
      setPreviewUrl(currentImageUrl);
    }
  }, [form]);

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      return file;
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      const file = event.target.files[0];
      setUploading(true);

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Fehler",
          description: "Bitte wähle eine gültige Bilddatei aus.",
          variant: "destructive",
        });
        return;
      }

      // Increase size limit to 10MB
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Fehler",
          description: "Das Bild darf nicht größer als 10MB sein.",
          variant: "destructive",
        });
        return;
      }

      // Compress image if it's larger than 2MB
      const processedFile = file.size > 2 * 1024 * 1024 ? await compressImage(file) : file;

      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const localPreviewUrl = URL.createObjectURL(processedFile);
      setPreviewUrl(localPreviewUrl);

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

      form.setValue('image_url', publicUrl);

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

      URL.revokeObjectURL(localPreviewUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Fehler",
        description: "Bild konnte nicht hochgeladen werden.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    form.setValue('image_url', newUrl);
    setPreviewUrl(newUrl);
  };

  const clearImage = () => {
    form.setValue('image_url', '');
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <FormField
      control={form.control}
      name="image_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Bild</FormLabel>
          <FormControl>
            <div className="space-y-4">
              {previewUrl && (
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={clearImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Input 
                  {...field}
                  type="url" 
                  placeholder="Bild URL" 
                  value={field.value || ''}
                  onChange={handleUrlChange}
                />
                <div className="relative">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={uploading}
                    onClick={triggerFileInput}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Lädt...' : 'Upload'}
                  </Button>
                </div>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}