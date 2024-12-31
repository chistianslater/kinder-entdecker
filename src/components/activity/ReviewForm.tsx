import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TreePine, MessageSquare, Pencil, ImagePlus, Video } from 'lucide-react';
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [caption, setCaption] = useState('');
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
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
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

      // Submit review
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

      // Handle media upload if a file is selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const filePath = `${activity.id}/${Math.random()}.${fileExt}`;
        const bucket = mediaType === 'photo' ? 'activity-photos' : 'activity-videos';

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const insertData = {
          activity_id: activity.id,
          user_id: user.id,
          caption,
          ...(mediaType === 'photo' 
            ? { image_url: filePath }
            : { video_url: filePath }
          )
        };

        const { error: mediaError } = await supabase
          .from(mediaType === 'photo' ? 'photos' : 'videos')
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
        setSelectedFile(null);
        setCaption('');
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
      
      <div className="space-y-4 border-t pt-4">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={mediaType === 'photo' ? 'default' : 'outline'}
            onClick={() => setMediaType('photo')}
            className="flex items-center gap-2"
          >
            <ImagePlus className="w-4 h-4" />
            Foto
          </Button>
          <Button
            type="button"
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
        
        {selectedFile && (
          <Textarea
            placeholder={`${mediaType === 'photo' ? 'Bildunterschrift' : 'Videobeschreibung'} (optional)`}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        )}
      </div>

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