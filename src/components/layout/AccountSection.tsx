import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
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

export const AccountSection = () => {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const { businessProfile } = useBusinessProfile();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!session) {
    return (
      <Button 
        onClick={() => navigate('/')}
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
      >
        Login
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full hover:bg-accent/50"
        >
          <AccountAvatar onAvatarUpdate={() => {}} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-secondary/95 backdrop-blur-sm border border-accent/20 shadow-glass z-[100] mt-2" 
        align="end"
        sideOffset={5}
      >
        <DropdownMenuLabel className="text-white font-medium px-3 py-2">
          Mein Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-accent/20" />
        <DropdownMenuItem
          className="text-white focus:bg-accent focus:text-white cursor-pointer px-3 py-2"
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </DropdownMenuItem>
        {!businessProfile && (
          <DropdownMenuItem
            className="text-white focus:bg-accent focus:text-white cursor-pointer px-3 py-2"
            onClick={() => navigate('/business-signup')}
          >
            Business registrieren
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="text-white focus:bg-accent focus:text-white cursor-pointer px-3 py-2"
          onClick={handleSignOut}
        >
          Abmelden
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};