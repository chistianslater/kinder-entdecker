import React from 'react';
import { Camera, User, Trash2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface GalleryImage {
  url: string;
  isOwner: boolean;
  photographer: string;
  caption: string;
  id?: string;
}

interface CarouselItemProps {
  image: GalleryImage;
  activityTitle: string;
  onImageDelete?: () => void;
}

export const CarouselItem = ({ image, activityTitle, onImageDelete }: CarouselItemProps) => {
  const { isAdmin } = useIsAdmin();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!image.id) return;

    try {
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', image.id);

      if (error) throw error;

      toast({
        title: "Bild gelöscht",
        description: "Das Bild wurde erfolgreich gelöscht.",
      });

      if (onImageDelete) {
        onImageDelete();
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Fehler",
        description: "Das Bild konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative w-full h-full">
      <AspectRatio ratio={16 / 9} className="bg-muted">
        <img
          src={image.url}
          alt={`${activityTitle} - ${image.caption}`}
          className="object-cover w-full h-full rounded-lg"
          loading="lazy"
        />
      </AspectRatio>
      <Badge 
        variant="secondary" 
        className="absolute top-4 left-4 flex items-center gap-1 bg-white/30 backdrop-blur-md border border-white/40"
      >
        <Camera className="w-3 h-3" />
        {image.isOwner ? 'Official Photo' : 'Community Photo'}
      </Badge>
      {isAdmin && image.id && !image.isOwner && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-4 right-4"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
        <div className="flex items-center gap-2 text-white">
          <User className="w-4 h-4" />
          <span className="text-sm font-medium">{image.photographer}</span>
        </div>
      </div>
    </div>
  );
};