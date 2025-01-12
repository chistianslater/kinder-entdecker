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
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer outline-none">
        <AccountAvatar 
          avatarUrl={profile?.avatar_url} 
          className="h-10 w-10 border-2 border-primary hover:border-primary/80 transition-colors"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-secondary border-accent/20 shadow-glass z-[100]" 
        align="end"
      >
        <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
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
            Register Business
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="text-white focus:bg-accent focus:text-white cursor-pointer"
          onClick={handleSignOut}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};