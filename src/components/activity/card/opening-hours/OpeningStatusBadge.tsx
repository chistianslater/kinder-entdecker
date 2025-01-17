import React from 'react';

interface OpeningStatusBadgeProps {
  isOpen: boolean | null;
  openingHours: string | null;
}

export const OpeningStatusBadge = ({ isOpen, openingHours }: OpeningStatusBadgeProps) => {
  if (!openingHours) return null;
  
  // Handle 24/7 case
  if (openingHours.toLowerCase() === '24/7') {
    return (
      <div className="ml-2 px-2 py-1 rounded-md text-xs font-medium bg-[#F2FCE2] text-green-700">
        Geöffnet
      </div>
    );
  }

  if (isOpen === null) return null;

  return (
    <div className={`ml-2 px-2 py-1 rounded-md text-xs font-medium ${
      isOpen 
        ? "bg-[#F2FCE2] text-green-700" 
        : "bg-[#FFDEE2] text-red-700"
    }`}>
      {isOpen ? "Geöffnet" : "Geschlossen"}
    </div>
  );
};