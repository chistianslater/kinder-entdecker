import React from 'react';
import { Activity } from '@/types/activity';
import { Star } from 'lucide-react';

interface MapPopupProps {
  activity: Activity;
  onNavigate: () => void;
  onViewDetails: () => void;
}

export const createPopupContent = ({ activity, onNavigate, onViewDetails }: MapPopupProps) => {
  const popupContent = document.createElement('div');
  popupContent.className = 'p-4 min-w-[280px] bg-background/90 backdrop-blur-glass';
  
  // Title
  const title = document.createElement('h3');
  title.className = 'text-lg font-semibold mb-1 text-white';
  title.textContent = activity.title;

  // Type
  const type = document.createElement('p');
  type.className = 'text-sm text-white/70 mb-3';
  type.textContent = activity.type.join(', '); // Join array elements with comma

  // Opening Hours (if available)
  if (activity.opening_hours) {
    const openingHours = document.createElement('div');
    openingHours.className = 'flex items-center gap-2 text-sm text-white/70 mb-3';
    openingHours.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
      ${activity.opening_hours}
    `;
    popupContent.appendChild(openingHours);
  }
  
  // Buttons container
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'flex gap-2';

  // Navigation button
  const navigationBtn = document.createElement('button');
  navigationBtn.className = 'flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors w-full';
  navigationBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
    Navigation
  `;

  // Details button
  const detailsBtn = document.createElement('button');
  detailsBtn.className = 'flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors w-full';
  detailsBtn.innerHTML = `
    Details
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  `;

  // Add event listeners
  navigationBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    onNavigate();
  });

  detailsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    onViewDetails();
  });

  // Assemble the popup content
  buttonsContainer.appendChild(navigationBtn);
  buttonsContainer.appendChild(detailsBtn);

  popupContent.appendChild(title);
  popupContent.appendChild(type);
  popupContent.appendChild(buttonsContainer);

  return popupContent;
};