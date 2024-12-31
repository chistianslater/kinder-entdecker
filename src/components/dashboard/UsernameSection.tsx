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

      const { error } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', user.id);

      if (error) throw error;

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
      <Label htmlFor="username">Benutzername</Label>
      <div className="flex gap-2">
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Dein Benutzername"
        />
        <Button onClick={handleUpdateUsername}>Speichern</Button>
      </div>
    </div>
  );
};