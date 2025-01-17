import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImagePreviewProps {
  previewUrl: string;
  onClear: () => void;
}

export const ImagePreview = ({ previewUrl, onClear }: ImagePreviewProps) => {
  return (
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
        onClick={onClear}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};