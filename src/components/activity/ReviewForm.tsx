import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TreePine, MessageSquare, Pencil, X } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Activity } from '@/types/activity';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

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

export const ReviewForm = ({ activity, onSuccess, existingReview, onCancelEdit }: ReviewFormProps) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    enabled: !existingReview, // Only fetch if we're not in edit mode
  });

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

      const { error } = await supabase
        .from('reviews')
        .upsert({
          id: existingReview?.id,
          activity_id: activity.id,
          user_id: user.id,
          rating,
          comment: comment.trim() || null,
        });

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: existingReview 
          ? "Deine Bewertung wurde aktualisiert."
          : "Deine Bewertung wurde gespeichert.",
      });

      if (!existingReview) {
        setComment('');
        setRating(0);
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

  const renderTrees = () => {
    return Array.from({ length: 5 }).map((_, index) => {
      const treeValue = index + 1;
      const isFilled = (hoveredRating || rating) >= treeValue;
      
      return (
        <button
          key={index}
          type="button"
          onClick={() => setRating(treeValue)}
          onMouseEnter={() => setHoveredRating(treeValue)}
          onMouseLeave={() => setHoveredRating(0)}
          className="p-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
        >
          <TreePine 
            className={`w-6 h-6 transition-colors ${
              isFilled 
                ? 'fill-primary text-primary' 
                : 'fill-muted text-muted hover:fill-primary/20 hover:text-primary/20'
            }`}
          />
        </button>
      );
    });
  };

  if (userReview && !existingReview) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!rating && !existingReview && (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Wie würdest du diese Aktivität bewerten?
        </div>
      )}
      <div className="flex space-x-1">
        {renderTrees()}
      </div>
      <Textarea
        placeholder="Schreibe einen Kommentar..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px]"
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
          >
            Abbrechen
          </Button>
        )}
      </div>
    </form>
  );
};