import React from 'react';
import { Globe, Ticket } from 'lucide-react';

interface ActivityLinksProps {
  websiteUrl?: string;
  ticketUrl?: string;
}

export const ActivityLinks = ({ websiteUrl, ticketUrl }: ActivityLinksProps) => {
  if (!websiteUrl && !ticketUrl) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-primary">Links & Kontakt</h3>
      <div className="grid gap-3">
        {websiteUrl && (
          <a 
            href={websiteUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors"
          >
            <Globe className="w-5 h-5 text-primary" />
            <span>Website besuchen</span>
          </a>
        )}
        {ticketUrl && (
          <a 
            href={ticketUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors"
          >
            <Ticket className="w-5 h-5 text-primary" />
            <span>Tickets kaufen</span>
          </a>
        )}
      </div>
    </div>
  );
};