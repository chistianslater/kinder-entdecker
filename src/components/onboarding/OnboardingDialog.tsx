import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OnboardingForm } from './OnboardingForm';
import { Filters } from '../FilterBar';

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
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Willkommen bei TinyTrails!</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground mb-6">
          Lass uns gemeinsam herausfinden, welche Aktivitäten am besten zu dir passen.
        </p>
        <OnboardingForm 
          onComplete={handleComplete}
          onFiltersChange={onFiltersChange}
          onSkip={handleSkip}
        />
      </DialogContent>
    </Dialog>
  );
};