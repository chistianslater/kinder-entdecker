import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, ImagePlus, MessageSquare } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Activity } from '@/types/activity';

interface ActivityReviewsProps {
  activity: Activity;
}

export const ActivityReviews = ({ activity }: ActivityReviewsProps) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmitReview = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Fehler",
          description: "Bitte melde dich an, um eine Bewertung abzugeben.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('reviews')
        .insert({
          activity_id: activity.id,
          user_id: user.id,
          rating,
          comment,
        });

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: "Deine Bewertung wurde erfolgreich gespeichert.",
      });

      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Fehler",
        description: "Bewertung konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    }
  };

  const handleUploadPhoto = async () => {
    try {
      if (!selectedFile) {
        toast({
          title: "Fehler",
          description: "Bitte wähle ein Foto aus.",
          variant: "destructive",
        });
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Fehler",
          description: "Bitte melde dich an, um ein Foto hochzuladen.",
          variant: "destructive",
        });
        return;
      }

      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${activity.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('activity-photos')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('photos')
        .insert({
          activity_id: activity.id,
          user_id: user.id,
          image_url: `${filePath}`,
          caption,
        });

      if (dbError) throw dbError;

      toast({
        title: "Erfolg",
        description: "Dein Foto wurde erfolgreich hochgeladen.",
      });

      setSelectedFile(null);
      setCaption('');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Fehler",
        description: "Foto konnte nicht hochgeladen werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Bewertung abgeben</h3>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => setRating(value)}
              className={`p-1 ${rating >= value ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              <Star className="w-6 h-6" />
            </button>
          ))}
        </div>
        <Textarea
          placeholder="Schreibe einen Kommentar..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[100px]"
        />
        <Button 
          onClick={handleSubmitReview}
          disabled={rating === 0}
          className="flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Bewertung abschicken
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Foto hochladen</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-white
            hover:file:bg-primary/90"
        />
        <Textarea
          placeholder="Bildunterschrift (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <Button 
          onClick={handleUploadPhoto}
          disabled={!selectedFile}
          className="flex items-center gap-2"
        >
          <ImagePlus className="w-4 h-4" />
          Foto hochladen
        </Button>
      </div>
    </div>
  );
};