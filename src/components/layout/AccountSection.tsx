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
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <AccountAvatar />
        </Button>
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