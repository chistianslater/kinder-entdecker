import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AccountAvatarProps {
  avatarUrl?: string | null;
  onAvatarUpdate: () => void;
}

export const AccountAvatar = ({ avatarUrl, onAvatarUpdate }: AccountAvatarProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          avatar_url: publicUrl 
        });

      if (updateError) throw updateError;

      toast({
        title: "Erfolg",
        description: "Profilbild wurde aktualisiert.",
      });

      onAvatarUpdate();
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Fehler",
        description: "Profilbild konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} />
        ) : (
          <AvatarFallback>
            <User className="h-8 w-8" />
          </AvatarFallback>
        )}
      </Avatar>
      <div>
        <Label htmlFor="avatar" className="cursor-pointer">
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md inline-block">
            Profilbild ändern
          </div>
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
            disabled={uploading}
          />
        </Label>
      </div>
    </div>
  );
};