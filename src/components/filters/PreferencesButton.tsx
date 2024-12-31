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
      className={`flex items-center gap-2 min-w-[120px] ${
        isActive 
          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
          : "bg-white hover:bg-secondary/80 border-accent"
      }`}
      onClick={onClick}
    >
      <Heart className="w-4 h-4" />
      {!isMobile && "Für Uns"}
      <SlidersHorizontal 
        className="w-4 h-4 cursor-pointer hover:text-primary" 
        onClick={navigateToDashboard}
      />
    </Button>
  );
};