import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AccountAvatarProps {
  avatarUrl?: string | null;
  onAvatarUpdate?: () => void;
  className?: string;
}

export const AccountAvatar = ({ avatarUrl, onAvatarUpdate, className }: AccountAvatarProps) => {
  const { toast } = useToast();
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Fehler",
          description: "Das Bild darf nicht größer als 2MB sein.",
          variant: "destructive",
        });
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true // Allow overwriting existing files
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Erfolg",
        description: "Profilbild wurde aktualisiert.",
      });

      if (onAvatarUpdate) {
        onAvatarUpdate();
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Fehler",
        description: "Profilbild konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative group">
      <Avatar className={`h-12 w-12 ${className}`}>
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt="Profile" />
        ) : (
          <AvatarFallback>
            <User className="h-6 w-6" />
          </AvatarFallback>
        )}
      </Avatar>
      
      <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <span className="text-xs">Ändern</span>
      </label>
    </div>
  );
};