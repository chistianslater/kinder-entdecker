import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OnboardingForm } from './OnboardingForm';

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OnboardingDialog = ({ open, onOpenChange }: OnboardingDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Willkommen bei TinyTrails!</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground mb-6">
          Lassen Sie uns Ihre Präferenzen einrichten, damit wir Ihnen die besten Aktivitäten empfehlen können.
        </p>
        <OnboardingForm onComplete={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};