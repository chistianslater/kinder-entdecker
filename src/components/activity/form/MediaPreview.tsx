import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { MediaFile } from "@/types/media";

interface MediaPreviewProps {
  file: MediaFile;
  onDelete: (index: number) => void;
  index: number;
}

export const MediaPreview = ({ file, onDelete, index }: MediaPreviewProps) => {
  return (
    <div className="relative group">
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
        onClick={() => onDelete(index)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};