import React, { useRef, useEffect } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../types";
import { ImagePreview } from "./image-upload/ImagePreview";
import { ImageUrlInput } from "./image-upload/ImageUrlInput";
import { useImageUpload } from "./image-upload/useImageUpload";

interface ActivityImageUploadProps {
  form: UseFormReturn<FormData>;
}

export function ActivityImageUpload({ form }: ActivityImageUploadProps) {
  const [previewUrl, setPreviewUrl] = React.useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading } = useImageUpload(form);

  useEffect(() => {
    const currentImageUrl = form.getValues('image_url');
    if (currentImageUrl) {
      setPreviewUrl(currentImageUrl);
    }
  }, [form]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(localPreviewUrl);
    
    const publicUrl = await uploadImage(file);
    if (publicUrl) {
      form.setValue('image_url', publicUrl);
    }
    
    URL.revokeObjectURL(localPreviewUrl);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlChange = (newUrl: string) => {
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
                <ImagePreview 
                  previewUrl={previewUrl} 
                  onClear={clearImage}
                />
              )}
              <div className="flex items-center gap-2">
                <ImageUrlInput 
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
                    onClick={() => fileInputRef.current?.click()}
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