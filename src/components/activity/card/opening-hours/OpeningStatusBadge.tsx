import React from 'react';

interface OpeningStatusBadgeProps {
  isOpen: boolean | null;
}

export const OpeningStatusBadge = ({ isOpen }: OpeningStatusBadgeProps) => {
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