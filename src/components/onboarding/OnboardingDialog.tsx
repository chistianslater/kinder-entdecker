import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OnboardingForm } from './OnboardingForm';
import { Filters } from '../FilterBar';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFiltersChange: (filters: Filters) => void;
  onComplete?: () => void;
}

export const OnboardingDialog = ({ open, onOpenChange, onFiltersChange, onComplete }: OnboardingDialogProps) => {
  const handleComplete = () => {
    onOpenChange(false);
    onComplete?.();
  };

  const handleSkip = () => {
    onOpenChange(false);
    onComplete?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] animate-fade-in">
        <OnboardingForm 
          onComplete={handleComplete}
          onFiltersChange={onFiltersChange}
          onSkip={handleSkip}
          showAuth={true}
          supabaseClient={supabase}
        />
      </DialogContent>
    </Dialog>
  );
};