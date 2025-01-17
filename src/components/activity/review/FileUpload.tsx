import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFiles: File[];
  onRemoveFile: (index: number) => void;
}

export const FileUpload = ({
  onFileChange,
  selectedFiles,
  onRemoveFile,
}: FileUploadProps) => {
  return (
    <div className="space-y-4 border-t pt-4">
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