import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Video } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Activity } from '@/types/activity';

interface MediaUploadProps {
  activity: Activity;
}

export const MediaUpload = ({ activity }: MediaUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    try {
      if (!selectedFile) {
        toast({
          title: "Fehler",
          description: `Bitte wähle ${mediaType === 'photo' ? 'ein Foto' : 'ein Video'} aus.`,
          variant: "destructive",
        });
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Fehler",
          description: "Bitte melde dich an, um Medien hochzuladen.",
          variant: "destructive",
        });
        return;
      }

      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${activity.id}/${Math.random()}.${fileExt}`;
      const bucket = mediaType === 'photo' ? 'activity-photos' : 'activity-videos';
      const table = mediaType === 'photo' ? 'photos' : 'videos';
      const urlField = mediaType === 'photo' ? 'image_url' : 'video_url';

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from(table)
        .insert({
          activity_id: activity.id,
          user_id: user.id,
          [urlField]: filePath,
          caption,
        });

      if (dbError) throw dbError;

      toast({
        title: "Erfolg",
        description: `Dein ${mediaType === 'photo' ? 'Foto' : 'Video'} wurde erfolgreich hochgeladen.`,
      });

      setSelectedFile(null);
      setCaption('');
    } catch (error) {
      console.error('Error uploading media:', error);
      toast({
        title: "Fehler",
        description: `${mediaType === 'photo' ? 'Foto' : 'Video'} konnte nicht hochgeladen werden.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Medien hochladen</h3>
      <div className="flex gap-2">
        <Button
          variant={mediaType === 'photo' ? 'default' : 'outline'}
          onClick={() => setMediaType('photo')}
          className="flex items-center gap-2"
        >
          <ImagePlus className="w-4 h-4" />
          Foto
        </Button>
        <Button
          variant={mediaType === 'video' ? 'default' : 'outline'}
          onClick={() => setMediaType('video')}
          className="flex items-center gap-2"
        >
          <Video className="w-4 h-4" />
          Video
        </Button>
      </div>
      <input
        type="file"
        accept={mediaType === 'photo' ? 'image/*' : 'video/*'}
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-primary file:text-white
          hover:file:bg-primary/90"
      />
      <Textarea
        placeholder={`${mediaType === 'photo' ? 'Bildunterschrift' : 'Videobeschreibung'} (optional)`}
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <Button 
        onClick={handleUpload}
        disabled={!selectedFile}
        className="flex items-center gap-2"
      >
        {mediaType === 'photo' ? <ImagePlus className="w-4 h-4" /> : <Video className="w-4 h-4" />}
        {mediaType === 'photo' ? 'Foto hochladen' : 'Video hochladen'}
      </Button>
    </div>
  );
};