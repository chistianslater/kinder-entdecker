import React, { useState } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export const AccountSection = () => {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const { businessProfile } = useBusinessProfile();
  const [showAuth, setShowAuth] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const handleAuthClick = () => {
    setShowAuth(true);
    setDropdownOpen(false);
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
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
                onClick={handleAuthClick}
              >
                Anmelden
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-white focus:bg-accent focus:text-white cursor-pointer"
                onClick={handleAuthClick}
              >
                Registrieren
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="sm:max-w-md bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Anmelden oder Registrieren
            </DialogTitle>
          </DialogHeader>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#B5FF2B',
                    brandAccent: '#9EE619',
                    inputBackground: 'rgba(255, 255, 255, 0.08)',
                    inputText: '#FFFFFF',
                    anchorTextColor: 'rgba(255, 255, 255, 0.6)',
                    dividerBackground: 'rgba(255, 255, 255, 0.08)',
                  },
                },
              },
              className: {
                button: 'text-black',
                anchor: 'text-gray-400 hover:text-gray-300',
                label: 'text-gray-300',
              },
            }}
            localization={{
              variables: {
                sign_up: {
                  email_label: 'E-Mail Adresse',
                  password_label: 'Passwort',
                  email_input_placeholder: 'Deine E-Mail Adresse',
                  password_input_placeholder: 'Dein Passwort',
                  button_label: 'Registrieren',
                  loading_button_label: 'Registrierung...',
                  social_provider_text: 'Mit {{provider}} registrieren',
                  link_text: 'Kein Konto? Registrieren',
                },
                sign_in: {
                  email_label: 'E-Mail Adresse',
                  password_label: 'Passwort',
                  email_input_placeholder: 'Deine E-Mail Adresse',
                  password_input_placeholder: 'Dein Passwort',
                  button_label: 'Anmelden',
                  loading_button_label: 'Anmeldung...',
                  social_provider_text: 'Mit {{provider}} anmelden',
                  link_text: 'Bereits ein Konto? Anmelden',
                },
              },
            }}
            theme="dark"
            providers={[]}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};