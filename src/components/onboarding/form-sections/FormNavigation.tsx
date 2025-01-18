import React from 'react';
import { Button } from "@/components/ui/button";

interface FormNavigationProps {
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  isLastStep: boolean;
  showSkip?: boolean;
}

export const FormNavigation = ({ 
  onBack, 
  onNext, 
  onSkip, 
  isLastStep,
  showSkip = true 
}: FormNavigationProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between space-x-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={onBack}
          className="w-1/2 text-white hover:text-white"
        >
          Zurück
        </Button>
        
        <Button 
          type={isLastStep ? "submit" : "button"}
          onClick={isLastStep ? undefined : onNext}
          className="w-1/2"
        >
          {isLastStep ? "Weiter zum Konto" : "Weiter"}
        </Button>
      </div>
      
      {showSkip && (
        <Button
          type="button"
          variant="link"
          onClick={onSkip}
          className="text-muted-foreground hover:text-white transition-colors"
        >
          Ich habe bereits ein Konto
        </Button>
      )}
    </div>
  );
};