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

interface ActivityImageUploadProps {
  form: UseFormReturn<FormData>;
}

export function ActivityImageUpload({ form }: ActivityImageUploadProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // Initialize preview URL with form value
    const currentImageUrl = form.getValues('image_url');
    if (currentImageUrl) {
      setPreviewUrl(currentImageUrl);
    }
  }, [form]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      const file = event.target.files[0];
      setUploading(true);

      // Basic validation
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Fehler",
          description: "Bitte wähle eine gültige Bilddatei aus.",
          variant: "destructive",
        });
        return;
      }

      // Size validation (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Fehler",
          description: "Das Bild darf nicht größer als 5MB sein.",
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      // Create a local preview URL
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(localPreviewUrl);

      const { error: uploadError } = await supabase.storage
        .from('activity-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('activity-photos')
        .getPublicUrl(filePath);

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the activity ID if we're editing an existing activity
      const activityId = form.getValues('id');
      
      // If we have an activity ID, create a photo record
      if (activityId) {
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

      form.setValue('image_url', publicUrl);
      
      toast({
        title: "Erfolg",
        description: "Bild wurde erfolgreich hochgeladen.",
      });

      // Clean up the local preview URL
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
        fileInputRef.current.value = ''; // Reset file input
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