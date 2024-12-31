import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Medal, MessageSquare } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Activity } from '@/types/activity';
import { useQuery } from '@tanstack/react-query';

interface ReviewFormProps {
  activity: Activity;
}

export const ReviewForm = ({ activity }: ReviewFormProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    },
  });

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

  const renderMedals = () => {
    return Array.from({ length: 5 }).map((_, index) => {
      const medalValue = index + 1;
      const isFilled = (hoveredRating || rating) >= medalValue;
      
      return (
        <button
          key={index}
          type="button"
          onClick={() => setRating(medalValue)}
          onMouseEnter={() => setHoveredRating(medalValue)}
          onMouseLeave={() => setHoveredRating(0)}
          className="p-1 transition-colors"
        >
          <Medal 
            className={`w-6 h-6 transition-colors ${
              isFilled 
                ? 'fill-primary text-primary' 
                : 'fill-gray-200 text-gray-200 hover:fill-primary/50 hover:text-primary/50'
            }`}
          />
        </button>
      );
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Bewertung abgeben</h3>
      {profile?.username ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Bewerten als: {profile.username}</span>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          Setze deinen Benutzernamen in den Account-Einstellungen
        </div>
      )}
      <div className="flex space-x-2">
        {renderMedals()}
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