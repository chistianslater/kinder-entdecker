import React from 'react';
import { Activity } from '@/types/activity';

interface MapPopupProps {
  activity: Activity;
  onNavigate: () => void;
  onViewDetails: () => void;
}

export const createPopupContent = ({ activity, onNavigate, onViewDetails }: MapPopupProps) => {
  const popupContent = document.createElement('div');
  popupContent.className = 'p-4';
  
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'flex gap-2 mt-3';

  const navigationBtn = document.createElement('button');
  navigationBtn.className = 'navigation-btn flex items-center gap-1 px-3 py-1 bg-accent text-accent-foreground rounded-md text-sm hover:bg-accent/80 transition-colors';
  navigationBtn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
    Navigation
  `;

  const detailsBtn = document.createElement('button');
  detailsBtn.className = 'details-btn flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/80 transition-colors';
  detailsBtn.innerHTML = `
    Details
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  `;

  buttonsContainer.appendChild(navigationBtn);
  buttonsContainer.appendChild(detailsBtn);

  popupContent.innerHTML = `
    <h3 class="font-bold text-lg mb-2">${activity.title}</h3>
    <p class="text-sm text-gray-600 mb-2">${activity.type}</p>
    ${activity.price_range ? `<p class="text-sm mb-1">Preis: ${activity.price_range}</p>` : ''}
  `;
  popupContent.appendChild(buttonsContainer);

  navigationBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    onNavigate();
  });

  detailsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    onViewDetails();
  });

  return popupContent;
};