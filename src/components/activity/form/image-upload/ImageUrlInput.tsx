import React from 'react';
import { Input } from "@/components/ui/input";

interface ImageUrlInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const ImageUrlInput = ({ value, onChange }: ImageUrlInputProps) => {
  return (
    <Input 
      type="url" 
      placeholder="Bild URL" 
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};