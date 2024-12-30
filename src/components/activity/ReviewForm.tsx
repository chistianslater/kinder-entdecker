import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Activity } from '@/types/activity';

interface ReviewFormProps {
  activity: Activity;
}

export const ReviewForm = ({ activity }: ReviewFormProps) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const { toast } = useToast();

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

  return (
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
  );
};