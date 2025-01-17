import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Activity } from '@/types/activity';

interface UseReviewSubmissionProps {
  activity: Activity;
  existingReview?: {
    id: string;
    rating: number;
    comment: string | null;
  } | null;
  onSuccess?: () => void;
  onCancelEdit?: () => void;
}

export const useReviewSubmission = ({
  activity,
  existingReview,
  onSuccess,
  onCancelEdit,
}: UseReviewSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (
    rating: number,
    comment: string,
    selectedFiles: File[]
  ) => {
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

  return {
    isSubmitting,
    handleSubmit,
  };
};