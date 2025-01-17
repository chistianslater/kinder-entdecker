import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface FileUploadProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFiles: File[];
  onRemoveFile: (index: number) => void;
  existingFiles?: { id: string; url: string }[];
  onDeleteExisting?: (id: string) => void;
}

export const FileUpload = ({
  onFileChange,
  selectedFiles,
  onRemoveFile,
  existingFiles,
  onDeleteExisting,
}: FileUploadProps) => {
  return (
    <div className="space-y-4 border-t pt-4">
      {existingFiles && existingFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-white">Vorhandene Dateien</h4>
          <div className="grid grid-cols-3 gap-2">
            {existingFiles.map((file) => (
              <div key={file.id} className="relative group">
                <img
                  src={file.url}
                  alt="Uploaded content"
                  className="w-full h-24 object-cover rounded-lg"
                />
                {onDeleteExisting && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => onDeleteExisting(file.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={onFileChange}
        className="block w-full text-white text-sm
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-primary file:text-black
          hover:file:bg-primary/90"
      />
      
      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-white/70">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFile(index)}
                className="text-white/70 hover:text-white"
              >
                Entfernen
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};