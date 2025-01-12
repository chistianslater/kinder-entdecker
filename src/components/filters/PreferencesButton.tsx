import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, SlidersHorizontal } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface PreferencesButtonProps {
  isActive: boolean;
  onClick: () => void;
}

export const PreferencesButton = ({ isActive, onClick }: PreferencesButtonProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const navigateToDashboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/dashboard');
  };

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      className={`flex items-center gap-2 group transition-all duration-300 hover:scale-105 ${
        isActive 
          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
          : "bg-white hover:bg-accent/10 border-accent/20 rounded-2xl"
      }`}
      onClick={onClick}
    >
      <span className="flex items-center gap-2">
        <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
        {!isMobile && "Für Uns"}
      </span>
      <span 
        className={`pl-2 ml-2 border-l ${
          isActive 
            ? "border-primary-foreground/20" 
            : "border-accent/20"
        }`}
        onClick={navigateToDashboard}
        title="Einstellungen"
      >
        <SlidersHorizontal 
          className="w-4 h-4 hover:scale-110 transition-transform" 
        />
      </span>
    </Button>
  );
};