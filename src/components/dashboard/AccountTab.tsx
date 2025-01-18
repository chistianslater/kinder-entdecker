import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AccountAvatar } from './AccountAvatar';
import { UsernameSection } from './UsernameSection';

export const AccountTab = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  const { data: profile, refetch } = useQuery({
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

      if (data?.username) {
        setUsername(data.username);
      }

      return data || { username: null, avatar_url: null };
    },
  });

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
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-semibold text-white">Account Einstellungen</h2>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <AccountAvatar 
            avatarUrl={profile?.avatar_url} 
            onAvatarUpdate={refetch}
          />

          <UsernameSection
            username={username}
            setUsername={setUsername}
            onUpdate={refetch}
          />
        </div>

        <div className="border-t border-white/10 pt-6">
          <h3 className="text-lg font-medium mb-2 text-white">Account löschen</h3>
          <p className="text-white/60 mb-4">
            Wenn Sie Ihren Account löschen, werden alle Ihre Daten unwiderruflich gelöscht.
          </p>
          <Button variant="destructive">Account löschen</Button>
        </div>

        <div className="border-t border-white/10 pt-6">
          <h3 className="text-lg font-medium mb-2 text-white">Abmelden</h3>
          <p className="text-white/60 mb-4">
            Sie können sich jederzeit wieder mit Ihren Zugangsdaten anmelden.
          </p>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="text-white border-white/20 hover:bg-white/10"
          >
            Abmelden
          </Button>
        </div>
      </div>
    </div>
  );
};