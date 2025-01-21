import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AccountAvatar } from '../dashboard/AccountAvatar';
import { useAuth } from '@/hooks/useAuth';
import { useBusinessProfile } from '@/hooks/useBusinessProfile';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserCircle2 } from 'lucide-react';

export const AccountSection = () => {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const { businessProfile } = useBusinessProfile();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    },
    enabled: !!session,
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer outline-none">
        {session ? (
          <AccountAvatar 
            avatarUrl={profile?.avatar_url} 
            className="border-2 border-primary hover:border-primary/80 transition-colors"
          />
        ) : (
          <UserCircle2 className="w-8 h-8 text-primary hover:text-primary/80 transition-colors" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-secondary border-accent/20 shadow-glass z-[100]" 
        align="end"
      >
        {session ? (
          <>
            <DropdownMenuLabel className="text-white">Mein Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-accent/20" />
            <DropdownMenuItem
              className="text-white focus:bg-accent focus:text-white cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </DropdownMenuItem>
            {!businessProfile && (
              <DropdownMenuItem
                className="text-white focus:bg-accent focus:text-white cursor-pointer"
                onClick={() => navigate('/business-signup')}
              >
                Business registrieren
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="text-white focus:bg-accent focus:text-white cursor-pointer"
              onClick={handleSignOut}
            >
              Abmelden
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel className="text-white">Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-accent/20" />
            <DropdownMenuItem
              className="text-white focus:bg-accent focus:text-white cursor-pointer"
              onClick={() => navigate('/')}
            >
              Anmelden
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-white focus:bg-accent focus:text-white cursor-pointer"
              onClick={() => navigate('/')}
            >
              Registrieren
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};