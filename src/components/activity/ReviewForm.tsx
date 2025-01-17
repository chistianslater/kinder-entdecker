import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from 'lucide-react';
import { Activity } from '@/types/activity';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { RatingInput } from './review/RatingInput';
import { FileUpload } from './review/FileUpload';
import { useReviewSubmission } from '@/hooks/useReviewSubmission';
import { useExistingFiles } from '@/hooks/useExistingFiles';
import { supabase } from "@/integrations/supabase/client";

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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { existingFiles, handleDeleteExisting } = useExistingFiles(activity, existingReview?.id);
  const { isSubmitting, handleSubmit } = useReviewSubmission({
    activity,
    existingReview,
    onSuccess,
    onCancelEdit,
  });

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(rating, comment, selectedFiles);
  };

  if (userReview && !existingReview) {
    return null;
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
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
        existingFiles={existingFiles}
        onDeleteExisting={handleDeleteExisting}
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