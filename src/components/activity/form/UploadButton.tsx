import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon, Video } from "lucide-react";

interface UploadButtonProps {
  type: 'image' | 'video';
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

export const UploadButton = ({ type, onUpload, disabled }: UploadButtonProps) => {
  return (
    <div className="relative">
      <Input
        type="file"
        accept={type === 'image' ? "image/*" : "video/*"}
        multiple
        onChange={onUpload}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={disabled}
      />
      <Button type="button" variant="outline" disabled={disabled}>
        {type === 'image' ? (
          <ImageIcon className="w-4 h-4 mr-2" />
        ) : (
          <Video className="w-4 h-4 mr-2" />
        )}
        {type === 'image' ? 'Bilder hochladen' : 'Videos hochladen'}
      </Button>
    </div>
  );
};