import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UsernameSectionProps {
  username: string;
  setUsername: (username: string) => void;
  onUpdate: () => void;
}

export const UsernameSection = ({ username, setUsername, onUpdate }: UsernameSectionProps) => {
  const { toast } = useToast();

  const handleUpdateUsername = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          username 
        });

      if (updateError) throw updateError;

      toast({
        title: "Erfolg",
        description: "Benutzername wurde aktualisiert.",
      });

      onUpdate();
    } catch (error) {
      console.error('Error updating username:', error);
      toast({
        title: "Fehler",
        description: "Benutzername konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="username" className="text-white">Benutzername</Label>
      <div className="flex gap-2">
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Dein Benutzername"
          className="text-white bg-accent/10 border-white/10 placeholder:text-white/40"
        />
        <Button 
          onClick={handleUpdateUsername}
          className="text-white border-white/20 hover:bg-white/10"
        >
          Speichern
        </Button>
      </div>
    </div>
  );
};