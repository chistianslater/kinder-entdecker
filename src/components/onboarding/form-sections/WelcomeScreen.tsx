import React from 'react';
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onStart: () => void;
  onSkipPreferences: () => void;
}

export const WelcomeScreen = ({ onStart, onSkipPreferences }: WelcomeScreenProps) => {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-semibold text-white">Willkommen bei TinyTrails!</h2>
      <p className="text-muted-foreground">
        Lass uns gemeinsam herausfinden, welche Aktivitäten am besten zu dir passen.
      </p>
      <div className="flex flex-col space-y-4 pt-4">
        <Button onClick={onStart}>
          Loslegen
        </Button>
        <Button 
          variant="outline" 
          onClick={onSkipPreferences}
          className="text-white hover:text-white"
        >
          Ohne Vorlieben registrieren
        </Button>
      </div>
    </div>
  );
};