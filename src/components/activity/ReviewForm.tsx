import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Activity } from '@/types/activity';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { RatingInput } from './review/RatingInput';
import { FileUpload } from './review/FileUpload';

interface ReviewFormProps {
  activity: Activity;
  onSuccess?: () => void;
  existingReview?: {
    id: string;
    rating: number;
    comment: string | null;
  } | null;
  onCancelEdit?: () => void;
}

export const ReviewForm = ({ 
  activity, 
  onSuccess, 
  existingReview, 
  onCancelEdit 
}: ReviewFormProps) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const { data: userReview } = useQuery({
    queryKey: ['userReview', activity.id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('activity_id', activity.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !existingReview,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      toast({
        title: "Bewertung erforderlich",
        description: "Bitte gib eine Bewertung ab.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Nicht eingeloggt",
          description: "Bitte logge dich ein, um eine Bewertung abzugeben.",
          variant: "destructive",
        });
        return;
      }

      const { error: reviewError } = await supabase
        .from('reviews')
        .upsert({
          id: existingReview?.id,
          activity_id: activity.id,
          user_id: user.id,
          rating,
          comment: comment.trim() || null,
        });

      if (reviewError) throw reviewError;

      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${activity.id}/${Math.random()}.${fileExt}`;
        const bucket = file.type.startsWith('image/') ? 'activity-photos' : 'activity-videos';

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        const insertData = {
          activity_id: activity.id,
          user_id: user.id,
          ...(file.type.startsWith('image/') 
            ? { image_url: publicUrl }
            : { video_url: publicUrl }
          )
        };

        const { error: mediaError } = await supabase
          .from(file.type.startsWith('image/') ? 'photos' : 'videos')
          .insert(insertData);

        if (mediaError) throw mediaError;
      }

      toast({
        title: "Erfolg",
        description: existingReview 
          ? "Deine Bewertung wurde aktualisiert."
          : "Deine Bewertung wurde gespeichert.",
      });

      if (!existingReview) {
        setComment('');
        setRating(0);
        setSelectedFiles([]);
      }
      onSuccess?.();
      onCancelEdit?.();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Fehler",
        description: "Bewertung konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userReview && !existingReview) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!rating && !existingReview && (
        <div className="text-sm text-white/70 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Wie würdest du diese Aktivität bewerten?
        </div>
      )}
      
      <RatingInput
        rating={rating}
        hoveredRating={hoveredRating}
        onRatingChange={setRating}
        onHoverChange={setHoveredRating}
      />
      
      <Textarea
        placeholder="Schreibe einen Kommentar..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px] text-white placeholder:text-white/50"
      />
      
      <FileUpload
        onFileChange={handleFileChange}
        selectedFiles={selectedFiles}
        onRemoveFile={removeFile}
      />

      <div className="flex gap-2">
        <Button 
          type="submit" 
          disabled={isSubmitting || !rating}
          className="flex-1"
        >
          {existingReview ? "Bewertung aktualisieren" : "Bewertung abschicken"}
        </Button>
        {existingReview && (
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancelEdit}
            className="text-white border-white/20 hover:bg-white/10"
          >
            Abbrechen
          </Button>
        )}
      </div>
    </form>
  );
};