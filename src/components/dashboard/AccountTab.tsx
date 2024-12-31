import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const AccountTab = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Erfolgreich abgemeldet",
        description: "Auf Wiedersehen!",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Fehler beim Abmelden",
        description: "Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Account Einstellungen</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Account löschen</h3>
          <p className="text-muted-foreground mb-4">
            Wenn Sie Ihren Account löschen, werden alle Ihre Daten unwiderruflich gelöscht.
          </p>
          <Button variant="destructive">Account löschen</Button>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Abmelden</h3>
          <p className="text-muted-foreground mb-4">
            Sie können sich jederzeit wieder mit Ihren Zugangsdaten anmelden.
          </p>
          <Button variant="outline" onClick={handleSignOut}>Abmelden</Button>
        </div>
      </div>
    </div>
  );
};